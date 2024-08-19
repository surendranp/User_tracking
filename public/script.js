let sessionId = localStorage.getItem("sessionId") || generateSessionId();
localStorage.setItem("sessionId", sessionId);

let clickCount = 0;
let whatsappClicks = 0;
let homeClicks = 0;
let aboutClicks = 0;
let contactNavClicks = 0;
let paverClick = 0;
let holloClick = 0;
let flyashClick = 0;
let qualityClick = 0;
let CareerClick = 0;
let QuoteClick = 0;
let productClick = 0;
let textSelections = 0;
let selectedTexts = [];

const startTime = new Date();

// Generate a unique session ID for each visit
function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Track navbar button clicks
document.querySelector(".homeButton").addEventListener("click", () => {
    homeClicks++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".aboutButton").addEventListener("click", () => {
    aboutClicks++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".contactNavButton").addEventListener("click", () => {
    contactNavClicks++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".paverButton").addEventListener("click", () => {
    paverClick++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".hollowButton").addEventListener("click", () => {
    holloClick++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".flyashButton").addEventListener("click", () => {
    flyashClick++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".qualityButton").addEventListener("click", () => {
    qualityClick++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".CareerButton").addEventListener("click", () => {
    CareerClick++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".QuoteButton").addEventListener("click", () => {
    QuoteClick++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".productButton").addEventListener("click", () => {
    productClick++;
    clickCount++;
    saveVisitData();
});

document.querySelector(".whatsappButton").addEventListener("click", () => {
    whatsappClicks++;
    clickCount++;
    saveVisitData();
});

// Track text selections
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        textSelections++;
        selectedTexts.push(selectedText);

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

// Track page leave event
window.addEventListener("beforeunload", () => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

    saveVisitData(duration, endTime.toISOString());
});

function saveVisitData(duration = 0, endTime = null) {
    const data = {
        sessionId,
        startTime: startTime.toISOString(),
        endTime: endTime || new Date().toISOString(),
        duration,
        clickCount,
        whatsappClicks,
        homeClicks,
        aboutClicks,
        contactNavClicks,
        paverClick,
        holloClick,
        flyashClick,
        qualityClick,
        CareerClick,
        QuoteClick,
        productClick,
        textSelections,
        selectedTexts
    };

    // Save visit data to the server
    fetch("/api/save-visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log('Visit data saved:', data))
    .catch(error => console.error("Error saving visit data:", error));
}
