document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality is now handled by cart.js
    
    // Thumbnail gallery functionality
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update main image
            const imageUrl = this.getAttribute('data-image');
            mainImage.src = imageUrl;
        });
    });
    
    // Size guide link
    const sizeGuideLink = document.querySelector('.size-guide-link');
    
    if (sizeGuideLink) {
        sizeGuideLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'sizes.html';
        });
    }
    
    // Quantity selector
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    });
    
    // Prevent manual input of invalid values
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > 10) {
            this.value = 10;
        }
    });
    
    // Accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            // Toggle current item
            item.classList.toggle('active');
            
            // Close other items (uncomment for accordion behavior)
            // accordionItems.forEach(otherItem => {
            //     if (otherItem !== item) {
            //         otherItem.classList.remove('active');
            //     }
            // });
        });
    });
    
    // Commandez functionality for product detail page
    const addToCartBtn = document.querySelector('.btn-commandez');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productName = document.querySelector('.product-info-detail h1').textContent;
            const productPrice = document.querySelector('.product-price').textContent.split(' ')[0];
            const quantity = parseInt(quantityInput.value);
            const productImage = document.getElementById('main-product-image').getAttribute('src');
            
            // Get selected color
            const selectedColor = document.querySelector('input[name="color"]:checked')?.value || 'white';
            
            // Get current cart from localStorage or initialize empty array
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Add new item to cart
            cart.push({
                name: productName,
                price: productPrice,
                quantity: quantity,
                color: selectedColor,
                image: productImage
            });
            
            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // No alert message - redirect silently
            
            // Redirect to checkout page
            window.location.href = 'checkout.html';
        });
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
    
    // Cart count is now handled by cart.js
    
    // Wishlist functionality
    const wishlistBtn = document.querySelector('.btn-wishlist');
    
    wishlistBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        
        if (icon.classList.contains('far')) {
            // Add to wishlist
            icon.classList.remove('far');
            icon.classList.add('fas');
            // No alert message
        } else {
            // Remove from wishlist
            icon.classList.remove('fas');
            icon.classList.add('far');
            // No alert message
        }
    });
});