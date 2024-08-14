let clickCount = 0;
let contactClicks = 0;
let whatsappClicks = 0;
let viewMoreClicks = 0;
let textSelections = 0;

const startTime = new Date();

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

document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        textSelections++;
        fetch("https://usertracking-test.up.railway.app/api/save-text-selection", {
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

window.addEventListener("beforeunload", () => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

    const visitData = {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        clickCount,
        contactClicks,
        whatsappClicks,
        viewMoreClicks,
        textSelections
    };

    navigator.sendBeacon("https://usertracking-test.up.railway.app/api/save-visit", JSON.stringify(visitData));
});
