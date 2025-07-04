// API functions for handling orders
const API_URL = "https://api.jsonbin.io/v3/b";
// JSONBin.io API key - format should be $2b$10$...
const API_KEY = "$2b$10$W7Y1w05rI7FhqCSUCB/tRuDJYO2fRlTwgv2s3je3OlExS3oOz9UzG";
// If this bin ID doesn't work, run test-jsonbin.js to create a new one
const BIN_ID = "686583bb8561e97a50306adf";

// Function to save order to JSONBin.io
async function saveOrderToServer(order) {
    try {
        console.log('Attempting to save order to JSONBin:', order);
        
        // Check if bin ID is configured
        if (!BIN_ID) {
            console.warn('Bin ID not configured, falling back to localStorage');
            saveOrderToLocalStorage(order);
            return false;
        }
        
        // First, get existing data
        let data;
        try {
            data = await getOrdersFromServer();
            console.log('Retrieved existing data:', data);
        } catch (getError) {
            console.error('Error getting existing data:', getError);
            // If bin doesn't exist or can't be accessed, create a new data structure
            data = { orders: [] };
        }
        
        // Ensure orders array exists
        if (!data.orders) {
            data.orders = [];
        }
        
        // Check if order with same ID already exists to prevent duplicates
        const orderExists = data.orders.some(existingOrder => existingOrder.id === order.id);
        if (orderExists) {
            console.warn('Order already exists, skipping duplicate');
            return true;
        }
        
        // Add new order to the list
        data.orders.push(order);
        console.log('Updated data to save:', data);
        
        // Save updated orders list
        const response = await fetch(`${API_URL}/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
                'X-Bin-Versioning': 'false'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save order: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        console.log('Order saved successfully to JSONBin');
        
        // Also save to localStorage as backup
        saveOrderToLocalStorage(order);
        
        return true;
    } catch (error) {
        console.error('Error saving order:', error);
        // Fall back to localStorage if server fails
        saveOrderToLocalStorage(order);
        return false;
    }
}

// Function to get orders from JSONBin.io
async function getOrdersFromServer() {
    try {
        console.log('Attempting to fetch orders from JSONBin');
        
        // Check if bin ID is configured
        if (!BIN_ID) {
            console.warn('Bin ID not configured, falling back to localStorage');
            return {orders: JSON.parse(localStorage.getItem('orders')) || []};
        }
        
        const response = await fetch(`${API_URL}/${BIN_ID}`, {
            headers: {
                'X-Master-Key': API_KEY,
                'X-Bin-Meta': 'false'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Received data from JSONBin:', result);
        
        // Handle different response formats
        let data;
        if (result.record) {
            // New JSONBin API format
            data = result.record;
        } else {
            // Direct data format
            data = result;
        }
        
        // Ensure the data structure is correct
        if (!data || typeof data !== 'object') {
            console.warn('Invalid data format received, creating new data structure');
            data = {orders: []};
        }
        
        if (!data.orders) {
            console.warn('No orders array in data, creating it');
            data.orders = [];
        }
        
        console.log('Processed data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        // Fall back to localStorage if server fails
        const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
        console.log('Falling back to localStorage orders:', localOrders);
        return {orders: localOrders};
    }
}

// Function to save order to localStorage (fallback)
function saveOrderToLocalStorage(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}