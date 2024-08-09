let clickCount = 0;
let contactClicks = 0;
let whatsappClicks = 0;
let viewMoreClicks = 0;
let textSelections = 0;
let selectedTexts = [];

const startTime = new Date();

// Track button clicks
document.getElementById("contactButton").addEventListener("click", () => {
  contactClicks++;
  clickCount++;
});

document.getElementById("whatsappButton").addEventListener("click", () => {
  whatsappClicks++;
  clickCount++;
});

document.getElementById("viewMoreButton").addEventListener("click", () => {
  viewMoreClicks++;
  clickCount++;
});

// Track text selections
document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    textSelections++;
    selectedTexts.push(selectedText); // Store selected text

    // Send selected text to the server
    fetch("/api/save-text-selection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ selectedText })
    })
      .then(response => response.json())
      .then(data => console.log("Text selection saved:", data))
      .catch(error => console.error("Error saving text selection:", error));
  }
});

// Track page leave event.
window.addEventListener("beforeunload", (event) => {
  const endTime = new Date();
  const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

  // Ensure data is sent before the page unloads
  navigator.sendBeacon("/api/save-visit", JSON.stringify({
    startTime,
    endTime,
    duration,
    clickCount,
    contactClicks,
    whatsappClicks,
    viewMoreClicks,
    textSelections
  }));

  console.log("Data sent:", {
    startTime,
    endTime,
    duration,
    clickCount,
    contactClicks,
    whatsappClicks,
    viewMoreClicks,
    textSelections
  });
});