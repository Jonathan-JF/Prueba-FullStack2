// Inicialización cuando el DOM está listo
window.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('formContacto');
	if (!form) return;
	const nombre = document.getElementById('nombre');
	const correo = document.getElementById('correo');
	const comentario = document.getElementById('comentario');
	const errorNombre = document.getElementById('errorNombre');
	const errorCorreo = document.getElementById('errorCorreo');
	const errorComentario = document.getElementById('errorComentario');
	const mensajeExito = document.getElementById('mensajeExito');


	function validarNombre() {
		if (!nombre.value.trim()) {
			errorNombre.textContent = 'El nombre es requerido.';
			nombre.classList.add('is-invalid');
			return false;
		}
		if (nombre.value.length > 100) {
			errorNombre.textContent = 'Máximo 100 caracteres.';
			nombre.classList.add('is-invalid');
			return false;
		}
		nombre.classList.remove('is-invalid');
		errorNombre.textContent = '';
		return true;
	}

	function validarCorreo() {
		const val = correo.value.trim();
		const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
		if (!val) {
			errorCorreo.textContent = 'El correo es requerido.';
			correo.classList.add('is-invalid');
			return false;
		}
		if (val.length > 100) {
			errorCorreo.textContent = 'Máximo 100 caracteres.';
			correo.classList.add('is-invalid');
			return false;
		}
		if (!dominios.some(d => val.endsWith(d))) {
			errorCorreo.textContent = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com';
			correo.classList.add('is-invalid');
			return false;
		}
		correo.classList.remove('is-invalid');
		errorCorreo.textContent = '';
		return true;
	}

	function validarComentario() {
		if (!comentario.value.trim()) {
			errorComentario.textContent = 'El comentario es requerido.';
			comentario.classList.add('is-invalid');
			return false;
		}
		if (comentario.value.length > 500) {
			errorComentario.textContent = 'Máximo 500 caracteres.';
			comentario.classList.add('is-invalid');
			return false;
		}
		comentario.classList.remove('is-invalid');
		errorComentario.textContent = '';
		return true;
	}

	nombre.addEventListener('input', validarNombre);
	correo.addEventListener('input', validarCorreo);
	comentario.addEventListener('input', validarComentario);

	form.addEventListener('submit', function(e) {
		e.preventDefault();
		const okNombre = validarNombre();
		const okCorreo = validarCorreo();
		const okComentario = validarComentario();
		if (okNombre && okCorreo && okComentario) {
			mensajeExito.classList.remove('d-none');
			form.reset();
			setTimeout(() => mensajeExito.classList.add('d-none'), 3000);
		}
	});
});

// Validación de registro y login
window.addEventListener('DOMContentLoaded', () => {
	const formRegistro = document.getElementById('formRegistro');
	const formLogin = document.getElementById('formLogin');
	const correo = document.getElementById('correo');
	const password = document.getElementById('password');
	const errorCorreo = document.getElementById('errorCorreo');
	const errorPassword = document.getElementById('errorPassword');
	const mensajeExitoRegistro = document.getElementById('mensajeExitoRegistro');
	const mensajeExitoLogin = document.getElementById('mensajeExitoLogin');

	function validarCorreoForm() {
		if (!correo) return true;
		const val = correo.value.trim();
		const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
		if (!val) {
			errorCorreo.textContent = 'El correo es requerido.';
			correo.classList.add('is-invalid');
			return false;
		}
		if (val.length > 100) {
			errorCorreo.textContent = 'Máximo 100 caracteres.';
			correo.classList.add('is-invalid');
			return false;
		}
		if (!dominios.some(d => val.endsWith(d))) {
			errorCorreo.textContent = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com';
			correo.classList.add('is-invalid');
			return false;
		}
		correo.classList.remove('is-invalid');
		errorCorreo.textContent = '';
		return true;
	}

	function validarPasswordForm() {
		if (!password) return true;
		const val = password.value;
		if (!val) {
			errorPassword.textContent = 'La contraseña es requerida.';
			password.classList.add('is-invalid');
			return false;
		}
		if (val.length < 8 || val.length > 20) {
			errorPassword.textContent = 'Debe tener entre 8 y 20 caracteres.';
			password.classList.add('is-invalid');
			return false;
		}
		if (!/[A-Z]/.test(val)) {
			errorPassword.textContent = 'Debe contener al menos una mayúscula.';
			password.classList.add('is-invalid');
			return false;
		}
		if (!/[a-z]/.test(val)) {
			errorPassword.textContent = 'Debe contener al menos una minúscula.';
			password.classList.add('is-invalid');
			return false;
		}
		if (!/[0-9]/.test(val)) {
			errorPassword.textContent = 'Debe contener al menos un número.';
			password.classList.add('is-invalid');
			return false;
		}
		password.classList.remove('is-invalid');
		errorPassword.textContent = '';
		return true;
	}

	if (formRegistro) {
		correo.addEventListener('input', validarCorreoForm);
		password.addEventListener('input', validarPasswordForm);
		formRegistro.addEventListener('submit', function(e) {
			e.preventDefault();
			const okCorreo = validarCorreoForm();
			const okPassword = validarPasswordForm();
			if (okCorreo && okPassword) {
				// Guardar usuario en localStorage para admin
				let usuarios = JSON.parse(localStorage.getItem('admin_usuarios')) || [];
				usuarios.push({
					id: Date.now(),
					run: '',
					nombre: correo.value.split('@')[0],
					apellidos: '',
					correo: correo.value
				});
				localStorage.setItem('admin_usuarios', JSON.stringify(usuarios));
				mensajeExitoRegistro.classList.remove('d-none');
				formRegistro.reset();
				setTimeout(() => mensajeExitoRegistro.classList.add('d-none'), 3000);
			}
		});
	}

	if (formLogin) {
		correo.addEventListener('input', validarCorreoForm);
		password.addEventListener('input', validarPasswordForm);
		formLogin.addEventListener('submit', function(e) {
			e.preventDefault();
			const okCorreo = validarCorreoForm();
			const okPassword = validarPasswordForm();
			if (okCorreo && okPassword) {
				// Si es admin, redirige al panel
				if (correo.value === 'admin@duoc.cl' && password.value === 'Admin1234') {
					localStorage.setItem('tipoUsuario', 'admin');
					window.location.href = 'admin.html';
					return;
				}
				// Si es usuario normal, guardar tipo y redirigir a home
				localStorage.setItem('tipoUsuario', 'usuario');
				mensajeExitoLogin.classList.remove('d-none');
				formLogin.reset();
				setTimeout(() => {
					mensajeExitoLogin.classList.add('d-none');
					window.location.href = 'index.html';
				}, 1200);
			}
		});
	}
});
