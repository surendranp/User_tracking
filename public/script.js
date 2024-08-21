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
                    menu: 0,
                    home_Button_Clicks: 0,
                    about_Button_Clicks: 0,
                    contact_ButtonNav_Clicks: 0,
                    whatsapp_Button_Clicks: 0,
                    product_Button_Click: 0,
                    paverblock_Button_Click: 0,
                    holloblock_Button_Click: 0,
                    flyash_Button_Click: 0,
                    quality_Button_Click: 0,
                    Career_Button_Click: 0,
                    Quote_Button_Click: 0,
                   
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
    visitData.menu++;
    localStorage.setItem("visitData", JSON.stringify(visitData));
    saveVisitData();
}

// Function to handle text selection
function handleTextSelection() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        // Remove duplicate text if it exists
        const textIndex = visitData.selectedTexts.indexOf(selectedText);
        if (textIndex !== -1) {
            visitData.selectedTexts.splice(textIndex, 1); // Remove duplicate
        } else {
            visitData.selectedTexts.push(selectedText); // Add new text
        }
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
document.querySelector(".homeButton").addEventListener("click", () => updateVisitData('home_Button_Clicks'));
document.querySelector(".aboutButton").addEventListener("click", () => updateVisitData('about_Button_Clicks'));
document.querySelector(".contactNavButton").addEventListener("click", () => updateVisitData('contact_ButtonNav_Clicks'));
document.querySelector(".whatsappButton").addEventListener("click", () => updateVisitData('whatsapp_Button_Clicks'));
document.querySelector(".productButton").addEventListener("click", () => updateVisitData('product_Button_Click'));
document.querySelector(".paverButton").addEventListener("click", () => updateVisitData('paverblock_Button_Click'));
document.querySelector(".hollowButton").addEventListener("click", () => updateVisitData('holloblock_Button_Click'));
document.querySelector(".flyashButton").addEventListener("click", () => updateVisitData('flyash_Button_Click'));
document.querySelector(".qualityButton").addEventListener("click", () => updateVisitData('quality_Button_Click'));
document.querySelector(".CareerButton").addEventListener("click", () => updateVisitData('Career_Button_Click'));
document.querySelector(".QuoteButton").addEventListener("click", () => updateVisitData('Quote_Button_Click'));


// Add event listener for text selection
document.addEventListener('mouseup', handleTextSelection);

// Save visit data when the page is unloaded
window.addEventListener("beforeunload", saveVisitData);
