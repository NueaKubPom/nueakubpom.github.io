document.addEventListener("DOMContentLoaded", () => {
    // (ตัวแปรเดิม)
    const linksList = document.getElementById("links-list");
    const addForm = document.getElementById("add-form");
    const generateButton = document.getElementById("generate-button");
    const saveArea = document.getElementById("save-area");
    const jsonOutput = document.getElementById("json-output");
  
    // (ใหม่!) ตัวแปรสำหรับ Modal
    const editModal = document.getElementById("edit-modal");
    const editForm = document.getElementById("edit-form");
    const cancelEditBtn = document.getElementById("cancel-edit");
    const editIndexInput = document.getElementById("edit-index");
  
    let currentLinks = []; // ตัวแปรสำหรับเก็บลิงก์ในเบราว์เซอร์
  
    // 1. โหลดข้อมูลลิงก์เริ่มต้น (เหมือนเดิม)
    fetch('links.json')
      .then(response => {
        if (!response.ok) { throw new Error("ไม่สามารถโหลด links.json ได้"); }
        return response.json();
      })
      .then(data => {
        currentLinks = data;
        renderLinks();
      })
      .catch(error => {
        console.error(error);
        linksList.innerHTML = `<p style="color:red;">${error.message}</p>`;
      });
  
    // 2. ฟังก์ชันแสดงผลลิงก์ (อัปเดต!)
    function renderLinks() {
      linksList.innerHTML = "";
      if (currentLinks.length === 0) {
        linksList.innerHTML = "<p>ยังไม่มีลิงก์</p>";
        return;
      }
  
      currentLinks.forEach((link, index) => {
        const item = document.createElement("div");
        item.className = "link-item";
        
        // (อัปเดต!) เพิ่ม <span class="edit-trigger"> สำหรับคลิกแก้ไข
        item.innerHTML = `
          <span class="edit-trigger" data-index="${index}" title="คลิกเพื่อแก้ไข">
            ${link.emoji} ${link.text}
          </span>
          <button class="delete-btn" data-index="${index}">ลบ</button>
        `;
        
        linksList.appendChild(item);
      });
    }
  
    // 3. (อัปเดต!) Event Listener สำหรับ "ลบ" หรือ "แก้ไข"
    linksList.addEventListener("click", (e) => {
      
      // (A) ถ้ากด "ลบ"
      if (e.target.classList.contains("delete-btn")) {
        if (!confirm("คุณต้องการลบลิงก์นี้จริงหรือ?")) {
          return;
        }
        const index = parseInt(e.target.dataset.index, 10);
        currentLinks.splice(index, 1);
        renderLinks();
      }
      
      // (B) (ใหม่!) ถ้ากด "ข้อความ" (แก้ไข)
      if (e.target.classList.contains("edit-trigger")) {
        const index = parseInt(e.target.dataset.index, 10);
        openEditModal(index);
      }
    });
  
    // 4. ฟังก์ชันเพิ่มลิงก์ (เหมือนเดิม)
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newLink = {
        id: "link-" + Date.now(),
        emoji: document.getElementById("link-emoji").value,
        text: document.getElementById("link-text").value,
        url: document.getElementById("link-url").value,
        target: document.getElementById("link-target").value
      };
      currentLinks.push(newLink);
      renderLinks();
      addForm.reset();
    });
  
    // 5. ฟังก์ชันสร้าง JSON (เหมือนเดิม)
    generateButton.addEventListener("click", () => {
      const jsonString = JSON.stringify(currentLinks, null, 2);
      jsonOutput.value = jsonString;
      saveArea.style.display = "block";
      alert("สร้างโค้ดสำเร็จ! กรุณาคัดลอกโค้ดในกล่องด้านล่าง");
    });
  
    // --- (ใหม่!) ฟังก์ชันสำหรับ Modal แก้ไข ---
  
    // 6. (ใหม่!) ฟังก์ชันเปิด Pop-up แก้ไข
    function openEditModal(index) {
      const linkToEdit = currentLinks[index];
      
      // เติมข้อมูลเก่าลงในฟอร์ม
      editIndexInput.value = index;
      document.getElementById("edit-emoji").value = linkToEdit.emoji;
      document.getElementById("edit-text").value = linkToEdit.text;
      document.getElementById("edit-url").value = linkToEdit.url;
      document.getElementById("edit-target").value = linkToEdit.target;
      
      // แสดง Modal
      editModal.style.display = "flex";
    }
  
    // 7. (ใหม่!) ฟังก์ชันปิด Pop-up แก้ไข
    function closeEditModal() {
      editModal.style.display = "none";
    }
  
    // 8. (ใหม่!) Event Listener สำหรับปุ่ม "ยกเลิก"
    cancelEditBtn.addEventListener("click", closeEditModal);
  
    // 9. (ใหม่!) Event Listener สำหรับการ "บันทึก" (ใน Pop-up)
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // 1. ดึง index ที่เก็บไว้
      const index = parseInt(editIndexInput.value, 10);
      
      // 2. สร้าง object ใหม่จากข้อมูลที่แก้ไข
      const updatedLink = {
        id: currentLinks[index].id, // ใช้ ID เดิม
        emoji: document.getElementById("edit-emoji").value,
        text: document.getElementById("edit-text").value,
        url: document.getElementById("edit-url").value,
        target: document.getElementById("edit-target").value
      };
      
      // 3. อัปเดตข้อมูลใน Array
      currentLinks[index] = updatedLink;
      
      // 4. ปิด Pop-up และแสดงผลใหม่
      closeEditModal();
      renderLinks();
    });
  
  });