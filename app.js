document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // ตั้งค่า URL ของ Google Apps Script ของคุณที่นี่
  // ==========================================
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwk43VBe6UHCczza5rTpACNFzffn2yZMpHu5Q21kce-m5g0rfGDwr60C5RPMXGV2_tU/exec";

  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const typingElement = document.getElementById("typing-text");
  const textToType = "Creative Studio x Digital Playground";
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentText = isDeleting
      ? textToType.substring(0, charIndex--)
      : textToType.substring(0, charIndex++);

    if (typingElement) {
      typingElement.textContent = currentText;
    }

    let typeSpeed = isDeleting ? 50 : 110;

    if (!isDeleting && charIndex === textToType.length + 1) {
      isDeleting = true;
      typeSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      typeSpeed = 450;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  if (typingElement) {
    setTimeout(typeEffect, 700);
  }

  const linksContainer = document.getElementById("links-container");
  const metaById = {
    qr: "Launch tool",
    discord: "Join community",
    portfolio: "View selected work",
    facebook: "Social update",
    instagram: "Visual feed",
    line: "Direct contact",
    tiktok: "Short-form content",
    youtube: "Latest videos",
  };

  // 2. โหลดข้อมูลจาก Google Sheets (ผ่าน Web App URL)
  // หากยังไม่ได้ใส่ URL ระบบจะไปดึงจาก links.json (เผื่อไว้ทดสอบ)
  const fetchUrl = GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
    ? 'links.json'
    : GOOGLE_SCRIPT_URL;

  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((links) => {
      if (!Array.isArray(links) || links.length === 0) {
        return fetch("links.json").then(r => r.json());
      }
      return links;
    })
    .then((links) => {
      links.forEach((link, idx) => {
        const a = document.createElement("a");
        a.href = link.url;
        // Tailwind Cyber Neon classes for the link wrapper
        a.className = "group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-neon-cyan overflow-hidden";

        if (link.target) {
          a.target = link.target;
        }

        // Animated background glow on hover
        const glowBg = document.createElement("div");
        glowBg.className = "absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none";
        a.appendChild(glowBg);

        const iconWrap = document.createElement("span");
        iconWrap.className = "relative z-10 flex shrink-0 h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-slate-300 group-hover:bg-neon-cyan/20 group-hover:text-neon-cyan group-hover:border-neon-cyan/30 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 shadow-glass";

        const icon = document.createElement("i");
        icon.className = link.icon + " text-xl sm:text-2xl";
        iconWrap.appendChild(icon);

        const copy = document.createElement("span");
        copy.className = "relative z-10 flex flex-col flex-1 min-w-0";

        const text = document.createElement("span");
        text.className = "text-base sm:text-lg font-semibold text-slate-100 group-hover:text-white transition-colors truncate";
        text.textContent = link.text;

        const meta = document.createElement("span");
        meta.className = "text-xs sm:text-sm text-slate-400 group-hover:text-neon-cyan/70 transition-colors truncate mt-0.5";
        meta.textContent = metaById[link.id] || "Open destination";

        copy.appendChild(text);
        copy.appendChild(meta);

        const arrowWrap = document.createElement("span");
        arrowWrap.className = "relative z-10 flex shrink-0 items-center justify-center text-slate-500 group-hover:text-neon-cyan transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1";
        arrowWrap.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';

        a.appendChild(iconWrap);
        a.appendChild(copy);
        a.appendChild(arrowWrap);
        linksContainer.appendChild(a);
      });

      // Optional: Show a subtle SweetAlert2 toast on load
      setTimeout(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'System Initialized',
          text: 'Welcome to NueaKubPom Portal',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: 'rgba(5, 11, 20, 0.9)',
          color: '#00f3ff',
          customClass: {
            popup: 'border border-neon-cyan/30 shadow-neon-cyan bg-black/90',
            timerProgressBar: 'bg-neon-cyan'
          }
        });
      }, 1000);

    })
    .catch((error) => {
      console.error("Unable to load links:", error);
      linksContainer.innerHTML = `
        <div class="rounded-[24px] border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          <i class="fa-solid fa-triangle-exclamation mr-2"></i> System Error: Unable to load data blocks.
        </div>
      `;
    });
});
