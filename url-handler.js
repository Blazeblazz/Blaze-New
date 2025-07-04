// Run immediately and again when DOM is loaded
(function() {
    // Product data mapping
    const productData = {
        'RISE': {
            title: 'RISE',
            description: "T-shirt premium RISE de notre collection Captivating Cities. Fabriqué au Maroc avec un coton 100% biologique de haute qualité. Le design emblématique représente le lever du soleil sur les villes marocaines, symbolisant l'espoir et le renouveau.",
            image: 'images/products/Rise.webp'
        },
        'SEGRETO': {
            title: 'SEGRETO',
            description: "SEGRETO révèle la beauté cachée de l'architecture marocaine. Ce t-shirt premium présente des motifs complexes inspirés des portes anciennes et des passages secrets.",
            image: 'images/products/SEGRETO.webp'
        },
        'WILDFLOWERS': {
            title: 'WILDFLOWERS',
            description: "WILDFLOWERS célèbre la beauté résiliente trouvée dans des espaces urbains inattendus. Ce t-shirt présente des éléments botaniques délicats contrastés avec des formes géométriques audacieuses.",
            image: 'images/products/Wild-Flowers.webp'
        },
        'RUSH': {
            title: 'RUSH',
            description: "RUSH capture l'énergie dynamique de la vie urbaine. Ce t-shirt premium présente un design inspiré par le mouvement constant et le rythme des environnements urbains.",
            image: 'images/products/Rush.webp'
        },
        'LOST-IN-CASABLANCA': {
            title: 'LOST IN CASABLANCA',
            description: "LOST IN CASABLANCA raconte l'histoire d'une errance à travers la ville la plus emblématique du Maroc. Ce t-shirt premium présente un design qui mélange des motifs traditionnels avec un style de rue contemporain.",
            image: 'images/products/Lost in Casablanca.webp'
        },
        'TRUST-THE-PROCESS': {
            title: 'TRUST THE PROCESS',
            description: "TRUST THE PROCESS est plus qu'un t-shirt—c'est une philosophie. Cette pièce premium présente un design minimaliste qui parle de patience et de persévérance.",
            image: 'images/products/Trust-The-Process.webp'
        }
    };
    
    // Get product name from URL
    function getProductFromURL() {
        // First check URL parameters (for backward compatibility)
        const urlParams = new URLSearchParams(window.location.search);
        const paramProduct = urlParams.get('product');
        if (paramProduct) return paramProduct;
        
        // Check if we're on a product page by path
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
            // Get product data
            const product = productData[productName] || {
                title: productName.replace(/-/g, ' ').toUpperCase(),
                description: "T-shirt premium de notre collection exclusive."
            };
            
            // Update page title
            document.title = product.title + ' - BLAZE Streetwear';
            
            // Update HTML title element directly for better SEO
            const titleElement = document.querySelector('title');
            if (titleElement) {
                titleElement.textContent = product.title + ' - BLAZE Streetwear';
            }
            
            // Update product name in breadcrumb
            const breadcrumbItem = document.querySelector('.breadcrumb li:last-child');
            if (breadcrumbItem) {
                breadcrumbItem.textContent = product.title;
            }
            
            // Update product name in product info
            const productTitle = document.querySelector('.product-info-detail h1');
            if (productTitle) {
                productTitle.textContent = product.title;
            }
            
            // Update product description
            const descriptionElement = document.querySelector('.product-description p');
            if (descriptionElement) {
                descriptionElement.textContent = product.description;
            }
            
            // Update product image if needed
            if (product.image) {
                const mainImage = document.getElementById('main-product-image');
                if (mainImage && mainImage.src.includes('Rise.webp')) {
                    mainImage.src = product.image;
                    mainImage.alt = 'T-shirt ' + product.title;
                }
            }
        }
    }
    
    // Run immediately
    updatePageInfo();
})();

// Also run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    updatePageInfo();
});