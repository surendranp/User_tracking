let clickCount = 0;
let contactClicks = 0;
let whatsappClicks = 0;
let viewMoreClicks = 0;
let textSelections = 0;
let selectedTexts = [];

const startTime = new Date();

// Track navbar button clicks
document.getElementById("homeButton").addEventListener("click", () => {
    trackNavbarClick("Home");
});

document.getElementById("aboutButton").addEventListener("click", () => {
    trackNavbarClick("About");
});

document.getElementById("contactNavButton").addEventListener("click", () => {
    trackNavbarClick("Contact");
});

// Track other button clicks
document.getElementById("contactButton").addEventListener("click", () => {
    contactClicks++;
    clickCount++;
    trackButtonClick("Contact");
});

document.getElementById("whatsappButton").addEventListener("click", () => {
    whatsappClicks++;
    clickCount++;
    trackButtonClick("WhatsApp");
});

document.getElementById("viewMoreButton").addEventListener("click", () => {
    viewMoreClicks++;
    clickCount++;
    trackButtonClick("View More");
});

// Track text selections
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        textSelections++;
        selectedTexts.push(selectedText);
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
window.addEventListener("beforeunload", () => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    // Save visit data to the server
    fetch("/api/save-visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            startTime,
            endTime,
            duration,
            clickCount,
            contactClicks,
            whatsappClicks,
            viewMoreClicks,
            textSelections
        })
    })
    .then(response => response.json())
    .then(data => console.log('Visit data saved:', data))
    .catch(error => console.error("Error saving visit data:", error));
});

// Function to track navbar clicks
function trackNavbarClick(buttonName) {
    fetch("/api/save-visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            buttonName,
            timestamp: new Date()
        })
    })
    .then(response => response.json())
    .then(data => console.log(`${buttonName} button click saved:`, data))
    .catch(error => console.error(`Error saving ${buttonName} button click:`, error));
}

// Function to track other button clicks
function trackButtonClick(buttonName) {
    fetch("/api/save-visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            buttonName,
            timestamp: new Date()
        })
    })
    .then(response => response.json())
    .then(data => console.log(`${buttonName} button click saved:`, data))
    .catch(error => console.error(`Error saving ${buttonName} button click:`, error));
}
