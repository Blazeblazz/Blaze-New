// Checkout Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load API script
    const apiScript = document.createElement('script');
    apiScript.src = 'api.js';
    document.head.appendChild(apiScript);
    
    // Load cart items
    loadCartItems();
    
    // Form submission
    const checkoutForm = document.getElementById('checkout-form');
    
    checkoutForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Get form data
            const formData = new FormData(checkoutForm);
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            const subtotal = parseInt(document.getElementById('subtotal').textContent);
            
            const orderData = {
                customer: {
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    city: formData.get('city')
                },
                payment: 'cod',
                items: cartItems,
                subtotal: subtotal,
                shipping: 'Gratuit',
                total: subtotal,
                date: new Date().toISOString().split('T')[0],
                status: 'new',
                id: generateOrderId()
            };
            
            // Send order data to server
            console.log('Order submitted:', orderData);
            
            // Track purchase event for Facebook Pixel
            try {
                fbq('track', 'Purchase', {
                    value: subtotal,
                    currency: 'MAD'
                });
            } catch (e) {
                console.log('Facebook Pixel error:', e);
            }
            
            try {
                // Wait for API script to load
                await waitForApi();
                
                // Save to JSONBin
                const success = await saveOrderToServer(orderData);
                
                if (!success) {
                    // Fallback to localStorage if JSONBin fails
                    saveOrderToLocalStorage(orderData);
                }
                
                // Show confirmation
                alert('Votre commande a été passée avec succès! Vous recevrez un appel pour confirmer.');
                
                // Clear cart
                localStorage.removeItem('cart');
                
                // Redirect to confirmation page
                window.location.href = 'confirmation.html';
            } catch (error) {
                console.error('Error saving order:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        }
    });
    
    // Wait for API script to load
    function waitForApi() {
        return new Promise((resolve) => {
            const checkApi = () => {
                if (window.saveOrderToServer) {
                    resolve();
                } else {
                    setTimeout(checkApi, 100);
                }
            };
            checkApi();
        });
    }
    
    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const city = document.getElementById('city').value;
        
        if (!name || !phone || !city) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return false;
        }
        
        return true;
    }
    
    // Generate order ID
    function generateOrderId() {
        const prefix = 'BLZ-';
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        return prefix + randomNum;
    }
    
    // Load cart items
    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('checkout-items');
        let subtotal = 0;
        
        // Clear container
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Votre panier est vide.</p>';
            updateTotals(0);
            return;
        }
        
        // Add each item to the container
        cartItems.forEach(item => {
            const itemTotal = parseInt(item.price) * item.quantity;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} MAD</div>
                    <div class="cart-item-quantity">Quantité: ${item.quantity}</div>
                    ${item.color ? `<div class="cart-item-color">Couleur: ${getColorName(item.color)}</div>` : ''}
                </div>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Update totals
        updateTotals(subtotal);
    }
    
    // Helper function to get color name
    function getColorName(colorCode) {
        const colorNames = {
            'white': 'Blanc',
            'black': 'Noir',
            'brown': 'Beige foncé'
        };
        return colorNames[colorCode] || colorCode;
    }
    
    // Update totals
    function updateTotals(subtotal) {
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        
        // Set subtotal
        subtotalElement.textContent = `${subtotal} MAD`;
        
        // Shipping is always free
        
        // Calculate total (same as subtotal since shipping is free)
        totalElement.textContent = `${subtotal} MAD`;
    }
    
    // Promo code functionality
    const applyPromoBtn = document.getElementById('apply-promo');
    
    applyPromoBtn.addEventListener('click', function() {
        const promoCode = document.getElementById('promo-code').value.trim().toUpperCase();
        const subtotal = parseInt(document.getElementById('subtotal').textContent);
        
        if (promoCode === 'BLAZE15') {
            // Apply 15% discount
            const discount = Math.round(subtotal * 0.15);
            const newSubtotal = subtotal - discount;
            
            // Update totals
            updateTotals(newSubtotal);
            
            // Show confirmation
            alert('Code promo BLAZE15 appliqué! Réduction de 15%.');
        } else if (promoCode === 'BLAZE40') {
            // Apply 40% discount for first-time customers
            const discount = Math.round(subtotal * 0.4);
            const newSubtotal = subtotal - discount;
            
            // Update totals
            updateTotals(newSubtotal);
            
            // Show confirmation
            alert('Code promo BLAZE40 appliqué! Réduction de 40% pour votre première commande.');
        } else {
            // Invalid promo code
            alert('Code promo invalide.');
        }
    });
});