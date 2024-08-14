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

  fetch("https://usertracking-test.up.railway.app/api/save-visit", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(visitData)
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error("Error saving visit data:", error));
});
