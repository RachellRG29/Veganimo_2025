// JS para activar solo una tarjeta
const cards = document.querySelectorAll(".plan-card");

cards.forEach(card => {
  card.addEventListener("click", () => {
    cards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
  });
});
