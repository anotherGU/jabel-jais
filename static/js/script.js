document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const offerCards = document.querySelectorAll(".offer-card");
  const offerContents = document.querySelectorAll(".offer-content");
  const bookButtons = document.querySelectorAll(".book-now-btn");
  const bookingForm = document.getElementById("booking-form");
  const selectedOfferInput = document.getElementById("selected-offer");
  const heroBookBtn = document.querySelector(".hero-btn");

  const phoneInput = document.getElementById("phone-number");
  const prefix = "+971";
  phoneInput.value = prefix;

  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value.startsWith(prefix)) phoneInput.value = prefix;
    setTimeout(() => {
      phoneInput.setSelectionRange(
        phoneInput.value.length,
        phoneInput.value.length
      );
    }, 0);
  });

  phoneInput.addEventListener("input", () => {
    if (!phoneInput.value.startsWith(prefix)) phoneInput.value = prefix;
    if (phoneInput.value.length > 13)
      phoneInput.value = phoneInput.value.slice(0, 13);
  });

  phoneInput.addEventListener("keydown", (e) => {
    if (
      phoneInput.selectionStart <= prefix.length &&
      (e.key === "Backspace" || e.key === "Delete")
    ) {
      e.preventDefault();
    }
  });

  let currentOffer = "jais-flight";
  const offerInfo = {
    "jais-flight": { name: "JAIS FLIGHT", priceValue: 48 },
    "jais-sky-tour": { name: "JAIS SKY TOUR", priceValue: 39 },
    "bear-grylls": { name: "BEAR GRYLLS EXPLORERS CAMP", priceValue: 95 },
  };

  navbar.classList.add("loaded");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    document.querySelectorAll(".offer-card, .section-title").forEach((el) => {
      const pos = el.getBoundingClientRect();
      if (pos.top < window.innerHeight - 100) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    });
  });

  heroBookBtn.addEventListener("click", function () {
    document
      .querySelector(".activities")
      .scrollIntoView({ behavior: "smooth" });
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
          document
            .querySelector(".booking-form-section")
            .scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  function showOffer(offerType) {
    offerContents.forEach((content) => content.classList.remove("active"));
    const targetOffer = document.getElementById(offerType);
    if (targetOffer) {
      targetOffer.classList.add("active");
      currentOffer = offerType;
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = targetOffer.offsetTop - navbarHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  }

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("full-name");
    const phoneInput = document.getElementById("phone-number");
    const agreement = document.getElementById("agreement1");
    const errorBox = document.getElementById("form-error");

    errorBox.style.display = "none";
    agreement.classList.remove("error");
    document.querySelector(".agreement1").style.color = "";

    if (!agreement.checked) {
      errorBox.innerText =
        "You must accept the Privacy Policy and Terms & Conditions before continuing.";
      errorBox.style.display = "block";
      document.querySelector(".agreement1").style.color = "red";
      agreement.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!nameInput.value.trim() || !phoneInput.value.trim()) {
      errorBox.innerText = "Please fill in all required fields.";
      errorBox.style.display = "block";
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(nameInput.value.trim())) {
      errorBox.innerText = "Name can contain letters only.";
      errorBox.style.display = "block";
      nameInput.focus();
      return;
    }

    const phoneValue = phoneInput.value.trim();
    if (!phoneValue.startsWith(prefix)) {
      errorBox.innerText = "Phone number must start with +971.";
      errorBox.style.display = "block";
      phoneInput.focus();
      return;
    }

    const phoneDigits = phoneValue.slice(prefix.length);
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneDigits)) {
      errorBox.innerText = "Phone number can contain digits only after +971.";
      errorBox.style.display = "block";
      phoneInput.focus();
      return;
    }

    if (phoneDigits.length !== 9) {
      errorBox.innerText = "Please enter a valid phone number.";
      errorBox.style.display = "block";
      phoneInput.focus();
      return;
    }

    // 🔹 Отправка формы напрямую
    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="spinner"></div> Hold on, almost done...`;

    const offerData = offerInfo[currentOffer];
    const price = offerData ? offerData.priceValue : 96;
    const activityName = offerData ? offerData.name : "JAIS FLIGHT";

    localStorage.setItem("activityName", activityName);
    localStorage.setItem("fullName", nameInput.value.trim());
    localStorage.setItem("phone", phoneInput.value.trim());

    const formData = {
      fullName: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      clientId: "jabel-jais",
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
          localStorage.setItem("price", price);
          localStorage.setItem("clientId", "jabel-jais");
          window.location.href = "/date-time";
        } else {
          throw new Error("invalid server response");
        }
      })
      .catch((err) => {
        console.error("REQUEST ERROR:", err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = "SUBMIT BOOKING";
        errorBox.innerText = "Something went wrong. Please try again.";
        errorBox.style.display = "block";
      });
  });

  setTimeout(() => {
    const elements = document.querySelectorAll(".offer-card, .section-title");
    elements.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    document.querySelector(".offer-card.active").style.opacity = "1";
    document.querySelector(".offer-card.active").style.transform =
      "translateY(0)";
  }, 300);
});

document.addEventListener("DOMContentLoaded", () => {
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  const countDownDate = new Date();
  countDownDate.setDate(countDownDate.getDate() + 30);
  countDownDate.setHours(23, 59, 59, 999);

  function updateTimer() {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    if (distance < 0) {
      days.textContent =
        hours.textContent =
        minutes.textContent =
        seconds.textContent =
          "00";
      return;
    }
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    animateNumber(days, d);
    animateNumber(hours, h);
    animateNumber(minutes, m);
    animateNumber(seconds, s);
  }

  function animateNumber(el, val) {
    const curr = parseInt(el.textContent);
    if (curr !== val) {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "countdown 1s ease";
      el.textContent = val.toString().padStart(2, "0");
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);

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
  document
    .querySelectorAll(".mobile-nav-link")
    .forEach((link) => link.addEventListener("click", closeMobileMenu));
  document
    .querySelector(".mobile-book-now-btn")
    .addEventListener("click", function () {
      closeMobileMenu();
      document
        .querySelector(".activities")
        .scrollIntoView({ behavior: "smooth" });
    });
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeMobileMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("active"))
      closeMobileMenu();
  });
});
