let clickCount = 0;
let contactClicks = 0;
let whatsappClicks = 0;

// let homeClicks = 0;
// let aboutClicks = 0;
// let paverblockClicks = 0;
// let hollowblockClicks = 0;
// let flyashblockClicks = 0;
// let qualitycontrolClicks = 0;
// let careerclicks = 0; 
// let gmailClicks = 0;
// let phoneClicks = 0;

// let viewMoreClicks = 0;

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

// document.getElementById("viewMoreButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });

// EnquiryButton 
// document.getElementById("enquiryButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });
// MailButton
// document.getElementById("mailButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });
// phoneButton
// document.getElementById("phoneButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });
// HomeButton
// document.getElementById("homeButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });
// AboutButton
// document.getElementById("aboutButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });
// PaverblockButton
// document.getElementById("PaverblockButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });
// HollowblockButton
// document.getElementById("hollowblockButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });
// FlyashblockButton
// document.getElementById("flyashblockButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });
// QualitycontrolButton
// document.getElementById("qualitycontrolButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });
// CareerButton
// document.getElementById("careerButton").addEventListener("click", () => {
//   viewMoreClicks++;
//   clickCount++;
// });







// Track text selections
document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    textSelections++;
    selectedTexts.push(selectedText); // Store selected text
    // Send selected text to the server
    fetch("https://usertracking-test.up.railway.app/api/save-text-selection", {
      // Ensure this path is correct for your hosting environment
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedText }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Text selection saved:", data))
      .catch((error) => console.error("Error saving text selection:", error));
  }
});

// Track page leave event
window.addEventListener("beforeunload", () => {
  const endTime = new Date();
  const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

  // Save visit data to the server
  fetch("https://usertracking-test.up.railway.app/api/save-visit", {
    // Ensure this path is correct for your hosting environment
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      clickCount,
      contactClicks,
      whatsappClicks,
      
// homeClicks,
// aboutClicks,
// paverblockClicks,
// hollowblockClicks,
// flyashblockClicks,
// qualitycontrolClicks,
// careerclicks,
// gmailClicks,
// phoneClicks,

      // viewMoreClicks,
      textSelections,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Visit data saved:", data))
    .catch((error) => console.error("Error saving visit data:", error));
});
