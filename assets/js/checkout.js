// Manejo del proceso de checkout y persistencia del carrito
class CheckoutManager {
    constructor() {
        this.initializeCart();
        this.setupEventListeners();
    }

    initializeCart() {
        // Recuperar carrito de sessionStorage o crear uno nuevo
        this.cart = JSON.parse(sessionStorage.getItem('cart')) || {
            items: [],
            subtotal: 0,
            discount: 0,
            total: 0
        };
        this.updateCartDisplay();
    }

    setupEventListeners() {
        // Escuchar cambios en el carrito
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.initializeCart();
            }
        });

        // Botón de pagar
        const checkoutButton = document.getElementById('btnPagar');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.startCheckout());
        }

        // Aplicar cupón
        const applyCouponButton = document.getElementById('btnAplicarCupon');
        if (applyCouponButton) {
            applyCouponButton.addEventListener('click', () => this.applyCoupon());
        }
    }

    updateCartDisplay() {
        const cartTable = document.querySelector('#tablaCarrito tbody');
        const totalElement = document.getElementById('totalCarrito');

        if (cartTable) {
            cartTable.innerHTML = this.cart.items.map(item => `
                <tr>
                    <td>
                        <img src="${item.imagen}" alt="${item.nombre}" style="width:50px;height:50px;object-fit:cover">
                        ${item.nombre}
                    </td>
                    <td>$${item.precio}</td>
                    <td>
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" onclick="checkout.updateQuantity(${item.id}, ${item.cantidad - 1})">-</button>
                            <input type="number" class="form-control text-center" value="${item.cantidad}" min="1" onchange="checkout.updateQuantity(${item.id}, this.value)">
                            <button class="btn btn-outline-secondary" onclick="checkout.updateQuantity(${item.id}, ${item.cantidad + 1})">+</button>
                        </div>
                    </td>
                    <td>$${item.precio * item.cantidad}</td>
                    <td>
                        <button class="btn btn-danger" onclick="checkout.removeItem(${item.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        }

        if (totalElement) {
            totalElement.textContent = `Total: $${this.cart.total}`;
        }

        // Actualizar contador del carrito en el header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const itemCount = this.cart.items.reduce((sum, item) => sum + item.cantidad, 0);
            cartCount.textContent = itemCount;
        }
    }

    async updateQuantity(productId, newQuantity) {
        try {
            // Validar stock disponible
            const product = await this.checkStock(productId);
            if (newQuantity > product.stock) {
                notifications.show('No hay suficiente stock disponible', 'error');
                return;
            }

            const item = this.cart.items.find(i => i.id === productId);
            if (item) {
                if (newQuantity < 1) {
                    this.removeItem(productId);
                } else {
                    item.cantidad = parseInt(newQuantity);
                    this.calculateTotals();
                    this.saveCart();
                }
            }
        } catch (error) {
            notifications.show(error.message, 'error');
        }
    }

    removeItem(productId) {
        this.cart.items = this.cart.items.filter(item => item.id !== productId);
        this.calculateTotals();
        this.saveCart();
    }

    calculateTotals() {
        this.cart.subtotal = this.cart.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        this.cart.total = this.cart.subtotal - this.cart.discount;
    }

    saveCart() {
        sessionStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    async checkStock(productId) {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        const product = productos.find(p => p.id === productId);
        
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        return product;
    }

    applyCoupon() {
        const cuponInput = document.getElementById('cupon');
        const cupon = cuponInput.value.trim().toUpperCase();

        // Lista de cupones válidos (en un sistema real, esto estaría en el backend)
        const cupones = {
            'BIENVENIDO10': 10,
            'VERANO20': 20,
            'ESPECIAL30': 30
        };

        if (cupones[cupon]) {
            const descuento = (this.cart.subtotal * cupones[cupon]) / 100;
            this.cart.discount = descuento;
            this.calculateTotals();
            this.saveCart();
            notifications.show(`Cupón aplicado: ${cupones[cupon]}% de descuento`, 'success');
        } else {
            notifications.show('Cupón inválido', 'error');
        }
    }

    async startCheckout() {
        try {
            // Verificar que haya productos en el carrito
            if (this.cart.items.length === 0) {
                throw new Error('El carrito está vacío');
            }

            // Verificar que el usuario esté autenticado
            const currentUser = JSON.parse(localStorage.getItem('usuarioActual'));
            if (!currentUser) {
                window.location.href = 'login.html?redirect=carrito';
                return;
            }

            // Verificar stock de todos los productos
            for (const item of this.cart.items) {
                const product = await this.checkStock(item.id);
                if (item.cantidad > product.stock) {
                    throw new Error(`Stock insuficiente para ${product.nombre}`);
                }
            }

            // Crear la orden
            const orden = {
                id: Date.now(),
                usuario: currentUser.id,
                items: this.cart.items,
                subtotal: this.cart.subtotal,
                discount: this.cart.discount,
                total: this.cart.total,
                fecha: new Date().toISOString(),
                estado: 'pendiente'
            };

            // Guardar la orden
            const ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
            ordenes.push(orden);
            localStorage.setItem('ordenes', JSON.stringify(ordenes));

            // Actualizar stock
            const productos = JSON.parse(localStorage.getItem('productos'));
            this.cart.items.forEach(item => {
                const producto = productos.find(p => p.id === item.id);
                producto.stock -= item.cantidad;
            });
            localStorage.setItem('productos', JSON.stringify(productos));

            // Limpiar carrito
            this.cart = {
                items: [],
                subtotal: 0,
                discount: 0,
                total: 0
            };
            this.saveCart();

            notifications.show('¡Compra realizada con éxito!', 'success');
            setTimeout(() => {
                window.location.href = 'ordenes.html';
            }, 2000);

        } catch (error) {
            notifications.show(error.message, 'error');
        }
    }
}

// Inicializar el checkout cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new CheckoutManager();
});