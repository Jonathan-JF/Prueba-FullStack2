// Validaciones de inicio de sesión
function validarInicioSesion() {
    const correo = document.getElementById('correoLogin');
    const password = document.getElementById('passwordLogin');
    let isValid = true;

    // Validación de correo
    if (!correo.value || correo.value.length > 100) {
        alert('El correo es requerido y debe tener máximo 100 caracteres');
        isValid = false;
    } else {
        const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        if (!dominiosPermitidos.some(dominio => correo.value.toLowerCase().endsWith(dominio))) {
            alert('El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com');
            isValid = false;
        }
    }
    return isValid;
}

// Evento para el formulario de login
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarInicioSesion()) {
                const correo = document.getElementById('correoLogin').value;
                const password = document.getElementById('passwordLogin').value;

                // Verificar credenciales
                const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
                const usuario = usuarios.find(u => u.correo === correo && u.password === password);

                if (usuario) {
                    // Guardar sesión
                    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
                    
                    // Redirigir según tipo de usuario
                    if (usuario.tipo === 'Administrador') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert('Credenciales inválidas');
                }
            }
        });
    }
});