const API_URL = "http://localhost:8080";

// --- Notification System ---
function showNotification(message, type = 'success') {
    const nav = document.getElementById('notification');
    if (!nav) return;
    nav.textContent = message;
    nav.style.backgroundColor = type === 'success' ? 'var(--success)' : 'var(--danger)';
    nav.style.display = 'block';
    setTimeout(() => {
        nav.style.display = 'none';
    }, 3000);
}

function showLoader(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

// --- API Calls ---
async function fetchData(endpoint) {
    showLoader(true);
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        showNotification('Помилка завантаження даних', 'error');
        return null;
    } finally {
        showLoader(false);
    }
}

async function postData(endpoint, data) {
    showLoader(true);
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Post failed');
        showNotification('Успішно збережено!');
        return await response.json();
    } catch (error) {
        console.error('Post error:', error);
        showNotification('Помилка при збереженні', 'error');
        return null;
    } finally {
        showLoader(false);
    }
}

async function deleteData(endpoint) {
    if (!confirm('Ви впевнені, що хочете видалити цей запис?')) return false;
    showLoader(true);
    try {
        const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Delete failed');
        showNotification('Видалено успішно');
        return true;
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Помилка при видаленні', 'error');
        return false;
    } finally {
        showLoader(false);
    }
}

// --- Shared Components Loader ---
function loadSidebar() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarHTML = `
        <div class="sidebar-header">
            <i class="fas fa-cubes fa-2x"></i>
            <h2>Course Admin</h2>
        </div>
        <ul class="nav-menu">
            <li class="nav-item">
                <a href="index.html" class="nav-link ${currentPath === 'index.html' ? 'active' : ''}">
                    <i class="fas fa-home"></i> <span>Головна</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="users.html" class="nav-link ${currentPath === 'users.html' || currentPath === 'user-details.html' ? 'active' : ''}">
                    <i class="fas fa-users"></i> <span>Користувачі</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="create-user.html" class="nav-link ${currentPath === 'create-user.html' ? 'active' : ''}">
                    <i class="fas fa-user-plus"></i> <span>Новий користувач</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="orders.html" class="nav-link ${currentPath === 'orders.html' || currentPath === 'order-details.html' ? 'active' : ''}">
                    <i class="fas fa-shopping-cart"></i> <span>Замовлення</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="create-order.html" class="nav-link ${currentPath === 'create-order.html' ? 'active' : ''}">
                    <i class="fas fa-cart-plus"></i> <span>Нове замовлення</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="statistics.html" class="nav-link ${currentPath === 'statistics.html' ? 'active' : ''}">
                    <i class="fas fa-chart-bar"></i> <span>Статистика</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="admin.html" class="nav-link ${currentPath === 'admin.html' ? 'active' : ''}">
                    <i class="fas fa-user-shield"></i> <span>Адмін панель</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="about.html" class="nav-link ${currentPath === 'about.html' ? 'active' : ''}">
                    <i class="fas fa-info-circle"></i> <span>Про проєкт</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="contacts.html" class="nav-link ${currentPath === 'contacts.html' ? 'active' : ''}">
                    <i class="fas fa-address-book"></i> <span>Контакти</span>
                </a>
            </li>
        </ul>
        <div class="sidebar-footer">
            <p>© 2026 Admin Panel</p>
        </div>
    `;
    const sidebarElement = document.getElementById('sidebar');
    if (sidebarElement) sidebarElement.innerHTML = sidebarHTML;
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();
});
