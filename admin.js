document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init({
    once: true,
    offset: 50,
  });

  // ==========================================
  // ตั้งค่า URL ของ Google Apps Script ของคุณที่นี่
  // ==========================================
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwk43VBe6UHCczza5rTpACNFzffn2yZMpHu5Q21kce-m5g0rfGDwr60C5RPMXGV2_tU/exec";

  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ==========================================
  // Login Elements
  // ==========================================
  const loginSection = document.getElementById("login-section");
  const adminContent = document.getElementById("admin-content");
  const loginForm = document.getElementById("login-form");
  const adminPasswordInput = document.getElementById("admin-password");

  let adminPassword = sessionStorage.getItem("admin_password") || "";

  // ==========================================
  // Admin Elements
  // ==========================================
  const linksList = document.getElementById("links-list");
  const addForm = document.getElementById("add-form");
  const saveToSheetsBtn = document.getElementById("save-to-sheets");
  const editModal = document.getElementById("edit-modal");
  const editModalContent = document.getElementById("edit-modal-content");
  const editForm = document.getElementById("edit-form");
  const cancelEditBtn = document.getElementById("cancel-edit");
  const closeEditTopBtn = document.getElementById("close-edit-top");
  const editIndexInput = document.getElementById("edit-index");

  const previewIcon = document.getElementById("preview-icon");
  const previewText = document.getElementById("preview-text");
  const previewMeta = document.getElementById("preview-meta");
  const previewTarget = document.getElementById("preview-target");

  const addFields = {
    id: document.getElementById("link-id"),
    icon: document.getElementById("link-icon"),
    text: document.getElementById("link-text"),
    url: document.getElementById("link-url"),
    target: document.getElementById("link-target"),
  };

  const editFields = {
    id: document.getElementById("edit-id"),
    icon: document.getElementById("edit-icon"),
    text: document.getElementById("edit-text"),
    url: document.getElementById("edit-url"),
    target: document.getElementById("edit-target"),
  };

  let currentLinks = [];

  // SweetAlert2 Toast configuration
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: 'rgba(5, 11, 20, 0.9)',
    color: '#00f3ff',
    customClass: {
      popup: 'border border-neon-cyan/30 backdrop-blur-md shadow-neon-cyan',
      timerProgressBar: 'bg-neon-cyan'
    }
  });

  // ==========================================
  // Login Logic
  // ==========================================
  function showAdmin() {
    loginSection.classList.add("hidden");
    adminContent.classList.remove("hidden");
    // Re-init AOS for newly visible content
    setTimeout(() => AOS.refresh(), 50);
    loadLinks();
  }

  function showLogin() {
    loginSection.classList.remove("hidden");
    adminContent.classList.add("hidden");
  }

  // ถ้ามี password ใน session อยู่แล้ว ให้เข้าเลย
  if (adminPassword) {
    showAdmin();
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = adminPasswordInput.value.trim();

    if (!password) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกรหัสผ่าน',
        background: 'rgba(10, 15, 25, 0.95)',
        color: '#fff',
        confirmButtonColor: 'rgba(188, 19, 254, 0.3)',
        customClass: { popup: 'border border-rose-500/30 backdrop-blur-xl' }
      });
      return;
    }

    // ทดสอบรหัสผ่านโดยส่ง POST ไปยัง Google Apps Script
    // ถ้ายังไม่ได้ตั้ง URL ให้ใช้รหัสง่ายๆ เพื่อทดสอบ
    if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      // Fallback mode: ยอมรับทุกรหัสผ่านเพื่อทดสอบ
      adminPassword = password;
      sessionStorage.setItem("admin_password", password);
      Toast.fire({ icon: 'success', title: 'เข้าสู่ระบบสำเร็จ', text: 'โหมดทดสอบ (ยังไม่ได้เชื่อม Google Sheets)' });
      showAdmin();
      return;
    }

    // ส่ง POST ทดสอบไปยัง Google Apps Script พร้อมข้อมูลว่าง (เพื่อตรวจสอบรหัสผ่าน)
    Swal.fire({
      title: 'กำลังตรวจสอบ...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      background: 'rgba(10, 15, 25, 0.95)',
      color: '#fff',
    });

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ password: password, action: "verify" }),
    })
      .then(res => res.json())
      .then(result => {
        Swal.close();
        if (result.success || result.success === undefined) {
          // success === undefined means verify action not implemented, treat as ok
          adminPassword = password;
          sessionStorage.setItem("admin_password", password);
          Toast.fire({ icon: 'success', title: 'เข้าสู่ระบบสำเร็จ' });
          showAdmin();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'รหัสผ่านไม่ถูกต้อง',
            text: result.message || 'กรุณาลองใหม่อีกครั้ง',
            background: 'rgba(10, 15, 25, 0.95)',
            color: '#fff',
            confirmButtonColor: 'rgba(188, 19, 254, 0.3)',
            customClass: { popup: 'border border-rose-500/30 backdrop-blur-xl' }
          });
        }
      })
      .catch(err => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'เชื่อมต่อไม่สำเร็จ',
          text: err.message,
          background: 'rgba(10, 15, 25, 0.95)',
          color: '#fff',
          confirmButtonColor: 'rgba(188, 19, 254, 0.3)',
          customClass: { popup: 'border border-rose-500/30 backdrop-blur-xl' }
        });
      });
  });

  // ==========================================
  // Utility Functions
  // ==========================================
  function normalizeId(value) {
    return value.trim().toLowerCase().replace(/\s+/g, "-");
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  // ==========================================
  // Render Links List
  // ==========================================
  function renderLinks() {
    linksList.innerHTML = "";

    if (!currentLinks.length) {
      linksList.innerHTML = `
        <div class="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-400">
          ยังไม่มีลิงก์ในระบบ
        </div>
      `;
      return;
    }

    currentLinks.forEach((link, index) => {
      const item = document.createElement("div");
      item.className = "flex flex-col sm:flex-row items-stretch gap-3 w-full group";

      item.innerHTML = `
        <button type="button" class="edit-trigger flex-1 flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-neon-cyan/10 hover:border-neon-cyan/40 transition-colors text-left" data-index="${index}" title="แก้ไขลิงก์นี้">
          <span class="flex shrink-0 h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white/10 text-slate-300 group-hover:text-neon-cyan transition-colors">
            <i class="${escapeHtml(link.icon || "fa-solid fa-link")} text-lg"></i>
          </span>
          <span class="flex flex-col flex-1 min-w-0">
            <span class="text-sm sm:text-base font-semibold text-slate-200 truncate">${escapeHtml(link.text || "Untitled link")}</span>
            <span class="text-xs text-slate-400 truncate">${escapeHtml(link.id || "no-id")} • ${escapeHtml(link.target || "_self")}</span>
          </span>
        </button>
        <button type="button" class="delete-btn shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-colors" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
          <span class="sm:hidden">ลบ</span>
        </button>
      `;
      linksList.appendChild(item);
    });
  }

  // ==========================================
  // Preview
  // ==========================================
  function updatePreview() {
    const iconClass = addFields.icon.value.trim() || "fa-solid fa-icons";
    const text = addFields.text.value.trim() || "ชื่อปุ่มของคุณ";
    const id = normalizeId(addFields.id.value) || "new-link";
    const target = addFields.target.value || "_blank";

    previewIcon.className = iconClass;
    previewText.textContent = text;
    previewMeta.textContent = `${id} • preview`;
    previewTarget.textContent = target;
  }

  // ==========================================
  // Modal
  // ==========================================
  function openEditModal(index) {
    const linkToEdit = currentLinks[index];
    editIndexInput.value = index;
    editFields.id.value = linkToEdit.id || "";
    editFields.icon.value = linkToEdit.icon || "";
    editFields.text.value = linkToEdit.text || "";
    editFields.url.value = linkToEdit.url || "";
    editFields.target.value = linkToEdit.target || "_self";

    editModal.classList.remove("hidden");
    editModal.classList.add("flex");

    setTimeout(() => {
      editModal.classList.remove("opacity-0");
      editModalContent.classList.remove("scale-95");
      editModalContent.classList.add("scale-100");
    }, 10);
  }

  function closeEditModal() {
    editModal.classList.add("opacity-0");
    editModalContent.classList.remove("scale-100");
    editModalContent.classList.add("scale-95");

    setTimeout(() => {
      editModal.classList.add("hidden");
      editModal.classList.remove("flex");
    }, 300);
  }

  function readFormFields(fields) {
    return {
      id: normalizeId(fields.id.value),
      icon: fields.icon.value.trim(),
      text: fields.text.value.trim(),
      url: fields.url.value.trim(),
      target: fields.target.value,
    };
  }

  // ==========================================
  // Google Sheets API Functions
  // ==========================================
  function loadLinks(forceFromDefault = false) {
    if (forceFromDefault) {
      fetch("links.json")
        .then(res => res.json())
        .then(data => {
          currentLinks = data;
          renderLinks();
          updatePreview();
          Toast.fire({ icon: 'success', title: 'โหลดข้อมูลจากไฟล์เริ่มต้นแล้ว', text: `พบ ${data.length} ลิงก์` });
        })
        .catch(err => {
          Toast.fire({ icon: 'error', title: 'ไม่สามารถอ่านไฟล์ links.json ได้' });
        });
      return;
    }

    const fetchUrl = GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
      ? "links.json"
      : GOOGLE_SCRIPT_URL;

    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลได้");
        }
        return response.json();
      })
      .then((data) => {
        // หาก Google Sheet คืนค่า Array ว่างมา ให้ fallback ดึง links.json เพื่อไม่ให้ข้อมูลหาย
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("Google Sheet empty, falling back to links.json");
          fetch("links.json")
            .then(res => res.json())
            .then(defaultLinks => {
              currentLinks = defaultLinks;
              renderLinks();
              updatePreview();
              Toast.fire({
                icon: 'info',
                title: 'กู้คืนข้อมูลเริ่มต้นอัตโนมัติ',
                text: 'เนื่องจาก Google Sheet ว่างเปล่า ระบบจึงโหลดลิงก์เริ่มต้นให้ (กด "บันทึก" เพื่อ Sync เข้า Sheet)'
              });
            })
            .catch(() => {
              currentLinks = [];
              renderLinks();
            });
          return;
        }

        currentLinks = data;
        renderLinks();
        updatePreview();
        Toast.fire({ icon: 'success', title: 'โหลดข้อมูลสำเร็จ', text: `พบ ${data.length} ลิงก์` });
      })
      .catch((error) => {
        console.error("Fetch error, falling back to links.json:", error);
        // Fallback to local links.json on error
        fetch("links.json")
          .then(res => res.json())
          .then(defaultLinks => {
            currentLinks = defaultLinks;
            renderLinks();
            updatePreview();
            Toast.fire({ icon: 'warning', title: 'ใช้ข้อมูลสำรองจากไฟล์', text: 'ไม่สามารถต่อ Google Sheet ได้' });
          })
          .catch(() => {
            linksList.innerHTML = `<div class="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200 backdrop-blur-md">${error.message}</div>`;
            Toast.fire({ icon: 'error', title: 'โหลดข้อมูลล้มเหลว', text: error.message, color: '#ff0055' });
          });
      });
  }

  function saveToGoogleSheets() {
    if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      // Fallback mode: แสดง JSON ให้ Copy เหมือนเดิม
      Swal.fire({
        icon: 'info',
        title: 'ยังไม่ได้เชื่อม Google Sheets',
        html: `<p style="text-align:left;font-size:14px;color:#94a3b8">คุณยังไม่ได้ตั้งค่า <code style="color:#00f3ff">GOOGLE_SCRIPT_URL</code> ใน admin.js<br><br>ข้อมูล JSON ของคุณ:</p>
               <textarea readonly style="width:100%;height:150px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#e2e8f0;padding:12px;font-family:monospace;font-size:12px">${JSON.stringify(currentLinks, null, 2)}</textarea>`,
        background: 'rgba(10, 15, 25, 0.95)',
        color: '#fff',
        confirmButtonColor: 'rgba(0, 243, 255, 0.3)',
        customClass: { popup: 'border border-neon-cyan/30 backdrop-blur-xl' }
      });
      return;
    }

    Swal.fire({
      title: 'กำลังบันทึก...',
      text: 'อัปเดตข้อมูลไปยัง Google Sheets',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      background: 'rgba(10, 15, 25, 0.95)',
      color: '#fff',
    });

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        password: adminPassword,
        data: currentLinks,
      }),
    })
      .then(res => res.json())
      .then(result => {
        Swal.close();
        if (result.success) {
          Toast.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', text: result.message });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'บันทึกไม่สำเร็จ',
            text: result.message || 'เกิดข้อผิดพลาด',
            background: 'rgba(10, 15, 25, 0.95)',
            color: '#fff',
            confirmButtonColor: 'rgba(188, 19, 254, 0.3)',
            customClass: { popup: 'border border-rose-500/30 backdrop-blur-xl' }
          });
          // ถ้ารหัสผ่านผิด ให้กลับไปหน้า Login
          if (result.message && result.message.includes("รหัสผ่าน")) {
            sessionStorage.removeItem("admin_password");
            adminPassword = "";
            showLogin();
          }
        }
      })
      .catch(err => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'เชื่อมต่อไม่สำเร็จ',
          text: err.message,
          background: 'rgba(10, 15, 25, 0.95)',
          color: '#fff',
          confirmButtonColor: 'rgba(188, 19, 254, 0.3)',
          customClass: { popup: 'border border-rose-500/30 backdrop-blur-xl' }
        });
      });
  }

  // ==========================================
  // Event Listeners
  // ==========================================

  // Watch inputs for preview
  Object.values(addFields).forEach((field) => {
    field.addEventListener("input", updatePreview);
    field.addEventListener("change", updatePreview);
  });

  // Handle list interactions (Edit & Delete)
  linksList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-btn");
    if (deleteButton) {
      const index = parseInt(deleteButton.dataset.index, 10);
      if (Number.isNaN(index)) return;

      Swal.fire({
        title: 'ลบลิงก์นี้?',
        text: "การลบจะมีผลหลังจากกดบันทึกไปยัง Google Sheets",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgba(244, 63, 94, 0.2)',
        cancelButtonColor: 'rgba(255, 255, 255, 0.1)',
        confirmButtonText: '<span class="text-rose-400 font-bold">ลบเลย</span>',
        cancelButtonText: '<span class="text-slate-300">ยกเลิก</span>',
        background: 'rgba(10, 15, 25, 0.95)',
        color: '#fff',
        customClass: {
          popup: 'border border-rose-500/30 backdrop-blur-xl shadow-lg',
          confirmButton: 'border border-rose-500/40 hover:bg-rose-500/30',
          cancelButton: 'border border-white/20 hover:bg-white/20'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          currentLinks.splice(index, 1);
          renderLinks();
          Toast.fire({ icon: 'success', title: 'ลบแล้ว!', text: 'อย่าลืมกดบันทึกไปยัง Google Sheets' });
        }
      });
      return;
    }

    const editButton = event.target.closest(".edit-trigger");
    if (editButton) {
      const index = parseInt(editButton.dataset.index, 10);
      if (!Number.isNaN(index)) {
        openEditModal(index);
      }
    }
  });

  // Add new link
  addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newLink = readFormFields(addFields);
    currentLinks.push(newLink);
    renderLinks();
    addForm.reset();
    addFields.target.value = "_blank";
    updatePreview();
    Toast.fire({ icon: 'success', title: 'เพิ่มลิงก์แล้ว!', text: 'อย่าลืมกดบันทึกไปยัง Google Sheets' });
  });

  // Save to Google Sheets
  saveToSheetsBtn.addEventListener("click", () => {
    saveToGoogleSheets();
  });

  // Edit Modal
  cancelEditBtn.addEventListener("click", closeEditModal);
  closeEditTopBtn.addEventListener("click", closeEditModal);

  editModal.addEventListener("click", (event) => {
    if (event.target === editModal) {
      closeEditModal();
    }
  });

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const index = parseInt(editIndexInput.value, 10);
    if (Number.isNaN(index)) return;

    currentLinks[index] = readFormFields(editFields);
    closeEditModal();
    renderLinks();
    Toast.fire({ icon: 'success', title: 'แก้ไขแล้ว!', text: 'อย่าลืมกดบันทึกไปยัง Google Sheets' });
  });

  // Restore Default from links.json button
  const restoreDefaultBtn = document.getElementById("restore-default-btn");
  if (restoreDefaultBtn) {
    restoreDefaultBtn.addEventListener("click", () => {
      Swal.fire({
        title: 'โหลดลิงก์เริ่มต้นจากไฟล์?',
        text: 'ระบบจะนำรายการลิงก์มาตรฐานจาก links.json มาแทนที่ (กด "บันทึก" หลังโหลดเสร็จ เพื่ออัปเดตเข้า Google Sheets)',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'โหลดเดี๋ยวนี้',
        cancelButtonText: 'ยกเลิก',
        background: 'rgba(10, 15, 25, 0.95)',
        color: '#fff',
        confirmButtonColor: 'rgba(0, 243, 255, 0.3)',
      }).then((result) => {
        if (result.isConfirmed) {
          loadLinks(true);
        }
      });
    });
  }

  // Refresh Links button
  const refreshLinksBtn = document.getElementById("refresh-links-btn");
  if (refreshLinksBtn) {
    refreshLinksBtn.addEventListener("click", () => {
      loadLinks();
    });
  }
});
