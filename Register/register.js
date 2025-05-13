// register.js

document.addEventListener('DOMContentLoaded', () => {
  // Referencia al formulario y al botón
  const form = document.querySelector('#registerForm');
  const registerBtn = document.querySelector('#registerBtn');

  // Escuchamos el evento submit del formulario
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenimos el comportamiento por defecto del formulario

    // Recolectamos los datos del formulario
    const formData = new FormData(form);
    const userData = {
      email: formData.get('email'),
      password: formData.get('password'),
      // Otros campos que tengas en tu formulario
    };

    // 1. Enviar los datos al backend para crear el usuario
    try {
      const registerResponse = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const registerData = await registerResponse.json();

      if (registerData.success) {
        // 2. Enviar correo con el código de verificación
        const verifyResponse = await fetch('/send-verification-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userData.email }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
          // 3. Mostrar el campo para ingresar el código de verificación
          const verificationForm = document.querySelector('#verificationForm');
          verificationForm.style.display = 'block';
          document.querySelector('#emailVerification').value = ''; // Limpiar el campo de código

          // 4. Manejar el envío del código de verificación
          const verificationBtn = document.querySelector('#verificationBtn');
          verificationBtn.addEventListener('click', async () => {
            const verificationCode = document.querySelector('#emailVerification').value;

            const codeVerificationResponse = await fetch('/verify-code', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: userData.email, code: verificationCode }),
            });

            const codeVerificationData = await codeVerificationResponse.json();

            if (codeVerificationData.success) {
              // 5. Registrar en la base de datos solo si la verificación es correcta
              const finalResponse = await fetch('/finalize-registration', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userData.email, password: userData.password }),
              });

              const finalData = await finalResponse.json();
              if (finalData.success) {
                // Usuario registrado correctamente
                alert('¡Registro exitoso!');
                // Redirigir a donde sea necesario (por ejemplo, login)
                window.location.href = '/login';
              } else {
                alert('Hubo un error al finalizar el registro. Intenta de nuevo.');
              }
            } else {
              alert('El código de verificación es incorrecto.');
            }
          });
        } else {
          alert('Hubo un error al enviar el código de verificación.');
        }
      } else {
        alert('Hubo un error al registrar el usuario. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      alert('Hubo un error al registrar el usuario. Intenta de nuevo.');
    }
  });
});
