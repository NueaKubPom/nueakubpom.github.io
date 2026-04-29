document.addEventListener("DOMContentLoaded", () => {
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

  fetch("links.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((links) => {
      for (const link of links) {
        const a = document.createElement("a");
        a.href = link.url;
        a.className = "button-link";

        if (link.target) {
          a.target = link.target;
        }

        const iconWrap = document.createElement("span");
        iconWrap.className = "link-icon-wrap";

        const icon = document.createElement("i");
        icon.className = link.icon;
        iconWrap.appendChild(icon);

        const copy = document.createElement("span");
        copy.className = "link-copy";

        const text = document.createElement("span");
        text.className = "link-label";
        text.textContent = link.text;

        const meta = document.createElement("span");
        meta.className = "link-meta";
        meta.textContent = metaById[link.id] || "Open destination";

        copy.appendChild(text);
        copy.appendChild(meta);

        const arrow = document.createElement("span");
        arrow.className = "link-arrow";
        arrow.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';

        a.appendChild(iconWrap);
        a.appendChild(copy);
        a.appendChild(arrow);
        linksContainer.appendChild(a);
      }
    })
    .catch((error) => {
      console.error("Unable to load links:", error);
      linksContainer.innerHTML = `
        <div class="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-5 text-rose-100">
          เกิดข้อผิดพลาดในการโหลดข้อมูลลิงก์
        </div>
      `;
    });
});
