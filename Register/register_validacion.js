document.addEventListener('DOMContentLoaded', function() {
  // Elementos del formulario
  const form = document.getElementById('formRegistro');
  const fullnameInput = document.getElementById('fullname');
  const birthdateInput = document.getElementById('birthdate');
  const genderSelect = document.getElementById('gender');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const registerBtn = document.querySelector('.registerBtn');

  // Expresiones regulares para validación
const nameRegex = /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*\s([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(\s(de|De))?\s([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)$/;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|ugb\.edu\.sv|co\.sv|co\.uk|co\.nz|tv|me|int|io|info|us|sg|ca|au)\b$/;

  // Estado de validación
  const validationState = {
    fullname: false,
    birthdate: false,
    gender: false,
    email: false,
    password: false,
    confirmPassword: false
  };

  /* ------------------------------- FUNCIONES DE VALIDACIÓN --------------------------------------------------- */

// ---------------------- NOMBRE COMPLETO ----------------------
function validateFullname() {
  const value = fullnameInput.value.trim();
  const isValid = nameRegex.test(value);
  validationState.fullname = isValid;

  if (value === "") {
    showFieldError(fullnameInput, 'Este campo es obligatorio');
  } else if (!isValid) {
    showFieldError(fullnameInput, 'Nombre inválido. Debe tener entre 3 y 5 palabras, cada una iniciando con mayúscula. ' +
      'Si usas "de" o "De", debe ir solo entre el primer y segundo apellido, para indicar unión matrimonial.');
  } else {
    showFieldSuccess(fullnameInput);

    // Comentario aparte si escribió "de" o "De" en el lugar correcto
    const hasDe = /\s(de|De)\s/.test(value);
    if (hasDe) {
      // Aquí puedes mostrar el comentario donde prefieras, por ejemplo:
      console.log('Nota: "de" o "De" se usa para indicar unión matrimonial entre apellidos.');
      
    } else {
      // Limpiar mensaje si no tiene "de" o "De"
      // document.getElementById('commentFullname').textContent = '';
    }
  }
  return isValid;
}

  /* ----------------------   CUMPLEAÑOS ---------------------- */
  function validateBirthdate() {
    const value = birthdateInput.value;
    if (!value) {
      showFieldError(birthdateInput, 'Debe ingresar una fecha');
      validationState.birthdate = false;
      return false;
    }

    const inputDate = new Date(value);
    const minDate = new Date('1925-01-01');
    const maxDate = new Date('2007-12-31');
    const today = new Date();
    
    let age = today.getFullYear() - inputDate.getFullYear();
    const monthDiff = today.getMonth() - inputDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < inputDate.getDate())) {
      age--;
    }

    let isValid = true;
    let errorMessage = '';

    if (inputDate < minDate) {
      errorMessage = 'Fecha no puede ser menor a 1925';
      isValid = false;
    } else if (inputDate > maxDate) {
      errorMessage = 'Fecha no puede ser mayor a 2007';
      isValid = false;
    } else if (age < 18) {
      errorMessage = 'Debe tener al menos 18 años';
      isValid = false;
    }

    validationState.birthdate = isValid;
    
    if (!isValid) {
      showFieldError(birthdateInput, errorMessage);
    } else {
      showFieldSuccess(birthdateInput);
    }
    return isValid;
  }

  /* ----------------------   GENERO ---------------------- */
  function validateGender() {
    const isValid = genderSelect.value !== "";
    validationState.gender = isValid;
    
    if (!isValid) {
      showFieldError(genderSelect, 'Seleccione un género');
    } else {
      showFieldSuccess(genderSelect);
    }
    return isValid;
  }

  /* ----------------------   CORREO ---------------------- */
  function validateEmail() {
    const value = emailInput.value.trim();
    const isValid = emailRegex.test(value);
    validationState.email = isValid;
    
    if (value === "") {
      showFieldError(emailInput, 'Este campo es obligatorio');
    } else if (!isValid) {
      showFieldError(emailInput, 'Correo electrónico inválido');
    } else {
      showFieldSuccess(emailInput);
    }
    return isValid;
  }

  /* ----------------------   CONTRASEÑA ---------------------- */
  function validatePassword() {
    const value = passwordInput.value;
    const hasLength = value.length >= 6;
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSymbol = /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(value);
    const hasNoSpace = !/\s/.test(value);
    
    const isValid = hasLength && hasUpper && hasNumber && hasSymbol && hasNoSpace;
    validationState.password = isValid;
    
    if (!isValid) {
      showFieldError(passwordInput, 'La contraseña no cumple los requisitos');
    } else {
      showFieldSuccess(passwordInput);
    }
    return isValid;
  }

  /* ----------------------   VALIDAR CONTRASEÑA ---------------------- */  
function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirm = confirmPasswordInput.value;
  const messageElement = document.getElementById('match-message');
  const isValid = password === confirm && password !== "";
  validationState.confirmPassword = isValid;

  if (confirm === "") {
    clearFieldValidation(confirmPasswordInput);
    if (messageElement) messageElement.textContent = '';
  } else if (!isValid) {
    showFieldError(confirmPasswordInput, ''); // limpiamos el mensaje asociado al input
    if (messageElement) {
      messageElement.textContent = 'Las contraseñas no coinciden';
      messageElement.classList.add('text-danger');
      messageElement.classList.remove('text-success');
    }
  } else {
    showFieldSuccess(confirmPasswordInput);
    if (messageElement) {
      messageElement.textContent = 'Las contraseñas coinciden ✅';
      messageElement.classList.add('text-success');
      messageElement.classList.remove('text-danger');
    }
  }
  return isValid;
}


  /* ---------------------- FUNCIONES AUXILIARES ---------------------- */

  function showFieldError(element, message) {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
    const messageElement = document.getElementById(`${element.id}-message`);
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.classList.add('text-danger');
      messageElement.classList.remove('text-success');
    }
  }

  function showFieldSuccess(element) {
    element.classList.add('is-valid');
    element.classList.remove('is-invalid');
    const messageElement = document.getElementById(`${element.id}-message`);
    if (messageElement) {
      messageElement.textContent = 'Campo válido ✅';
      messageElement.classList.add('text-success');
      messageElement.classList.remove('text-danger');
    }
  }

  function clearFieldValidation(element) {
    element.classList.remove('is-valid', 'is-invalid');
    const messageElement = document.getElementById(`${element.id}-message`);
    if (messageElement) {
      messageElement.textContent = '';
      messageElement.classList.remove('text-danger', 'text-success');
    }
  }

  function validateAllFields() {
    validateFullname();
    validateBirthdate();
    validateGender();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    
    return Object.values(validationState).every(valid => valid);
  }

  function showFormError(message) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true
    });
  }

  /* ---------------------- EVENT LISTENERS ---------------------- */

  // Eventos de validación en tiempo real
  fullnameInput.addEventListener('input', validateFullname);
  birthdateInput.addEventListener('change', validateBirthdate);
  genderSelect.addEventListener('change', validateGender);
  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', function() {
    validatePassword();
    validateConfirmPassword();
  });
  confirmPasswordInput.addEventListener('input', validateConfirmPassword);

  // Manejar envío del formulario
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validar todos los campos
    const isFormValid = validateAllFields();
    
    if (!isFormValid) {
      showFormError('Por favor complete todos los campos correctamente');
      return;
    }

    // Mostrar carga mientras se procesa
    Swal.fire({
      title: 'Procesando registro...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const formData = new FormData(form);
      const response = await fetch("registro.php", {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      
      Swal.close();
      
      if (data.success) {
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        
        if (data.redirect) {
          setTimeout(() => {
            window.location.href = data.redirect;
          }, 3000);
        }
      } else {
        showFormError(data.message || 'Error en el registro');
      }
    } catch (error) {
      Swal.close();
      showFormError('Error de conexión con el servidor');
    }
  });
});