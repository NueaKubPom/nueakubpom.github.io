let qrCode; // สำหรับ QR Code จริง (ที่ดาวน์โหลด)
let previewQrCode; // สำหรับ "test" ที่แสดงผลสด

// ===== Preset Themes =====
const PRESETS = {
  classic: {
    dotStyle: "square",
    cornerSquareStyle: "square",
    cornerDotStyle: "square",
    dotColorType: "solid",
    dotColor1: "#000000",
    dotColor2: "#000000",
    dotGradientType: "linear",
    dotGradientRotation: 0,
    bgType: "solid",
    bgColor1: "#ffffff",
    bgColor2: "#ffffff",
    bgGradientType: "linear",
    bgGradientRotation: 0,
  },
  ocean: {
    dotStyle: "rounded",
    cornerSquareStyle: "extra-rounded",
    cornerDotStyle: "dot",
    dotColorType: "gradient",
    dotColor1: "#0077b6",
    dotColor2: "#00b4d8",
    dotGradientType: "linear",
    dotGradientRotation: 45,
    bgType: "solid",
    bgColor1: "#ffffff",
    bgColor2: "#ffffff",
    bgGradientType: "linear",
    bgGradientRotation: 0,
  },
  galaxy: {
    dotStyle: "dots",
    cornerSquareStyle: "dot",
    cornerDotStyle: "dot",
    dotColorType: "gradient",
    dotColor1: "#7b2ff7",
    dotColor2: "#c471ed",
    dotGradientType: "radial",
    dotGradientRotation: 0,
    bgType: "solid",
    bgColor1: "#ffffff",
    bgColor2: "#ffffff",
    bgGradientType: "linear",
    bgGradientRotation: 0,
  },
  sunset: {
    dotStyle: "classy",
    cornerSquareStyle: "extra-rounded",
    cornerDotStyle: "dot",
    dotColorType: "gradient",
    dotColor1: "#f7971e",
    dotColor2: "#ff6b6b",
    dotGradientType: "linear",
    dotGradientRotation: 135,
    bgType: "solid",
    bgColor1: "#ffffff",
    bgColor2: "#ffffff",
    bgGradientType: "linear",
    bgGradientRotation: 0,
  },
  nature: {
    dotStyle: "extra-rounded",
    cornerSquareStyle: "extra-rounded",
    cornerDotStyle: "dot",
    dotColorType: "gradient",
    dotColor1: "#11998e",
    dotColor2: "#38ef7d",
    dotGradientType: "linear",
    dotGradientRotation: 90,
    bgType: "solid",
    bgColor1: "#ffffff",
    bgColor2: "#ffffff",
    bgGradientType: "linear",
    bgGradientRotation: 0,
  },
  neon: {
    dotStyle: "dots",
    cornerSquareStyle: "dot",
    cornerDotStyle: "dot",
    dotColorType: "gradient",
    dotColor1: "#00ff87",
    dotColor2: "#60efff",
    dotGradientType: "linear",
    dotGradientRotation: 45,
    bgType: "solid",
    bgColor1: "#0a0a0a",
    bgColor2: "#0a0a0a",
    bgGradientType: "linear",
    bgGradientRotation: 0,
  },
  cherry: {
    dotStyle: "classy-rounded",
    cornerSquareStyle: "extra-rounded",
    cornerDotStyle: "dot",
    dotColorType: "gradient",
    dotColor1: "#ff6b9d",
    dotColor2: "#c44569",
    dotGradientType: "linear",
    dotGradientRotation: 180,
    bgType: "solid",
    bgColor1: "#fff5f7",
    bgColor2: "#fff5f7",
    bgGradientType: "linear",
    bgGradientRotation: 0,
  },
  gold: {
    dotStyle: "classy-rounded",
    cornerSquareStyle: "extra-rounded",
    cornerDotStyle: "dot",
    dotColorType: "gradient",
    dotColor1: "#d4af37",
    dotColor2: "#f5d061",
    dotGradientType: "linear",
    dotGradientRotation: 135,
    bgType: "solid",
    bgColor1: "#1a1a2e",
    bgColor2: "#1a1a2e",
    bgGradientType: "linear",
    bgGradientRotation: 0,
  },
};

// (A) ส่วนจัดการ UI และ Live Preview
document.addEventListener("DOMContentLoaded", function () {
  // --- 0. Branding: Dynamic Year ---
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // --- 0.1 Branding: Typewriter Effect ---
  const typingElement = document.getElementById("typing-text");
  const textToType = "Styled QR x Live Design";
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentText = isDeleting
      ? textToType.substring(0, charIndex--)
      : textToType.substring(0, charIndex++);
    if (typingElement) typingElement.textContent = currentText;
    let typeSpeed = isDeleting ? 50 : 150;
    if (!isDeleting && charIndex === textToType.length + 1) {
      isDeleting = true;
      typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
  }
  if (typingElement) setTimeout(typeEffect, 1000);

  // --- 1. โค้ดสลับช่องกรอก ตามประเภทข้อมูล ---
  const dataTypeSelect = document.getElementById("dataType");
  const allInputAreas = {
    text: document.getElementById("text-input-area"),
    wifi: document.getElementById("wifi-input-area"),
    sms: document.getElementById("sms-input-area"),
    vcard: document.getElementById("vcard-input-area"),
    geo: document.getElementById("geo-input-area"),
    event: document.getElementById("event-input-area"),
  };

  // ประเภทที่ใช้ text-input-area ร่วมกัน
  const textBasedTypes = [
    "text",
    "url",
    "email",
    "phone",
    "line",
    "facebook",
    "instagram",
    "youtube",
    "tiktok",
  ];

  // Placeholder ตามประเภท
  const placeholders = {
    text: "ข้อความหรือลิงก์...",
    url: "https://example.com",
    email: "example@mail.com",
    phone: "0812345678",
    line: "@lineid หรือ username",
    facebook: "https://facebook.com/yourpage หรือ username",
    instagram: "username (ไม่ต้องใส่ @)",
    youtube: "https://youtube.com/... หรือ @channel",
    tiktok: "username (ไม่ต้องใส่ @)",
  };

  dataTypeSelect.addEventListener("change", function () {
    const value = this.value;

    // ซ่อนทุก input area ก่อน
    Object.values(allInputAreas).forEach((area) => {
      if (area) area.style.display = "none";
    });

    if (textBasedTypes.includes(value)) {
      allInputAreas.text.style.display = "block";
      document.getElementById("qrText").placeholder =
        placeholders[value] || "ข้อความ...";
    } else if (allInputAreas[value]) {
      allInputAreas[value].style.display = "block";
    }
  });

  // --- 2. โค้ดสลับช่องกรอก Gradient/Solid ---
  const dotColorType = document.getElementById("dotColorType");
  const dotGradientOptions = document.getElementById("dotGradientOptions");

  dotColorType.addEventListener("change", function () {
    dotGradientOptions.style.display =
      this.value === "gradient" ? "block" : "none";
  });

  const bgType = document.getElementById("bgType");
  const bgColorOptions = document.getElementById("bgColorOptions");
  const bgGradientOptions = document.getElementById("bgGradientOptions");

  bgType.addEventListener("change", function () {
    if (this.value === "gradient") {
      bgColorOptions.style.display = "block";
      bgGradientOptions.style.display = "block";
    } else if (this.value === "solid") {
      bgColorOptions.style.display = "block";
      bgGradientOptions.style.display = "none";
    } else {
      // Transparent
      bgColorOptions.style.display = "none";
      bgGradientOptions.style.display = "none";
    }
  });

  // --- 3. สร้าง Live Preview "test" QR Code ทันทีที่โหลดหน้า ---
  let initialOptions = buildStylingOptions();
  initialOptions.data = "test"; // บังคับข้อมูลเป็น "test"
  initialOptions.image = ""; // ไม่มีโลโก้ในพรีวิว

  previewQrCode = new QRCodeStyling(initialOptions);
  previewQrCode.append(document.getElementById("qr-code"));

  // --- 4. เพิ่ม Event Listeners ให้ทุกปุ่มปรับแต่ง ---
  // --- 5. Checkbox toggle สำหรับ typeNumber (auto/manual) ---
  const customTypeNumberCheckbox = document.getElementById("customTypeNumber");
  const autoTypeInfo = document.getElementById("autoTypeInfo");
  const manualTypeNumber = document.getElementById("manualTypeNumber");

  customTypeNumberCheckbox.addEventListener("change", function () {
    if (this.checked) {
      autoTypeInfo.style.display = "none";
      manualTypeNumber.style.display = "block";
    } else {
      autoTypeInfo.style.display = "flex";
      manualTypeNumber.style.display = "none";
    }
    updatePreview();
  });

  const styleInputs = [
    // สไตล์
    "dotStyle", "cornerSquareStyle", "cornerDotStyle",
    // สีจุด
    "dotColorType", "dotColor1", "dotColor2", "dotGradientType", "dotGradientRotation",
    // สีพื้นหลัง
    "bgType", "bgColor1", "bgColor2", "bgGradientType", "bgGradientRotation",
    // ตั้งค่า
    "errorCorrection", "typeNumber", "qrSize", "qrMargin"
  ];

  styleInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const eventType =
      el.tagName === "INPUT" &&
      (el.type === "color" || el.type === "number" || el.type === "range")
        ? "input"
        : "change";
    el.addEventListener(eventType, updatePreview);
  });
});

/**
 * (B) ฟังก์ชันกลางสำหรับ "อ่านค่า" จากฟอร์ม
 */
function buildStylingOptions() {
  // 1. สร้าง dotsOptions (สีจุด / ไล่สีจุด)
  const dotColorType = document.getElementById("dotColorType").value;
  const dotColor1 = document.getElementById("dotColor1").value;
  let dotsOptions = {
    type: document.getElementById("dotStyle").value,
  };

  if (dotColorType === "gradient") {
    dotsOptions.gradient = {
      type: document.getElementById("dotGradientType").value,
      rotation: parseInt(document.getElementById("dotGradientRotation").value),
      colorStops: [
        { offset: 0, color: dotColor1 },
        { offset: 1, color: document.getElementById("dotColor2").value },
      ],
    };
  } else {
    dotsOptions.color = dotColor1;
  }

  // 2. สร้าง backgroundOptions (สีพื้นหลัง / ไล่สี / โปร่งใส)
  const bgType = document.getElementById("bgType").value;
  let backgroundOptions = {};

  if (bgType === "gradient") {
    backgroundOptions.gradient = {
      type: document.getElementById("bgGradientType").value,
      rotation: parseInt(document.getElementById("bgGradientRotation").value),
      colorStops: [
        { offset: 0, color: document.getElementById("bgColor1").value },
        { offset: 1, color: document.getElementById("bgColor2").value },
      ],
    };
  } else if (bgType === "transparent") {
    backgroundOptions.color = "transparent";
  } else {
    backgroundOptions.color = document.getElementById("bgColor1").value;
  }

  // 3. สร้าง cornersOptions (ให้ใช้สี/gradient เดียวกับ dots)
  let cornersSquareOptions = {
    type: document.getElementById("cornerSquareStyle").value,
  };
  let cornersDotOptions = {
    type: document.getElementById("cornerDotStyle").value,
  };

  if (dotColorType === "gradient") {
    cornersSquareOptions.gradient = dotsOptions.gradient;
    cornersDotOptions.gradient = dotsOptions.gradient;
  } else {
    cornersSquareOptions.color = dotsOptions.color;
    cornersDotOptions.color = dotsOptions.color;
  }

  // 4. รวบรวม Options ทั้งหมด
  const isCustomType = document.getElementById("customTypeNumber") && document.getElementById("customTypeNumber").checked;
  const typeNumberEl = document.getElementById("typeNumber");
  const typeNumberValue = (isCustomType && typeNumberEl) ? parseInt(typeNumberEl.value) : 0;

  return {
    width: parseInt(document.getElementById("qrSize").value),
    height: parseInt(document.getElementById("qrSize").value),
    margin: parseInt(document.getElementById("qrMargin").value),
    qrOptions: {
      errorCorrectionLevel: document.getElementById("errorCorrection").value,
      typeNumber: typeNumberValue, // 0 = AUTO, อื่นๆ = กำหนดเอง
    },
    dotsOptions: dotsOptions,
    backgroundOptions: backgroundOptions,
    cornersSquareOptions: cornersSquareOptions,
    cornersDotOptions: cornersDotOptions,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10,
      imageSize: 0.25,
    },
  };
}

/**
 * (C) ฟังก์ชันอัปเดต "test" QR Code (Live Preview)
 */
function updatePreview() {
  if (!previewQrCode) return;
  let updatedOptions = buildStylingOptions();
  previewQrCode.update(updatedOptions);
}

/**
 * (D) Apply preset theme
 */
function applyPreset(name, triggerButton) {
  const preset = PRESETS[name];
  if (!preset) return;

  // ตั้งค่า form ตามค่า preset
  document.getElementById("dotStyle").value = preset.dotStyle;
  document.getElementById("cornerSquareStyle").value = preset.cornerSquareStyle;
  document.getElementById("cornerDotStyle").value = preset.cornerDotStyle;
  document.getElementById("dotColorType").value = preset.dotColorType;
  document.getElementById("dotColor1").value = preset.dotColor1;
  document.getElementById("dotColor2").value = preset.dotColor2;
  document.getElementById("dotGradientType").value = preset.dotGradientType;
  document.getElementById("dotGradientRotation").value =
    preset.dotGradientRotation;
  document.getElementById("bgType").value = preset.bgType;
  document.getElementById("bgColor1").value = preset.bgColor1;
  document.getElementById("bgColor2").value = preset.bgColor2;
  document.getElementById("bgGradientType").value = preset.bgGradientType;
  document.getElementById("bgGradientRotation").value =
    preset.bgGradientRotation;

  // Toggle gradient options visibility
  document.getElementById("dotGradientOptions").style.display =
    preset.dotColorType === "gradient" ? "block" : "none";

  if (preset.bgType === "gradient") {
    document.getElementById("bgColorOptions").style.display = "block";
    document.getElementById("bgGradientOptions").style.display = "block";
  } else if (preset.bgType === "solid") {
    document.getElementById("bgColorOptions").style.display = "block";
    document.getElementById("bgGradientOptions").style.display = "none";
  } else {
    document.getElementById("bgColorOptions").style.display = "none";
    document.getElementById("bgGradientOptions").style.display = "none";
  }

  updatePreview();

  const btn = triggerButton || null;
  if (btn) {
    const previousBoxShadow = btn.style.boxShadow;
    const previousBorderColor = btn.style.borderColor;
    btn.style.borderColor = "rgba(103, 228, 217, 0.72)";
    btn.style.boxShadow = "0 0 0 1px rgba(103, 228, 217, 0.24), 0 18px 30px rgba(0, 0, 0, 0.18)";
    setTimeout(() => {
      btn.style.borderColor = previousBorderColor;
      btn.style.boxShadow = previousBoxShadow;
    }, 600);
  }
}

/**
 * (E) Randomize all styles
 */
function randomizeStyle() {
  const dotStyles = [
    "square",
    "dots",
    "rounded",
    "classy",
    "classy-rounded",
    "extra-rounded",
  ];
  const cornerSquareStyles = ["square", "extra-rounded", "dot"];
  const cornerDotStyles = ["square", "dot"];
  const gradientTypes = ["linear", "radial"];

  function randItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function randColor() {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Randomize dot style
  document.getElementById("dotStyle").value = randItem(dotStyles);
  document.getElementById("cornerSquareStyle").value =
    randItem(cornerSquareStyles);
  document.getElementById("cornerDotStyle").value = randItem(cornerDotStyles);

  // 70% chance of gradient
  const useGradient = Math.random() < 0.7;
  document.getElementById("dotColorType").value = useGradient
    ? "gradient"
    : "solid";
  document.getElementById("dotColor1").value = randColor();
  document.getElementById("dotColor2").value = randColor();
  document.getElementById("dotGradientType").value = randItem(gradientTypes);
  document.getElementById("dotGradientRotation").value = randInt(0, 360);

  // Toggle gradient options visibility
  document.getElementById("dotGradientOptions").style.display = useGradient
    ? "block"
    : "none";

  // Background — 80% solid white, 10% gradient, 10% dark
  const bgRoll = Math.random();
  if (bgRoll < 0.6) {
    document.getElementById("bgType").value = "solid";
    document.getElementById("bgColor1").value = "#ffffff";
    document.getElementById("bgColorOptions").style.display = "block";
    document.getElementById("bgGradientOptions").style.display = "none";
  } else if (bgRoll < 0.8) {
    document.getElementById("bgType").value = "solid";
    // สีพื้นสว่าง
    const lightBgs = [
      "#ffffff",
      "#f8f9fa",
      "#fff5f7",
      "#f0f4ff",
      "#f5fff0",
      "#fffff0",
      "#1a1a2e",
      "#0a0a0a",
      "#1c1c3a",
    ];
    document.getElementById("bgColor1").value = randItem(lightBgs);
    document.getElementById("bgColorOptions").style.display = "block";
    document.getElementById("bgGradientOptions").style.display = "none";
  } else {
    document.getElementById("bgType").value = "gradient";
    document.getElementById("bgColor1").value = randColor();
    document.getElementById("bgColor2").value = randColor();
    document.getElementById("bgGradientType").value = randItem(gradientTypes);
    document.getElementById("bgGradientRotation").value = randInt(0, 360);
    document.getElementById("bgColorOptions").style.display = "block";
    document.getElementById("bgGradientOptions").style.display = "block";
  }

  updatePreview();
}

/**
 * (F) สร้าง QR data text จากฟอร์ม
 */
function buildQRData() {
  const dataType = document.getElementById("dataType").value;

  switch (dataType) {
    case "url": {
      let rawUrl = document.getElementById("qrText").value.trim();
      if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
        rawUrl = "https://" + rawUrl;
      }
      return rawUrl;
    }
    case "email":
      return `mailto:${document.getElementById("qrText").value.trim()}`;
    case "phone":
      return `tel:${document.getElementById("qrText").value.trim().replace(/\s+/g, "")}`;
    case "sms": {
      const num = document
        .getElementById("smsNumber")
        .value.trim()
        .replace(/\s+/g, "");
      const body = document.getElementById("smsBody").value.trim();
      return body ? `smsto:${num}:${body}` : `smsto:${num}`;
    }
    case "line":
      return `https://line.me/ti/p/${document.getElementById("qrText").value.trim().replace(/^@/, "")}`;
    case "wifi": {
      const ssid = document.getElementById("wifiSSID").value;
      const pass = document.getElementById("wifiPass").value;
      const enc = document.getElementById("wifiEnc").value;
      return `WIFI:S:${ssid};T:${enc};P:${pass};;`;
    }
    case "vcard": {
      const name = document.getElementById("vcardName").value.trim();
      const phone = document.getElementById("vcardPhone").value.trim();
      const email = document.getElementById("vcardEmail").value.trim();
      const org = document.getElementById("vcardOrg").value.trim();
      const title = document.getElementById("vcardTitle").value.trim();
      const url = document.getElementById("vcardUrl").value.trim();
      const address = document.getElementById("vcardAddress").value.trim();
      let nameParts = name.split(" ");
      let lastName = nameParts.length > 1 ? nameParts.pop() : "";
      let firstName = nameParts.join(" ");
      let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName};;;\nFN:${name}`;
      if (phone) vcard += `\nTEL:${phone}`;
      if (email) vcard += `\nEMAIL:${email}`;
      if (org) vcard += `\nORG:${org}`;
      if (title) vcard += `\nTITLE:${title}`;
      if (url) vcard += `\nURL:${url}`;
      if (address) vcard += `\nADR:;;${address};;;;`;
      vcard += `\nEND:VCARD`;
      return vcard;
    }
    case "geo": {
      const lat = document.getElementById("geoLat").value;
      const lng = document.getElementById("geoLng").value;
      const label = document.getElementById("geoLabel").value.trim();
      let geo = `geo:${lat},${lng}`;
      if (label) geo += `?q=${lat},${lng}(${encodeURIComponent(label)})`;
      return geo;
    }
    case "event": {
      const title = document.getElementById("eventTitle").value.trim();
      const start = document.getElementById("eventStart").value;
      const end = document.getElementById("eventEnd").value;
      const location = document.getElementById("eventLocation").value.trim();
      const desc = document.getElementById("eventDescription").value.trim();
      // Format: YYYYMMDDTHHMMSS
      function formatDT(dtLocal) {
        if (!dtLocal) return "";
        return dtLocal.replace(/[-:]/g, "").replace("T", "T") + "00";
      }
      let cal = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title}`;
      if (start) cal += `\nDTSTART:${formatDT(start)}`;
      if (end) cal += `\nDTEND:${formatDT(end)}`;
      if (location) cal += `\nLOCATION:${location}`;
      if (desc) cal += `\nDESCRIPTION:${desc}`;
      cal += `\nEND:VEVENT\nEND:VCALENDAR`;
      return cal;
    }
    case "facebook": {
      let fb = document.getElementById("qrText").value.trim();
      if (!fb.startsWith("http")) fb = `https://facebook.com/${fb}`;
      return fb;
    }
    case "instagram": {
      let ig = document.getElementById("qrText").value.trim().replace(/^@/, "");
      if (!ig.startsWith("http")) ig = `https://instagram.com/${ig}`;
      return ig;
    }
    case "youtube": {
      let yt = document.getElementById("qrText").value.trim();
      if (!yt.startsWith("http")) yt = `https://youtube.com/${yt}`;
      return yt;
    }
    case "tiktok": {
      let tt = document.getElementById("qrText").value.trim().replace(/^@/, "");
      if (!tt.startsWith("http")) tt = `https://tiktok.com/@${tt}`;
      return tt;
    }
    default: // "text"
      return document.getElementById("qrText").value;
  }
}

/**
 * (G) Validation — ตรวจสอบข้อมูลก่อนสร้าง QR
 */
function validateInput() {
  const dataType = document.getElementById("dataType").value;

  switch (dataType) {
    case "wifi":
      if (!document.getElementById("wifiSSID").value.trim()) {
        alert("กรุณาใส่ชื่อเครือข่าย (SSID)");
        return false;
      }
      return true;
    case "sms":
      if (!document.getElementById("smsNumber").value.trim()) {
        alert("กรุณาใส่เบอร์โทรผู้รับ SMS");
        return false;
      }
      return true;
    case "vcard":
      if (!document.getElementById("vcardName").value.trim()) {
        alert("กรุณาใส่ชื่อ-นามสกุล");
        return false;
      }
      return true;
    case "geo":
      if (
        !document.getElementById("geoLat").value ||
        !document.getElementById("geoLng").value
      ) {
        alert("กรุณาใส่ละติจูดและลองจิจูด");
        return false;
      }
      return true;
    case "event":
      if (!document.getElementById("eventTitle").value.trim()) {
        alert("กรุณาใส่ชื่อกิจกรรม");
        return false;
      }
      if (!document.getElementById("eventStart").value) {
        alert("กรุณาเลือกวันเวลาเริ่มกิจกรรม");
        return false;
      }
      return true;
    default:
      // text, url, email, phone, line, facebook, instagram, youtube, tiktok
      if (!document.getElementById("qrText").value.trim()) {
        alert("กรุณาใส่ข้อความหรือลิงก์");
        return false;
      }
      return true;
  }
}

/**
 * (H) ฟังก์ชันสร้าง QR Code จริง
 */
function generateQR() {
  if (!validateInput()) return;

  const text = buildQRData();
  if (!text) {
    alert("ไม่สามารถสร้างข้อมูล QR ได้ กรุณาตรวจสอบข้อมูลอีกครั้ง");
    return;
  }

  const logoFile = document.getElementById("logoInput").files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const logoData = logoFile ? reader.result : null;

    // ลบ preview QR Code ออก
    document.getElementById("qr-code").innerHTML = "";

    // 1. ดึงสไตล์ทั้งหมดที่ผู้ใช้ตั้งค่าไว้
    let finalOptions = buildStylingOptions();

    // 2. เพิ่มข้อมูลจริง (data) และโลโก้ (image)
    finalOptions.data = unescape(encodeURIComponent(text));
    finalOptions.image = logoData;

    // 3. สร้าง QR Code จริง
    qrCode = new QRCodeStyling(finalOptions);
    qrCode.append(document.getElementById("qr-code"));
  };

  if (logoFile) {
    reader.readAsDataURL(logoFile);
  } else {
    reader.onload();
  }
}

/**
 * (I) ฟังก์ชันดาวน์โหลด QR
 */
function downloadQR() {
  if (!qrCode) {
    alert("กรุณาสร้าง QR Code ก่อนดาวน์โหลด");
    return;
  }
  const filename = document.getElementById("filename").value.trim() || "my-qr";
  qrCode.download({ name: filename, extension: "png" });
}
