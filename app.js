// =============================================
// CHANGELOG CONFIG — แก้ไขตรงนี้เมื่อมีอัพเดทใหม่
// =============================================
const SITE_CHANGELOG = {
  version: "1.1.0",
  date: "24 มิ.ย. 2569",
  sections: [
    {
      type: "fix",       // fix | feature | improve
      title: "แก้ไขบั๊ก",
      icon: "fa-solid fa-bug",
      items: [
        "แก้ไข QR Preview หายเมื่อเลื่อนหน้าจอ — ไม่ต้องปรับขนาดหน้าจอแล้ว",
        "แก้ไข QR Code canvas/SVG แสดงผลผิดพลาด",
        "แก้ไข Instagram URL ลิงก์ไปที่ผิด",
        "แก้ไข Gradient options layout เสียเมื่อสลับธีม",
      ]
    },
    {
      type: "improve",
      title: "ปรับปรุง UI/UX",
      icon: "fa-solid fa-wand-magic-sparkles",
      items: [
        "เพิ่ม dropdown arrow icon ให้ทุก select menu",
        "ปรับปรุง datetime-local input ให้เห็นชัดใน dark mode",
        "ปรับ responsive layout สำหรับ QR Preview บนมือถือ",
        "ปรับ CSS ให้ทำงานถูกต้องกับ Tailwind CDN",
      ]
    },
    {
      type: "feature",
      title: "ฟีเจอร์ใหม่",
      icon: "fa-solid fa-sparkles",
      items: [
        "เพิ่มระบบ Changelog แจ้งอัพเดทเมื่อมีเวอร์ชันใหม่",
        "เพิ่ม Meta Description สำหรับ SEO",
        "เพิ่ม color-scheme dark สำหรับ native elements",
      ]
    }
  ]
};

// =============================================
// CHANGELOG SYSTEM
// =============================================
function initChangelog() {
  const overlay = document.getElementById("changelog-overlay");
  if (!overlay) return;

  const storageKey = "nkpnt_changelog_dismissed";
  const dismissedVersion = localStorage.getItem(storageKey);

  // ถ้า version ที่กดปิดไปแล้วตรงกับปัจจุบัน → ไม่แสดง
  if (dismissedVersion === SITE_CHANGELOG.version) return;

  // Render content
  const versionText = document.getElementById("changelog-version-text");
  const dateText = document.getElementById("changelog-date");
  const contentEl = document.getElementById("changelog-content");

  if (versionText) versionText.textContent = "v" + SITE_CHANGELOG.version;
  if (dateText) dateText.textContent = SITE_CHANGELOG.date;

  if (contentEl) {
    const sectionColors = {
      fix: { border: "border-rose-500/20", bg: "bg-rose-500/5", icon: "text-rose-400", badge: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
      feature: { border: "border-emerald-500/20", bg: "bg-emerald-500/5", icon: "text-emerald-400", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
      improve: { border: "border-amber-500/20", bg: "bg-amber-500/5", icon: "text-amber-400", badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    };

    contentEl.innerHTML = SITE_CHANGELOG.sections.map(function(section) {
      const colors = sectionColors[section.type] || sectionColors.improve;
      const itemsHtml = section.items.map(function(item) {
        return '<li class="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">' +
          '<i class="fa-solid fa-chevron-right text-[10px] mt-1.5 shrink-0 ' + colors.icon + '"></i>' +
          '<span>' + item + '</span>' +
          '</li>';
      }).join("");

      return '<div class="rounded-[20px] border ' + colors.border + ' ' + colors.bg + ' p-4 backdrop-blur-md">' +
        '<div class="flex items-center gap-2.5 mb-3">' +
          '<span class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ' + colors.badge + '">' +
            '<i class="' + section.icon + '"></i>' +
            section.title +
          '</span>' +
        '</div>' +
        '<ul class="space-y-2">' + itemsHtml + '</ul>' +
      '</div>';
    }).join("");
  }

  // แสดง modal ด้วย animation
  setTimeout(function() {
    overlay.style.display = "flex";
    requestAnimationFrame(function() {
      overlay.style.opacity = "1";
      const modal = document.getElementById("changelog-modal");
      if (modal) {
        modal.style.transform = "scale(1) translateY(0)";
      }
    });
  }, 1500); // delay เล็กน้อยให้หน้าเว็บโหลดก่อน

  // ปุ่มปิด
  function dismissChangelog() {
    localStorage.setItem(storageKey, SITE_CHANGELOG.version);
    overlay.style.opacity = "0";
    const modal = document.getElementById("changelog-modal");
    if (modal) {
      modal.style.transform = "scale(0.92) translateY(20px)";
    }
    setTimeout(function() {
      overlay.style.display = "none";
    }, 400);
  }

  var closeBtn = document.getElementById("changelog-close-btn");
  var dismissBtn = document.getElementById("changelog-dismiss-btn");
  if (closeBtn) closeBtn.addEventListener("click", dismissChangelog);
  if (dismissBtn) dismissBtn.addEventListener("click", dismissChangelog);

  // กดพื้นหลังปิดด้วย
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) dismissChangelog();
  });

  // กด Escape ปิด
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && overlay.style.display === "flex") {
      dismissChangelog();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init({
    once: true,
    offset: 50,
  });

  // Initialize Changelog modal
  initChangelog();

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
      links.forEach((link, idx) => {
        const a = document.createElement("a");
        a.href = link.url;
        // Tailwind Cyber Neon classes for the link wrapper
        a.className = "group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-neon-cyan overflow-hidden backdrop-blur-md";
        a.setAttribute("data-aos", "fade-up");
        a.setAttribute("data-aos-delay", (300 + (idx * 50)).toString());

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
            popup: 'border border-neon-cyan/30 backdrop-blur-md shadow-neon-cyan',
            timerProgressBar: 'bg-neon-cyan'
          }
        });
      }, 1000);

    })
    .catch((error) => {
      console.error("Unable to load links:", error);
      linksContainer.innerHTML = `
        <div class="rounded-[24px] border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.2)]" data-aos="fade-in">
          <i class="fa-solid fa-triangle-exclamation mr-2"></i> System Error: Unable to load data blocks.
        </div>
      `;
    });
});
