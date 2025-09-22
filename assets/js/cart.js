// Espera a que el DOM esté completamente cargado antes de inicializar el carrito
window.addEventListener('DOMContentLoaded', () => {
    const tabla = document.querySelector('#tablaCarrito tbody');
    const totalCarrito = document.getElementById('totalCarrito');
    const btnPagar = document.getElementById('btnPagar');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    /**
     * Actualiza el contador del carrito en el navbar
     * Muestra la cantidad total de items en el carrito
     */
    function actualizarContadorCarrito() {
        const carritoCounters = document.querySelectorAll('.badge.bg-danger');
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        
        carritoCounters.forEach(counter => {
            counter.textContent = totalItems;
            // Mostrar u ocultar el contador según si hay items
            if (totalItems > 0) {
                counter.classList.remove('d-none');
            } else {
                counter.classList.add('d-none');
            }
        });
    }

    /**
     * Renderiza los productos del carrito en la tabla
     * - Calcula subtotales por producto
     * - Actualiza el total general
     * - Genera los botones de control para cada producto
     */
    function renderCarrito() {
        tabla.innerHTML = '';
        let total = 0;
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            tabla.innerHTML += `
                <tr>
                    <td>${item.nombre}</td>
                    <td>$${item.precio}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="modificarCantidad(${item.id}, -1)">-</button>
                        <span class="mx-2">${item.cantidad}</span>
                        <button class="btn btn-sm btn-secondary" onclick="modificarCantidad(${item.id}, 1)">+</button>
                    </td>
                    <td>$${subtotal}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})">Eliminar</button></td>
                </tr>
            `;
        });
        totalCarrito.textContent = `Total: $${total}`;
        actualizarContadorCarrito();
    }

	window.modificarCantidad = function(id, cambio) {
		const item = carrito.find(p => p.id === id);
		if (!item) return;
		item.cantidad += cambio;
		if (item.cantidad < 1) item.cantidad = 1;
		localStorage.setItem('carrito', JSON.stringify(carrito));
		renderCarrito();
	}

	window.eliminarDelCarrito = function(id) {
		carrito = carrito.filter(p => p.id !== id);
		localStorage.setItem('carrito', JSON.stringify(carrito));
		renderCarrito();
	}

	btnPagar.addEventListener('click', () => {
		alert('¡Pago simulado! Gracias por tu compra.');
		carrito = [];
		localStorage.setItem('carrito', JSON.stringify(carrito));
		renderCarrito();
	});

	renderCarrito();
});
