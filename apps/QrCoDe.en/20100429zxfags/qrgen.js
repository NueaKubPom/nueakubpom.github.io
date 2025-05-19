let qrCode;

function generateQR() {
  let rawInput = document.getElementById("qrText").value.trim();
  if (!rawInput) {
    alert("กรุณาใส่ข้อความหรือลิงก์");
    return;
  }

  const dataType = document.getElementById("dataType").value;
  let text = "";

  switch (dataType) {
    case "url":
      if (!rawInput.startsWith("http://") && !rawInput.startsWith("https://")) {
        text = "http://" + rawInput;
      } else {
        text = rawInput;
      }
      break;

    case "email":
      text = `mailto:${rawInput}`;
      break;

    case "phone":
      text = `tel:${rawInput.replace(/\s+/g, "")}`;
      break;

    case "line":
      text = `https://line.me/ti/p/${rawInput}`;
      break;

    default:
      text = rawInput;
      break;
  }

  const randomParam = Math.floor(Math.random() * 1000000);
  if (dataType === "url") {
    if (text.includes("?")) {
      text += `&random=${randomParam}`;
    } else {
      text += `?random=${randomParam}`;
    }
  } else if (dataType === "text") {
    text += ` #${randomParam}`;
  }

  const filename = document.getElementById("filename").value.trim() || "my-qr";
  const dotStyle = document.getElementById("dotStyle").value;
  const dotColor = document.getElementById("dotColor").value;
  const bgColor = document.getElementById("bgColor").value;
  const logoFile = document.getElementById("logoInput").files[0];
  const errorCorrection = document.getElementById("errorCorrection").value;
  const typeNumber = parseInt(document.getElementById("typeNumber").value);
  const qrSize = parseInt(document.getElementById("qrSize").value);

  const reader = new FileReader();

  reader.onload = () => {
    const logoData = logoFile ? reader.result : null;

    document.getElementById("qr-code").innerHTML = "";

    qrCode = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: unescape(encodeURIComponent(text)),
      image: logoData,
      qrOptions: {
        errorCorrectionLevel: errorCorrection,
        typeNumber: typeNumber,
      },
      dotsOptions: {
        color: dotColor,
        type: dotStyle,
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10,
        imageSize: 0.25,
      },
    });

    qrCode.append(document.getElementById("qr-code"));
  };

  if (logoFile) {
    reader.readAsDataURL(logoFile);
  } else {
    reader.onload();
  }
}

function downloadQR() {
  if (!qrCode) {
    alert("กรุณาสร้าง QR Code ก่อนดาวน์โหลด");
    return;
  }
  const filename = document.getElementById("filename").value.trim() || "my-qr";
  qrCode.download({ name: filename, extension: "png" });
}
