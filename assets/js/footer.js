// Footer HTML template
const footerTemplate = `
<footer class="footer mt-5 py-5 bg-light rounded-4">
    <div class="container">
        <div class="row g-4">
            <!-- Columna de la empresa -->
            <div class="col-lg-4">
                <img src="https://i.imgur.com/qu5V6xN.png" alt="Logo Tienda de Bebidas" height="40" class="mb-3">
                <p class="text-muted">
                    Tu destino premium para las mejores bebidas nacionales e internacionales. 
                    Calidad y variedad garantizada.
                </p>
                <div class="d-flex gap-3 mt-3">
                    <a href="#" class="text-muted text-decoration-none">
                        <i class="bi bi-facebook fs-5"></i>
                    </a>
                    <a href="#" class="text-muted text-decoration-none">
                        <i class="bi bi-instagram fs-5"></i>
                    </a>
                    <a href="#" class="text-muted text-decoration-none">
                        <i class="bi bi-twitter fs-5"></i>
                    </a>
                </div>
            </div>

            <!-- Enlaces rápidos -->
            <div class="col-6 col-lg-2">
                <h5 class="fw-bold mb-3">Enlaces</h5>
                <ul class="list-unstyled">
                    <li class="mb-2"><a href="productos.html" class="text-muted text-decoration-none">Productos</a></li>
                    <li class="mb-2"><a href="nosotros.html" class="text-muted text-decoration-none">Nosotros</a></li>
                    <li class="mb-2"><a href="blogs.html" class="text-muted text-decoration-none">Blog</a></li>
                    <li class="mb-2"><a href="contacto.html" class="text-muted text-decoration-none">Contacto</a></li>
                </ul>
            </div>

            <!-- Información legal -->
            <div class="col-6 col-lg-2">
                <h5 class="fw-bold mb-3">Legal</h5>
                <ul class="list-unstyled">
                    <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Términos</a></li>
                    <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Privacidad</a></li>
                    <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Cookies</a></li>
                    <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Legal</a></li>
                </ul>
            </div>

            <!-- Newsletter -->
            <div class="col-lg-4">
                <h5 class="fw-bold mb-3">Newsletter</h5>
                <p class="text-muted">Suscríbete para recibir nuestras últimas novedades y ofertas exclusivas.</p>
                <form class="newsletter-form">
                    <div class="input-group mb-3">
                        <input type="email" class="form-control" placeholder="Tu email" aria-label="Tu email" required>
                        <button class="btn btn-primary" type="submit">Suscribirse</button>
                    </div>
                </form>
                <small class="text-muted">
                    <i class="bi bi-shield-check"></i> 
                    Tu información está segura con nosotros.
                </small>
            </div>
        </div>

        <!-- Separador -->
        <hr class="my-4">

        <!-- Copyright -->
        <div class="row align-items-center">
            <div class="col-lg-6 text-center text-lg-start">
                <small class="text-muted">
                    &copy; 2025 Tienda de Bebidas. Todos los derechos reservados.
                </small>
            </div>
        </div>
    </div>
</footer>
`;

// Función para insertar el footer
document.addEventListener('DOMContentLoaded', function() {
    // Buscar el contenedor principal
    const container = document.querySelector('.container-gray');
    if (container) {
        // Insertar el footer antes del cierre del contenedor
        container.insertAdjacentHTML('beforeend', footerTemplate);
    }

    // Manejar el formulario de newsletter
    const newsLetterForm = document.querySelector('.newsletter-form');
    if (newsLetterForm) {
        newsLetterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Aquí iría la lógica para procesar la suscripción
            console.log('Email suscrito:', email);
            
            // Mostrar mensaje de éxito
            alert('¡Gracias por suscribirte a nuestro newsletter!');
            this.reset();
        });
    }
});