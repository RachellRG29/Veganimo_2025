// register.js
const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullname = document.getElementById('fullname').value.trim();
  const birthdate = document.getElementById('birthdate').value;
  const gender = document.getElementById('gender').value;
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (!fullname || !birthdate || !gender || !email || !password || !confirmPassword) {
    return Swal.fire({
      icon: 'warning',
      title: 'Campos vacíos',
      text: 'Por favor completa todos los campos.',
    });
  }

  if (password !== confirmPassword) {
    return Swal.fire({
      icon: 'error',
      title: 'Contraseñas diferentes',
      text: 'Las contraseñas no coinciden. Verifica e inténtalo de nuevo.',
    });
  }

  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Guardar datos en Firestore (sin contraseña)
    const db = firebase.firestore();
    await db.collection('Usuarios').doc(user.uid).set({
      fullname,
      birthdate,
      gender,
      email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    await Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Serás redirigido a Verificación de 2 pasos.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    // Pequeño delay antes de redirigir
    setTimeout(() => {
      window.location.href = 'verificacion';
    }, 2000);

  } catch (error) {
    console.error('Error registrando usuario:', error);
    let errorMessage = 'Hubo un problema inesperado.';

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'El correo ya está registrado.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'La contraseña es demasiado débil (mínimo 6 caracteres).';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El correo ingresado no es válido.';
    }

    Swal.fire({
      icon: 'error',
      title: 'Error de registro',
      text: errorMessage,
    });
  }
});
