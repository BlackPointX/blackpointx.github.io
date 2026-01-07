
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
    const response = await fetch(GOOGLE_SCRIPT_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    const jsonContent = JSON.stringify(data, null, 2);
    
    // Logika ścieżek:
    // 1. Jeśli folder 'public' istnieje obok folderu scripts (czyli jesteśmy w źródłach lokalnie), zapisz tam.
    // 2. W przeciwnym razie (jesteśmy na serwerze w root), zapisz w bieżącym katalogu roboczym (root strony).
    
    const localPublicDir = path.join(__dirname, '..', 'public');
    let targetPath;

    if (fs.existsSync(localPublicDir)) {
        // Środowisko lokalne (Source)
        targetPath = path.join(localPublicDir, 'data.json');
        console.log(`📍 Wykryto środowisko lokalne.`);
    } else {
        // Środowisko produkcyjne (GitHub Pages root)
        // Na serwerze skrypt jest w /scripts, a data.json ma być w /
        targetPath = path.join('data.json');
        console.log(`📍 Wykryto środowisko produkcyjne (root).`);
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
