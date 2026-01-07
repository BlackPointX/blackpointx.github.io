
// --- KONFIGURACJA SKLEPU ---
// WAŻNE: Wklej ten klucz w edytorze Google Apps Script, nie trzymaj go na GitHubie!
const STRIPE_SECRET_KEY = "TU_WKLEJ_SWOJ_SEKRETNY_KLUCZ_STRIPE_W_GOOGLE_APPS_SCRIPT";
const SUCCESS_URL = "https://blackpointx.github.io/?status=success";
const SHIPPING_COST = 1200; // 12.00 PLN w groszach
const ADMIN_EMAIL = "mateuszczarnecki90@gmail.com";

// --- KONFIGURACJA GITHUB (DO WYPEŁNIENIA) ---
// Wygeneruj token tutaj: https://github.com/settings/tokens (Classic, zaznacz scope 'repo')
const GITHUB_TOKEN = "TU_WKLEJ_SWOJ_GITHUB_TOKEN"; 
const GITHUB_OWNER = "blackpointx"; // Twój nick na GitHub
const GITHUB_REPO = "blackpointx.github.io"; // Nazwa Twojego repozytorium

// --- TRIGGERY I MENU ARKUSZA ---

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('PokeCustom Menu')
    .addItem('🔧 Napraw listę statusów (Kolumna B)', 'applyValidationToStatusColumn')
    .addItem('🕒 Zaktualizuj datę dla zaznaczonego wiersza', 'updateDateForSelectedRow')
    .addItem('🔄 Wymuś aktualizację GitHuba (Ręcznie)', 'triggerGithubBuild')
    .addToUi();
}

// Automatyczna aktualizacja daty przy zmianie statusu ręcznie
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "Status") return;

  const range = e.range;
  const col = range.getColumn();
  const row = range.getRow();

  // Jeśli edytowano kolumnę 2 (Status) i nie jest to nagłówek
  if (col === 2 && row > 1) {
    // Ustaw datę w kolumnie 3 (Data Aktualizacji)
    sheet.getRange(row, 3).setValue(new Date().toLocaleString());
  }
}

// Funkcja do ręcznego wywołania z menu
function applyValidationToStatusColumn() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Status");
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Brak arkusza "Status"!');
    return;
  }
  
  const lastRow = sheet.getMaxRows();
  // Zakładamy, że statusy są w kolumnie B (2), od wiersza 2 w dół
  const range = sheet.getRange(2, 2, lastRow - 1);
  
  const rules = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Przyjęto', 'Produkcja', 'Wysłano', 'Gotowe'], true)
    .setAllowInvalid(false) // Nie pozwalaj na wpisanie innych wartości
    .build();
    
  range.setDataValidation(rules);
  SpreadsheetApp.getUi().alert('Lista statusów została zaktualizowana w kolumnie B.');
}

function updateDateForSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getName() !== "Status") {
     SpreadsheetApp.getUi().alert('To działa tylko w arkuszu "Status"');
     return;
  }
  const row = sheet.getActiveCell().getRow();
  if (row > 1) {
     sheet.getRange(row, 3).setValue(new Date().toLocaleString());
  }
}

// --- GŁÓWNA LOGIKA API ---

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'get_discounts') {
    return getDiscounts();
  }
  
  if (action === 'check_status') {
    return checkOrderStatus(e.parameter.orderId);
  }
  
  return getProducts();
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'verify_payment') {
       return verifyPaymentAndSaveOrder(data.sessionId);
    }
    
    // TWORZENIE PŁATNOŚCI
    const orderId = generateOrderId();
    
    const driveFolder = DriveApp.getRootFolder(); 
    let itemsDesc = [];
    let stripeLineItems = [];
    let imagesLinks = [];
    
    data.items.forEach(function(item) {
      const details = item.customDetails || {};

      if (item.isCustom) {
        let customDesc = `[${orderId}] CUSTOM: ${details.name || item.name}\n` +
                         `Subject: ${details.subject || '-'}\n` +
                         `Set: ${details.set || '-'} | Subtype: ${details.subtype}\n` +
                         `Type: ${details.type} | HP: ${details.hp}\n` +
                         `Flavor Text: ${details.flavorText || '-'}\n`;
        
        if (details.moves && Array.isArray(details.moves) && details.moves.length > 0) {
           const movesStr = details.moves.map(m => {
             const costStr = (m.cost && m.cost.length > 0) ? `[${m.cost.join('-')}]` : '[No Cost]';
             return `> ${m.name} (${m.type}) - DMG: ${m.damage || '0'} - Energy: ${costStr}\n   Effect: ${m.description || '-'}`;
           }).join('\n');
           customDesc += `Moves:\n${movesStr}`;
        }
        itemsDesc.push(customDesc);
      } else {
        itemsDesc.push(item.name + " (x" + item.qty + ")");
      }

      const unitAmount = Math.round(Number(item.price) * 100);

      stripeLineItems.push({
        price_data: {
          currency: 'pln',
          product_data: {
            name: item.name,
            description: item.isCustom ? `Custom Card (ID: ${orderId})` : "Karta Kolekcjonerska",
          },
          unit_amount: unitAmount,
        },
        quantity: parseInt(item.qty) || 1,
      });

      if (item.isCustom && details && details.imageData) {
         let imgsToProcess = [];
         if (details.images && Array.isArray(details.images)) {
             imgsToProcess = details.images;
         } else if (Array.isArray(details.imageData)) {
             imgsToProcess = details.imageData;
         } else if (details.imageData) {
             imgsToProcess = [details.imageData];
         }

         imgsToProcess.forEach((imgData, idx) => {
             if (typeof imgData === 'string') {
                 if (imgData.startsWith('http')) {
                     imagesLinks.push(`[${idx+1}] ${imgData}`);
                 } else if (imgData.includes('base64')) {
                     try {
                        const base64Data = imgData.split(",")[1];
                        const contentType = imgData.split(";")[0].split(":")[1];
                        const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), contentType, `Card_${orderId}_${idx+1}.png`);
                        const file = driveFolder.createFile(blob);
                        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
                        imagesLinks.push(`[${idx+1}] ${file.getUrl()}`);
                     } catch(e) {
                        imagesLinks.push(`[${idx+1}] Błąd Drive`);
                     }
                 }
             }
         });
      }
    });

    stripeLineItems.push({
      price_data: {
        currency: 'pln',
        product_data: {
          name: "Wysyłka (Paczkomat InPost)",
          description: "Dostawa na terenie Polski",
        },
        unit_amount: SHIPPING_COST,
      },
      quantity: 1,
    });

    let discounts = [];
    let discountCode = data.discountUsed || "";
    let discountAmountPLN = parseFloat(data.discountAmount) || 0;

    if (discountCode && discountAmountPLN > 0) {
      try {
        const amountOffCents = Math.round(discountAmountPLN * 100);
        const couponId = createStripeCoupon(amountOffCents, discountCode);
        if (couponId) {
          discounts.push({ coupon: couponId });
        }
      } catch (couponErr) {
        Logger.log("Błąd tworzenia kuponu: " + couponErr.toString());
      }
    }

    const formPayload = {
      "mode": "payment",
      "success_url": SUCCESS_URL,
      "cancel_url": SUCCESS_URL.replace('status=success', 'status=cancel'),
      "customer_email": data.userData.email
    };
    
    formPayload["metadata[orderId]"] = orderId;

    stripeLineItems.forEach((item, index) => {
        formPayload[`line_items[${index}][price_data][currency]`] = 'pln';
        formPayload[`line_items[${index}][price_data][unit_amount]`] = Number(item.price_data.unit_amount).toFixed(0);
        formPayload[`line_items[${index}][price_data][product_data][name]`] = item.price_data.product_data.name;
        formPayload[`line_items[${index}][price_data][product_data][description]`] = item.price_data.product_data.description || "";
        formPayload[`line_items[${index}][quantity]`] = Number(item.quantity).toFixed(0);
    });

    if (discounts.length > 0) {
       formPayload[`discounts[0][coupon]`] = discounts[0].coupon;
    }

    const options = {
      method: "post",
      headers: { "Authorization": "Bearer " + STRIPE_SECRET_KEY },
      payload: formPayload,
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch("https://api.stripe.com/v1/checkout/sessions", options);
    const result = JSON.parse(response.getContentText());

    if (result.error) {
      throw new Error("Stripe Error: " + result.error.message);
    }

    const orderDataToSave = {
      id: orderId,
      date: data.orderDate || new Date().toLocaleString(),
      user: data.userData,
      items: itemsDesc.join("\n\n----------------\n\n"),
      rawItems: data.items, // Zapisujemy surowe dane aby móc zaktualizować stan magazynowy
      images: imagesLinks.join("\n"),
      total: (parseFloat(data.total)).toFixed(2) + " PLN", 
      discountCode: discountCode,
      discountVal: discountAmountPLN > 0 ? discountAmountPLN.toFixed(2) + " PLN" : "-"
    };
    
    try {
        CacheService.getScriptCache().put(result.id, JSON.stringify(orderDataToSave), 21600);
    } catch(e) {
        appendToSheet(orderDataToSave, "OCZEKUJE - CACHE_FAIL", result.id);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'SUCCESS',
      paymentUrl: result.url,
      sessionId: result.id
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function createStripeCoupon(amountOff, name) {
  const payload = {
    "duration": "once",
    "amount_off": amountOff.toString(),
    "currency": "pln",
    "name": "Rabat: " + name
  };
  const options = {
    method: "post",
    headers: { "Authorization": "Bearer " + STRIPE_SECRET_KEY },
    payload: payload,
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch("https://api.stripe.com/v1/coupons", options);
  const result = JSON.parse(response.getContentText());
  return result.id || null;
}

function verifyPaymentAndSaveOrder(sessionId) {
  try {
    const options = {
      method: "get",
      headers: { "Authorization": "Bearer " + STRIPE_SECRET_KEY },
      muteHttpExceptions: true
    };
    const response = UrlFetchApp.fetch("https://api.stripe.com/v1/checkout/sessions/" + sessionId, options);
    const session = JSON.parse(response.getContentText());

    if (session.payment_status === 'paid') {
        const cachedData = CacheService.getScriptCache().get(sessionId);
        
        if (cachedData) {
            const orderData = JSON.parse(cachedData);
            appendToSheet(orderData, "OPŁACONE", sessionId);
            
            // Ustawienie pierwszego statusu
            updateStatusSheet(orderData.id, "Przyjęto", "Zamówienie opłacone, oczekuje na weryfikację.");
            
            // AKTUALIZACJA STANÓW MAGAZYNOWYCH
            if (orderData.rawItems) {
               updateInventory(orderData.rawItems);
            }

            // TRIGGER GITHUB ACTION (STATYCZNE DANE)
            triggerGithubBuild();
            
            CacheService.getScriptCache().remove(sessionId);
            sendEmails(orderData, sessionId);
            return ContentService.createTextOutput(JSON.stringify({ status: 'PAID' })).setMimeType(ContentService.MimeType.JSON);
        } else {
             return ContentService.createTextOutput(JSON.stringify({ status: 'PAID', warning: 'Cache expired' })).setMimeType(ContentService.MimeType.JSON);
        }
    } else {
        return ContentService.createTextOutput(JSON.stringify({ status: 'UNPAID' })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (e) {
     return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', message: e.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Funkcja wywołująca GitHub Actions (Repository Dispatch)
function triggerGithubBuild() {
  // Sprawdzenie czy skonfigurowano token
  if (!GITHUB_TOKEN || GITHUB_TOKEN === "TU_WKLEJ_SWOJ_GITHUB_TOKEN") {
    Logger.log("Błąd: Nie skonfigurowano tokena GitHub w pliku code.gs");
    return;
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;
  
  const options = {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + GITHUB_TOKEN,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Google-Apps-Script"
    },
    payload: JSON.stringify({
      "event_type": "update_products" // Musi pasować do types w pliku .yml w GitHub Actions
    }),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    Logger.log("GitHub Trigger Response Code: " + code);
    Logger.log("GitHub Trigger Response Body: " + response.getContentText());
  } catch (e) {
    Logger.log("Błąd GitHub Trigger: " + e.toString());
  }
}

// Funkcja aktualizująca stany magazynowe w arkuszu "Produkty"
function updateInventory(items) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Produkty");
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return;

  // Znajdź indeksy kolumn ID i Stan
  const headers = data[0].map(h => String(h).toLowerCase().trim());
  const idIndex = headers.indexOf('id');
  const stanIndex = headers.indexOf('stan');

  if (idIndex === -1 || stanIndex === -1) {
    Logger.log("Nie znaleziono kolumny ID lub Stan w arkuszu Produkty");
    return;
  }

  // Iterujemy po zakupionych przedmiotach
  items.forEach(item => {
      // Pomijamy karty Custom (nie mają stanu magazynowego w arkuszu)
      if (item.isCustom || !item.productId) return; 

      // Szukamy wiersza z produktem
      for (let i = 1; i < data.length; i++) {
          // Porównujemy ID produktu (rzutujemy na string)
          if (String(data[i][idIndex]).trim() === String(item.productId).trim()) {
              const currentStock = parseInt(data[i][stanIndex]);
              // Jeśli stan jest liczbą, odejmujemy
              if (!isNaN(currentStock)) {
                  const qtyBought = parseInt(item.qty) || 1;
                  const newStock = Math.max(0, currentStock - qtyBought);
                  // Zapisujemy nową wartość (i + 1 bo tablica 0-indexed, wiersze 1-indexed)
                  sheet.getRange(i + 1, stanIndex + 1).setValue(newStock);
              }
              break; // Przerywamy pętlę wierszy po znalezieniu produktu
          }
      }
  });
}

function generateOrderId() {
   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
   let p1 = "";
   let p2 = "";
   for(let i=0; i<4; i++) {
     p1 += chars.charAt(Math.floor(Math.random() * chars.length));
     p2 += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return "POKE-" + p1 + "-" + p2;
}

function updateStatusSheet(orderId, status, details) {
   const ss = SpreadsheetApp.getActiveSpreadsheet();
   let sheet = ss.getSheetByName("Status");
   if (!sheet) {
      sheet = ss.insertSheet("Status");
      sheet.appendRow(["ID Zamówienia", "Status", "Data Aktualizacji", "Szczegóły"]);
   }
   
   sheet.appendRow([orderId, status, new Date().toLocaleString(), details]);
   
   // Dodajemy Data Validation (Dropdown) do komórki statusu w nowym wierszu
   const lastRow = sheet.getLastRow();
   const cell = sheet.getRange(lastRow, 2);
   const rule = SpreadsheetApp.newDataValidation()
     .requireValueInList(['Przyjęto', 'Produkcja', 'Wysłano', 'Gotowe'], true)
     .setAllowInvalid(false)
     .build();
   cell.setDataValidation(rule);
}

function checkOrderStatus(orderId) {
   const ss = SpreadsheetApp.getActiveSpreadsheet();
   const sheet = ss.getSheetByName("Status");
   if (!sheet) return ContentService.createTextOutput(JSON.stringify({ found: false, message: "Brak arkusza Status" })).setMimeType(ContentService.MimeType.JSON);
   
   const data = sheet.getDataRange().getValues();
   for (let i = data.length - 1; i >= 1; i--) {
       const sheetId = String(data[i][0]).trim().toUpperCase();
       const searchId = String(orderId).trim().toUpperCase();
       
       if (sheetId === searchId) {
           return ContentService.createTextOutput(JSON.stringify({
               found: true,
               id: data[i][0],
               state: data[i][1],
               updateTime: data[i][2] instanceof Date ? data[i][2].toLocaleString() : data[i][2],
               items: data[i][3]
           })).setMimeType(ContentService.MimeType.JSON);
       }
   }
   
   return ContentService.createTextOutput(JSON.stringify({ found: false })).setMimeType(ContentService.MimeType.JSON);
}

function sendEmails(order, id) {
  const PDF_URL = "https://blackpointx.github.io/regulamin/regulamin.pdf"; 
  let pdfBlob = null;
  try {
     const pdfResponse = UrlFetchApp.fetch(PDF_URL);
     if (pdfResponse.getResponseCode() === 200) {
       pdfBlob = pdfResponse.getBlob().setName("Regulamin_PokeCustom.pdf");
     }
  } catch (e) {}

  let itemsHtml = order.items.replace(/\n/g, '<br/>');

  const adminSubject = `[${order.id}] NOWE ZAMÓWIENIE: ${order.user.fullName}`;
  let adminBody = `
    <h3>Nowe zamówienie opłacone!</h3>
    <p><b>ID Zamówienia:</b> ${order.id}</p>
    <p><b>Klient:</b> ${order.user.fullName} (${order.user.email})</p>
    <p><b>Adres:</b> ${order.user.paczkomatCode ? `Paczkomat ${order.user.paczkomatCode}` : order.user.address}</p>
    <p><b>Telefon:</b> ${order.user.phone}</p>
    <hr/>
    <h3>Zamówione pozycje:</h3>
    <p style="font-family: monospace;">${itemsHtml}</p>
    <p><b>Zdjęcia referencyjne:</b> <br/>${order.images.replace(/\n/g, '<br/>')}</p>
    <hr/>
    <p><b>Suma:</b> ${order.total}</p>
  `;
  
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: adminSubject,
    htmlBody: adminBody
  });
  
  const clientSubject = `Potwierdzenie zamówienia ${order.id} - PokeCustom`;
  let clientBody = `
    <h2>Dziękujemy za zamówienie!</h2>
    <p>Cześć ${order.user.fullName},</p>
    <p>Płatność przyjęta. Twoje karty trafiły do produkcji.</p>
    <p><b>Twój numer zamówienia: ${order.id}</b></p>
    <p>Możesz sprawdzić status realizacji w zakładce "Status Zamówienia" na naszej stronie.</p>
    <hr/>
    <h3>Szczegóły:</h3>
    <p>${itemsHtml}</p>
    <p><b>Suma:</b> ${order.total}</p>
    <br/>
    <p>Pozdrawiamy,<br/>Zespół PokeCustom</p>
  `;
  
  const emailOptions = {
    to: order.user.email,
    subject: clientSubject,
    htmlBody: clientBody
  };

  if (pdfBlob) {
    emailOptions.attachments = [pdfBlob];
  }
  
  MailApp.sendEmail(emailOptions);
}

function appendToSheet(data, status, transactionId) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Zamówienia");
    if (!sheet) {
       const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Zamówienia");
       newSheet.appendRow(["Data", "ID Zamówienia", "Imię", "Email", "Telefon", "Adres/Paczkomat", "Koszyk (Szczegóły)", "Linki Zdjęć", "Suma", "Status", "Stripe ID", "Kod Rab.", "Kwota Rab."]);
    }
    
    const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Zamówienia");
    const addressInfo = data.user.paczkomatCode 
        ? "Paczkomat: " + data.user.paczkomatCode + " (" + data.user.paczkomatAddress + ")"
        : (data.user.address + ", " + data.user.city);

    activeSheet.appendRow([
      data.date,
      data.id,
      data.user.fullName,
      data.user.email,
      data.user.phone,
      addressInfo,
      data.items, 
      data.images,
      data.total,
      status,
      transactionId,
      data.discountCode || "",
      data.discountVal || ""
    ]);
}

function getDiscounts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rabat");
  if (!sheet) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  const data = getSheetData(sheet);
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Produkty");
  if (!sheet) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);

  const headers = data[0].map(function(h) { 
    return h ? h.toString().toLowerCase().trim().replace(/\s+/g, '') : ''; 
  });

  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; 
    let product = {};
    headers.forEach(function(header, index) {
      if (header && row[index] !== "") product[header] = row[index];
    });

    let foundImages = [];
    Object.keys(product).forEach(function(key) {
      if ((key.indexOf('img') === 0 || key.indexOf('image') === 0) && key !== 'images') foundImages.push(product[key]);
    });
    if (foundImages.length === 0 && product['images']) foundImages = product['images'].split(',').map(s => s.trim());
    product.images = foundImages;
    if (product.price) product.price = parseFloat(product.price.toString().replace(',', '.').replace(/[^0-9.]/g, '')) || 0;
    products.push(product);
  }
  return ContentService.createTextOutput(JSON.stringify(products)).setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let obj = {};
    let hasData = false;
    for (let j = 0; j < headers.length; j++) {
      if (headers[j]) {
        obj[headers[j]] = row[j];
        if (row[j] !== "") hasData = true;
      }
    }
    if (hasData) result.push(obj);
  }
  return result;
}
