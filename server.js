// API Endpoint to Save Visit Data
app.post("/api/save-visit", async (req, res) => {
    const visitData = req.body;

    try {
        const existingVisit = await Visit.findOne({ sessionId: visitData.sessionId });

        if (existingVisit) {
            Object.assign(existingVisit, visitData); // Update all fields
            await existingVisit.save();
        } else {
            const newVisit = new Visit(visitData);
            await newVisit.save();
        }

        res.status(200).json({ message: "Visit data saved successfully" });
    } catch (err) {
        console.error("Error saving visit:", err);
        res.status(500).json({ error: "Failed to save visit data" });
    }
});
