(function () {
  var body = document.body;
  var burger = document.querySelector("[data-burger]");
  var nav = document.querySelector("[data-nav]");
  var backdrop = document.querySelector("[data-backdrop]");
  var year = document.querySelector("[data-year]");
  var form = document.querySelector("[data-lead-form]");
  var statusEl = document.querySelector("[data-form-status]");
  var MAIL_TO = "premiumclean@prmclean.ru";

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

  function setStatus(ok, text) {
    if (!statusEl) return;
    statusEl.className = "form__status " + (ok ? "is-ok" : "is-err");
    statusEl.textContent = text;
  }

  function leadLines(org, name, phone, service, comment) {
    return [
      "Заявка с сайта Премиум Клин Про",
      "Имя: " + name,
      "Телефон: +" + phone,
      "Организация: " + org,
      "Что убрать: " + service,
      "Детали: " + comment
    ].join("\n");
  }

  function mailtoFallback(text) {
    window.location.href = "mailto:" + MAIL_TO + "?subject=" +
      encodeURIComponent("Заявка с сайта Премиум Клин Про") +
      "&body=" + encodeURIComponent(text);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var phone = digitsPhone(data.get("phone"));
      if (phone.length !== 11) {
        setStatus(false, "Укажите телефон полностью");
        return;
      }
      var payload = {
        organization: String(data.get("organization") || "").trim(),
        name: String(data.get("name") || "").trim(),
        phone: phone,
        service: String(data.get("service") || "").trim(),
        comment: String(data.get("comment") || "").trim(),
        website: String(data.get("website") || ""),
        agree: true
      };
      var text = leadLines(payload.organization || "—", payload.name || "—", phone, payload.service || "—", payload.comment || "—");
      var btn = form.querySelector("[type=submit]");
      if (btn) btn.disabled = true;
      setStatus(true, "Отправляем заявку…");

      var endpoint = form.getAttribute("data-endpoint") || "/api/lead";
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (r) {
          return r.json().then(function (j) {
            if (!r.ok || !j.ok) throw new Error(j.error || "fail");
            return j;
          });
        })
        .then(function () {
          setStatus(true, "Заявка ушла. Перезвоним или напишем.");
          form.reset();
        })
        .catch(function () {
          setStatus(true, "Открываем письмо на почту компании…");
          mailtoFallback(text);
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }
})();
