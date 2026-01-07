import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// URL do Twojego Google Apps Script (taki sam jak w App.tsx)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFQPNUYwNkCtAuskHJhSkyGvEQ7R_J_spT08J_PMux4mUQIrU29JiQkfq09s2TaIawyA/exec";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchData() {
  console.log('🔄 Rozpoczynanie pobierania danych z Google Sheets...');
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    // Ścieżka do folderu public
    const publicDir = path.join(__dirname, '..', 'public');
    const outputPath = path.join(publicDir, 'data.json');

    // Upewnij się, że katalog public istnieje
    if (!fs.existsSync(publicDir)){
        fs.mkdirSync(publicDir);
    }

    // Zapisz dane do pliku
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Sukces! Pobrano ${Array.isArray(data) ? data.length : 0} produktów.`);
    console.log(`📂 Zapisano w: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Błąd podczas pobierania danych:', error);
    process.exit(1);
  }
}

fetchData();