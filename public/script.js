// Initialize or retrieve the session ID
let sessionId = localStorage.getItem("sessionId") || generateSessionId();
if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId);
}

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

// Function to update and save interaction data
function saveVisitData() {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

    fetch("/api/save-visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
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
        })
    })
    .then(response => response.json())
    .then(data => console.log('Visit data saved:', data))
    .catch(error => console.error("Error saving visit data:", error));
}

// Update click tracking and navigate
function handleButtonClick(clickVar, url) {
    clickVar++;
    clickCount++;
    saveVisitData(); // Save data before navigation
    window.location.href = url;
}

// Attach event listeners to buttons
document.querySelector(".homeButton").addEventListener("click", () => handleButtonClick(homeClicks, "/home"));
document.querySelector(".aboutButton").addEventListener("click", () => handleButtonClick(aboutClicks, "/about"));
document.querySelector(".contactNavButton").addEventListener("click", () => handleButtonClick(contactNavClicks, "/contact"));
document.querySelector(".paverButton").addEventListener("click", () => handleButtonClick(paverClick, "/paver"));
document.querySelector(".hollowButton").addEventListener("click", () => handleButtonClick(holloClick, "/hollow"));
document.querySelector(".flyashButton").addEventListener("click", () => handleButtonClick(flyashClick, "/flyash"));
document.querySelector(".qualityButton").addEventListener("click", () => handleButtonClick(qualityClick, "/quality"));
document.querySelector(".CareerButton").addEventListener("click", () => handleButtonClick(CareerClick, "/career"));
document.querySelector(".QuoteButton").addEventListener("click", () => handleButtonClick(QuoteClick, "/quote"));
document.querySelector(".productButton").addEventListener("click", () => handleButtonClick(productClick, "/product"));
document.querySelector(".whatsappButton").addEventListener("click", () => handleButtonClick(whatsappClicks, "/whatsapp"));

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

// Save visit data when the page is unloaded
window.addEventListener("beforeunload", saveVisitData);
