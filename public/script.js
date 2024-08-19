let clickCount = 0;
// let contactClicks = 0;
let whatsappClicks = 0;
// let viewMoreClicks = 0;
let homeClicks = 0;
let aboutClicks = 0;
let contactNavClicks = 0;
let textSelections = 0;
let selectedTexts = [];

const startTime = new Date();

// Track navbar button clicks
document.getElementById("homeButton").addEventListener("click", () => {
    homeClicks++;
    clickCount++;
});

document.getElementById("aboutButton").addEventListener("click", () => {
    aboutClicks++;
    clickCount++;
});

document.getElementById("contactNavButton").addEventListener("click", () => {
    contactNavClicks++;
    clickCount++;
});

// Track other button clicks
// document.getElementById("contactButton").addEventListener("click", () => {
//     contactClicks++;
//     clickCount++;
// });

document.getElementsByClassName("whatsappButton").addEventListener("click", () => {
    whatsappClicks++;
    clickCount++;
});

// document.getElementById("viewMoreButton").addEventListener("click", () => {
//     viewMoreClicks++;
//     clickCount++;
// });

// Track text selections
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        textSelections++;
        selectedTexts.push(selectedText);
        fetch("/api/save-text-selection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ selectedText })
        })
        .then(response => response.json())
        .then(data => console.log("Text selection saved:", data))
        .catch(error => console.error("Error saving text selection:", error));
    }
});

// Track page leave event.
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
            startTime,
            endTime,
            duration,
            clickCount,
            // contactClicks,
            whatsappClicks,
            // viewMoreClicks,
            homeClicks,
            aboutClicks,
            contactNavClicks,
            textSelections
        })
    })
    .then(response => response.json())
    .then(data => console.log('Visit data saved:', data))
    .catch(error => console.error("Error saving visit data:", error));
});
