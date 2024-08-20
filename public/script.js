let sessionId = generateSessionId();
let textSelections = 0;
let selectedTexts = [];

// Initialize button click counts
let buttonClicks = {
    home: 0,
    about: 0,
    contact: 0,
    enquiry: 0,
    qualityControl: 0,
    products: 0
};

const startTime = new Date();

// Generate a unique session ID for each visit
function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Track navbar button clicks
document.querySelector(".homeButton").addEventListener("click", () => {
    buttonClicks.home++;
});

document.querySelector(".aboutButton").addEventListener("click", () => {
    buttonClicks.about++;
});

document.querySelector(".contactNavButton").addEventListener("click", () => {
    buttonClicks.contact++;
});

document.querySelector(".enquiryButton").addEventListener("click", () => {
    buttonClicks.enquiry++;
});

document.querySelector(".qualityControlButton").addEventListener("click", () => {
    buttonClicks.qualityControl++;
});

document.querySelector(".productsButton").addEventListener("click", () => {
    buttonClicks.products++;
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

    // Save visit data to the server
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
            buttonClicks,
            textSelections,
            selectedTexts
        })
    })
    .then(response => response.json())
    .then(data => console.log('Visit data saved:', data))
    .catch(error => console.error("Error saving visit data:", error));
});
