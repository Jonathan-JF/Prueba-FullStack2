// ---------- Datos de productos (puedes editarlos) ----------
const productos = [
	{
		id: 1,
		nombre: "Fanta",
		precio: 2500,
		imagen: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=2003&auto=format&fit=crop&ixlib=rb-4.1.0",
		destacado: true,
		descripcion: "Bebida gaseosa sabor naranja, refrescante y perfecta para cualquier ocasión.",
		subtitulo: "Sabor naranja clásico"
	},
	{
		id: 2,
		nombre: "Coca-Cola",
		precio: 4500,
		imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
		destacado: true,
		descripcion: "La clásica bebida cola, ideal para acompañar tus comidas y reuniones.",
		subtitulo: "Clasico mundial"
	},
	{
		id: 3,
		nombre: "Pepsi Cero",
		precio: 6000,
		imagen: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
		destacado: false,
		descripcion: "Pepsi sin azúcar, el sabor de siempre con menos calorías."
	},
	{
		id: 4,
		nombre: "Monster",
		precio: 12000,
		imagen: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
		destacado: false,
		descripcion: "Energizante potente para mantenerte activo durante todo el día."
	},
	{
		id: 5,
		nombre: "Score",
		precio: 8500,
		imagen: "https://scoreenergydrink.com/cdn/shop/files/SCOREGORILLA500ML_9e93e49e-5f8c-43b1-a992-108f18bec960.jpg?v=1734648539&width=2048",
		destacado: false,
		descripcion: "Bebida energética con sabor intenso y efecto prolongado."
	}
];

// Formateador de precios (CLP)
const formatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

// ---------- Funciones de carrito y UI ----------

// Mostrar modal bootstrap cuando se añade un producto
function mostrarModalCarrito(nombre) {
	let modal = document.getElementById('modalCarrito');
	if (!modal) {
		modal = document.createElement('div');
		modal.id = 'modalCarrito';
		modal.className = 'modal fade';
		modal.tabIndex = -1;
		modal.innerHTML = `
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Producto añadido</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
				</div>
				<div class="modal-body">
					<p id="modalCarritoTexto"></p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
				</div>
			</div>
		</div>`;
		document.body.appendChild(modal);
	}
	document.getElementById('modalCarritoTexto').textContent = `Se añadió "${nombre}" al carrito.`;
	const modalBootstrap = new bootstrap.Modal(modal);
	modalBootstrap.show();
}

// Actualizar contador del carrito (badges)
function actualizarContadorCarrito(carrito) {
    const totalItems = carrito.reduce((total, item) => total + (item.cantidad || 0), 0);
    const carritoCounters = document.querySelectorAll('.badge.bg-danger');
    carritoCounters.forEach(counter => {
        counter.textContent = totalItems;
        if (totalItems > 0) {
            counter.classList.remove('d-none');
        } else {
            counter.classList.add('d-none');
        }
    });
}

// Añadir al carrito (genérica)
function agregarAlCarritoPorId(id, cantidad = 1) {
    let producto = productos.find(p => p.id === id);
    if (!producto) {
        const adminProductos = JSON.parse(localStorage.getItem('admin_productos')) || [];
        producto = adminProductos.find(p => p.id === id);
    }
    if (!producto) return;
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const existe = carrito.find(item => item.id === id);
    if (existe) {
        existe.cantidad = (existe.cantidad || 0) + cantidad;
    } else {
        carrito.push({ ...producto, cantidad: cantidad });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito(carrito);
    mostrarModalCarrito(producto.nombre);
}

// Añadir desde detalle (usa cantidad del input)
function agregarAlCarritoDetalle(id) {
	let cantidad = parseInt(document.getElementById('cantidadDetalle')?.value) || 1;
	agregarAlCarritoPorId(id, cantidad);
}

// ---------- Renderers (destacados, listado, detalle/relacionados) ----------

// Helper: card modernizada (devuelve HTML string)
function cardProductoCompacto(p) {
	return `
	<div class="col-12 col-sm-6 col-md-4 mb-4">
		<article class="card product-card h-100 border-0">
			<div class="position-relative ratio ratio-4x3 overflow-hidden">
				<img src="${p.imagen}" class="card-img-top object-cover" alt="${p.nombre}" loading="lazy">
				<span class="price-badge badge rounded-pill shadow-sm">${formatter.format(p.precio)}</span>
				<button class="btn btn-sm btn-light wishlist-btn" aria-label="Favoritos" data-id="${p.id}">
					<i class="bi bi-heart"></i>
				</button>
			</div>

			<div class="card-body d-flex flex-column">
				<h6 class="card-title mb-1 text-truncate" title="${p.nombre}">${p.nombre}</h6>
				${p.subtitulo ? `<p class="text-muted small mb-2 text-truncate">${p.subtitulo}</p>` : ''}
				<p class="card-text text-muted small mb-2">${p.descripcion ? p.descripcion.substring(0,80) + (p.descripcion.length>80? '…':'') : ''}</p>
				<div class="mt-auto d-flex gap-2">
					<a href="detalle.html?id=${p.id}" class="btn btn-outline-primary btn-sm w-100" aria-label="Ver detalle de ${p.nombre}">
						<i class="bi bi-eye me-1"></i> Ver detalle
					</a>
					<button class="btn btn-primary btn-sm add-cart-btn" data-id="${p.id}" aria-label="Agregar ${p.nombre} al carrito">
						<i class="bi bi-cart-plus me-1"></i> Añadir
					</button>
				</div>
			</div>
		</article>
	</div>
	`;
}

// Renderizar productos destacados en la página principal
document.addEventListener('DOMContentLoaded', () => {
	const contenedor = document.getElementById('productosDestacados');
	if (!contenedor) return;
	const destacados = productos.filter(p => p.destacado);
	contenedor.innerHTML = destacados.map(p => `
		<div class="col-md-4">
			<article class="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
				<div class="position-relative">
					<img src="${p.imagen}" class="card-img-top" alt="${p.nombre}" style="height: 250px; object-fit: cover;">
					<div class="position-absolute top-0 start-0 m-3">
						<span class="badge bg-danger">Destacado</span>
					</div>
				</div>
				<div class="card-body d-flex flex-column p-4">
					<h5 class="card-title fw-bold mb-3">${p.nombre}</h5>
					<p class="card-text text-muted mb-3">${p.descripcion}</p>
					<div class="d-flex justify-content-between align-items-center mt-auto">
						<span class="h5 mb-0 text-primary">${formatter.format(p.precio)}</span>
						<button class="btn btn-primary add-cart-btn" data-id="${p.id}">
							<i class="bi bi-cart-plus"></i> Añadir
						</button>
					</div>
				</div>
			</article>
		</div>
	`).join('');
});

// Renderizar lista completa en productos.html
window.addEventListener('DOMContentLoaded', () => {
	const lista = document.getElementById('listaProductos');
	if (!lista) return;
	// Unir productos de productos.js y los creados en admin
	let adminProductos = JSON.parse(localStorage.getItem('admin_productos')) || [];
	// Evitar duplicados por id
	let todos = [...productos];
	adminProductos.forEach(p => {
		if (!todos.some(x => x.id === p.id)) {
			todos.push({
				id: p.id,
				nombre: p.nombre,
				precio: p.precio,
				imagen: p.imagen || '',
				descripcion: p.descripcion || '',
				destacado: p.destacado || false
			});
		}
	});
	// Usamos la card compacta para listado también
	lista.innerHTML = todos.map(producto => `
		<div class="col-md-4 mb-4">
			<article class="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
				<div class="position-relative">
					<img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 250px; object-fit: cover;">
					${producto.destacado ? '<div class="position-absolute top-0 start-0 m-3"><span class="badge bg-danger">Destacado</span></div>' : ''}
				</div>
				<div class="card-body d-flex flex-column p-4">
					<h5 class="card-title fw-bold mb-3">${producto.nombre}</h5>
					<p class="card-text text-muted mb-4">${producto.descripcion}</p>
					<div class="d-flex justify-content-between align-items-center mb-3">
						<span class="h5 mb-0 text-primary">${formatter.format(producto.precio)}</span>
						<div class="d-flex gap-2">
							<button class="btn btn-primary add-cart-btn" data-id="${producto.id}">
								<i class="bi bi-cart-plus"></i>
							</button>
							<a href="detalle.html?id=${producto.id}" class="btn btn-outline-primary">
								<i class="bi bi-eye"></i>
							</a>
						</div>
					</div>
				</div>
			</article>
		</div>
	`).join('');
});

// Renderizar detalle de producto en detalle.html (incluye relacionados modernizados)
window.addEventListener('DOMContentLoaded', () => {
	const contenedor = document.getElementById('detalleProducto');
	if (!contenedor) return;
	const params = new URLSearchParams(window.location.search);
	const id = parseInt(params.get('id'));
	let producto = productos.find(p => p.id === id);
	if (!producto) {
		// Buscar en productos creados en admin
		const adminProductos = JSON.parse(localStorage.getItem('admin_productos')) || [];
		producto = adminProductos.find(p => p.id === id);
	}
	if (!producto) {
		contenedor.innerHTML = '<p>Producto no encontrado.</p>';
		return;
	}
	// Selector de cantidad
	contenedor.innerHTML = `
		<div class="row align-items-center">
			<div class="col-md-5 text-center">
				<img src="${producto.imagen}" class="img-fluid rounded shadow detalle-img" alt="${producto.nombre}">
			</div>
			<div class="col-md-7">
				<article class="card h-100 detalle-card">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title">${producto.nombre}</h5>
						<p class="card-text">${producto.descripcion}</p>
						<p class="card-text">Precio: ${formatter.format(producto.precio)}</p>
						<p class="card-text">ID: ${producto.id}</p>
						<div class="mb-3">
							<label for="cantidadDetalle" class="form-label">Cantidad</label>
							<input type="number" id="cantidadDetalle" class="form-control w-50" min="1" value="1">
						</div>
						<button class="btn btn-primary mt-auto add-cart-detail" data-id="${producto.id}">Añadir al carrito</button>
					</div>
				</article>
			</div>
		</div>
		<div class="mt-5">
			<h5>Productos relacionados</h5>
			<div class="row" id="relacionados"></div>
		</div>
	`;
	// Renderizar productos relacionados (mismo tipo, diferente id) usando la card modernizada
	let relacionados = productos.filter(p => p.id !== producto.id).slice(0, 4);
	document.getElementById('relacionados').innerHTML = relacionados.map(p => {
		// Reusar la tarjeta compacta (pero cortando columnas a 3)
		return `
		<div class="col-md-3 mb-3">
			<article class="card h-100 border-0">
				<div class="position-relative ratio ratio-4x3 overflow-hidden">
					<img src="${p.imagen}" class="card-img-top object-cover" alt="${p.nombre}">
					<span class="price-badge badge rounded-pill shadow-sm">${formatter.format(p.precio)}</span>
					<button class="btn btn-sm btn-light wishlist-btn" data-id="${p.id}" aria-label="Favoritos">
						<i class="bi bi-heart"></i>
					</button>
				</div>
				<div class="card-body d-flex flex-column">
					<h6 class="card-title mb-1 text-truncate">${p.nombre}</h6>
					<p class="card-text text-muted small mb-2">${p.descripcion ? p.descripcion.substring(0,60) + (p.descripcion.length>60? '…':'') : ''}</p>
					<div class="mt-auto d-flex gap-2">
						<a href="detalle.html?id=${p.id}" class="btn btn-outline-primary btn-sm w-100">Ver detalle</a>
						<button class="btn btn-primary btn-sm add-cart-btn" data-id="${p.id}">Añadir</button>
					</div>
				</div>
			</article>
		</div>
		`;
	}).join('');
});

// ---------- Event Delegation para botones (Añadir y Favoritos) ----------
document.addEventListener('click', (e) => {
	// Añadir al carrito (botones con clase add-cart-btn)
	const addBtn = e.target.closest('.add-cart-btn');
	if (addBtn) {
		const id = parseInt(addBtn.dataset.id);
		if (!isNaN(id)) agregarAlCarritoPorId(id, 1);
		return;
	}
	// Botón en detalle (añadir con cantidad)
	const addDetail = e.target.closest('.add-cart-detail');
	if (addDetail) {
		const id = parseInt(addDetail.dataset.id);
		if (!isNaN(id)) agregarAlCarritoDetalle(id);
		return;
	}
	// Favoritos (wishlist)
	const wish = e.target.closest('.wishlist-btn');
	if (wish) {
		const id = parseInt(wish.dataset.id);
		if (!isNaN(id)) {
			// manejo simple: guardar ids en localStorage
			let favs = JSON.parse(localStorage.getItem('favs')) || [];
			if (!favs.includes(id)) {
				favs.push(id);
				localStorage.setItem('favs', JSON.stringify(favs));
				// feedback visual
				wish.classList.add('active');
				wish.innerHTML = '<i class="bi bi-heart-fill"></i>';
			} else {
				// quitar favorito
				favs = favs.filter(x => x !== id);
				localStorage.setItem('favs', JSON.stringify(favs));
				wish.classList.remove('active');
				wish.innerHTML = '<i class="bi bi-heart"></i>';
			}
		}
		return;
	}
});

// Inicializar contador con lo que haya en localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
	const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
	actualizarContadorCarrito(carrito);
});

