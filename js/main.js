(function () {
  var body = document.body;
  var burger = document.querySelector("[data-burger]");
  var nav = document.querySelector("[data-nav]");
  var backdrop = document.querySelector("[data-backdrop]");
  var year = document.querySelector("[data-year]");
  var form = document.querySelector("[data-lead-form]");
  var statusEl = document.querySelector("[data-form-status]");

  if (year) year.textContent = String(new Date().getFullYear());

  function setMenu(open) {
    body.classList.toggle("is-menu-open", open);
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) backdrop.hidden = !open;
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setMenu(!body.classList.contains("is-menu-open"));
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setMenu(false);
    });
  }

  if (nav) {
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setMenu(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  function digitsPhone(value) {
    var d = String(value || "").replace(/\D/g, "");
    if (d.length === 11 && d[0] === "8") d = "7" + d.slice(1);
    if (d.length === 10) d = "7" + d;
    return d;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var phone = digitsPhone(data.get("phone"));
      if (phone.length !== 11) {
        if (statusEl) {
          statusEl.className = "form__status is-err";
          statusEl.textContent = "Укажите телефон полностью";
        }
        return;
      }
      var lines = [
        "Заявка с сайта Премиум Клин Про",
        "Имя: " + (data.get("name") || "—"),
        "Телефон: +" + phone,
        "Услуга: " + (data.get("service") || "—"),
        "Комментарий: " + (data.get("comment") || "—")
      ];
      var url = "https://wa.me/79855487003?text=" + encodeURIComponent(lines.join("\n"));
      if (statusEl) {
        statusEl.className = "form__status is-ok";
        statusEl.textContent = "Открываем WhatsApp…";
      }
      window.open(url, "_blank", "noopener");
    });
  }
})();
