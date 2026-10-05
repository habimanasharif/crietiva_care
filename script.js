(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector("header");
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector(".nav-panel");

  function closeMenu() {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    panel.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      panel.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        window.setTimeout(closeMenu, 50);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  var greeting = document.querySelector("[data-greeting]");
  if (greeting) {
    var hour = new Date().getHours();
    var hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    greeting.textContent = hello + " from Kingston.";
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el, index) {
      el.style.setProperty("--delay", (index % 6) * 70 + "ms");
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  document.querySelectorAll(".card, .value").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      if (!window.matchMedia("(hover: hover)").matches) return;
      var box = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((event.clientX - box.left) / box.width) * 100 + "%");
      card.style.setProperty("--my", ((event.clientY - box.top) / box.height) * 100 + "%");
    });
  });

  var topBtn = document.querySelector(".to-top");
  if (topBtn) {
    window.addEventListener(
      "scroll",
      function () {
        topBtn.classList.toggle("is-visible", window.scrollY > 420);
      },
      { passive: true }
    );
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = document.getElementById("name").value.trim();
      var phone = document.getElementById("phone").value.trim();
      var email = document.getElementById("email").value.trim();
      var forWhom = document.getElementById("for-whom").value.trim();
      var message = document.getElementById("message").value.trim();
      var body = [
        "Name: " + name,
        "Phone: " + phone,
        "Email: " + email,
        "Care for: " + forWhom,
        "",
        message
      ].join("\n");
      window.location.href =
        "mailto:hello@creativacare.ca?subject=" +
        encodeURIComponent("Creativa Care inquiry from " + name) +
        "&body=" +
        encodeURIComponent(body);
      var status = document.getElementById("form-status");
      status.hidden = false;
      status.textContent =
        "Your email app should open with the message ready to send. You can also call 613-583-7320.";
    });
  }
})();
