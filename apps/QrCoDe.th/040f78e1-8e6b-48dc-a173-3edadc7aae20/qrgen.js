let qrCode; // สำหรับ QR Code จริง (ที่ดาวน์โหลด)
let previewQrCode; // สำหรับ "test" ที่แสดงผลสด

// (A) ส่วนจัดการ UI และ Live Preview
document.addEventListener("DOMContentLoaded", function() {
  
  // --- 1. โค้ดสลับช่องกรอก (WiFi/Text) ---
  const dataTypeSelect = document.getElementById("dataType");
  const textInputArea = document.getElementById("text-input-area");
  const wifiInputArea = document.getElementById("wifi-input-area");

  dataTypeSelect.addEventListener("change", function() {
    if (this.value === "wifi") {
      textInputArea.style.display = "none";
      wifiInputArea.style.display = "block";
    } else {
      textInputArea.style.display = "block";
      wifiInputArea.style.display = "none";
    }
  });

  // --- 2. (ใหม่!) โค้ดสลับช่องกรอก Gradient/Solid ---
  const dotColorType = document.getElementById("dotColorType");
  const dotGradientOptions = document.getElementById("dotGradientOptions");
  
  dotColorType.addEventListener("change", function() {
    dotGradientOptions.style.display = (this.value === "gradient") ? "block" : "none";
  });

  const bgType = document.getElementById("bgType");
  const bgColorOptions = document.getElementById("bgColorOptions");
  const bgGradientOptions = document.getElementById("bgGradientOptions");

  bgType.addEventListener("change", function() {
    if (this.value === "gradient") {
      bgColorOptions.style.display = "block";
      bgGradientOptions.style.display = "block";
    } else if (this.value === "solid") {
      bgColorOptions.style.display = "block";
      bgGradientOptions.style.display = "none";
    } else { // Transparent
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
  const styleInputs = [
    // สไตล์
    "dotStyle", "cornerSquareStyle", "cornerDotStyle",
    // สีจุด
    "dotColorType", "dotColor1", "dotColor2", "dotGradientType", "dotGradientRotation",
    // สีพื้นหลัง
    "bgType", "bgColor1", "bgColor2", "bgGradientType", "bgGradientRotation",
    // ตั้งค่า
    "errorCorrection", "typeNumber", "qrSize"
  ];

  styleInputs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return; // ถ้าหาไม่เจอก็ข้ามไป
    
    // 'input' ใช้สำหรับ color/number (เปลี่ยนทันทีที่ลาก)
    // 'change' ใช้สำหรับ select (เปลี่ยนหลังเลือก)
    const eventType = (el.tagName === 'INPUT' && (el.type === 'color' || el.type === 'number')) ? 'input' : 'change';
    el.addEventListener(eventType, updatePreview);
  });
});

/**
 * (B) (ใหม่!) ฟังก์ชันกลางสำหรับ "อ่านค่า" จากฟอร์ม
 * นี่คือหัวใจหลักที่ทำให้ "สิ่งที่เห็น" (Preview) = "สิ่งที่ได้" (Generate)
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
        { offset: 1, color: document.getElementById("dotColor2").value }
      ]
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
        { offset: 1, color: document.getElementById("bgColor2").value }
      ]
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
  return {
    width: parseInt(document.getElementById("qrSize").value),
    height: parseInt(document.getElementById("qrSize").value),
    margin: 15, // (Padding ที่คุณขอไว้)
    qrOptions: {
      errorCorrectionLevel: document.getElementById("errorCorrection").value,
      typeNumber: parseInt(document.getElementById("typeNumber").value),
    },
    dotsOptions: dotsOptions,
    backgroundOptions: backgroundOptions,
    cornersSquareOptions: cornersSquareOptions,
    cornersDotOptions: cornersDotOptions,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10,
      imageSize: 0.25,
    }
  };
}

/**
 * (C) ฟังก์ชันอัปเดต "test" QR Code (Live Preview)
 */
function updatePreview() {
  if (!previewQrCode) return; 
  
  let updatedOptions = buildStylingOptions();
  // (พรีวิวจะไม่มี data และ image เพราะใช้ของเดิม)
  previewQrCode.update(updatedOptions);
}

/**
 * (D) ฟังก์ชันสร้าง QR Code จริง
 * (จะ "ไม่สุ่ม" อีกต่อไป)
 */
function generateQR() {
  // (ส่วนตรวจสอบข้อมูล - เหมือนเดิม)
  const dataType = document.getElementById("dataType").value;
  let text = "";

  if (dataType === "wifi") {
    const ssid = document.getElementById("wifiSSID").value.trim();
    if (!ssid) {
      alert("กรุณาใส่ชื่อเครือข่าย (SSID)");
      return;
    }
  } else {
    let rawInput = document.getElementById("qrText").value.trim();
    if (dataType !== 'text' && !rawInput) {
      alert("กรุณาใส่ข้อความหรือลิงก์");
      return;
    }
  }

  // (ส่วนสร้าง text - เหมือนเดิม)
  switch (dataType) {
    case "url":
      let rawUrl = document.getElementById("qrText").value.trim();
      if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
        text = "http://" + rawUrl;
      } else {
        text = rawUrl;
      }
      break;
    case "email":
      text = `mailto:${document.getElementById("qrText").value.trim()}`;
      break;
    case "phone":
      text = `tel:${document.getElementById("qrText").value.trim().replace(/\s+/g, "")}`;
      break;
    case "line":
      text = `https://line.me/ti/p/${document.getElementById("qrText").value.trim()}`;
      break;
    case "wifi":
      const ssid = document.getElementById("wifiSSID").value;
      const pass = document.getElementById("wifiPass").value;
      const enc = document.getElementById("wifiEnc").value;
      text = `WIFI:S:${ssid};T:${enc};P:${pass};;`;
      break;
    default: // "text"
      text = document.getElementById("qrText").value;
      break;
  }

  const logoFile = document.getElementById("logoInput").files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const logoData = logoFile ? reader.result : null;

    // (สำคัญ) ลบ "test" QR Code (preview) ออกก่อน
    document.getElementById("qr-code").innerHTML = ""; 

    // 1. ดึงสไตล์ทั้งหมดที่ผู้ใช้ตั้งค่าไว้
    let finalOptions = buildStylingOptions();
    
    // 2. เพิ่มข้อมูลจริง (data) และโลโก้ (image) เข้าไป
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
 * (E) ฟังก์ชันดาวน์โหลด QR
 * (ไม่ต้องแก้ไข - ใช้งานได้เลย)
 */
function downloadQR() {
  if (!qrCode) {
    alert("กรุณาสร้าง QR Code (จริง) ก่อนดาวน์โหลด");
    return;
  }
  const filename = document.getElementById("filename").value.trim() || "my-qr";
  qrCode.download({ name: filename, extension: "png" });
}