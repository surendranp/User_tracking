let sessionId = generateSessionId();
let clickData = {
    homeClicks: 0,
    aboutClicks: 0,
    contactClicks: 0,
    enquiryClicks: 0,
    qualityClicks: 0,
    productsClicks: 0
};
let textSelections = 0;
let selectedTexts = [];
const startTime = new Date();

// Generate a unique session ID for each visit
function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Track navbar button clicks
document.querySelector(".homeButton").addEventListener("click", () => {
    clickData.homeClicks++;
    saveVisitData();
});

document.querySelector(".aboutButton").addEventListener("click", () => {
    clickData.aboutClicks++;
    saveVisitData();
});

document.querySelector(".contactButton").addEventListener("click", () => {
    clickData.contactClicks++;
    saveVisitData();
});

document.querySelector(".enquiryButton").addEventListener("click", () => {
    clickData.enquiryClicks++;
    saveVisitData();
});

document.querySelector(".qualityButton").addEventListener("click", () => {
    clickData.qualityClicks++;
    saveVisitData();
});

document.querySelector(".productsButton").addEventListener("click", () => {
    clickData.productsClicks++;
    saveVisitData();
});

// Track text selections
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        textSelections++;
        selectedTexts.push(selectedText);
    }
});

// Track page leave event
window.addEventListener("beforeunload", () => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

    saveVisitData(duration, endTime);
});

function saveVisitData(duration = null, endTime = null) {
    fetch("/api/save-visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionId,
            startTime: startTime.toISOString(),
            endTime: endTime ? endTime.toISOString() : null,
            duration: duration,
            ...clickData,
            textSelections,
            selectedTexts
        })
    })
    .then(response => response.json())
    .then(data => console.log('Visit data saved:', data))
    .catch(error => console.error("Error saving visit data:", error));
}
