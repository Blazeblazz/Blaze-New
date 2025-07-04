// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin panel
    initializeAdmin();
    
    // Function to initialize admin panel
    async function initializeAdmin() {
        try {
            // Try to get orders from server first
            const serverData = await getOrdersFromServer();
            let orders = serverData.orders || [];
            
            // If server request failed, fall back to localStorage
            if (!orders || orders.length === 0) {
                orders = JSON.parse(localStorage.getItem('orders')) || [];
            }
    
    // If no orders in localStorage, use sample data
    if (orders.length === 0) {
        orders = [
            {
                id: 'BLZ-25789',
                date: '2025-01-15',
                customer: {
                    name: 'Ahmed Benali',
                    phone: '(212) 612-345678',
                    city: 'Casablanca'
                },
                items: [
                    { name: 'RISE', color: 'Blanc', price: 129, quantity: 1, total: 129 },
                    { name: 'SEGRETO', color: 'Noir', price: 129, quantity: 2, total: 258 }
                ],
                subtotal: 387,
                shipping: 'Gratuit',
                total: 387,
                status: 'new',
                payment: 'cod'
            },
            {
                id: 'BLZ-25790',
                date: '2025-01-14',
                customer: {
                    name: 'Fatima Zahra',
                    phone: '(212) 623-456789',
                    city: 'Rabat'
                },
                items: [
                    { name: 'WILDFLOWERS', color: 'Noir', price: 129, quantity: 1, total: 129 }
                ],
                subtotal: 129,
                shipping: 'Gratuit',
                total: 129,
                status: 'processing',
                payment: 'cod'
            },
            {
                id: 'BLZ-25791',
                date: '2025-01-13',
                customer: {
                    name: 'Karim Idrissi',
                    phone: '(212) 634-567890',
                    city: 'Marrakech'
                },
                items: [
                    { name: 'RUSH', color: 'Beige foncé', price: 129, quantity: 1, total: 129 },
                    { name: 'TRUST THE PROCESS', color: 'Noir', price: 129, quantity: 1, total: 129 }
                ],
                subtotal: 258,
                shipping: 'Gratuit',
                total: 258,
                status: 'shipped',
                payment: 'cod'
            },
            {
                id: 'BLZ-25792',
                date: '2025-01-12',
                customer: {
                    name: 'Leila Benjelloun',
                    phone: '(212) 645-678901',
                    city: 'Tanger'
                },
                items: [
                    { name: 'LOST IN CASABLANCA', color: 'Blanc', price: 129, quantity: 3, total: 387 }
                ],
                subtotal: 387,
                shipping: 'Gratuit',
                total: 387,
                status: 'delivered',
                payment: 'cod'
            },
            {
                id: 'BLZ-25793',
                date: '2025-01-11',
                customer: {
                    name: 'Youssef Alami',
                    phone: '(212) 656-789012',
                    city: 'Fès'
                },
                items: [
                    { name: 'RISE', color: 'Beige foncé', price: 129, quantity: 1, total: 129 }
                ],
                subtotal: 129,
                shipping: 'Gratuit',
                total: 129,
                status: 'cancelled',
                payment: 'cod'
            }
        ];
    }
    
            // Initialize the admin panel
            initAdminPanel(orders);
        } catch (error) {
            console.error('Error initializing admin panel:', error);
            // Fall back to localStorage if there's an error
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            initAdminPanel(orders);
        }
    }
    
    // Function to initialize the admin panel
    function initAdminPanel(ordersData) {
        // Update dashboard stats
        updateDashboardStats(ordersData);
        
        // Load orders table
        loadOrdersTable(ordersData);
        
        // Set up event listeners
        setupEventListeners(ordersData);
    }
    
    // Function to update dashboard stats
    function updateDashboardStats(ordersData) {
        // Count new orders
        const newOrders = ordersData.filter(order => order.status === 'new').length;
        document.getElementById('new-orders-count').textContent = newOrders;
        
        // Count processing orders
        const processingOrders = ordersData.filter(order => order.status === 'processing').length;
        document.getElementById('processing-count').textContent = processingOrders;
        
        // Calculate daily revenue (assuming today's date)
        const today = new Date().toISOString().split('T')[0];
        const dailyRevenue = ordersData
            .filter(order => order.date === today && order.status !== 'cancelled')
            .reduce((sum, order) => sum + order.total, 0);
        document.getElementById('daily-revenue').textContent = `${dailyRevenue} MAD`;
        
        // Count total orders
        document.getElementById('total-orders').textContent = ordersData.length;
    }
    
    // Function to load orders table
    function loadOrdersTable(ordersData) {
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = '';
        
        ordersData.forEach(order => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(order.date);
            const formattedDate = date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Get product names
            const products = order.items.map(item => item.name).join(', ');
            
            // Create status badge class
            const statusClass = `status-${order.status}`;
            
            // Create status text
            let statusText;
            switch(order.status) {
                case 'new': statusText = 'Nouvelle'; break;
                case 'processing': statusText = 'En traitement'; break;
                case 'shipped': statusText = 'Expédiée'; break;
                case 'delivered': statusText = 'Livrée'; break;
                case 'cancelled': statusText = 'Annulée'; break;
                default: statusText = order.status;
            }
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${formattedDate}</td>
                <td>${order.customer.name}</td>
                <td>${products}</td>
                <td>${order.total} MAD</td>
                <td><span class="order-status ${statusClass}">${statusText}</span></td>
                <td class="order-actions">
                    <button class="btn-view" data-id="${order.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn-edit" data-id="${order.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" data-id="${order.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            ordersList.appendChild(row);
        });
    }
    
    // Function to set up event listeners
    function setupEventListeners(ordersData) {
        // View order buttons
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                const order = ordersData.find(o => o.id === orderId);
                if (order) {
                    showOrderModal(order);
                }
            });
        });
        
        // Edit order buttons
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                const order = ordersData.find(o => o.id === orderId);
                if (order) {
                    showOrderModal(order, true);
                }
            });
        });
        
        // Delete order buttons
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                if (confirm(`Êtes-vous sûr de vouloir supprimer la commande ${orderId}?`)) {
                    // Remove from the array
                    const index = ordersData.findIndex(o => o.id === orderId);
                    if (index !== -1) {
                        ordersData.splice(index, 1);
                        // Update both server and localStorage
                        try {
                            // Get current data first
                            getOrdersFromServer().then(data => {
                                // Update orders array
                                data.orders = ordersData;
                                
                                // Update server
                                fetch(`${API_URL}/${BIN_ID}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Master-Key': API_KEY
                                },
                                body: JSON.stringify(data)
                            });
                            });
                        } catch (error) {
                            console.error('Error updating server:', error);
                        }
                        
                        // Update localStorage as backup
                        localStorage.setItem('orders', JSON.stringify(ordersData));
                        updateDashboardStats(ordersData);
                        loadOrdersTable(ordersData);
                        setupEventListeners(ordersData);
                    }
                }
            });
        });
        
        // Close modal button
        document.querySelector('.close-modal').addEventListener('click', function() {
            document.getElementById('order-modal').classList.remove('active');
        });
        
        // Click outside modal to close
        document.getElementById('order-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
        
        // Update status select
        document.getElementById('update-status').addEventListener('change', function() {
            const status = this.value;
            if (!status) return;
            
            const orderId = document.getElementById('modal-order-id').textContent;
            const order = ordersData.find(o => o.id === orderId);
            
            if (order) {
                order.status = status;
                // Update both server and localStorage
                try {
                    // Get current data first
                    getOrdersFromServer().then(data => {
                        // Update orders array
                        data.orders = ordersData;
                        
                        // Update server
                        fetch(`${API_URL}/${BIN_ID}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Master-Key': API_KEY
                        },
                        body: JSON.stringify(data)
                    });
                    });
                } catch (error) {
                    console.error('Error updating server:', error);
                }
                
                // Update localStorage as backup
                localStorage.setItem('orders', JSON.stringify(ordersData));
                updateDashboardStats(ordersData);
                loadOrdersTable(ordersData);
                setupEventListeners(ordersData);
                
                // Update status in modal
                let statusText;
                switch(status) {
                    case 'new': statusText = 'Nouvelle'; break;
                    case 'processing': statusText = 'En traitement'; break;
                    case 'shipped': statusText = 'Expédiée'; break;
                    case 'delivered': statusText = 'Livrée'; break;
                    case 'cancelled': statusText = 'Annulée'; break;
                    default: statusText = status;
                }
                
                document.getElementById('modal-order-status').textContent = statusText;
                
                // Reset select
                this.value = '';
            }
        });
        
        // Print button
        document.querySelector('.btn-print').addEventListener('click', function() {
            window.print();
        });
        
        // Search functionality
        document.getElementById('order-search').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm === '') {
                loadOrdersTable(ordersData);
                setupEventListeners(ordersData);
                return;
            }
            
            const filteredOrders = ordersData.filter(order => 
                order.id.toLowerCase().includes(searchTerm) ||
                order.customer.name.toLowerCase().includes(searchTerm) ||
                order.items.some(item => item.name.toLowerCase().includes(searchTerm))
            );
            
            loadOrdersTable(filteredOrders);
            setupEventListeners(ordersData);
        });
        
        // Status filter
        document.getElementById('status-filter').addEventListener('change', function() {
            const status = this.value;
            
            if (status === 'all') {
                loadOrdersTable(ordersData);
                setupEventListeners(ordersData);
                return;
            }
            
            const filteredOrders = ordersData.filter(order => order.status === status);
            
            loadOrdersTable(filteredOrders);
            setupEventListeners(ordersData);
        });
        
        // Date filter
        document.getElementById('date-filter').addEventListener('change', function() {
            const filter = this.value;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            let filteredOrders;
            
            switch(filter) {
                case 'today':
                    const todayStr = today.toISOString().split('T')[0];
                    filteredOrders = ordersData.filter(order => order.date === todayStr);
                    break;
                    
                case 'week':
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    filteredOrders = ordersData.filter(order => {
                        const orderDate = new Date(order.date);
                        return orderDate >= weekStart;
                    });
                    break;
                    
                case 'month':
                    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    filteredOrders = ordersData.filter(order => {
                        const orderDate = new Date(order.date);
                        return orderDate >= monthStart;
                    });
                    break;
                    
                default:
                    filteredOrders = ordersData;
            }
            
            loadOrdersTable(filteredOrders);
            setupEventListeners(ordersData);
        });
    }
    
    // Function to show order modal
    function showOrderModal(order, isEdit = false) {
        const modal = document.getElementById('order-modal');
        
        // Set order details
        document.getElementById('modal-order-id').textContent = order.id;
        
        // Format date
        const date = new Date(order.date);
        const formattedDate = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('modal-order-date').textContent = formattedDate;
        
        // Set status
        let statusText;
        switch(order.status) {
            case 'new': statusText = 'Nouvelle'; break;
            case 'processing': statusText = 'En traitement'; break;
            case 'shipped': statusText = 'Expédiée'; break;
            case 'delivered': statusText = 'Livrée'; break;
            case 'cancelled': statusText = 'Annulée'; break;
            default: statusText = order.status;
        }
        document.getElementById('modal-order-status').textContent = statusText;
        
        // Set payment method
        let paymentText;
        switch(order.payment) {
            case 'cod': paymentText = 'Paiement à la livraison'; break;
            default: paymentText = order.payment;
        }
        document.getElementById('modal-payment-method').textContent = paymentText;
        
        // Set customer info
        document.getElementById('modal-customer-name').textContent = order.customer.name;
        document.getElementById('modal-customer-phone').textContent = order.customer.phone;
        document.getElementById('modal-customer-city').textContent = order.customer.city;
        
        // Set order items
        const itemsList = document.getElementById('modal-items');
        itemsList.innerHTML = '';
        
        order.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.color}</td>
                <td>${item.price} MAD</td>
                <td>${item.quantity}</td>
                <td>${item.total} MAD</td>
            `;
            itemsList.appendChild(row);
        });
        
        // Set totals
        document.getElementById('modal-subtotal').textContent = `${order.subtotal} MAD`;
        document.getElementById('modal-total').textContent = `${order.total} MAD`;
        
        // Show modal
        modal.classList.add('active');
    }
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
            // In a real application, you would send a request to log out
            // For this demo, we'll just redirect to the login page
            window.location.href = '../index.html';
        }
    });
});