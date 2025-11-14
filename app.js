// รอให้หน้าเว็บโหลดเสร็จก่อน
document.addEventListener("DOMContentLoaded", () => {
  const linksContainer = document.getElementById("links-container");

  // 1. ดึงข้อมูลจากไฟล์ links.json (เหมือนเดิม)
  fetch('links.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(links => {
      
      // 2. (อัปเดต!) แก้ไข 'for loop'
      for (const link of links) {
        
        // 3. สร้างปุ่ม <a> (เหมือนเดิม)
        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'button-link';
        
        if (link.target) {
          a.target = link.target;
        }

        // (ใหม่!) 4. สร้างไอคอน <i class="..."></i>
        const icon = document.createElement('i');
        icon.className = link.icon; // เช่น "fa-brands fa-discord"
        
        // (ใหม่!) 5. สร้างข้อความ <span>...</span>
        const text = document.createElement('span');
        text.textContent = link.text;
        
        // 6. นำไอคอนและข้อความใส่ในปุ่ม <a>
        a.appendChild(icon);
        a.appendChild(text);
        
        // 7. นำปุ่มไปแปะในหน้าเว็บ
        linksContainer.appendChild(a);
      }
    })
    .catch(error => {
      console.error('ไม่สามารถโหลดข้อมูลลิงก์ได้:', error);
      linksContainer.innerHTML = '<p style="color:red;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    });
});