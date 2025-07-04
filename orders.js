// Simple orders management system
const ORDERS = {
    // JSONBin.io configuration
    API_URL: "https://api.jsonbin.io/v3/b",
    API_KEY: "$2b$10$W7Y1w05rI7FhqCSUCB/tRuDJYO2fRlTwgv2s3je3OlExS3oOz9UzG",
    BIN_ID: "686583bb8561e97a50306adf", // Replace with your bin ID if needed
    
    // Save an order
    saveOrder: async function(order) {
        console.log("Saving order:", order);
        
        // Always save to localStorage first as backup
        this.saveToLocalStorage(order);
        
        try {
            // Get current orders
            const currentOrders = await this.getAllOrders();
            
            // Add new order
            currentOrders.push(order);
            
            // Save to JSONBin
            const response = await fetch(`${this.API_URL}/${this.BIN_ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": this.API_KEY
                },
                body: JSON.stringify({ orders: currentOrders })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to save order: ${response.status}`);
            }
            
            console.log("Order saved successfully to JSONBin");
            return true;
        } catch (error) {
            console.error("Error saving to JSONBin:", error);
            return false;
        }
    },
    
    // Get all orders
    getAllOrders: async function() {
        try {
            // Try to get from JSONBin
            const response = await fetch(`${this.API_URL}/${this.BIN_ID}`, {
                headers: {
                    "X-Master-Key": this.API_KEY
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.status}`);
            }
            
            const data = await response.json();
            const orders = data.record?.orders || [];
            console.log("Orders fetched from JSONBin:", orders);
            
            // Merge with localStorage orders to ensure we don't lose any
            const localOrders = this.getFromLocalStorage();
            
            // Combine orders, avoiding duplicates
            const allOrders = [...orders];
            
            // Add local orders that aren't already in the JSONBin orders
            for (const localOrder of localOrders) {
                if (!allOrders.some(order => order.id === localOrder.id)) {
                    allOrders.push(localOrder);
                }
            }
            
            return allOrders;
        } catch (error) {
            console.error("Error fetching from JSONBin:", error);
            // Fall back to localStorage
            return this.getFromLocalStorage();
        }
    },
    
    // Save to localStorage
    saveToLocalStorage: function(order) {
        const orders = this.getFromLocalStorage();
        orders.push(order);
        localStorage.setItem("blaze_orders", JSON.stringify(orders));
        console.log("Order saved to localStorage");
    },
    
    // Get from localStorage
    getFromLocalStorage: function() {
        try {
            return JSON.parse(localStorage.getItem("blaze_orders")) || [];
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return [];
        }
    },
    
    // Generate a unique order ID
    generateOrderId: function() {
        const prefix = "BLZ-";
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${timestamp}-${random}`;
    }
};