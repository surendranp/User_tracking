let clickCount = 0;
let contactClicks = 0;
let whatsappClicks = 0;
let viewMoreClicks = 0;
let textSelections = 0;
let selectedTexts = [];

const startTime = new Date();

// Track navbar button clicks
document.getElementById("homeButton").addEventListener("click", () => {
    clickCount++;
    trackNavbarClick("Home");
});

document.getElementById("aboutButton").addEventListener("click", () => {
    clickCount++;
    trackNavbarClick("About");
});

document.getElementById("contactButton").addEventListener("click", () => {
    contactClicks++;
    clickCount++;
    trackNavbarClick("Contact");
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
window.addEventListener("beforeunload", () => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

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
    .then(data => console.log('Success:', data))
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
