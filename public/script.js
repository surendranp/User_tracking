// public/script.js

let clickCount = 0;
let contactClicks = 0;
let whatsappClicks = 0;
let viewMoreClicks = 0;

const startTime = new Date();

// Track button clicks
document.getElementById("contactButton").addEventListener("click", () => {
    contactClicks++;
    clickCount++;
});

document.getElementById("whatsappButton").addEventListener("click", () => {
    whatsappClicks++;
    clickCount++;
});

document.getElementById("viewMoreButton").addEventListener("click", () => {
    viewMoreClicks++;
    clickCount++;
});

// Track page leave event
window.addEventListener("beforeunload", () => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

    // Save visit data to the server
    fetch("http://localhost:3000/api/save-visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            startTime,
            endTime,
            duration,
            clickCount,
            contactClicks,
            whatsappClicks,
            viewMoreClicks
        })
    })
    .then(response => response.json())
    .then(data => console.log("Visit data saved:", data))
    .catch(error => console.error("Error saving visit data:", error));
});
