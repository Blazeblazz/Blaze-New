// Test script for JSONBin connection
const API_URL = "https://api.jsonbin.io/v3/b";
// Use a different API key format that is definitely correct
const API_KEY = "$2b$10$W7Y1w05rI7FhqCSUCB/tRuDJYO2fRlTwgv2s3je3OlExS3oOz9UzG";

// Function to create a new bin
async function createNewBin() {
    try {
        console.log("Creating new bin...");
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
                'X-Bin-Name': 'BLAZE Orders'
            },
            body: JSON.stringify({ orders: [] })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create bin: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("New bin created successfully!");
        console.log("Bin ID:", result.metadata.id);
        console.log("Use this ID in your api.js file");
        return result.metadata.id;
    } catch (error) {
        console.error("Error creating bin:", error);
        return null;
    }
}

// Function to test existing bin
async function testExistingBin(binId) {
    try {
        console.log(`Testing bin with ID: ${binId}`);
        const response = await fetch(`${API_URL}/${binId}`, {
            headers: {
                'X-Master-Key': API_KEY,
                'X-Bin-Meta': 'false'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to access bin: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("Bin accessed successfully!");
        console.log("Current data:", result);
        return true;
    } catch (error) {
        console.error("Error accessing bin:", error);
        return false;
    }
}

// Function to add a test order
async function addTestOrder(binId) {
    try {
        console.log("Adding test order...");
        
        // First get current data
        const getResponse = await fetch(`${API_URL}/${binId}`, {
            headers: {
                'X-Master-Key': API_KEY,
                'X-Bin-Meta': 'false'
            }
        });
        
        if (!getResponse.ok) {
            throw new Error(`Failed to get bin data: ${getResponse.status} ${getResponse.statusText}`);
        }
        
        const data = await getResponse.json();
        const orders = data.orders || [];
        
        // Add test order
        const testOrder = {
            id: `TEST-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            customer: {
                name: "Test Customer",
                phone: "(212) 123-456789",
                city: "Test City"
            },
            items: [
                {
                    name: "TEST PRODUCT",
                    price: "129",
                    quantity: 1,
                    color: "white",
                    image: "images/products/Rise.webp"
                }
            ],
            subtotal: 129,
            shipping: "Gratuit",
            total: 129,
            status: "new",
            payment: "cod"
        };
        
        orders.push(testOrder);
        
        // Update bin with new order
        const updateResponse = await fetch(`${API_URL}/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
                'X-Bin-Versioning': 'false'
            },
            body: JSON.stringify({ orders: orders })
        });
        
        if (!updateResponse.ok) {
            throw new Error(`Failed to update bin: ${updateResponse.status} ${updateResponse.statusText}`);
        }
        
        console.log("Test order added successfully!");
        return true;
    } catch (error) {
        console.error("Error adding test order:", error);
        return false;
    }
}

// Main function
async function main() {
    // Test existing bin first
    const existingBinId = "686583bb8561e97a50306adf";
    const binExists = await testExistingBin(existingBinId);
    
    if (binExists) {
        // Add a test order to the existing bin
        await addTestOrder(existingBinId);
    } else {
        // Create a new bin
        const newBinId = await createNewBin();
        if (newBinId) {
            // Add a test order to the new bin
            await addTestOrder(newBinId);
        }
    }
}

// Run the test
main();