// Онлайн анкет (hunii-nuuts.html)
//
// Анкетыг хүлээн авах хаяг. Хоосон бол маягт илгээгдэхгүй, зөвхөн шалгалт ажиллана.
// Formspree, Netlify Forms, Getform гэх мэт файл хүлээн авдаг үйлчилгээний хаягийг энд бичнэ.
var ANKET_ENDPOINT = "";

var MAX_FILE_MB = 5;

(function () {
  var form = document.getElementById("anket");
  if (!form) return;

  var status = document.getElementById("form-status");
  var position = document.getElementById("position_1");

  // ---------- Давтагдах мөрүүд (сургууль, ажлын туршлага г.м) ----------
  function addRow(repeat) {
    var tpl = document.getElementById(repeat.dataset.template);
    var row = tpl.content.firstElementChild.cloneNode(true);
    var prefix = repeat.dataset.name;
    if (prefix) {
      row.querySelectorAll("[data-field]").forEach(function (el) {
        el.name = prefix + "_" + el.dataset.field + "[]";
      });
    }
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn-remove";
    remove.textContent = "Устгах";
    remove.setAttribute("aria-label", "Энэ мөрийг устгах");
    remove.addEventListener("click", function () {
      row.remove();
      updateRemoveButtons(repeat);
    });
    row.appendChild(remove);
    repeat.appendChild(row);
    updateRemoveButtons(repeat);
    return row;
  }

  function updateRemoveButtons(repeat) {
    var min = parseInt(repeat.dataset.min || "0", 10);
    var rows = repeat.querySelectorAll(".row-card");
    rows.forEach(function (row) {
      row.querySelector(".btn-remove").hidden = rows.length <= min;
    });
  }

  form.querySelectorAll(".repeat").forEach(function (repeat) {
    var min = parseInt(repeat.dataset.min || "0", 10);
    for (var i = 0; i < min; i++) addRow(repeat);
  });

  form.querySelectorAll("[data-add]").forEach(function (button) {
    button.addEventListener("click", function () {
      var repeat = button.previousElementSibling;
      var row = addRow(repeat);
      var first = row.querySelector("input, select, textarea");
      if (first) first.focus();
    });
  });

  // ---------- Ажлын байрны картаас сонгоход албан тушаалыг бөглөх ----------
  document.querySelectorAll("[data-apply]").forEach(function (link) {
    link.addEventListener("click", function () {
      position.value = link.dataset.apply;
      position.dispatchEvent(new Event("change"));
    });
  });

  // ---------- Жолоочийн албан тушаалд жолооны үнэмлэх заавал ----------
  var licenseReq = document.getElementById("license-req");
  var drivingYears = document.getElementById("driving_years");
  function isDriver() { return position.value === "Захиргааны жолооч"; }

  // Ачаа вагон хүлээлцэгч, тооцооны операторт иргэний үнэмлэх, ажил байдлын тодорхойлолт заавал
  var RAIL_POSITIONS = ["Ачаа вагон хүлээлцэгч", "Төмөр замын тээврийн тооцооны оператор"];
  function isRailJob() { return RAIL_POSITIONS.indexOf(position.value) !== -1; }

  position.addEventListener("change", function () {
    licenseReq.hidden = !isDriver();
    drivingYears.required = isDriver();
    form.querySelectorAll("[data-required-rail]").forEach(function (el) { el.required = isRailJob(); });
    form.querySelectorAll("[data-req-rail]").forEach(function (el) { el.hidden = !isRailJob(); });
  });

  // ---------- Өнөөдрийн огноо ----------
  var today = new Date();
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  document.getElementById("submitted_date").value =
    today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());

  // ---------- Цээж зургийн урьдчилсан харагдац ----------
  var photoInput = form.querySelector('input[name="photo"]');
  var preview = document.getElementById("photo-preview");
  photoInput.addEventListener("change", function () {
    var file = photoInput.files[0];
    preview.innerHTML = "";
    if (file && file.type.indexOf("image/") === 0) {
      var img = document.createElement("img");
      img.alt = "";
      img.src = URL.createObjectURL(file);
      preview.appendChild(img);
    } else {
      preview.innerHTML = "<span>Цээж зураг<br>3×4</span>";
    }
  });

  // ---------- Шалгалт ----------
  function fileError(input) {
    var max = parseFloat(input.dataset.maxMb || MAX_FILE_MB) * 1024 * 1024;
    for (var i = 0; i < input.files.length; i++) {
      if (input.files[i].size > max) {
        return "“" + input.files[i].name + "” файл " + MAX_FILE_MB + " MB-аас их байна.";
      }
    }
    return "";
  }

  function fieldLabel(el) {
    var label = el.closest("label") || el.closest(".field");
    if (!label) return "Талбар";
    return label.childNodes[0].textContent.replace("*", "").trim() || "Талбар";
  }

  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("input", function () { el.classList.remove("is-invalid"); });
    el.addEventListener("change", function () {
      el.classList.remove("is-invalid");
      if (el.type === "file") el.setCustomValidity(fileError(el));
    });
  });

  function validate() {
    form.querySelectorAll(".is-invalid").forEach(function (el) { el.classList.remove("is-invalid"); });
    var licenseBox = document.getElementById("license-classes");
    licenseBox.classList.remove("is-invalid");

    var firstBad = null;
    var message = "";

    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      if (el.type === "file") el.setCustomValidity(fileError(el));
      if (!el.checkValidity()) {
        el.classList.add("is-invalid");
        if (!firstBad) {
          firstBad = el;
          if (el.type === "file" && el.validationMessage && el.files.length) {
            message = el.validationMessage;
          } else if (el.name === "register_no" && el.value) {
            message = "Регистрийн дугаар 2 үсэг, 8 тооноос бүрдэнэ (жишээ нь АА00000000).";
          } else if (el.type === "checkbox") {
            message = "Баталгаажуулалтын хэсгийг зөвшөөрнө үү.";
          } else {
            message = "“" + fieldLabel(el) + "” талбарыг бөглөнө үү.";
          }
        }
      }
    });

    if (!firstBad && isDriver() && !licenseBox.querySelector("input:checked")) {
      licenseBox.classList.add("is-invalid");
      firstBad = licenseBox.querySelector("input");
      message = "Захиргааны жолоочийн ажилд жолооны үнэмлэхний ангиллаа сонгоно уу.";
    }

    if (firstBad) {
      status.className = "form-status is-error";
      status.textContent = message;
      firstBad.focus();
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }

  // ---------- Илгээх ----------
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;

    if (!ANKET_ENDPOINT) {
      status.className = "form-status is-error";
      status.textContent = "Анкет бүрэн бөглөгдсөн байна. Гэхдээ анкет хүлээн авах хаяг одоогоор тохируулагдаагүй тул илгээгдсэнгүй.";
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.className = "form-status";
    status.textContent = "Илгээж байна…";

    fetch(ANKET_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        preview.innerHTML = "<span>Цээж зураг<br>3×4</span>";
        status.className = "form-status is-success";
        status.textContent = "Таны анкет амжилттай илгээгдлээ. Баярлалаа! Бид тантай удахгүй холбогдох болно.";
      })
      .catch(function () {
        status.className = "form-status is-error";
        status.textContent = "Илгээхэд алдаа гарлаа. Дахин оролдох эсвэл info@bodirail.mn хаягаар холбогдоно уу.";
      })
      .finally(function () { button.disabled = false; });
  });
})();
