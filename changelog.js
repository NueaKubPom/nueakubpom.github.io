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
    },
    {
      type: "improve",
      title: "Performance Optimization",
      icon: "fa-solid fa-gauge-high",
      items: [
        "Changelog ทำงานทุกหน้า",
        "แก้ไขหน้าเว็บกระตุกเมื่อปิด Hardware Acceleration",
        "ปิดระบบ Backdrop Blur ทั้งโปรเจกต์เพื่อลดภาระ CPU",
        "ปรับปรุง Live Preview ให้วาดภาพรวดเร็วขึ้น",
      ]
    }
  ]
};

// =============================================
// CHANGELOG SYSTEM
// =============================================
function initChangelog() {
  const storageKey = "nkpnt_changelog_dismissed";
  const dismissedVersion = localStorage.getItem(storageKey);

  // ถ้า version ที่กดปิดไปแล้วตรงกับปัจจุบัน → ไม่แสดง
  if (dismissedVersion === SITE_CHANGELOG.version) return;

  // สร้างและแทรก HTML
  const overlayHtml = `
    <div id="changelog-overlay" class="fixed inset-0 z-[200] hidden items-center justify-center p-4 bg-black/80" style="opacity:0; transition: opacity 0.4s ease;">
      <div id="changelog-modal" class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[32px] border border-neon-purple/40 bg-gradient-to-b from-slate-900/95 to-black/95 p-6 sm:p-8 shadow-[0_0_40px_rgba(188,19,254,0.15),0_0_80px_rgba(0,243,255,0.08)] custom-scrollbar" style="transform: scale(0.92) translateY(20px); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease;">
        <div class="flex items-start justify-between gap-4 mb-6">
          <div class="flex items-center gap-4">
            <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30 shadow-neon-purple shrink-0">
              <i class="fa-solid fa-rocket text-2xl text-neon-purple"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan/70 mb-1">What's New</p>
              <h2 class="text-2xl sm:text-3xl font-bold text-white" style="text-shadow: 0 0 10px rgba(188,19,254,0.4), 0 0 20px rgba(188,19,254,0.2);">Changelog</h2>
            </div>
          </div>
          <button id="changelog-close-btn" type="button" class="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-neon-purple/40 transition-all duration-300 shrink-0 mt-1" aria-label="ปิด">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <div class="flex items-center gap-3 mb-6">
          <span class="inline-flex items-center gap-2 rounded-full bg-neon-purple/15 border border-neon-purple/30 px-4 py-1.5 text-sm font-bold text-neon-purple shadow-neon-purple">
            <i class="fa-solid fa-tag text-xs"></i>
            <span id="changelog-version-text">v${SITE_CHANGELOG.version}</span>
          </span>
          <span id="changelog-date" class="text-xs text-slate-500">${SITE_CHANGELOG.date}</span>
        </div>
        <div id="changelog-content" class="space-y-4"></div>
        <div class="mt-8">
          <button id="changelog-dismiss-btn" type="button" class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/30 hover:shadow-neon-purple transition-all duration-300">
            <i class="fa-solid fa-check"></i>
            <span>รับทราบแล้ว</span>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', overlayHtml);

  const overlay = document.getElementById("changelog-overlay");
  const contentEl = document.getElementById("changelog-content");

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

      return '<div class="rounded-[20px] border ' + colors.border + ' ' + colors.bg + ' p-4">' +
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

document.addEventListener("DOMContentLoaded", initChangelog);
