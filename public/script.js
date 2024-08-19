// Generate a unique session ID for each visit
function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

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

// Track navbar button clicks and redirect to specific pages
function trackClick(buttonClass, clickVariable, url) {
    document.querySelector(buttonClass)?.addEventListener("click", () => {
        clickVariable++;
        clickCount++;
        window.location.href = url;
    });
}

trackClick(".homeButton", homeClicks, "/home.html");
trackClick(".aboutButton", aboutClicks, "/about.html");
trackClick(".contactNavButton", contactNavClicks, "/contact.html");
trackClick(".paverButton", paverClick, "/paver.html");
trackClick(".hollowButton", holloClick, "/hollow.html");
trackClick(".flyashButton", flyashClick, "/flyash.html");
trackClick(".qualityButton", qualityClick, "/quality.html");
trackClick(".CareerButton", CareerClick, "/career.html");
trackClick(".QuoteButton", QuoteClick, "/quote.html");
trackClick(".productButton", productClick, "/product.html");

document.querySelector(".whatsappButton")?.addEventListener("click", () => {
    whatsappClicks++;
    clickCount++;
    window.location.href = "https://api.whatsapp.com/send?phone=YOUR_PHONE_NUMBER";
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
