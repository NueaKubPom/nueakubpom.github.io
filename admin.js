document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const linksList = document.getElementById("links-list");
  const addForm = document.getElementById("add-form");
  const generateButton = document.getElementById("generate-button");
  const saveArea = document.getElementById("save-area");
  const jsonOutput = document.getElementById("json-output");
  const editModal = document.getElementById("edit-modal");
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

  function renderLinks() {
    linksList.innerHTML = "";

    if (!currentLinks.length) {
      linksList.innerHTML = `
        <div class="rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] p-5 text-white/55">
          ยังไม่มีลิงก์ในรายการ
        </div>
      `;
      return;
    }

    currentLinks.forEach((link, index) => {
      const item = document.createElement("div");
      item.className = "admin-list-card";
      item.innerHTML = `
        <button type="button" class="edit-trigger admin-list-main" data-index="${index}" title="แก้ไขลิงก์นี้">
          <span class="link-icon-wrap"><i class="${escapeHtml(link.icon || "fa-solid fa-link")}"></i></span>
          <span class="link-copy">
            <span class="link-label">${escapeHtml(link.text || "Untitled link")}</span>
            <span class="link-meta">${escapeHtml(link.id || "no-id")} • ${escapeHtml(link.target || "_self")}</span>
          </span>
        </button>
        <button type="button" class="delete-btn admin-danger-button" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
          <span>ลบ</span>
        </button>
      `;
      linksList.appendChild(item);
    });
  }

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

  function openEditModal(index) {
    const linkToEdit = currentLinks[index];
    editIndexInput.value = index;
    editFields.id.value = linkToEdit.id || "";
    editFields.icon.value = linkToEdit.icon || "";
    editFields.text.value = linkToEdit.text || "";
    editFields.url.value = linkToEdit.url || "";
    editFields.target.value = linkToEdit.target || "_self";
    editModal.style.display = "flex";
  }

  function closeEditModal() {
    editModal.style.display = "none";
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

  fetch("links.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("ไม่สามารถโหลด links.json ได้");
      }
      return response.json();
    })
    .then((data) => {
      currentLinks = data;
      renderLinks();
      updatePreview();
    })
    .catch((error) => {
      console.error(error);
      linksList.innerHTML = `<div class="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-5 text-rose-100">${error.message}</div>`;
    });

  Object.values(addFields).forEach((field) => {
    field.addEventListener("input", updatePreview);
    field.addEventListener("change", updatePreview);
  });

  linksList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-btn");
    if (deleteButton) {
      const index = parseInt(deleteButton.dataset.index, 10);
      if (Number.isNaN(index)) {
        return;
      }
      if (!confirm("ต้องการลบลิงก์นี้ใช่หรือไม่?")) {
        return;
      }
      currentLinks.splice(index, 1);
      renderLinks();
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

  addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newLink = readFormFields(addFields);
    currentLinks.push(newLink);
    renderLinks();
    addForm.reset();
    addFields.target.value = "_self";
    updatePreview();
  });

  generateButton.addEventListener("click", () => {
    jsonOutput.value = JSON.stringify(currentLinks, null, 2);
    saveArea.classList.remove("hidden");
  });

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
    if (Number.isNaN(index)) {
      return;
    }

    currentLinks[index] = readFormFields(editFields);
    closeEditModal();
    renderLinks();
  });
});
