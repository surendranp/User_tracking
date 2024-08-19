let sessionId = generateSessionId();
        let clickCount = 0;
        // let contactClicks = 0;
        let whatsappClicks = 0;
        // let viewMoreClicks = 0;
        let homeClicks = 0;
        let aboutClicks = 0;
        let contactNavClicks = 0;
        let paverClick =0;
        let holloClick =0;
        let flyashClick=0;
        let qualityClick=0;
        let CareerClick=0;
        let QuoteClick=0;
        let textSelections = 0;
        let selectedTexts = [];

        const startTime = new Date();

        // Generate a unique session ID for each visit
        function generateSessionId() {
            return '_' + Math.random().toString(36).substr(2, 9);
        }

        // Track navbar button clicks
        document.querySelector(".homeButton").addEventListener("click", () => {
            homeClicks++;
            clickCount++;
        });

        document.querySelector(".aboutButton").addEventListener("click", () => {
            aboutClicks++;
            clickCount++;
        });

        document.querySelector(".contactNavButton").addEventListener("click", () => {
            contactNavClicks++;
            clickCount++;
        });
        document.querySelector(".paverButton").addEventListener("click", () => {
            paverClick++;
            clickCount++;
        });
        document.querySelector(".hollowButton").addEventListener("click", () => {
            holloClick++;
            clickCount++;
        });
        
        document.querySelector(".flyashButton").addEventListener("click", () => {
            flyashClick++;
            clickCount++;
        });
        
        document.querySelector(".qualityButton").addEventListener("click", () => {
            qualityClick++;
            clickCount++;
        });
        
        document.querySelector(".CareerButton").addEventListener("click", () => {
            CareerClick++;
            clickCount++;
        });
        
        document.querySelector(".QuoteButton").addEventListener("click", () => {
            QuoteClick++;
            clickCount++;
        });
        // Track other button clicks
        // document.getElementById("contactButton").addEventListener("click", () => {
        //     contactClicks++;
        //     clickCount++;
        // });

        document.querySelector("#whatsapp").addEventListener("click", () => {
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
                    // contactClicks,
                    whatsappClicks,
                    // viewMoreClicks,
                    homeClicks,
                    aboutClicks,
                    contactNavClicks,
                    paverClick,
                    holloClick,
                    flyashClick,
                    qualityClick,
                    CareerClick,
                    QuoteClick,
                    textSelections,
                    selectedTexts
                })
            })
            .then(response => response.json())
            .then(data => console.log('Visit data saved:', data))
            .catch(error => console.error("Error saving visit data:", error));
        });