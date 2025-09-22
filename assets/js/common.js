// Maneja la suscripción al newsletter
document.addEventListener('DOMContentLoaded', function() {
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