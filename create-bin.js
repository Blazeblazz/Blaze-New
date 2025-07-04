// Simple script to create a new bin
const API_KEY = "$2b$10$W7Y1w05rI7FhqCSUCB/tRuDJYO2fRlTwgv2s3je3OlExS3oOz9UzG";

async function createBin() {
    try {
        const response = await fetch("https://api.jsonbin.io/v3/b", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY,
                "X-Bin-Name": "BLAZE Orders"
            },
            body: JSON.stringify({ orders: [] })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create bin: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("New bin created successfully!");
        console.log("Bin ID:", data.metadata.id);
        return data.metadata.id;
    } catch (error) {
        console.error("Error creating bin:", error);
        return null;
    }
}

// Run the function
createBin().then(binId => {
    if (binId) {
        console.log(`Use this bin ID in your orders.js file: ${binId}`);
    }
});