// Funciones de validación y seguridad
const security = {
    // Validar formato de correo electrónico
    validateEmail: (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!emailRegex.test(email)) {
            throw new Error('El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com');
        }
        if (email.length > 100) {
            throw new Error('El correo no puede superar los 100 caracteres');
        }
        return true;
    },

    // Validar RUT chileno
    validateRut: (rut) => {
        if (!/^[0-9]{7,8}[0-9K]$/.test(rut)) {
            throw new Error('El RUT debe tener entre 7 y 8 dígitos más dígito verificador');
        }
        return true;
    },

    // Validar contraseña
    validatePassword: (password) => {
        if (password.length < 4 || password.length > 10) {
            throw new Error('La contraseña debe tener entre 4 y 10 caracteres');
        }
        return true;
    },

    // Sanitizar entrada de texto
    sanitizeInput: (input) => {
        return input.replace(/[<>]/g, '');
    },

    // Validar archivo de imagen
    validateImage: (file) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Solo se permiten imágenes JPG, PNG y WebP');
        }
        if (file.size > maxSize) {
            throw new Error('La imagen no puede superar los 5MB');
        }
        return true;
    }
};

// Sistema de notificaciones mejorado
const notifications = {
    container: null,

    init() {
        this.container = document.createElement('div');
        this.container.id = 'notifications-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(this.container);
    },

    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            background: white;
            border-left: 4px solid ${this.getColor(type)};
            padding: 1rem;
            margin-bottom: 0.5rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;
        toast.innerHTML = `
            <div class="toast-header">
                <strong>${this.getTitle(type)}</strong>
                <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
            <div class="toast-body">${message}</div>
        `;
        this.container.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    },

    getColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    },

    getTitle(type) {
        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || titles.info;
    }
};

// Sistema de caché de imágenes
const imageCache = {
    async init() {
        if ('caches' in window) {
            const cache = await caches.open('image-cache');
            return cache;
        }
        return null;
    },

    async store(url, response) {
        const cache = await this.init();
        if (cache) {
            await cache.put(url, response);
        }
    },

    async get(url) {
        const cache = await this.init();
        if (cache) {
            return await cache.match(url);
        }
        return null;
    }
};

// Sistema de paginación y filtros
class ProductList {
    constructor(containerId, itemsPerPage = 12) {
        this.container = document.getElementById(containerId);
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.filters = {
            category: '',
            minPrice: null,
            maxPrice: null,
            search: ''
        };
    }

    async init() {
        this.products = JSON.parse(localStorage.getItem('productos') || '[]');
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
        this.render();
        this.renderPagination();
        this.setupFilters();
    }

    applyFilters() {
        return this.products.filter(product => {
            const matchesCategory = !this.filters.category || product.category === this.filters.category;
            const matchesPrice = (!this.filters.minPrice || product.price >= this.filters.minPrice) &&
                               (!this.filters.maxPrice || product.price <= this.filters.maxPrice);
            const matchesSearch = !this.filters.search || 
                                product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                                product.description.toLowerCase().includes(this.filters.search.toLowerCase());
            return matchesCategory && matchesPrice && matchesSearch;
        });
    }

    render() {
        const filteredProducts = this.applyFilters();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageProducts = filteredProducts.slice(start, end);

        this.container.innerHTML = pageProducts.map(product => `
            <div class="col-md-4 mb-4">
                <div class="card producto-card">
                    <img src="${product.imagen}" class="card-img-top" alt="${product.nombre}" 
                         loading="lazy" onload="this.style.opacity='1'">
                    <div class="card-body">
                        <h5 class="card-title">${product.nombre}</h5>
                        <p class="card-text">${product.descripcion}</p>
                        <p class="precio">$${product.precio}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderPagination() {
        const pagination = document.createElement('div');
        pagination.className = 'pagination justify-content-center mt-4';
        pagination.innerHTML = `
            <button class="btn btn-outline-primary mx-1" 
                    ${this.currentPage === 1 ? 'disabled' : ''}
                    onclick="productList.goToPage(${this.currentPage - 1})">
                Anterior
            </button>
            <span class="mx-3">Página ${this.currentPage} de ${this.totalPages}</span>
            <button class="btn btn-outline-primary mx-1"
                    ${this.currentPage === this.totalPages ? 'disabled' : ''}
                    onclick="productList.goToPage(${this.currentPage + 1})">
                Siguiente
            </button>
        `;
        this.container.after(pagination);
    }

    setupFilters() {
        // Implementar los filtros aquí
        const filterForm = document.createElement('form');
        filterForm.className = 'mb-4';
        filterForm.innerHTML = `
            <div class="row g-3">
                <div class="col-md-3">
                    <select class="form-select" id="categoryFilter">
                        <option value="">Todas las categorías</option>
                        ${this.getUniqueCategories().map(cat => 
                            `<option value="${cat}">${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control" id="minPrice" 
                           placeholder="Precio mínimo">
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control" id="maxPrice" 
                           placeholder="Precio máximo">
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control" id="searchInput" 
                           placeholder="Buscar productos">
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-primary w-100" 
                            onclick="productList.updateFilters()">
                        Aplicar filtros
                    </button>
                </div>
            </div>
        `;
        this.container.before(filterForm);
    }

    getUniqueCategories() {
        return [...new Set(this.products.map(p => p.category))];
    }

    updateFilters() {
        this.filters = {
            category: document.getElementById('categoryFilter').value,
            minPrice: document.getElementById('minPrice').value || null,
            maxPrice: document.getElementById('maxPrice').value || null,
            search: document.getElementById('searchInput').value
        };
        this.currentPage = 1;
        this.render();
        this.renderPagination();
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.render();
            this.renderPagination();
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }
}

// Inicializar sistemas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    notifications.init();
    
    // Inicializar paginación si estamos en la página de productos
    const productContainer = document.getElementById('listaProductos');
    if (productContainer) {
        window.productList = new ProductList('listaProductos');
        productList.init();
    }
});