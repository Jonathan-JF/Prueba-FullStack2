/**
 * Panel de Administración
 * 
 * Este archivo maneja todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * para productos y usuarios en el panel de administración.
 * 
 * Características principales:
 * - Gestión de productos y usuarios
 * - Persistencia de datos usando localStorage
 * - Validación de datos
 * - Interfaz de usuario dinámica
 */

// Inicialización del panel cuando el DOM está listo
window.addEventListener('DOMContentLoaded', () => {
	const vista = document.getElementById('vistaAdmin');
	const menuProductos = document.getElementById('menuProductos');
	const menuUsuarios = document.getElementById('menuUsuarios');


	let productos = JSON.parse(localStorage.getItem('admin_productos')) || [];
	
	// Importación de productos globales si existen
	if (window.productos && Array.isArray(window.productos)) {
		window.productos.forEach(p => {
			if (!productos.some(x => x.id === p.id)) {
				productos.push({
					id: p.id,
					codigo: 'P' + String(p.id).padStart(3, '0'),
					nombre: p.nombre,
					precio: p.precio,
					stock: 10,
					imagen: p.imagen || '',
					descripcion: p.descripcion || ''
				});
			}
		});
		localStorage.setItem('admin_productos', JSON.stringify(productos));
	}
	let usuarios = JSON.parse(localStorage.getItem('admin_usuarios')) || [
		{ id: 1, run: '19011022K', nombre: 'Juan', apellidos: 'Pérez', correo: 'juan@duoc.cl' },
		{ id: 2, run: '20123456K', nombre: 'Ana', apellidos: 'Gómez', correo: 'ana@gmail.com' }
	];

	/**
	 * Renderiza la tabla de productos
	 * 
	 * Funcionalidad:
	 * - Ordena productos por ID
	 * - Genera tabla HTML dinámica
	 * - Incluye botones de acción por producto
	 * - Actualiza la vista en tiempo real
	 */
	function renderProductos() {
		// Ordenar productos por ID para mantener consistencia
		const productosOrdenados = [...productos].sort((a, b) => a.id - b.id);
		vista.innerHTML = `
			<h4>Productos</h4>
			<button class="btn btn-primary mb-3" onclick="mostrarFormProducto()">Nuevo Producto</button>
			<table class="table table-bordered">
				<thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
				<tbody>
					${productosOrdenados.map(p => `
						<tr>
							<td>${p.codigo}</td>
							<td>${p.nombre}</td>
							<td>$${p.precio}</td>
							<td>${p.stock}</td>
							<td>
								<button class="btn btn-sm btn-warning" onclick="editarProducto(${p.id})">Editar</button>
								<button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.id})">Eliminar</button>
							</td>
						</tr>
					`).join('')}
				</tbody>
			</table>
			<div id="formProducto"></div>
		`;
	// Se eliminó la función importarProductosBase por redundancia
	}

	window.mostrarFormProducto = function() {
		document.getElementById('formProducto').innerHTML = `
			<h5>Nuevo Producto</h5>
			<form onsubmit="guardarProducto(event)">
				<input type="hidden" id="idProducto" value="">
				<div class="mb-2"><input type="text" class="form-control" id="codigoProducto" placeholder="Código" required maxlength="10"></div>
				<div class="mb-2"><input type="text" class="form-control" id="nombreProducto" placeholder="Nombre" required maxlength="50"></div>
				<div class="mb-2"><input type="number" class="form-control" id="precioProducto" placeholder="Precio" min="1" required></div>
				<div class="mb-2"><input type="number" class="form-control" id="stockProducto" placeholder="Stock" min="1" required></div>
				<div class="mb-2"><input type="text" class="form-control" id="imagenProducto" placeholder="URL de imagen" maxlength="200"></div>
				<div class="mb-2"><textarea class="form-control" id="descripcionProducto" placeholder="Descripción" maxlength="200"></textarea></div>
				<button type="submit" class="btn btn-success">Guardar</button>
			</form>
		`;
	}

	window.guardarProducto = function(e) {
		e.preventDefault();
		const id = document.getElementById('idProducto').value;
		const codigo = document.getElementById('codigoProducto').value;
		const nombre = document.getElementById('nombreProducto').value;
		const precio = parseFloat(document.getElementById('precioProducto').value);
		const stock = parseInt(document.getElementById('stockProducto').value);
		const imagen = document.getElementById('imagenProducto').value;
		const descripcion = document.getElementById('descripcionProducto').value;
		if (id) {
			// Editar
			const prod = productos.find(p => p.id == id);
			prod.codigo = codigo; prod.nombre = nombre; prod.precio = precio; prod.stock = stock;
			prod.imagen = imagen;
			prod.descripcion = descripcion;
		} else {
			// Nuevo
			productos.push({ id: Date.now(), codigo, nombre, precio, stock, imagen, descripcion });
		}
		localStorage.setItem('admin_productos', JSON.stringify(productos));
		renderProductos();
	}

	window.editarProducto = function(id) {
		const prod = productos.find(p => p.id === id);
		document.getElementById('formProducto').innerHTML = `
			<h5>Editar Producto</h5>
			<form onsubmit="guardarProducto(event)">
				<input type="hidden" id="idProducto" value="${prod.id}">
				<div class="mb-2"><input type="text" class="form-control" id="codigoProducto" value="${prod.codigo}" required></div>
				<div class="mb-2"><input type="text" class="form-control" id="nombreProducto" value="${prod.nombre}" required></div>
				<div class="mb-2"><input type="number" class="form-control" id="precioProducto" value="${prod.precio}" min="0" required></div>
				<div class="mb-2"><input type="number" class="form-control" id="stockProducto" value="${prod.stock}" min="0" required></div>
				<div class="mb-2"><input type="text" class="form-control" id="imagenProducto" value="${prod.imagen || ''}" placeholder="URL de imagen"></div>
				<div class="mb-2"><textarea class="form-control" id="descripcionProducto" placeholder="Descripción">${prod.descripcion || ''}</textarea></div>
				<button type="submit" class="btn btn-success">Guardar</button>
			</form>
		`;
	}

	window.eliminarProducto = function(id) {
	productos = productos.filter(p => p.id !== id);
	localStorage.setItem('admin_productos', JSON.stringify(productos));
	renderProductos();
	}

	function renderUsuarios() {
		vista.innerHTML = `
			<h4>Usuarios</h4>
			<button class="btn btn-primary mb-3" onclick="mostrarFormUsuario()">Nuevo Usuario</button>
			<table class="table table-bordered">
				<thead><tr><th>RUN</th><th>Nombre</th><th>Apellidos</th><th>Correo</th><th>Acciones</th></tr></thead>
				<tbody>
					${usuarios.map(u => `
						<tr>
							<td>${u.run}</td>
							<td>${u.nombre}</td>
							<td>${u.apellidos}</td>
							<td>${u.correo}</td>
							<td>
								<button class="btn btn-sm btn-warning" onclick="editarUsuario(${u.id})">Editar</button>
								<button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.id})">Eliminar</button>
							</td>
						</tr>
					`).join('')}
				</tbody>
			</table>
			<div id="formUsuario"></div>
		`;
	}

	window.mostrarFormUsuario = function() {
		document.getElementById('formUsuario').innerHTML = `
			<h5>Nuevo Usuario</h5>
			<form onsubmit="guardarUsuario(event)">
				<input type="hidden" id="idUsuario" value="">
				<div class="mb-2"><input type="text" class="form-control" id="runUsuario" placeholder="RUN" required maxlength="12"></div>
				<div class="mb-2"><input type="text" class="form-control" id="nombreUsuario" placeholder="Nombre" required maxlength="50"></div>
				<div class="mb-2"><input type="text" class="form-control" id="apellidosUsuario" placeholder="Apellidos" required maxlength="50"></div>
				<div class="mb-2"><input type="email" class="form-control" id="correoUsuario" placeholder="Correo" required maxlength="100" pattern=".+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$"></div>
				<button type="submit" class="btn btn-success">Guardar</button>
			</form>
		`;
	}

	window.guardarUsuario = function(e) {
		e.preventDefault();
		const id = document.getElementById('idUsuario').value;
		const run = document.getElementById('runUsuario').value;
		const nombre = document.getElementById('nombreUsuario').value;
		const apellidos = document.getElementById('apellidosUsuario').value;
		const correo = document.getElementById('correoUsuario').value;
		if (id) {
			// Editar
			const user = usuarios.find(u => u.id == id);
			user.run = run; user.nombre = nombre; user.apellidos = apellidos; user.correo = correo;
		} else {
			// Nuevo
			usuarios.push({ id: Date.now(), run, nombre, apellidos, correo });
		}
		localStorage.setItem('admin_usuarios', JSON.stringify(usuarios));
		renderUsuarios();
	}

	window.editarUsuario = function(id) {
		const user = usuarios.find(u => u.id === id);
		document.getElementById('formUsuario').innerHTML = `
			<h5>Editar Usuario</h5>
			<form onsubmit="guardarUsuario(event)">
				<input type="hidden" id="idUsuario" value="${user.id}">
				<div class="mb-2"><input type="text" class="form-control" id="runUsuario" value="${user.run}" required></div>
				<div class="mb-2"><input type="text" class="form-control" id="nombreUsuario" value="${user.nombre}" required></div>
				<div class="mb-2"><input type="text" class="form-control" id="apellidosUsuario" value="${user.apellidos}" required></div>
				<div class="mb-2"><input type="email" class="form-control" id="correoUsuario" value="${user.correo}" required></div>
				<button type="submit" class="btn btn-success">Guardar</button>
			</form>
		`;
	}

	window.eliminarUsuario = function(id) {
	usuarios = usuarios.filter(u => u.id !== id);
	localStorage.setItem('admin_usuarios', JSON.stringify(usuarios));
	renderUsuarios();
	}

	menuProductos.addEventListener('click', (e) => {
		e.preventDefault();
		renderProductos();
	});
	menuUsuarios.addEventListener('click', (e) => {
		e.preventDefault();
		renderUsuarios();
	});

	// Mostrar productos por defecto
	renderProductos();
});
