// Initialize or retrieve the session ID
let sessionId = localStorage.getItem("sessionId") || generateSessionId();
if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId);
}

let clickCount = parseInt(localStorage.getItem("clickCount")) || 0;
let whatsappClicks = parseInt(localStorage.getItem("whatsappClicks")) || 0;
let homeClicks = parseInt(localStorage.getItem("homeClicks")) || 0;
let aboutClicks = parseInt(localStorage.getItem("aboutClicks")) || 0;
let contactNavClicks = parseInt(localStorage.getItem("contactNavClicks")) || 0;
let paverClick = parseInt(localStorage.getItem("paverClick")) || 0;
let holloClick = parseInt(localStorage.getItem("holloClick")) || 0;
let flyashClick = parseInt(localStorage.getItem("flyashClick")) || 0;
let qualityClick = parseInt(localStorage.getItem("qualityClick")) || 0;
let CareerClick = parseInt(localStorage.getItem("CareerClick")) || 0;
let QuoteClick = parseInt(localStorage.getItem("QuoteClick")) || 0;
let productClick = parseInt(localStorage.getItem("productClick")) || 0;
let textSelections = parseInt(localStorage.getItem("textSelections")) || 0;
let selectedTexts = JSON.parse(localStorage.getItem("selectedTexts")) || [];

const startTime = new Date();

// Generate a unique session ID for each visit
function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Function to update localStorage
function updateLocalStorage() {
    localStorage.setItem("clickCount", clickCount);
    localStorage.setItem("whatsappClicks", whatsappClicks);
    localStorage.setItem("homeClicks", homeClicks);
    localStorage.setItem("aboutClicks", aboutClicks);
    localStorage.setItem("contactNavClicks", contactNavClicks);
    localStorage.setItem("paverClick", paverClick);
    localStorage.setItem("holloClick", holloClick);
    localStorage.setItem("flyashClick", flyashClick);
    localStorage.setItem("qualityClick", qualityClick);
    localStorage.setItem("CareerClick", CareerClick);
    localStorage.setItem("QuoteClick", QuoteClick);
    localStorage.setItem("productClick", productClick);
    localStorage.setItem("textSelections", textSelections);
    localStorage.setItem("selectedTexts", JSON.stringify(selectedTexts));
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

// Update click tracking
function handleButtonClick(clickVar, buttonName) {
    clickVar++;
    clickCount++;
    updateLocalStorage();
    saveVisitData();
}

// Attach event listeners to buttons
document.querySelector(".homeButton").addEventListener("click", () => handleButtonClick(homeClicks, "homeClicks"));
document.querySelector(".aboutButton").addEventListener("click", () => handleButtonClick(aboutClicks, "aboutClicks"));
document.querySelector(".contactNavButton").addEventListener("click", () => handleButtonClick(contactNavClicks, "contactNavClicks"));
document.querySelector(".paverButton").addEventListener("click", () => handleButtonClick(paverClick, "paverClick"));
document.querySelector(".hollowButton").addEventListener("click", () => handleButtonClick(holloClick, "holloClick"));
document.querySelector(".flyashButton").addEventListener("click", () => handleButtonClick(flyashClick, "flyashClick"));
document.querySelector(".qualityButton").addEventListener("click", () => handleButtonClick(qualityClick, "qualityClick"));
document.querySelector(".CareerButton").addEventListener("click", () => handleButtonClick(CareerClick, "CareerClick"));
document.querySelector(".QuoteButton").addEventListener("click", () => handleButtonClick(QuoteClick, "QuoteClick"));
document.querySelector(".productButton").addEventListener("click", () => handleButtonClick(productClick, "productClick"));
document.querySelector(".whatsappButton").addEventListener("click", () => handleButtonClick(whatsappClicks, "whatsappClicks"));

// Track text selections
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        textSelections++;
        selectedTexts.push(selectedText);
        updateLocalStorage();

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
