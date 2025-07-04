// Email notification system for orders
const EMAIL_NOTIFICATION = {
    // Formspree endpoint - replace with your own
    ENDPOINT: "https://formspree.io/f/xdoqbwgj",
    
    // Send order notification
    sendOrderNotification: async function(order) {
        try {
            console.log("Sending order notification via email...");
            
            const response = await fetch(this.ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    orderID: order.id,
                    customerName: order.customer.name,
                    customerPhone: order.customer.phone,
                    customerCity: order.customer.city,
                    orderTotal: order.total + " MAD",
                    orderItems: order.items.map(item => `${item.name} (${item.quantity}x)`).join(", "),
                    orderDate: order.date,
                    _subject: `Nouvelle commande: ${order.id}`
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to send email: ${response.status}`);
            }
            
            console.log("Email notification sent successfully");
            return true;
        } catch (error) {
            console.error("Error sending email notification:", error);
            return false;
        }
    }
};