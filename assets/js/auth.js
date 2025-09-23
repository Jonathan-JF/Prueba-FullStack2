function validarRut(rut) {
    if (!rut || rut.length < 7 || rut.length > 9) return false;
    
    rut = rut.toUpperCase();
    const rutLimpio = rut.replace(/[^0-9K]/g, "");
    
    if (rutLimpio.length < 7 || rutLimpio.length > 9) return false;
    
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = rutLimpio.length - 2; i >= 0; i--) {
        suma += parseInt(rutLimpio[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const dv = 11 - (suma % 11);
    const dvEsperado = rutLimpio[rutLimpio.length - 1];
    
    if (dv === 11) return dvEsperado === "0";
    if (dv === 10) return dvEsperado === "K";
    return dv.toString() === dvEsperado;
}


function validarCorreo(correo) {
    // Lista de dominios permitidos en la aplicación
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!correo || correo.length > 100) return false;
    return dominiosPermitidos.some(dominio => correo.toLowerCase().endsWith(dominio));
}

// Función para validar campos del formulario de registro
function validarCamposRegistro() {
    const rut = document.getElementById('rut');
    const nombre = document.getElementById('nombre');
    const apellidos = document.getElementById('apellidos');
    const correo = document.getElementById('correo');
    const direccion = document.getElementById('direccion');

    // Validación RUT
    if (!validarRut(rut.value)) {
        alert('RUT inválido. Debe tener entre 7 y 9 caracteres sin puntos ni guión');
        return false;
    }

    // Validación nombre
    if (!nombre.value || nombre.value.length > 50) {
        alert('El nombre es requerido y debe tener máximo 50 caracteres');
        return false;
    }

    // Validación apellidos
    if (!apellidos.value || apellidos.value.length > 100) {
        alert('Los apellidos son requeridos y deben tener máximo 100 caracteres');
        return false;
    }

    // Validación correo
    if (!validarCorreo(correo.value)) {
        alert('Correo inválido. Debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com y tener máximo 100 caracteres');
        return false;
    }

    // Validación dirección
    if (!direccion.value || direccion.value.length > 300) {
        alert('La dirección es requerida y debe tener máximo 300 caracteres');
        return false;
    }
    return true;
}

// Evento para el formulario de registro
document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarCamposRegistro()) {
                // Aquí iría la lógica para guardar el usuario
                const usuario = {
                    rut: document.getElementById('rut').value,
                    nombre: document.getElementById('nombre').value,
                    apellidos: document.getElementById('apellidos').value,
                    correo: document.getElementById('correo').value,
                    direccion: document.getElementById('direccion').value,
                    tipo: 'Cliente' // Por defecto al registrarse desde la tienda
                };
                
                // Guardar en localStorage
                const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
                usuarios.push(usuario);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                
                alert('Usuario registrado correctamente');
                window.location.href = 'login.html';
            }
        });
    }
});
