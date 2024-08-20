// Initialize or retrieve the session ID
let sessionId = localStorage.getItem("sessionId") || generateSessionId();
if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId);
}

// Function to generate a unique session ID
function generateSessionId() {
    return 'sess-' + Math.random().toString(36).substr(2, 9);
}

// Fetch the existing visit data for the session from the server
fetchVisitData(sessionId);

// Function to fetch existing visit data from the server
function fetchVisitData(sessionId) {
    fetch(`/api/get-visit/${sessionId}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                visitData = data;
            } else {
                // Initialize visit data if no existing data is found
                visitData = {
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
                    selectedTexts: [] // Initialize selectedTexts array
                };
            }
            localStorage.setItem("visitData", JSON.stringify(visitData));
        })
        .catch(error => console.error("Error fetching visit data:", error));
}

// Function to update visit data
function updateVisitData(key) {
    visitData[key]++;
    visitData.clickCount++;
    localStorage.setItem("visitData", JSON.stringify(visitData));
    saveVisitData();
}

// Function to handle text selection
function handleTextSelection() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText && !visitData.selectedTexts.includes(selectedText)) {
        visitData.selectedTexts.push(selectedText);
        localStorage.setItem("visitData", JSON.stringify(visitData));
        saveVisitData();
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
document.querySelector(".homeButton").addEventListener("click", () => updateVisitData('homeClicks'));
document.querySelector(".aboutButton").addEventListener("click", () => updateVisitData('aboutClicks'));
document.querySelector(".contactNavButton").addEventListener("click", () => updateVisitData('contactNavClicks'));
document.querySelector(".paverButton").addEventListener("click", () => updateVisitData('paverClick'));
document.querySelector(".hollowButton").addEventListener("click", () => updateVisitData('holloClick'));
document.querySelector(".flyashButton").addEventListener("click", () => updateVisitData('flyashClick'));
document.querySelector(".qualityButton").addEventListener("click", () => updateVisitData('qualityClick'));
document.querySelector(".CareerButton").addEventListener("click", () => updateVisitData('CareerClick'));
document.querySelector(".QuoteButton").addEventListener("click", () => updateVisitData('QuoteClick'));
document.querySelector(".productButton").addEventListener("click", () => updateVisitData('productClick'));
document.querySelector(".whatsappButton").addEventListener("click", () => updateVisitData('whatsappClicks'));

// Add event listener for text selection
document.addEventListener('mouseup', handleTextSelection);

// Save visit data when the page is unloaded
window.addEventListener("beforeunload", saveVisitData);
