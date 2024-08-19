// Initialize or retrieve the session ID
let sessionId = localStorage.getItem("sessionId") || generateSessionId();
if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId);
}

// Initialize visit data
let visitData = {
    sessionId: sessionId,
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

// Function to generate a unique session ID
function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Function to update visit data
function updateVisitData(key) {
    if (visitData[key] !== undefined) {
        visitData[key]++;
        visitData.clickCount++;
    }
}

// Function to save visit data to the server
function saveVisitData() {
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
const buttons = {
    homeButton: 'homeClicks',
    aboutButton: 'aboutClicks',
    contactNavButton: 'contactNavClicks',
    paverButton: 'paverClick',
    hollowButton: 'holloClick',
    flyashButton: 'flyashClick',
    qualityButton: 'qualityClick',
    CareerButton: 'CareerClick',
    QuoteButton: 'QuoteClick',
    productButton: 'productClick',
    whatsappButton: 'whatsappClicks'
};

Object.keys(buttons).forEach(buttonClass => {
    const button = document.querySelector(`.${buttonClass}`);
    if (button) {
        button.addEventListener("click", () => {
            updateVisitData(buttons[buttonClass]);
            saveVisitData();
        });
    }
});

// Track text selections
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        visitData.textSelections++;
        visitData.selectedTexts.push(selectedText);

        // Save text selection data
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
window.addEventListener("beforeunload", () => {
    saveVisitData();
});
