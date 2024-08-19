function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

let sessionId = localStorage.getItem("sessionId") || generateSessionId();
localStorage.setItem("sessionId", sessionId);

let visitData = JSON.parse(localStorage.getItem("visitData")) || {
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

function updateVisitData(key) {
    visitData[key]++;
    visitData.clickCount++;
    localStorage.setItem("visitData", JSON.stringify(visitData));
    saveVisitData();
}

function saveVisitData() {
    return fetch("/api/save-visit", {
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

function handleTextSelection() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        visitData.textSelections++;
        visitData.selectedTexts.push(selectedText);
        localStorage.setItem("visitData", JSON.stringify(visitData));
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
}

function handleButtonClick(buttonKey, redirectUrl) {
    updateVisitData(buttonKey);
    saveVisitData().then(() => {
        window.location.href = redirectUrl;
    });
}

document.querySelector(".homeButton")?.addEventListener("click", () => handleButtonClick('homeClicks', '/home'));
document.querySelector(".aboutButton")?.addEventListener("click", () => handleButtonClick('aboutClicks', '/about'));
document.querySelector(".contactNavButton")?.addEventListener("click", () => handleButtonClick('contactNavClicks', '/contact'));
document.querySelector(".paverButton")?.addEventListener("click", () => handleButtonClick('paverClick', '/paver'));
document.querySelector(".hollowButton")?.addEventListener("click", () => handleButtonClick('holloClick', '/hollow'));
document.querySelector(".flyashButton")?.addEventListener("click", () => handleButtonClick('flyashClick', '/flyash'));
document.querySelector(".qualityButton")?.addEventListener("click", () => handleButtonClick('qualityClick', '/quality'));
document.querySelector(".CareerButton")?.addEventListener("click", () => handleButtonClick('CareerClick', '/career'));
document.querySelector(".QuoteButton")?.addEventListener("click", () => handleButtonClick('QuoteClick', '/quote'));
document.querySelector(".productButton")?.addEventListener("click", () => handleButtonClick('productClick', '/product'));
document.querySelector(".whatsappButton")?.addEventListener("click", () => handleButtonClick('whatsappClicks', '/whatsapp'));

window.addEventListener("beforeunload", saveVisitData);
document.addEventListener("mouseup", handleTextSelection);
