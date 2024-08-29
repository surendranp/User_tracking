async function sendVisitDataEmail() {
    try {
        const now = moment().tz("Asia/Kolkata");
        
        // Define the time periods
        const todayStart = now.clone().startOf('day').set({ hour: 8 }); // 8:00 AM today
        const todayEnd = now.clone().startOf('day').set({ hour: 20 }); // 8:00 PM today
        const tomorrowStart = todayEnd.clone().add(1, 'minute'); // 8:01 PM today
        const tomorrowEnd = now.clone().startOf('day').add(1, 'day').set({ hour: 8 }).subtract(1, 'minute'); // 7:59 AM tomorrow

        // Query for 8:00 AM to 8:00 PM today
        const dayPeriodVisits = await Visit.find({
            timestamp: { $gte: todayStart.toDate(), $lt: todayEnd.toDate() }
        });

        // Query for 8:01 PM today to 7:59 AM tomorrow
        const nightPeriodVisits = await Visit.find({
            timestamp: { $gte: tomorrowStart.toDate(), $lte: tomorrowEnd.toDate() }
        });

        // Function to calculate button clicks and page views
        const calculateStats = (visits) => {
            return {
                userCount: visits.length,
                buttonClicks: {
                    home: visits.reduce((acc, visit) => acc + visit.home_Button_Clicks, 0),
                    about: visits.reduce((acc, visit) => acc + visit.about_Button_Clicks, 0),
                    contact: visits.reduce((acc, visit) => acc + visit.contact_ButtonNav_Clicks, 0),
                    whatsapp: visits.reduce((acc, visit) => acc + visit.whatsapp_Button_Clicks, 0),
                    product: visits.reduce((acc, visit) => acc + visit.product_Button_Click, 0),
                    paverblock: visits.reduce((acc, visit) => acc + visit.paverblock_Button_Click, 0),
                    holloblock: visits.reduce((acc, visit) => acc + visit.holloblock_Button_Click, 0),
                    flyash: visits.reduce((acc, visit) => acc + visit.flyash_Button_Click, 0),
                    quality: visits.reduce((acc, visit) => acc + visit.quality_Button_Click, 0),
                    career: visits.reduce((acc, visit) => acc + visit.Career_Button_Click, 0),
                    quote: visits.reduce((acc, visit) => acc + visit.Quote_Button_Click, 0),
                },
                pageViews: visits.length // Assuming one view per visit
            };
        };

        // Get statistics for each period
        const dayData = calculateStats(dayPeriodVisits);
        const nightData = calculateStats(nightPeriodVisits);

        // Create transporter for sending emails
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Define the email content
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'surayrk315@gmail.com', // Replace with the recipient's email address
            subject: 'Daily Visit Data Report',
            html: `
                <h1>Visit Data Report</h1>
                <h2>8:00 AM to 8:00 PM Today</h2>
                <p>User Count: ${dayData.userCount}</p>
                <p>Button Clicks:</p>
                <ul>
                    <li>Home: ${dayData.buttonClicks.home}</li>
                    <li>About: ${dayData.buttonClicks.about}</li>
                    <li>Contact: ${dayData.buttonClicks.contact}</li>
                    <li>Whatsapp: ${dayData.buttonClicks.whatsapp}</li>
                    <li>Product: ${dayData.buttonClicks.product}</li>
                    <li>Paverblock: ${dayData.buttonClicks.paverblock}</li>
                    <li>Holloblock: ${dayData.buttonClicks.holloblock}</li>
                    <li>Flyash: ${dayData.buttonClicks.flyash}</li>
                    <li>Quality: ${dayData.buttonClicks.quality}</li>
                    <li>Career: ${dayData.buttonClicks.career}</li>
                    <li>Quote: ${dayData.buttonClicks.quote}</li>
                </ul>
                <p>Page Views: ${dayData.pageViews}</p>

                <h2>8:01 PM Today to 7:59 AM Tomorrow</h2>
                <p>User Count: ${nightData.userCount}</p>
                <p>Button Clicks:</p>
                <ul>
                    <li>Home: ${nightData.buttonClicks.home}</li>
                    <li>About: ${nightData.buttonClicks.about}</li>
                    <li>Contact: ${nightData.buttonClicks.contact}</li>
                    <li>Whatsapp: ${nightData.buttonClicks.whatsapp}</li>
                    <li>Product: ${nightData.buttonClicks.product}</li>
                    <li>Paverblock: ${nightData.buttonClicks.paverblock}</li>
                    <li>Holloblock: ${nightData.buttonClicks.holloblock}</li>
                    <li>Flyash: ${nightData.buttonClicks.flyash}</li>
                    <li>Quality: ${nightData.buttonClicks.quality}</li>
                    <li>Career: ${nightData.buttonClicks.career}</li>
                    <li>Quote: ${nightData.buttonClicks.quote}</li>
                </ul>
                <p>Page Views: ${nightData.pageViews}</p>
            `
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Daily report email sent successfully:', info.response);
    } catch (err) {
        console.error("Error sending daily report email:", err);
    }
}

// Schedule the email to be sent every day at 9 AM IST
nodeCron.schedule('0 9 * * *', () => {
    console.log('Executing cron job to send daily report email');
    sendVisitDataEmail();
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
