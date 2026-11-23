// Гар утсан дээр цэсийг нээж хаах
document.querySelectorAll(".nav__toggle").forEach(function (button) {
  button.addEventListener("click", function () {
    var nav = button.closest(".nav");
    var open = nav.classList.toggle("nav--open");
    button.setAttribute("aria-expanded", open ? "true" : "false");
  });
});
