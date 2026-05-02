const API_BASE = "http://localhost:3001/api";

function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

async function getCertificate() {
  const emailInput = document.getElementById("emailInput");
  const errorMsg = document.getElementById("errorMsg");
  const getBtn = document.getElementById("getBtn");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");

  const email = emailInput.value.trim();

  // Basic validation
  errorMsg.classList.add("hidden");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorMsg.textContent = "Please enter a valid email address.";
    errorMsg.classList.remove("hidden");
    return;
  }

  // Loading state
  getBtn.disabled = true;
  btnText.textContent = "Checking...";
  btnLoader.classList.remove("hidden");

  try {
    // First verify the student exists
    const verifyRes = await fetch(`${API_BASE}/verify?email=${encodeURIComponent(email)}`);
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      // Show not found page
      showPage("page-notfound");
      return;
    }

    // Student found — trigger PDF download
    showToast(`Certificate found for ${verifyData.student.name}! Downloading...`);

    const downloadUrl = `${API_BASE}/certificate?email=${encodeURIComponent(email)}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `certificate_${verifyData.student.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (err) {
    errorMsg.textContent = "Server error. Please make sure the backend is running.";
    errorMsg.classList.remove("hidden");
  } finally {
    getBtn.disabled = false;
    btnText.textContent = "Get Certificate";
    btnLoader.classList.add("hidden");
  }
}

function tryAgain() {
  showPage("page-main");
  document.getElementById("emailInput").value = "";
  document.getElementById("errorMsg").classList.add("hidden");
}

// Allow Enter key to submit
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("emailInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") getCertificate();
  });
});
