// รอให้หน้าเว็บโหลดเสร็จก่อน
document.addEventListener("DOMContentLoaded", () => {
  // 0. Update Current Year (Existing)
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Typewriter Effect ---
  const typingElement = document.getElementById("typing-text");
  const textToType = " X NKPNT STUDIO";
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentText = isDeleting
      ? textToType.substring(0, charIndex--)
      : textToType.substring(0, charIndex++);

    if (typingElement) {
      typingElement.textContent = currentText;
    }

    let typeSpeed = isDeleting ? 50 : 150;

    if (!isDeleting && charIndex === textToType.length + 1) {
      // Finished typing, pause before deleting
      isDeleting = true;
      typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, pause before typing again
      isDeleting = false;
      typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  // Start the typing loop
  if (typingElement) {
    setTimeout(typeEffect, 1000);
  }
  // -------------------------

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