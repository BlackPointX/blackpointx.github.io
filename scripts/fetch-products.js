
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// URL do Twojego Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFQPNUYwNkCtAuskHJhSkyGvEQ7R_J_spT08J_PMux4mUQIrU29JiQkfq09s2TaIawyA/exec";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchData() {
  console.log('🔄 Rozpoczynanie pobierania danych z Google Sheets...');
  
  try {
    // 1. Dodajemy timestamp, aby uniknąć cache'owania przez serwery Google/GitHub
    const urlWithCacheBuster = `${GOOGLE_SCRIPT_URL}?t=${Date.now()}`;
    
    const response = await fetch(urlWithCacheBuster);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    const jsonContent = JSON.stringify(data, null, 2);
    
    // Logika ścieżek:
    const localPublicDir = path.join(__dirname, '..', 'public');
    let targetPath;

    // PRIORYTET 1: Środowisko CI (GitHub Actions)
    // GitHub Actions ustawia zmienną środowiskową CI=true.
    // W tym trybie MUSIMY zapisać plik w głównym katalogu (root), niezależnie od tego czy folder public istnieje.
    if (process.env.CI) {
        targetPath = path.join(__dirname, '..', 'data.json');
        console.log(`📍 Wykryto środowisko CI (GitHub Actions) -> Wymuszony zapis do głównego katalogu (root).`);
    } 
    // PRIORYTET 2: Środowisko Lokalne (Dev)
    // Jeśli pracujesz u siebie i masz folder public, zapisujemy tam (dla Vite).
    else if (fs.existsSync(localPublicDir)) {
        targetPath = path.join(localPublicDir, 'data.json');
        console.log(`📍 Wykryto środowisko lokalne (Dev) -> Zapis do folderu /public.`);
    } 
    // PRIORYTET 3: Fallback (Inne serwery)
    else {
        targetPath = path.join('data.json');
        console.log(`📍 Środowisko produkcyjne (Fallback) -> Zapis do obecnego katalogu.`);
    }

    fs.writeFileSync(targetPath, jsonContent);
    console.log(`✅ Zapisano pomyślnie w: ${targetPath}`);
    console.log(`📦 Pobrano ${Array.isArray(data) ? data.length : 0} produktów.`);
    
  } catch (error) {
    console.error('❌ Błąd podczas pobierania danych:', error);
    process.exit(1);
  }
}

fetchData();
