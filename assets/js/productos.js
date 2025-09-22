// Array de productos de ejemplo
window.productos = [
	{
		id: 1,
		nombre: "Fanta",
		precio: 2500,
		imagen: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=2003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		destacado: true,
		descripcion: "Bebida gaseosa sabor naranja, refrescante y perfecta para cualquier ocasión."
	},
	{
		id: 2,
		nombre: "Coca-Cola",
		precio: 4500,
		imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		destacado: true,
		descripcion: "La clásica bebida cola, ideal para acompañar tus comidas y reuniones."
	},
	{
		id: 3,
		nombre: "Pepsi Cero",
		precio: 6000,
		imagen: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		destacado: false,
		descripcion: "Pepsi sin azúcar, el sabor de siempre con menos calorías."
	},
	{
		id: 4,
		nombre: "Monster",
		precio: 12000,
		imagen: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

// Renderizar productos destacados en el home
window.addEventListener('DOMContentLoaded', () => {
	const contenedor = document.getElementById('productosDestacados');
	if (!contenedor) return;
	const destacados = productos.filter(p => p.destacado);
		contenedor.innerHTML = destacados.map(producto => `
			<div class="col-md-4 mb-4">
				<article class="card h-100">
					<img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title">${producto.nombre}</h5>
						<p class="card-text">${producto.descripcion}</p>
						<p class="card-text">Precio: $${producto.precio}</p>
						<button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
					</div>
				</article>
			</div>
		`).join('');
});

// Renderizar todos los productos en productos.html
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
					destacado: false
				});
			}
		});
		lista.innerHTML = todos.map(producto => `
			<div class="col-md-4 mb-4">
				<article class="card h-100">
					<img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title">${producto.nombre}</h5>
						<p class="card-text">${producto.descripcion}</p>
						<p class="card-text">Precio: $${producto.precio}</p>
						<button class="btn btn-success mb-2" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
						<a href="detalle.html?id=${producto.id}" class="btn btn-outline-primary">Ver detalle</a>
					</div>
				</article>
			</div>
		`).join('');
});

// Renderizar detalle de producto en detalle.html
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
	contenedor.innerHTML = `
		<div class="col-md-6">
			<article class="card h-100">
				<img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
				<div class="card-body d-flex flex-column">
					<h5 class="card-title">${producto.nombre}</h5>
					<p class="card-text">${producto.descripcion}</p>
					<p class="card-text">Precio: $${producto.precio}</p>
					<p class="card-text">ID: ${producto.id}</p>
					<button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
				</div>
			</article>
		</div>
	`;
});

// Función para añadir al carrito (localStorage)
function agregarAlCarrito(id) {
	const producto = productos.find(p => p.id === id);
	if (!producto) return;
	let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
	const existe = carrito.find(item => item.id === id);
	if (existe) {
		existe.cantidad += 1;
	} else {
		carrito.push({ ...producto, cantidad: 1 });
	}
	localStorage.setItem('carrito', JSON.stringify(carrito));
	alert('Producto añadido al carrito');
}
