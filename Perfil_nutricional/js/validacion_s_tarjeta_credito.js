/**** ANIMACIÓN CON LA SECCIÓN 7: TARJETA CRÉDITO Y CVV ****/
const cvvInput = document.getElementById("cvv");
const cardFlip = document.querySelector(".card-flip");
const cvvValue = document.querySelector(".lbl_cvv");

cvvInput.addEventListener("focus", () => {
  cardFlip.classList.add("flipped");
});

cvvInput.addEventListener("blur", () => {
  cardFlip.classList.remove("flipped");
});

// Mostrar CVV digitado en la tarjeta
cvvInput.addEventListener("input", () => {
  cvvValue.textContent = cvvInput.value || "****";
});

/**** ELEMENTOS DEL FORMULARIO Y REFLEJADOS EN LA TARJETA ****/
// Inputs
const cardNumberInput = document.getElementById("cardNumber");
const cardHolderInput = document.getElementById("cardHolder");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");
const cvvInput2 = document.getElementById("cvv");

// Labels de la tarjeta
const lblCardNumber = document.querySelector(".lbl_numero_tarjeta");
const lblCardHolder = document.querySelector(".lbl_titulo_tarjeta");
const lblExpDate = document.querySelector(".lbl_venc");
const lblCVV = document.querySelector(".lbl_cvv");

/**** 1. Número de tarjeta ****/
cardNumberInput.addEventListener("input", () => {
  let value = cardNumberInput.value.replace(/\D/g, ""); // Solo números
  value = value.substring(0, 16); // Máximo 16 dígitos
  cardNumberInput.value = value.replace(/(.{4})(?=.)/g, "$1 "); // Espacio cada 4

  // Reflejar
  lblCardNumber.textContent = cardNumberInput.value || "#### #### #### ####";

  // Validación
  if (value.length === 16) {
    setValid(cardNumberInput);
  } else {
    setError(cardNumberInput);
  }
});

/**** 2. Titular ****/
cardHolderInput.addEventListener("input", () => {
  let value = cardHolderInput.value.replace(/[^a-zA-Z\s]/g, ""); // Solo letras
  value = value.substring(0, 40);
  cardHolderInput.value = value;

  lblCardHolder.textContent = value || "Nombre completo";

  if (value.trim().length > 0) {
    setValid(cardHolderInput);
  } else {
    setError(cardHolderInput);
  }
});

/**** 3. Fecha de vencimiento ****/
function updateExpDate() {
  const month = monthSelect.value;
  const year = yearSelect.value;

  if (month && year && year !== "Año" && month !== "Mes") {
    const formatted = `${month.padStart(2, "0")}/${year.slice(-2)}`;
    lblExpDate.textContent = formatted;
    setValid(monthSelect);
    setValid(yearSelect);
  } else {
    lblExpDate.textContent = "MM/YY";
    setError(monthSelect);
    setError(yearSelect);
  }
}

monthSelect.addEventListener("change", updateExpDate);
yearSelect.addEventListener("change", updateExpDate);

/**** 4. CVV ****/
cvvInput2.addEventListener("input", () => {
  let value = cvvInput2.value.replace(/\D/g, ""); // Solo números
  value = value.substring(0, 4); // Máximo 4 dígitos
  cvvInput2.value = value;

  lblCVV.textContent = value || "****";

  if (value.length === 3 || value.length === 4) {
    setValid(cvvInput2);
  } else {
    setError(cvvInput2);
  }
});

/**** Helpers: validación visual ****/
function setValid(el) {
  el.classList.remove("campo-error");
  el.classList.add("campo-valido");
}

function setError(el) {
  el.classList.remove("campo-valido");
  el.classList.add("campo-error");
}
