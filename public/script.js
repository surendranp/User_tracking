let clickCount = 0;
let contactClicks = 0;
let whatsappClicks = 0;
let viewMoreClicks = 0;
let textSelections = 0;

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
        sendTextSelection(selectedText);
    }
});

// Function to send text selection data to the server
function sendTextSelection(text) {
    fetch("/api/save-text-selection", { // Updated endpoint path
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ selectedText: text })
    })
    .then(response => response.json())
    .then(data => console.log("Text selection saved:", data))
    .catch(error => console.error("Error saving text selection:", error));
}

// Track page leave event
window.addEventListener("beforeunload", () => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

    fetch("/api/save-visit", { // Updated endpoint path
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
            textSelections // Include textSelections
        })
    })
    .then(response => response.json())
    .then(data => console.log("Visit data saved:", data))
    .catch(error => console.error("Error saving visit data:", error));
});
