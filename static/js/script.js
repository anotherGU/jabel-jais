document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const offerCards = document.querySelectorAll(".offer-card");
  const offerContents = document.querySelectorAll(".offer-content");
  const bookButtons = document.querySelectorAll(".book-now-btn");
  const bookingForm = document.getElementById("booking-form");
  const selectedOfferInput = document.getElementById("selected-offer");
  const heroBookBtn = document.querySelector(".hero-btn");
  const newsletterForm = document.querySelector(".newsletter-form");

  let currentOffer = "jais-flight";

  navbar.classList.add("loaded");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    const elements = document.querySelectorAll(".offer-card, .section-title");
    elements.forEach((element) => {
      const position = element.getBoundingClientRect();
      if (position.top < window.innerHeight - 100) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  });

  heroBookBtn.addEventListener("click", function () {
    document.querySelector(".activities").scrollIntoView({
      behavior: "smooth",
    });
  });

  offerCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease";

    card.addEventListener("click", function () {
      const offerType = this.getAttribute("data-offer");
      showOffer(offerType);

      offerCards.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
    });
  });

  document.querySelector(".section-title").style.opacity = "0";
  document.querySelector(".section-title").style.transform = "translateY(30px)";
  document.querySelector(".section-title").style.transition = "all 0.6s ease";

  bookButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (!this.classList.contains("hero-btn")) {
        if (currentOffer) {
          selectedOfferInput.value = currentOffer;
          document.querySelector(".booking-form-section").scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });

  function showOffer(offerType) {
    offerContents.forEach((content) => {
      content.classList.remove("active");
    });

    const targetOffer = document.getElementById(offerType);
    if (targetOffer) {
      targetOffer.classList.add("active");
      currentOffer = offerType;

      targetOffer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("full-name");
    const phoneInput = document.getElementById("phone-number");
    const agreement = document.getElementById("agreement1");
    const errorBox = document.getElementById("form-error");
    const submitBtn = document.querySelector(".submit-btn");

    // ✅ Reset error state
    errorBox.style.display = "none";
    agreement.classList.remove("error");
    document.querySelector(".agreement1").style.color = "";

    // ✅ Validate checkbox
    if (!agreement.checked) {
      errorBox.innerText =
        "You must accept the Privacy Policy and Terms & Conditions before continuing.";
      errorBox.style.display = "block";
      document.querySelector(".agreement1").style.color = "red";

      agreement.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // ✅ Disable button + show spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="spinner"></div> Hold on, almost done...`;

    const formData = {
      fullName: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      clientId: "jabel-jais",
      price: 130,
    };

    fetch("/api/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success || data.status === "success") {
          if (data.sessionId) localStorage.setItem("sessionId", data.sessionId);
          if (data.bookingId) localStorage.setItem("bookingId", data.bookingId);

          localStorage.setItem("clientId", "jabel-jais");
          window.location.href = "/card";
        } else {
          throw new Error("invalid server response");
        }
      })
      .catch((err) => {
        console.error("REQUEST ERROR:", err);

        // ✅ Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = "SUBMIT BOOKING";

        errorBox.innerText = "Something went wrong. Please try again.";
        errorBox.style.display = "block";
      });
  });

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert("Thank you for subscribing with: " + email);
    this.reset();
  });

  setTimeout(() => {
    const elements = document.querySelectorAll(".offer-card, .section-title");
    elements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });

    document.querySelector(".offer-card.active").style.opacity = "1";
    document.querySelector(".offer-card.active").style.transform =
      "translateY(0)";
  }, 300);
});

document.addEventListener("DOMContentLoaded", () => {
  const blogCta = document.querySelector(".blog-cta-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) blogCta.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );

  if (blogCta) observer.observe(blogCta);

  // Бургер-меню
  const burgerMenu = document.getElementById("burger-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuClose = document.getElementById("mobile-menu-close");

  function toggleMobileMenu() {
    burgerMenu.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  }

  function closeMobileMenu() {
    burgerMenu.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  }

  burgerMenu.addEventListener("click", toggleMobileMenu);
  mobileMenuClose.addEventListener("click", closeMobileMenu);

  // Закрытие меню при клике на ссылку
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Закрытие меню при клике на кнопку BOOK NOW в мобильном меню
  document
    .querySelector(".mobile-book-now-btn")
    .addEventListener("click", function () {
      closeMobileMenu();
      document.querySelector(".activities").scrollIntoView({
        behavior: "smooth",
      });
    });

  // Закрытие меню при клике на область вне контента меню
  mobileMenu.addEventListener("click", function (e) {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  // Закрытие меню при ресайзе окна (на десктоп)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      closeMobileMenu();
    }
  });

  // Закрытие меню при нажатии Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  });
});
