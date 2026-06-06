// 1. ตั้งค่ารหัสผ่านสำหรับการอัปเดตข้อมูล
const ADMIN_PASSWORD = "1234"; // เปลี่ยนเป็นรหัสผ่านที่คุณต้องการ

// 2. ฟังก์ชันนี้ทำงานเมื่อมีการเรียกดูข้อมูล (จากหน้าเว็บหลัก หรือหน้าแอดมินตอนโหลด)
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // แปลงข้อมูลจาก Sheet ให้อยู่ในรูปแบบ Array ของ Object (เหมือน links.json)
  const links = [];
  
  // ข้ามบรรทัดแรก (Header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // ลบแถวว่างทิ้ง
    if (!row[0] && !row[1] && !row[2]) continue;
    
    links.push({
      id: row[0] ? String(row[0]) : "",
      icon: row[1] ? String(row[1]) : "",
      text: row[2] ? String(row[2]) : "",
      url: row[3] ? String(row[3]) : "",
      target: row[4] ? String(row[4]) : "_blank"
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(links))
    .setMimeType(ContentService.MimeType.JSON);
}

// 3. ฟังก์ชันนี้ทำงานเมื่อมีการกด "บันทึก/ลบ/เพิ่ม" จากหน้าแอดมิน (POST Request)
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    // ตรวจสอบรหัสผ่าน
    if (payload.password !== ADMIN_PASSWORD) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: "รหัสผ่านไม่ถูกต้อง!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const links = payload.data; // ข้อมูล links ทั้งหมดที่ส่งมา
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // ลบข้อมูลเก่าทั้งหมด (เริ่มลบตั้งแต่แถว 2 ปล่อย Header ไว้)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 5).clearContent();
    }
    
    // ถ้ามีข้อมูลใหม่ ให้เขียนลงไป
    if (links && links.length > 0) {
      const rows = links.map(link => [
        link.id || "",
        link.icon || "",
        link.text || "",
        link.url || "",
        link.target || "_blank"
      ]);
      
      sheet.getRange(2, 1, rows.length, 5).setValues(rows);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "อัปเดตข้อมูลเรียบร้อย!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Error: " + error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
