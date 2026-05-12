const API_URL = 'http://localhost:8080';

// Centralized Navigation and Sidebar
const renderSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    sidebar.innerHTML = `
        <div class="logo">
            <i class="fas fa-cubes"></i>
            <span>DevSystem</span>
        </div>
        <nav class="nav-menu">
            <a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}">
                <i class="fas fa-home"></i> <span>Головна</span>
            </a>
            <a href="users.html" class="nav-link ${currentPage === 'users.html' || currentPage === 'create-user.html' ? 'active' : ''}">
                <i class="fas fa-users"></i> <span>Користувачі</span>
            </a>
            <a href="products.html" class="nav-link ${currentPage === 'products.html' || currentPage === 'create-product.html' ? 'active' : ''}">
                <i class="fas fa-shopping-bag"></i> <span>Товари</span>
            </a>
            <a href="orders.html" class="nav-link ${currentPage === 'orders.html' ? 'active' : ''}">
                <i class="fas fa-shopping-cart"></i> <span>Замовлення</span>
            </a>
            <a href="reviews.html" class="nav-link ${currentPage === 'reviews.html' ? 'active' : ''}">
                <i class="fas fa-star"></i> <span>Відгуки</span>
            </a>
            <a href="statistics.html" class="nav-link ${currentPage === 'statistics.html' ? 'active' : ''}">
                <i class="fas fa-chart-line"></i> <span>Статистика</span>
            </a>
            <a href="admin.html" class="nav-link ${currentPage === 'admin.html' ? 'active' : ''}">
                <i class="fas fa-user-shield"></i> <span>Адмін панель</span>
            </a>
            <hr style="margin: 1rem 0; opacity: 0.1;">
            <a href="about.html" class="nav-link ${currentPage === 'about.html' ? 'active' : ''}">
                <i class="fas fa-info-circle"></i> <span>Про проект</span>
            </a>
            <a href="contacts.html" class="nav-link ${currentPage === 'contacts.html' ? 'active' : ''}">
                <i class="fas fa-envelope"></i> <span>Контакти</span>
            </a>
        </nav>
    `;
};

// Notification helper
const showNotification = (message, type = 'success') => {
    const notif = document.getElementById('notification');
    if (!notif) return;
    
    notif.className = type;
    notif.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    notif.classList.add('show');
    
    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
};

// API Functions
const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error('Помилка завантаження даних');
        return await response.json();
    } catch (error) {
        console.error(error);
        showNotification(error.message, 'error');
        return null;
    }
};

// Users
const loadUsers = async () => {
    const tableBody = document.getElementById('users-table');
    if (!tableBody) return;
    
    const users = await fetchData('/users');
    if (!users) return;

    tableBody.innerHTML = users.map(user => `
        <tr class="animate">
            <td><strong>#${user.id}</strong></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber || '-'}</td>
            <td><span class="badge badge-new">${user.age} р.</span></td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <a href="user-details.html?id=${user.id}" class="btn btn-outline btn-sm">
                    <i class="fas fa-eye"></i>
                </a>
            </td>
        </tr>
    `).join('');
};

const deleteUser = async (id) => {
    if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) return;
    try {
        const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showNotification('Користувача видалено');
            loadUsers();
        }
    } catch (error) {
        showNotification('Помилка видалення', 'error');
    }
};

const createUser = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showNotification('Користувача успішно створено');
            event.target.reset();
            setTimeout(() => window.location.href = 'users.html', 1500);
        }
    } catch (error) {
        showNotification('Помилка при створенні', 'error');
    }
};

// Products (Mock logic if backend missing, else API)
const loadProducts = async () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    let products = await fetchData('/products');
    
    // Demo data if API fails or empty
    if (!products || products.length === 0) {
        products = [
            { id: 1, title: 'Laptop Pro 16', price: 45000, category: 'Електроніка' },
            { id: 2, title: 'Smartphone X', price: 28000, category: 'Електроніка' },
            { id: 3, title: 'Wireless Headphones', price: 3500, category: 'Аксесуари' },
            { id: 4, title: 'Mechanical Keyboard', price: 4200, category: 'Аксесуари' }
        ];
    }

    grid.innerHTML = products.map(p => `
        <div class="card product-card animate">
            <div class="product-img">
                <i class="fas ${p.id % 2 === 0 ? 'fa-laptop' : 'fa-mobile-alt'}"></i>
            </div>
            <div class="product-content">
                <span class="badge badge-pending">${p.category || 'Товар'}</span>
                <h3 class="card-title" style="margin-top: 0.5rem;">${p.title}</h3>
                <div class="product-price">${p.price} ₴</div>
                <button class="btn btn-primary" style="width: 100%;" onclick="showNotification('Товар додано до кошика (демо)')">
                    <i class="fas fa-cart-plus"></i> Купити
                </button>
            </div>
        </div>
    `).join('');
};

// Orders
const loadAllOrders = async () => {
    const container = document.getElementById('orders-list');
    if (!container) return;

    // In a real app we might need a Global Orders endpoint or fetch for each user
    // For demo/coursework we'll simulate or use /orders if exists
    const users = await fetchData('/users');
    if (!users) return;

    let allOrders = [];
    for (const user of users) {
        const orders = await fetchData(`/orders/${user.id}`);
        if (orders) {
            orders.forEach(o => o.userName = user.name);
            allOrders = [...allOrders, ...orders];
        }
    }

    if (allOrders.length === 0) {
        container.innerHTML = '<div class="card"><p>Замовлень поки немає.</p></div>';
        return;
    }

    container.innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Клієнт</th>
                        <th>Товар/Опис</th>
                        <th>Ціна</th>
                        <th>Статус</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    ${allOrders.map(o => `
                        <tr>
                            <td>#${o.id}</td>
                            <td>${o.userName}</td>
                            <td>${o.title}</td>
                            <td><strong>${o.price} ₴</strong></td>
                            <td><span class="badge badge-new">В процесі</span></td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="deleteOrder(${o.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
};

const deleteOrder = async (id) => {
    if (!confirm('Видалити замовлення?')) return;
    try {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
        showNotification('Замовлення видалено');
        loadAllOrders();
    } catch (e) {
        showNotification('Помилка', 'error');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    
    // Routing for data loading
    const path = window.location.pathname;
    if (path.includes('users.html')) loadUsers();
    if (path.includes('products.html')) loadProducts();
    if (path.includes('orders.html')) loadAllOrders();
    
    // Forms
    const userForm = document.getElementById('create-user-form');
    if (userForm) userForm.addEventListener('submit', createUser);
    
    const productForm = document.getElementById('create-product-form');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Товар успішно додано (симуляція)');
            productForm.reset();
        });
    }

    // Index page stats
    if (path.includes('index.html') || path.endsWith('/')) {
        updateDashboardStats();
    }
});

async function updateDashboardStats() {
    const users = await fetchData('/users');
    if (users) {
        document.getElementById('stat-users-count').textContent = users.length;
        // Simple mock for others
        document.getElementById('stat-orders-count').textContent = '12';
        document.getElementById('stat-revenue').textContent = '154,200 ₴';
    }
}
