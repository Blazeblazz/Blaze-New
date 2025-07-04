document.addEventListener('DOMContentLoaded', function() {
    // Get product name from URL
    function getProductFromURL() {
        // Check if we're on a product page
        const path = window.location.pathname;
        const isHomepage = path === '/HOMEPAGE' || path === '/index.html' || path === '/';
        
        if (isHomepage) {
            return null;
        }
        
        // Get product name from path
        const productName = path.substring(1); // Remove leading slash
        return productName || null;
    }
    
    // Update page title and product info based on URL
    function updatePageInfo() {
        const productName = getProductFromURL();
        
        if (productName) {
            // Update page title
            const formattedName = productName.replace(/-/g, ' ');
            document.title = formattedName + ' - BLAZE Streetwear';
            
            // Update product name in breadcrumb
            const breadcrumbItem = document.querySelector('.breadcrumb li:last-child');
            if (breadcrumbItem) {
                breadcrumbItem.textContent = formattedName;
            }
            
            // Update product name in product info
            const productTitle = document.querySelector('.product-info-detail h1');
            if (productTitle) {
                productTitle.textContent = formattedName;
            }
        }
    }
    
    // Run on page load
    updatePageInfo();
});