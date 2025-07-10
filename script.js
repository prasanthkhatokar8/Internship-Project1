// Global variables
let shareCount = 0
let isSubmitted = false
let selectedFile = null

// DOM elements
const form = document.getElementById("registrationForm")
const whatsappBtn = document.getElementById("whatsappBtn")
const shareCounter = document.getElementById("shareCounter")
const shareComplete = document.getElementById("shareComplete")
const submitBtn = document.getElementById("submitBtn")
const fileUpload = document.getElementById("fileUpload")
const fileInput = document.getElementById("screenshot")
const filePreview = document.getElementById("filePreview")
const successMessage = document.getElementById("successMessage")

// Check if user has already submitted
window.addEventListener("load", () => {
  const hasSubmitted = localStorage.getItem("techForGirlsSubmitted")
  if (hasSubmitted === "true") {
    showSuccessMessage()
    return
  }

  // Load saved share count
  const savedShareCount = localStorage.getItem("whatsappShareCount")
  if (savedShareCount) {
    shareCount = Number.parseInt(savedShareCount)
    updateShareCounter()
    if (shareCount >= 5) {
      showShareComplete()
    }
  }

  checkSubmitButton()
})

// WhatsApp sharing functionality
whatsappBtn.addEventListener("click", () => {
  if (shareCount < 5) {
    shareCount++
    localStorage.setItem("whatsappShareCount", shareCount.toString())
    updateShareCounter()

    // Open WhatsApp with pre-written message
    const message = encodeURIComponent(
      "Hey Buddy, Join Tech For Girls Community! 🚀👩‍💻 Let's empower women in technology together!",
    )
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, "_blank")

    if (shareCount >= 5) {
      showShareComplete()
    }

    checkSubmitButton()
  }
})

// Update share counter display
function updateShareCounter() {
  shareCounter.textContent = `Click count: ${shareCount}/5`

  if (shareCount >= 5) {
    whatsappBtn.disabled = true
    whatsappBtn.innerHTML = '<i class="fas fa-check"></i> Sharing Complete'
  }
}

// Show share complete message
function showShareComplete() {
  shareComplete.classList.remove("hidden")
  whatsappBtn.disabled = true
  whatsappBtn.innerHTML = '<i class="fas fa-check"></i> Sharing Complete'
}

// File upload handling
fileUpload.addEventListener("click", () => {
  fileInput.click()
})

fileUpload.addEventListener("dragover", (e) => {
  e.preventDefault()
  fileUpload.style.borderColor = "#5a67d8"
  fileUpload.style.background = "#f0f4ff"
})

fileUpload.addEventListener("dragleave", (e) => {
  e.preventDefault()
  fileUpload.style.borderColor = "#667eea"
  fileUpload.style.background = "white"
})

fileUpload.addEventListener("drop", (e) => {
  e.preventDefault()
  fileUpload.style.borderColor = "#667eea"
  fileUpload.style.background = "white"

  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFileSelect(files[0])
  }
})

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    handleFileSelect(e.target.files[0])
  }
})

// Handle file selection
function handleFileSelect(file) {
  selectedFile = file

  // Show file preview
  filePreview.innerHTML = `
        <i class="fas fa-file-alt"></i>
        <span>Selected: ${file.name}</span>
        <small>(${(file.size / 1024 / 1024).toFixed(2)} MB)</small>
    `
  filePreview.classList.remove("hidden")

  checkSubmitButton()
}

// Check if submit button should be enabled
function checkSubmitButton() {
  const formValid = form.checkValidity()
  const shareComplete = shareCount >= 5
  const fileSelected = selectedFile !== null

  if (formValid && shareComplete && fileSelected) {
    submitBtn.disabled = false
  } else {
    submitBtn.disabled = true
  }
}

// Form validation on input
form.addEventListener("input", checkSubmitButton)

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  if (isSubmitted) return

  // Validate all requirements
  if (shareCount < 5) {
    alert("Please complete the WhatsApp sharing (5/5) before submitting.")
    return
  }

  if (!selectedFile) {
    alert("Please upload a screenshot before submitting.")
    return
  }

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'
  submitBtn.disabled = true

  try {
    // Collect form data
    const formData = new FormData()
    formData.append("name", document.getElementById("name").value)
    formData.append("phone", document.getElementById("phone").value)
    formData.append("email", document.getElementById("email").value)
    formData.append("college", document.getElementById("college").value)
    formData.append("screenshot", selectedFile)
    formData.append("timestamp", new Date().toISOString())

    // Here you would normally send to Google Sheets
    // For demo purposes, we'll simulate the submission
    await simulateSubmission(formData)

    // Mark as submitted
    isSubmitted = true
    localStorage.setItem("techForGirlsSubmitted", "true")

    // Show success message
    showSuccessMessage()
  } catch (error) {
    console.error("Submission error:", error)
    alert("There was an error submitting your registration. Please try again.")
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Registration'
    submitBtn.disabled = false
  }
})

// Simulate form submission (replace with actual Google Sheets integration)
async function simulateSubmission(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Form submitted with data:", Object.fromEntries(formData))
      resolve()
    }, 2000)
  })
}

// Show success message and disable form
function showSuccessMessage() {
  form.classList.add("hidden")
  successMessage.classList.remove("hidden")

  // Disable all form elements
  const formElements = form.querySelectorAll("input, select, button")
  formElements.forEach((element) => {
    element.disabled = true
  })
}

// Google Sheets Integration Setup (Instructions)
/*
To integrate with Google Sheets:

1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Replace the default code with:

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.phone,
    data.email,
    data.college,
    data.screenshot ? 'File uploaded' : 'No file'
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}

4. Deploy as web app with execute permissions for "Anyone"
5. Replace the simulateSubmission function with actual fetch to your web app URL
*/

// Actual Google Sheets submission function (uncomment and configure)
/*
async function submitToGoogleSheets(formData) {
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to submit to Google Sheets');
    }
    
    return response.json();
}
*/

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    })
  })
})

// Add form field animations
const formInputs = document.querySelectorAll("input, select")
formInputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.style.transform = "translateY(-2px)"
    this.parentElement.style.transition = "transform 0.3s ease"
  })

  input.addEventListener("blur", function () {
    this.parentElement.style.transform = "translateY(0)"
  })
})
