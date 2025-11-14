
// รอให้หน้าเว็บโหลดเสร็จก่อน
document.addEventListener("DOMContentLoaded", () => {
    const linksContainer = document.getElementById("links-container");
  
    // 1. ดึงข้อมูลจากไฟล์ links.json
    fetch('links.json')
      .then(response => {
        // ตรวจสอบว่าไฟล์โหลดสำเร็จ
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(links => {
        
        // 2. (นี่คือ 'for loop' ที่คุณขอ)
        // วนลูปข้อมูล (links) ที่ได้มาทีละอัน
        for (const link of links) {
          
          // 3. สร้างปุ่ม (Element <a>)
          const a = document.createElement('a');
          a.href = link.url;
          a.className = 'button-link';
          a.textContent = `${link.emoji} ${link.text}`;
          
          // ถ้ามี target (เช่น _blank) ก็ให้ใส่ไปด้วย
          if (link.target) {
            a.target = link.target;
          }
          
          // 4. นำปุ่มไปแปะในหน้าเว็บ
          linksContainer.appendChild(a);
        }
      })
      .catch(error => {
        // หากโหลดไฟล์ json ไม่สำเร็จ
        console.error('ไม่สามารถโหลดข้อมูลลิงก์ได้:', error);
        linksContainer.innerHTML = '<p style="color:red;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
      });
  });