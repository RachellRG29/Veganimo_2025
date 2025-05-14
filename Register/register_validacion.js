// Función para ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Obtener elementos del DOM
  const form = document.getElementById('formRegistro');
  const fullnameInput = document.getElementById('fullname');
  const fullnameMessage = document.getElementById('fullname-message');
  const registerBtn = document.getElementById('registerBtn');
  const birthdateInput = document.getElementById('birthdate');
  const birthdateMessage = document.getElementById('birthdate-message');
  const genderSelect = document.getElementById('gender');
  const genderMessage = document.getElementById('gender-message');
  const emailInput = document.getElementById('email');
  const emailMessage = document.getElementById('email-message');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const matchMessage = document.getElementById('match-message');

  /* --------------------------- VALIDACIÓN DEL NOMBRE COMPLETO -------------------------------------- */
  const regex = /^([a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,})(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]{3,})+$/;

  function validateFullname(value) {
    value = value.trim().replace(/\s{2,}/g, ' ');
    fullnameInput.value = value;
    return regex.test(value);
  }

  fullnameInput.addEventListener('input', function() {
    const cleanedValue = this.value.trim().replace(/\s{2,}/g, ' ');
    this.value = cleanedValue;

    if (cleanedValue === "") {
      fullnameMessage.textContent = 'Este campo es obligatorio.';
      fullnameMessage.className = 'form-text mt-1 text-danger';
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
    } else if (validateFullname(cleanedValue)) {
      fullnameMessage.textContent = 'Datos correctos ✅';
      fullnameMessage.className = 'form-text mt-1 text-success';
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
    } else {
      fullnameMessage.textContent = 'Ingrese nombre y apellido, mínimo 3 letras cada uno, sin espacios múltiples.';
      fullnameMessage.className = 'form-text mt-1 text-danger';
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
    }
    updateSubmitButton();
  });

  fullnameInput.addEventListener('keydown', function(e) {
    const char = e.key;
    if (e.ctrlKey || e.metaKey || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(char)) return;

    if (char === ' ') {
      e.preventDefault();
      setTimeout(() => {
        const value = fullnameInput.value.trim().replace(/\s{2,}/g, ' ');
        const parts = value.split(' ');
        const lastPart = parts[parts.length - 1] || '';
        if (lastPart.length >= 3) {
          fullnameInput.value = value + ' ';
        }
      }, 0);
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]$/.test(char)) {
      e.preventDefault();
    }
  });

  fullnameInput.addEventListener('paste', function(e) {
    const pasted = e.clipboardData.getData('text');
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(pasted)) {
      e.preventDefault();
      fullnameMessage.textContent = 'No se permiten números ni signos al pegar.';
      fullnameMessage.className = 'form-text mt-1 text-danger';
      return;
    }

    const cleaned = pasted.trim().replace(/\s{2,}/g, ' ');
    if (!validateFullname(cleaned)) {
      e.preventDefault();
      fullnameMessage.textContent = 'Pegado inválido. Asegúrese de que haya al menos dos palabras de 3 letras.';
      fullnameMessage.className = 'form-text mt-1 text-danger';
    }
  });

  /* ----------------- FUNCIONES DE FECHA DE NACIMIENTO ----------------------- */
  birthdateInput.addEventListener('input', function() {
    const value = this.value;
    const inputDate = new Date(value);
    const today = new Date();

    if (!value) {
      birthdateMessage.textContent = 'Debe ingresar una fecha de nacimiento.';
      birthdateMessage.className = 'form-text mt-1 text-danger';
      this.classList.remove('is-valid', 'is-invalid');
      return;
    }

    const age = today.getFullYear() - inputDate.getFullYear();
    const monthDiff = today.getMonth() - inputDate.getMonth();
    const dayDiff = today.getDate() - inputDate.getDate();
    let is18 = age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

    const minDate = new Date('1925-01-01');
    if (inputDate < minDate) {
      birthdateMessage.textContent = 'La fecha no puede ser menor a 1925.';
      birthdateMessage.className = 'form-text mt-1 text-danger';
      this.classList.remove('is-valid');
      this.classList.add('is-invalid');
    } else if (!is18) {
      birthdateMessage.textContent = 'Debe tener al menos 18 años para registrarse.';
      birthdateMessage.className = 'form-text mt-1 text-danger';
      this.classList.remove('is-valid');
      this.classList.add('is-invalid');
    } else {
      birthdateMessage.textContent = 'Fecha válida. Todo está correcto ✅';
      birthdateMessage.className = 'form-text mt-1 text-success';
      this.classList.remove('is-invalid');
      this.classList.add('is-valid');
    }
    updateSubmitButton();
  });

  /* ----------------- VALIDACIÓN DEL GÉNERO ----------------------- */
  genderSelect.addEventListener('change', function() {
    if (this.value !== "") {
      this.classList.remove('is-invalid');
      this.classList.add('is-valid');
      genderMessage.textContent = 'Selección válida ✅';
      genderMessage.className = 'form-text mt-1 text-success';
      genderMessage.style.display = 'block';
    } else {
      this.classList.remove('is-valid');
      this.classList.add('is-invalid');
      genderMessage.textContent = 'Debe seleccionar un género.';
      genderMessage.className = 'form-text mt-1 text-danger';
    }
    updateSubmitButton();
  });

  /* --------------------------- FUNCIONES DE CORREO -------------------------------------- */
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|ugb\.edu\.sv|co\.sv|co\.uk|co\.nz|tv|me|int|io|info|us|sg|ca|au)\b$/;

  emailInput.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
      e.preventDefault();
    }
  });

  emailInput.addEventListener('input', function() {
    const value = this.value;
    if (emailRegex.test(value)) {
      emailMessage.textContent = 'Correo válido ✅';
      emailMessage.className = 'form-text mt-1 text-success';
      this.classList.add('is-valid');
      this.classList.remove('is-invalid');
    } else {
      emailMessage.textContent = 'Ingrese un correo válido (ejemplo@gmail.com)';
      emailMessage.className = 'form-text mt-1 text-danger';
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
    }
    updateSubmitButton();
  });

  /* ----------------- FUNCIONES DE CONTRASEÑA Y CONFIRMAR CONTRASEÑA ----------------------- */
  const reqLength = document.getElementById('req-length');
  const reqUppercase = document.getElementById('req-uppercase');
  const reqNumber = document.getElementById('req-number');
  const reqSymbol = document.getElementById('req-symbol');
  const reqSpace = document.getElementById('req-space');

  const checkLength = document.getElementById('check-length');
  const checkUppercase = document.getElementById('check-uppercase');
  const checkNumber = document.getElementById('check-number');
  const checkSymbol = document.getElementById('check-symbol');
  const checkSpace = document.getElementById('check-space');

  function allValidationsPassed() {
    const value = passwordInput.value;
    return (
      value.length >= 6 &&
      /[A-Z]/.test(value) &&
      /\d/.test(value) &&
      /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(value) &&
      !/\s/.test(value)
    );
  }

  function updateItem(element, isValid, text, checkIcon) {
    element.textContent = text;
    element.className = isValid ? 'text-success' : 'text-danger';
    checkIcon.style.display = isValid ? 'inline' : 'none';
  }

  function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirm = confirmPasswordInput.value;

    if (confirm === '') {
      matchMessage.textContent = '';
      confirmPasswordInput.classList.remove('is-valid', 'is-invalid');
    } else if (password === confirm && allValidationsPassed()) {
      matchMessage.textContent = 'Las contraseñas coinciden';
      matchMessage.className = 'form-text mt-1 text-success';
      confirmPasswordInput.classList.add('is-valid');
      confirmPasswordInput.classList.remove('is-invalid');
    } else {
      matchMessage.textContent = 'Las contraseñas no coinciden';
      matchMessage.className = 'form-text mt-1 text-danger';
      confirmPasswordInput.classList.add('is-invalid');
      confirmPasswordInput.classList.remove('is-valid');
    }
    updateSubmitButton();
  }

  passwordInput.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
      e.preventDefault();
    }
  });

  confirmPasswordInput.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
      e.preventDefault();
    }
  });

  passwordInput.addEventListener('input', function() {
    const value = this.value;
    updateItem(reqLength, value.length >= 6, 'Al menos 6 caracteres', checkLength);
    updateItem(reqUppercase, /[A-Z]/.test(value), 'Debe tener al menos una mayúscula', checkUppercase);
    updateItem(reqNumber, /\d/.test(value), 'Debe tener al menos un número', checkNumber);
    updateItem(reqSymbol, /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(value), 'Debe tener al menos un signo (!@#$%^&*()[]{};:,.<>?\\| etc.)', checkSymbol);
    updateItem(reqSpace, !/\s/.test(value), 'No debe tener espacios', checkSpace);
    checkPasswordMatch();
  });

  confirmPasswordInput.addEventListener('input', checkPasswordMatch);

  /* ----------------- VALIDACIÓN GENERAL DEL FORMULARIO ----------------------- */
  function isFormValid() {
    return (
      validateFullname(fullnameInput.value.trim()) &&
      birthdateInput.value &&
      genderSelect.value !== "" &&
      emailRegex.test(emailInput.value) &&
      allValidationsPassed() &&
      passwordInput.value === confirmPasswordInput.value
    );
  }

  function updateSubmitButton() {
    registerBtn.disabled = !isFormValid();
  }

  form.addEventListener('submit', function(e) {
    if (!isFormValid()) {
      e.preventDefault();
      // Forzar validación visual de todos los campos
      fullnameInput.dispatchEvent(new Event('input'));
      birthdateInput.dispatchEvent(new Event('input'));
      genderSelect.dispatchEvent(new Event('change'));
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));
      confirmPasswordInput.dispatchEvent(new Event('input'));
    }
  });

  // Inicializar validaciones
  updateSubmitButton();
});
