let sessionId = generateSessionId();
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

// Helper function to send data and navigate to a new page
function handleClick(event, clickType) {
    clickType++;
    clickCount++;

    // Prevent the default link behavior
    event.preventDefault();

    // Prepare the data to be sent
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    const data = {
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
    };

    // Send the data to the server
    fetch("/api/save-visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        // After saving data, navigate to the corresponding page
        window.location.href = event.target.href;
    })
    .catch(error => {
        console.error("Error saving visit data:", error);
        // Navigate to the corresponding page even if there's an error
        window.location.href = event.target.href;
    });
}

// Track navbar button clicks
document.querySelector(".homeButton").addEventListener("click", (event) => handleClick(event, homeClicks));
document.querySelector(".aboutButton").addEventListener("click", (event) => handleClick(event, aboutClicks));
document.querySelector(".contactNavButton").addEventListener("click", (event) => handleClick(event, contactNavClicks));
document.querySelector(".paverButton").addEventListener("click", (event) => handleClick(event, paverClick));
document.querySelector(".hollowButton").addEventListener("click", (event) => handleClick(event, holloClick));
document.querySelector(".flyashButton").addEventListener("click", (event) => handleClick(event, flyashClick));
document.querySelector(".qualityButton").addEventListener("click", (event) => handleClick(event, qualityClick));
document.querySelector(".CareerButton").addEventListener("click", (event) => handleClick(event, CareerClick));
document.querySelector(".QuoteButton").addEventListener("click", (event) => handleClick(event, QuoteClick));
document.querySelector(".productButton").addEventListener("click", (event) => handleClick(event, productClick));
document.querySelector(".whatsappButton").addEventListener("click", (event) => handleClick(event, whatsappClicks));

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
});
