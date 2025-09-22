// Manejar el formulario de registro
document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistro');


    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // Validar RUT
                const rut = document.getElementById('rut').value;
                if (!security.validateRut(rut)) {
                    throw new Error('RUT inválido');
                }

                // Validar nombre
                const nombre = document.getElementById('nombre').value;
                if (!nombre || nombre.length > 50) {
                    throw new Error('El nombre es requerido y debe tener máximo 50 caracteres');
                }

                // Validar apellidos
                const apellidos = document.getElementById('apellidos').value;
                if (!apellidos || apellidos.length > 100) {
                    throw new Error('Los apellidos son requeridos y deben tener máximo 100 caracteres');
                }

                // Validar correo
                const correo = document.getElementById('correo').value;
                if (!security.validateEmail(correo)) {
                    throw new Error('Correo inválido');
                }

                // Validar contraseña
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (!security.validatePassword(password)) {
                    throw new Error('La contraseña debe tener entre 4 y 10 caracteres');
                }

                if (password !== confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }

                // Validar dirección
                const direccion = document.getElementById('direccion').value;
                if (!direccion || direccion.length > 300) {
                    throw new Error('La dirección es requerida y debe tener máximo 300 caracteres');
                }

                // Crear objeto de usuario
                const usuario = {
                    rut: security.sanitizeInput(rut),
                    nombre: security.sanitizeInput(nombre),
                    apellidos: security.sanitizeInput(apellidos),
                    correo: security.sanitizeInput(correo),
                    password: password, // La contraseña debería hashearse en un entorno real
                    fechaNacimiento: document.getElementById('fechaNacimiento').value,
                    region: security.sanitizeInput(region),
                    comuna: security.sanitizeInput(comuna),
                    direccion: security.sanitizeInput(direccion),
                    telefono: security.sanitizeInput(document.getElementById('telefono').value),
                    tipo: 'Cliente',
                    fechaRegistro: new Date().toISOString()
                };

                // Guardar usuario
                const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
                
                // Verificar si el correo ya está registrado
                if (usuarios.some(u => u.correo === correo)) {
                    throw new Error('Este correo ya está registrado');
                }

                // Verificar si el RUT ya está registrado
                if (usuarios.some(u => u.rut === rut)) {
                    throw new Error('Este RUT ya está registrado');
                }

                usuarios.push(usuario);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                // Mostrar mensaje de éxito
                notifications.show('Usuario registrado correctamente', 'success');
                
                // Redireccionar después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (error) {
                notifications.show(error.message, 'error');
            }
        });
    }
});

