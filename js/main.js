// Хүчин чадлын слайдер: сум, цэгээр слайд солих, хажуу талд өмнөх/дараагийн зураг харуулах
document.querySelectorAll(".carousel").forEach(function (carousel) {
  var slides = carousel.querySelectorAll(".slide--main");
  var sides = carousel.querySelectorAll(".slide--side");
  var dotsBox = carousel.parentElement.querySelector(".dots");
  var current = 0;
  var dots = [];

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Слайд " + (i + 1));
    dot.addEventListener("click", function () { show(i); });
    dotsBox.appendChild(dot);
    dots.push(dot);
  });

  function peek(side, slide) {
    var img = slide.querySelector(".slide__img");
    side.style.backgroundImage = img ? "linear-gradient(rgba(243,246,250,.45), rgba(243,246,250,.45)), url('" + img.src + "')" : "";
  }

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.hidden = n !== current; });
    dots.forEach(function (d, n) { d.setAttribute("aria-current", n === current ? "true" : "false"); });
    if (slides.length > 1 && sides.length === 2) {
      peek(sides[0], slides[(current - 1 + slides.length) % slides.length]);
      peek(sides[1], slides[(current + 1) % slides.length]);
    }
  }

  carousel.querySelector(".carousel__btn--prev").addEventListener("click", function () { show(current - 1); });
  carousel.querySelector(".carousel__btn--next").addEventListener("click", function () { show(current + 1); });
  show(0);
});

// Тусгай зөвшөөрлийн зураг дээр усан тэмдэг (watermark) тавих
var WATERMARK_TEXT = "Зөвхөн танилцуулах зорилгоор · bodirail.mn";
document.querySelectorAll("[data-watermark]").forEach(function (el) {
  var wm = document.createElement("div");
  wm.className = "wm";
  wm.setAttribute("aria-hidden", "true");
  for (var i = 0; i < 16; i++) {
    var line = document.createElement("span");
    line.textContent = (WATERMARK_TEXT + "      ").repeat(4);
    wm.appendChild(line);
  }
  el.appendChild(wm);
});

// Тусгай зөвшөөрлийг томоор харуулах (татаж авах холбоосгүй)
var viewer = document.getElementById("license-viewer");
if (viewer) {
  var viewerImg = viewer.querySelector("img");
  document.querySelectorAll("[data-license-open]").forEach(function (button) {
    button.addEventListener("click", function () {
      var img = button.querySelector("img");
      viewerImg.src = img.src;
      viewerImg.alt = img.alt;
      viewer.showModal();
    });
  });
  viewer.querySelector(".viewer__close").addEventListener("click", function () { viewer.close(); });
  viewer.addEventListener("click", function (e) { if (e.target === viewer) viewer.close(); });
}

// Хамгаалсан зураг дээр баруун товчны цэс гаргахгүй
document.addEventListener("contextmenu", function (e) {
  if (e.target.closest && e.target.closest(".license__doc, .viewer")) e.preventDefault();
});

// Гар утсан дээр цэсийг нээж хаах
document.querySelectorAll(".nav__toggle").forEach(function (button) {
  button.addEventListener("click", function () {
    var nav = button.closest(".nav");
    var open = nav.classList.toggle("nav--open");
    button.setAttribute("aria-expanded", open ? "true" : "false");
  });
});
