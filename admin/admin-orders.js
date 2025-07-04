// Admin orders management
const ADMIN_ORDERS = {
    // JSONBin.io configuration
    API_URL: "https://api.jsonbin.io/v3/b",
    API_KEY: "$2b$10$W7Y1w05rI7FhqCSUCB/tRuDJYO2fRlTwgv2s3je3OlExS3oOz9UzG",
    BIN_ID: "686583bb8561e97a50306adf", // Replace with your bin ID if needed
    
    // Get all orders from all sources
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
            const jsonbinOrders = data.record?.orders || [];
            console.log("Orders fetched from JSONBin:", jsonbinOrders);
            
            // Get orders from localStorage
            const localOrders = this.getFromLocalStorage();
            console.log("Orders from localStorage:", localOrders);
            
            // Get emergency orders
            const emergencyOrders = this.getEmergencyOrders();
            console.log("Emergency orders:", emergencyOrders);
            
            // Combine all orders, avoiding duplicates
            const allOrders = [...jsonbinOrders];
            
            // Add local orders that aren't already in the JSONBin orders
            for (const localOrder of localOrders) {
                if (!allOrders.some(order => order.id === localOrder.id)) {
                    allOrders.push(localOrder);
                }
            }
            
            // Add emergency orders
            for (const emergencyOrder of emergencyOrders) {
                if (!allOrders.some(order => order.id === emergencyOrder.id)) {
                    allOrders.push(emergencyOrder);
                }
            }
            
            return allOrders;
        } catch (error) {
            console.error("Error fetching orders:", error);
            
            // Fall back to localStorage
            const localOrders = this.getFromLocalStorage();
            const emergencyOrders = this.getEmergencyOrders();
            
            return [...localOrders, ...emergencyOrders];
        }
    },
    
    // Get orders from localStorage
    getFromLocalStorage: function() {
        try {
            return JSON.parse(localStorage.getItem("blaze_orders")) || [];
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return [];
        }
    },
    
    // Get emergency orders
    getEmergencyOrders: function() {
        try {
            return JSON.parse(localStorage.getItem("emergency_orders")) || [];
        } catch (error) {
            console.error("Error reading emergency orders:", error);
            return [];
        }
    },
    
    // Update order status
    updateOrderStatus: async function(orderId, newStatus) {
        try {
            // Get all orders
            const allOrders = await this.getAllOrders();
            
            // Find the order to update
            const orderIndex = allOrders.findIndex(order => order.id === orderId);
            
            if (orderIndex === -1) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
            
            // Update the status
            allOrders[orderIndex].status = newStatus;
            
            // Save back to JSONBin
            const response = await fetch(`${this.API_URL}/${this.BIN_ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": this.API_KEY
                },
                body: JSON.stringify({ orders: allOrders })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update order: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error("Error updating order status:", error);
            return false;
        }
    },
    
    // Delete an order
    deleteOrder: async function(orderId) {
        try {
            // Get all orders
            const allOrders = await this.getAllOrders();
            
            // Filter out the order to delete
            const updatedOrders = allOrders.filter(order => order.id !== orderId);
            
            // Save back to JSONBin
            const response = await fetch(`${this.API_URL}/${this.BIN_ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": this.API_KEY
                },
                body: JSON.stringify({ orders: updatedOrders })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to delete order: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error("Error deleting order:", error);
            return false;
        }
    }
};