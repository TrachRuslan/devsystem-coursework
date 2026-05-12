const API_URL = 'http://localhost:8080';

// Global state for modals
let confirmModalCallback = null;

// UI Components
const renderSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    sidebar.innerHTML = `
        <button class="sidebar-toggle" id="sidebar-close" style="display: none;">
            <i class="fas fa-times"></i>
        </button>
        <div class="logo">
            <i class="fas fa-terminal"></i>
            <span>DevSystem</span>
        </div>
        <nav class="nav-menu">
            <a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}">
                <i class="fas fa-th-large"></i> <span>Панель приладів</span>
            </a>
            <a href="users.html" class="nav-link ${currentPage === 'users.html' || currentPage === 'create-user.html' ? 'active' : ''}">
                <i class="fas fa-user-friends"></i> <span>Користувачі</span>
            </a>
            <a href="products.html" class="nav-link ${currentPage === 'products.html' || currentPage === 'create-product.html' ? 'active' : ''}">
                <i class="fas fa-box"></i> <span>Товари</span>
            </a>
            <a href="orders.html" class="nav-link ${currentPage === 'orders.html' ? 'active' : ''}">
                <i class="fas fa-shopping-cart"></i> <span>Замовлення</span>
            </a>
            <a href="reviews.html" class="nav-link ${currentPage === 'reviews.html' ? 'active' : ''}">
                <i class="fas fa-comment-dots"></i> <span>Відгуки</span>
            </a>
            <a href="statistics.html" class="nav-link ${currentPage === 'statistics.html' ? 'active' : ''}">
                <i class="fas fa-chart-pie"></i> <span>Статистика</span>
            </a>
            <a href="admin.html" class="nav-link ${currentPage === 'admin.html' ? 'active' : ''}">
                <i class="fas fa-shield-alt"></i> <span>Адмін панель</span>
            </a>
            <div style="margin: 1.5rem 0.5rem 0.5rem; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Інше</div>
            <a href="about.html" class="nav-link ${currentPage === 'about.html' ? 'active' : ''}">
                <i class="fas fa-info-circle"></i> <span>Про проект</span>
            </a>
            <a href="contacts.html" class="nav-link ${currentPage === 'contacts.html' ? 'active' : ''}">
                <i class="fas fa-paper-plane"></i> <span>Контакти</span>
            </a>
        </nav>
    `;

    // Add Mobile Toggle Button if not exists
    if (!document.getElementById('mobile-toggle')) {
        const toggle = document.createElement('button');
        toggle.id = 'mobile-toggle';
        toggle.className = 'sidebar-toggle';
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(toggle);
        
        toggle.onclick = () => sidebar.classList.toggle('show');
    }
};

// Notification helper
const showNotification = (message, type = 'success') => {
    let notif = document.getElementById('notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'notification';
        document.body.appendChild(notif);
    }
    
    notif.className = type;
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-times-circle' : 'fa-info-circle');
    notif.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    notif.classList.add('show');
    
    setTimeout(() => {
        notif.classList.remove('show');
    }, 3500);
};

// Loader helper
const showLoader = () => {
    const loader = document.createElement('div');
    loader.className = 'loader-container';
    loader.id = 'global-loader';
    loader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loader);
};

const hideLoader = () => {
    const loader = document.getElementById('global-loader');
    if (loader) loader.remove();
};

// Confirmation Modal
const showConfirm = (message, callback) => {
    let overlay = document.getElementById('modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <h3 class="card-title" style="margin-bottom: 1rem;">Підтвердження</h3>
                <p id="confirm-message" style="margin-bottom: 2rem; color: var(--text-muted);"></p>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button class="btn btn-outline" id="confirm-cancel">Скасувати</button>
                    <button class="btn btn-primary" id="confirm-ok" style="background: var(--danger);">Видалити</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('confirm-cancel').onclick = () => overlay.classList.remove('show');
    }
    
    document.getElementById('confirm-message').innerText = message;
    confirmModalCallback = callback;
    
    document.getElementById('confirm-ok').onclick = () => {
        overlay.classList.remove('show');
        if (confirmModalCallback) confirmModalCallback();
    };
    
    setTimeout(() => overlay.classList.add('show'), 10);
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

// Search and Filter
const initSearch = (inputId, tableId) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('keyup', () => {
        const filter = input.value.toLowerCase();
        const rows = document.querySelectorAll(`#${tableId} tr`);
        
        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    });
};

// Empty State helper
const checkEmpty = (containerId, itemCount, message = "Даних не знайдено") => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (itemCount === 0) {
        container.innerHTML = `
            <div class="empty-state animate">
                <i class="fas fa-folder-open"></i>
                <p>${message}</p>
            </div>
        `;
    }
};

// Users
const loadUsers = async () => {
    const tableBody = document.getElementById('users-table');
    if (!tableBody) return;
    
    showLoader();
    const users = await fetchData('/users');
    hideLoader();
    
    if (!users || users.length === 0) {
        checkEmpty('users-container', 0, 'Користувачів поки немає');
        return;
    }

    tableBody.innerHTML = users.map(user => `
        <tr class="animate">
            <td><strong>#${user.id}</strong></td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;">
                        ${user.name.charAt(0)}
                    </div>
                    ${user.name}
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.phoneNumber || '<span style="opacity: 0.5;">не вказано</span>'}</td>
            <td><span class="badge badge-new">${user.age} р.</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <a href="user-details.html?id=${user.id}" class="btn btn-outline btn-sm" title="Деталі">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})" title="Видалити">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
};

const deleteUser = (id) => {
    showConfirm('Ви впевнені, що хочете видалити цього користувача?', async () => {
        try {
            showLoader();
            const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
            hideLoader();
            if (response.ok) {
                showNotification('Користувача успішно видалено');
                loadUsers();
            } else {
                showNotification('Помилка при видаленні', 'error');
            }
        } catch (error) {
            hideLoader();
            showNotification('Помилка мережі', 'error');
        }
    });
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

    showLoader();
    let products = await fetchData('/products');
    hideLoader();
    
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
        <div class="card product-card animate" style="padding: 0; overflow: hidden;">
            <div style="height: 180px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--primary);">
                <i class="fas ${p.id % 2 === 0 ? 'fa-laptop' : 'fa-mobile-alt'}"></i>
            </div>
            <div style="padding: 1.5rem;">
                <span class="badge" style="background: var(--primary-light); color: var(--primary);">${p.category || 'Товар'}</span>
                <h3 class="card-title" style="margin-top: 0.5rem; font-size: 1.1rem;">${p.title}</h3>
                <div style="font-size: 1.25rem; font-weight: 800; color: white; margin: 1rem 0;">${p.price} ₴</div>
                <button class="btn btn-primary" style="width: 100%;" onclick="showNotification('Додано до кошика')">
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

    showLoader();
    const users = await fetchData('/users');
    if (!users) { hideLoader(); return; }

    let allOrders = [];
    for (const user of users) {
        const orders = await fetchData(`/orders/${user.id}`);
        if (orders) {
            orders.forEach(o => o.userName = user.name);
            allOrders = [...allOrders, ...orders];
        }
    }
    hideLoader();

    if (allOrders.length === 0) {
        checkEmpty('orders-list', 0, 'Замовлень поки немає');
        return;
    }

    container.innerHTML = `
        <div class="table-container">
            <table id="orders-table-el">
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
                        <tr class="animate">
                            <td><strong>#${o.id}</strong></td>
                            <td>${o.userName}</td>
                            <td>${o.title}</td>
                            <td><strong>${o.price} ₴</strong></td>
                            <td><span class="badge badge-new" style="background: rgba(99, 102, 241, 0.1); color: var(--primary);">Обробка</span></td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="deleteOrder(${o.id})" title="Видалити">
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

const deleteOrder = (id) => {
    showConfirm('Видалити це замовлення?', async () => {
        try {
            showLoader();
            const response = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
            hideLoader();
            if (response.ok) {
                showNotification('Замовлення видалено');
                loadAllOrders();
            }
        } catch (error) {
            hideLoader();
            showNotification('Помилка видалення', 'error');
        }
    });
};

// Stats
const updateDashboardStats = async () => {
    const users = await fetchData('/users');
    if (users) {
        const usersCount = document.getElementById('stat-users-count');
        if (usersCount) animateValue('stat-users-count', 0, users.length, 1500);
        
        // Orders calculation
        let allOrders = [];
        for (const user of users) {
            const orders = await fetchData(`/orders/${user.id}`);
            if (orders) allOrders = [...allOrders, ...orders];
        }
        
        const ordersCount = document.getElementById('stat-orders-count');
        if (ordersCount) animateValue('stat-orders-count', 0, allOrders.length, 1500);
        
        const revenue = document.getElementById('stat-revenue');
        if (revenue) {
            const total = allOrders.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0);
            revenue.textContent = total.toLocaleString() + ' ₴';
        }
    }
};

// Reviews
const loadReviews = async () => {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    // Simulated reviews for coursework
    const reviews = [
        { id: 1, user: 'Олександр П.', rating: 5, text: 'Чудова система! Дуже зручний інтерфейс.', date: '2026-05-10' },
        { id: 2, user: 'Марина К.', rating: 4, text: 'Все працює швидко, але хотілося б більше графіків.', date: '2026-05-12' },
        { id: 3, user: 'Ігор В.', rating: 5, text: 'Найкраща розробка для курсової роботи.', date: '2026-05-13' }
    ];

    container.innerHTML = reviews.map(r => `
        <div class="card animate">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                    <h3 class="card-title" style="margin-bottom: 0.25rem;">${r.user}</h3>
                    <div class="stars">
                        ${'<i class="fas fa-star"></i>'.repeat(r.rating)}${'<i class="far fa-star"></i>'.repeat(5-r.rating)}
                    </div>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${r.date}</span>
            </div>
            <p style="color: var(--text-muted); font-style: italic;">"${r.text}"</p>
        </div>
    `).join('');
};

// Statistics Chart
const initStatsChart = async () => {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;

    const users = await fetchData('/users') || [];
    const labels = users.length > 0 ? users.slice(0, 7).map(u => u.name) : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    const data = users.length > 0 ? users.slice(0, 7).map(() => Math.floor(Math.random() * 50) + 10) : [12, 19, 3, 5, 2, 3, 10];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Активність користувачів',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#6366f1',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
};

const animateValue = (id, start, end, duration) => {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.innerHTML = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const initDashboardChart = async () => {
    const ctx = document.getElementById('dashboardMainChart');
    if (!ctx) return;

    const users = await fetchData('/users') || [];
    const labels = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип'];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Замовлення',
                    data: [45, 59, 80, 81, 56, 55, 40],
                    backgroundColor: '#6366f1',
                    borderRadius: 8,
                },
                {
                    label: 'Прибуток (тис.)',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    backgroundColor: '#a855f7',
                    borderRadius: 8,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#94a3b8', font: { family: 'Inter' } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    if (page === 'users.html') {
        loadUsers();
        initSearch('search-users', 'users-table');
    }
    if (page === 'products.html') loadProducts();
    if (page === 'orders.html') {
        loadAllOrders();
        initSearch('search-orders', 'orders-table-el');
    }
    if (page === 'reviews.html') loadReviews();
    if (page === 'statistics.html') initStatsChart();
    if (page === 'index.html' || page === '') {
        updateDashboardStats();
        initDashboardChart();
    }
    
    // Forms
    const userForm = document.getElementById('create-user-form');
    if (userForm) userForm.addEventListener('submit', createUser);
});
