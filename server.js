app.post("/api/save-visit", async (req, res) => {
  console.log("Received visit data:", req.body);

  const {
      startTime,
      endTime,
      duration,
      clickCount,
      contactClicks,
      whatsappClicks,
      viewMoreClicks,
      textSelections
  } = req.body;

  if (
      !startTime || !endTime || !duration || !clickCount ||
      !contactClicks || !whatsappClicks || !viewMoreClicks || !textSelections
  ) {
      return res.status(400).json({ error: "Missing required fields" });
  }

  const startTimeDate = new Date(startTime);
  const endTimeDate = new Date(endTime);

  if (
      isNaN(startTimeDate.getTime()) ||
      isNaN(endTimeDate.getTime()) ||
      isNaN(duration) || isNaN(clickCount) ||
      isNaN(contactClicks) || isNaN(whatsappClicks) ||
      isNaN(viewMoreClicks) || isNaN(textSelections)
  ) {
      return res.status(400).json({ error: "Invalid data types" });
  }

  const newVisit = new Visit({
      startTime: startTimeDate,
      endTime: endTimeDate,
      duration,
      clickCount,
      contactClicks,
      whatsappClicks,
      viewMoreClicks,
      textSelections
  });

  try {
      const savedVisit = await newVisit.save();
      console.log("Visit data saved:", savedVisit); // Added detailed logging
      res.status(200).json({ message: "Visit data saved successfully" });
  } catch (err) {
      console.error("Error saving visit:", err);
      res.status(500).json({ error: "Failed to save visit data", details: err.message });
  }
});
