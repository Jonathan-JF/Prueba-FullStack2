// =========================
// Datos iniciales
// =========================
let productos = JSON.parse(localStorage.getItem("productos")) || [
  {
    id: 1,
    nombre: "Vino Don Melchor",
    precio: 20000,
    imagen: "https://donmelchor.com/wp-content/uploads/2024/11/Post-Web-DM-2-1024x683.jpg",
    descripcion: "Un vino chileno de clase mundial, ideal para ocasiones especiales.",
    destacado: true
  },
  {
    id: 2,
    nombre: "Score Energy Drink",
    precio: 1500,
    imagen: "https://scoreenergydrink.com/cdn/shop/files/SCOREGORILLA500ML_9e93e49e-5f8c-43b1-a992-108f18bec960.jpg?v=1734648539&width=800",
    descripcion: "La bebida energética favorita de los jóvenes.",
    destacado: true
  },
  {
    id: 3,
    nombre: "Cerveza artesanal",
    precio: 2500,
    imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    descripcion: "Cerveza artesanal chilena, refrescante y con carácter.",
    destacado: false
  }
];
localStorage.setItem("productos", JSON.stringify(productos));

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// Utilidades
// =========================
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
  const total = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  document.querySelectorAll(".badge.bg-danger").forEach(badge => {
    badge.textContent = total;
    badge.classList.toggle("d-none", total === 0);
  });
}

// =========================
// Carrito
// =========================
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const existe = carrito.find(p => p.id === id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  actualizarContadorCarrito();
  alert(`${producto.nombre} agregado al carrito`);
  mostrarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito();
  mostrarCarrito();
  actualizarContadorCarrito();
}

function mostrarCarrito() {
  const contenedor = document.getElementById("carrito-items");
  const totalTexto = document.getElementById("carrito-total");
  if (!contenedor || !totalTexto) return;

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    contenedor.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <strong>${item.nombre}</strong><br>
          Cantidad: ${item.cantidad}
        </div>
        <div>
          $${(item.precio * item.cantidad).toLocaleString()}
          <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${item.id})">x</button>
        </div>
      </div>
    `;
  });

  totalTexto.textContent = "Total: $" + total.toLocaleString();
}

// =========================
// Productos
// =========================
function mostrarProductos() {
  const lista = document.getElementById("lista-productos");
  if (!lista) return;

  lista.innerHTML = "";
  productos.forEach(prod => {
    lista.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body text-center">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text">$${prod.precio.toLocaleString()}</p>
            <a href="detalle.html?id=${prod.id}" class="btn btn-outline-primary">Ver detalle</a>
            <button class="btn btn-primary mt-2" onclick="agregarAlCarrito(${prod.id})">Añadir</button>
          </div>
        </div>
      </div>
    `;
  });
}

function mostrarDetalleProducto() {
  const contenedor = document.getElementById("detalleProducto");
  if (!contenedor) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    contenedor.innerHTML = "<p>Producto no encontrado</p>";
    return;
  }

  contenedor.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <img src="${producto.imagen}" class="img-fluid rounded" alt="${producto.nombre}">
      </div>
      <div class="col-md-6">
        <h2>${producto.nombre}</h2>
        <p>${producto.descripcion}</p>
        <p><strong>Precio:</strong> $${producto.precio.toLocaleString()}</p>
        <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
      </div>
    </div>
  `;
}

function mostrarDestacados() {
  const contenedor = document.getElementById("productosDestacados");
  if (!contenedor) return;

  const destacados = productos.filter(p => p.destacado);
  contenedor.innerHTML = destacados.map(prod => `
    <div class="col-md-4">
      <div class="card h-100">
        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}" style="height:250px;object-fit:cover;">
        <div class="card-body text-center">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">${prod.descripcion}</p>
          <p class="text-primary fw-bold">$${prod.precio.toLocaleString()}</p>
          <a href="detalle.html?id=${prod.id}" class="btn btn-outline-primary">Ver detalle</a>
          <button class="btn btn-primary mt-2" onclick="agregarAlCarrito(${prod.id})">Añadir</button>
        </div>
      </div>
    </div>
  `).join("");
}

// =========================
// Login / Registro
// =========================
function registrarUsuario() {
  const form = document.getElementById("formRegistro");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const usuario = {
      rut: document.getElementById("rut").value,
      nombre: document.getElementById("nombre").value,
      apellidos: document.getElementById("apellidos").value,
      correo: document.getElementById("correo").value,
      password: document.getElementById("password").value
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    window.location.href = "login.html";
  });
}

function loginUsuario() {
  const form = document.getElementById("formLogin");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.correo === correo && usuario.password === password) {
      alert("Login exitoso");
      window.location.href = "index.html";
    } else {
      alert("Correo o contraseña incorrectos");
    }
  });
}

// =========================
// Inicialización
// =========================
document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  mostrarDetalleProducto();
  mostrarCarrito();
  mostrarDestacados();
  registrarUsuario();
  loginUsuario();
  actualizarContadorCarrito();
});
