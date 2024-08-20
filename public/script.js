// Initialize or retrieve the session ID
let sessionId = localStorage.getItem("sessionId") || generateSessionId();
if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId);
}

// Initialize or retrieve visit data
let visitData = JSON.parse(localStorage.getItem("visitData")) || {
    sessionId: sessionId,
    startTime: new Date(),
    endTime: null,
    duration: 0,
    clickCount: 0,
    whatsappClicks: 0,
    homeClicks: 0,
    aboutClicks: 0,
    contactNavClicks: 0,
    paverClick: 0,
    holloClick: 0,
    flyashClick: 0,
    qualityClick: 0,
    CareerClick: 0,
    QuoteClick: 0,
    productClick: 0,
    textSelections: 0,
    selectedTexts: []
};

// Function to update visit data
function updateVisitData(key) {
    visitData[key]++;
    visitData.clickCount++;
    localStorage.setItem("visitData", JSON.stringify(visitData));
}

// Function to save visit data to the server
function saveVisitData() {
    visitData.endTime = new Date();
    visitData.duration = Math.round((visitData.endTime - visitData.startTime) / 1000); // Duration in seconds

    fetch("/api/save-visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(visitData)
    })
    .then(response => response.json())
    .then(data => console.log('Visit data saved:', data))
    .catch(error => console.error("Error saving visit data:", error));
}

// Button click event listeners
document.querySelectorAll(".navButton").forEach(button => {
    button.addEventListener("click", () => {
        const buttonClass = button.classList[0];
        updateVisitData(buttonClass + 'Clicks');
    });
});

// Track text selections
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        visitData.textSelections++;
        visitData.selectedTexts.push(selectedText);
        localStorage.setItem("visitData", JSON.stringify(visitData));

        fetch("/api/save-text-selection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ sessionId, selectedText })
        })
        .then(response => response.json())
        .then(data => console.log("Text selection saved:", data))
        .catch(error => console.error("Error saving text selection:", error));
    }
});

// Save visit data when the page is unloaded
window.addEventListener("beforeunload", saveVisitData);

// Generate a unique session ID for each visit
function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
