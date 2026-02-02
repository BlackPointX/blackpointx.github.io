
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// !!! WAŻNE: Link PRODUKCYJNY do Google Apps Script !!!
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiuzeFB0HElbb9YkEi80GAmy-DQilDCXpUXoKfxUruNuhHp7voI9O5l7phlSmsEUMseA/exec";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchData() {
  console.log('🔄 Rozpoczynanie pobierania danych z Google Sheets (PROD ENV)...');
  
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("TU_WKLEJ")) {
      console.error("❌ BŁĄD KONFIGURACJI: Nie ustawiono poprawnego GOOGLE_SCRIPT_URL w scripts/fetch-products.js");
      process.exit(1);
  }

  try {
    const nonce = Math.random().toString(36).substring(7);
    const timestamp = Date.now();

    // 1. Pobierz DANE ZBIORCZE (get_init_data)
    console.log('📦 Pobieranie danych (Produkty + Rabaty + Galeria)...');
    // Używamy get_init_data aby pobrać wszystko jednym strzałem
    const initUrl = `${GOOGLE_SCRIPT_URL}?action=get_init_data&nonce=${nonce}&t=${timestamp}`;
    const initRes = await fetch(initUrl, {
        headers: { 'Cache-Control': 'no-cache' }
    });
    if (!initRes.ok) throw new Error(`HTTP Error Init Data: ${initRes.status}`);
    const initData = await initRes.json();

    const productsData = initData.products || [];
    const discountsData = initData.discounts || [];
    const galleryData = initData.gallery || []; // Nowe pole

    // 2. Przetwórz dane (Logika Promo po stronie Builda)
    let activePromo = {
        code: undefined,
        catalogMultiplier: 1,
        customMultiplier: 1
    };

    if (Array.isArray(discountsData)) {
        // Logika identyczna jak w App.tsx
        const promoRule = discountsData.find((d) => {
            const promoVal = String(d["Promo"] || d["promo"] || "").toLowerCase();
            return promoVal === 'tak' || promoVal === 'yes' || promoVal === 'true';
        });

        if (promoRule) {
            const codeName = String(promoRule["Kod rabatowy"] || "").trim();
            console.log(`✅ Znaleziono aktywny kod: ${codeName}`);

            const allRulesForCode = discountsData.filter((d) => 
                String(d["Kod rabatowy"] || "").trim().toLowerCase() === codeName.toLowerCase()
            );

            let catMult = 1;
            let custMult = 1;

            allRulesForCode.forEach((r) => {
                const type = String(r["Item"] || r["item"] || r["Typ"] || "").toLowerCase();
                const val = parseFloat(r["Liczba"]);
                const form = String(r["Forma"] || "").toLowerCase();
                
                if (!isNaN(val) && (form.includes('procent') || form === '%')) {
                    const multiplier = 1 - (val / 100);
                    
                    if (type === 'custom' || type === 'kustom') {
                        custMult = Math.min(custMult, multiplier);
                    } else if (type === 'katalog' || type === 'produkt' || type === 'gotowe') {
                        catMult = Math.min(catMult, multiplier);
                    } else if (type === '' || type === 'all' || type === 'wszystkie') {
                        custMult = Math.min(custMult, multiplier);
                        catMult = Math.min(catMult, multiplier);
                    }
                }
            });

            activePromo = {
                code: codeName,
                catalogMultiplier: catMult,
                customMultiplier: custMult
            };
        } else {
            console.log('ℹ️ Brak aktywnej promocji w arkuszu.');
        }
    }

    // 3. Budowanie ostatecznego JSONa
    const finalData = {
        products: Array.isArray(productsData) ? productsData : [],
        gallery: Array.isArray(galleryData) ? galleryData : [],
        promo: activePromo,
        lastUpdate: new Date().toLocaleString('pl-PL')
    };

    // DEBUG:
    if (finalData.products.length > 0) {
        console.log(`📦 Pobranno ${finalData.products.length} produktów.`);
        console.log(`🖼️ Pobranno ${finalData.gallery.length} elementów galerii.`);
        console.log(`🎟️ Promo: ${JSON.stringify(finalData.promo)}`);
    }

    const jsonContent = JSON.stringify(finalData, null, 2);
    
    // Logika ścieżek
    const localPublicDir = path.join(__dirname, '..', 'public');
    let targetPath;

    if (process.env.CI) {
        targetPath = path.join(__dirname, '..', 'data.json');
        console.log(`📍 CI Env -> root/data.json`);
    } else if (fs.existsSync(localPublicDir)) {
        targetPath = path.join(localPublicDir, 'data.json');
        console.log(`📍 Local Env -> public/data.json`);
    } else {
        targetPath = path.join('data.json');
        console.log(`📍 Fallback Env -> data.json`);
    }

    fs.writeFileSync(targetPath, jsonContent);
    console.log(`✅ Sukces! Zapisano w: ${targetPath}`);
    
  } catch (error) {
    console.error('❌ Błąd podczas pobierania danych:', error);
    process.exit(1);
  }
}

fetchData();
