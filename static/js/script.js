document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const offerCards = document.querySelectorAll(".offer-card");
  const offerContents = document.querySelectorAll(".offer-content");
  const bookButtons = document.querySelectorAll(".book-now-btn");
  const bookingForm = document.getElementById("booking-form");
  const selectedOfferInput = document.getElementById("selected-offer");
  const heroBookBtn = document.querySelector(".hero-btn");
  const newsletterForm = document.querySelector(".newsletter-form");

  const phoneInput = document.getElementById("phone-number");
  const prefix = "+971";

  // Устанавливаем префикс при загрузке
  phoneInput.value = prefix;

  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value.startsWith(prefix)) {
      phoneInput.value = prefix;
    }
    setTimeout(() => {
      phoneInput.setSelectionRange(
        phoneInput.value.length,
        phoneInput.value.length
      );
    }, 0);
  });

  phoneInput.addEventListener("input", () => {
    if (!phoneInput.value.startsWith(prefix)) {
      phoneInput.value = prefix;
    }

    // Ограничиваем максимум 13 символов (+971 + 9 цифр)
    if (phoneInput.value.length > 13) {
      phoneInput.value = phoneInput.value.slice(0, 13);
    }
  });

  // Блокируем удаление префикса
  phoneInput.addEventListener("keydown", (e) => {
    if (
      phoneInput.selectionStart <= prefix.length &&
      (e.key === "Backspace" || e.key === "Delete")
    ) {
      e.preventDefault();
    }
  });

  // Элементы модального окна подтверждения
  const confirmationModal = document.getElementById("confirmation-modal");
  const confirmOfferName = document.getElementById("confirm-offer-name");
  const confirmOfferPrice = document.getElementById("confirm-offer-price");
  const confirmCustomerName = document.getElementById("confirm-customer-name");
  const confirmCustomerPhone = document.getElementById(
    "confirm-customer-phone"
  );
  const modalCancel = document.getElementById("modal-cancel");
  const modalConfirm = document.getElementById("modal-confirm");

  let currentOffer = "jais-flight";

  // Объект с информацией об офферах
  const offerInfo = {
    "jais-flight": {
      name: "JAIS FLIGHT",
      price: "48.00 AED",
      priceValue: 48,
    },
    "jais-sky-tour": {
      name: "JAIS SKY TOUR",
      price: "39.00 AED",
      priceValue: 39,
    },
    "bear-grylls": {
      name: "BEAR GRYLLS EXPLORERS CAMP",
      price: "95.00 AED",
      priceValue: 95,
    },
  };

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

      // Получаем высоту навигационной панели
      const navbarHeight = navbar.offsetHeight;

      // Вычисляем позицию для прокрутки с учетом высоты навигации
      const targetPosition = targetOffer.offsetTop - navbarHeight - 20; // 20px для небольшого отступа

      // Прокручиваем к вычисленной позиции
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("full-name");
    const phoneInput = document.getElementById("phone-number");
    const agreement = document.getElementById("agreement1");
    const errorBox = document.getElementById("form-error");

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

    // ✅ Validate name and phone
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

    // ✅ Validate phone: проверяем что номер начинается с +971 и содержит только цифры после префикса
    const phoneValue = phoneInput.value.trim();
    if (!phoneValue.startsWith(prefix)) {
      errorBox.innerText = "Phone number must start with +971.";
      errorBox.style.display = "block";
      phoneInput.focus();
      return;
    }

    // Проверяем что после префикса только цифры
    const phoneDigits = phoneValue.slice(prefix.length);
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneDigits)) {
      errorBox.innerText = "Phone number can contain digits only after +971.";
      errorBox.style.display = "block";
      phoneInput.focus();
      return;
    }

    // ✅ Optional: minimum phone length (без префикса)
    if (phoneDigits.length !== 9) {
      errorBox.innerText = "Please enter a valid phone number.";
      errorBox.style.display = "block";
      phoneInput.focus();
      return;
    }

    // ✅ Показываем модалку подтверждения
    showConfirmationModal(nameInput.value.trim(), phoneValue);
  });

  // Функция показа модалки подтверждения
  function showConfirmationModal(name, phone) {
    // Заполняем данные в модалке
    const offerData = offerInfo[currentOffer];
    confirmOfferName.textContent = offerData.name;
    confirmOfferPrice.textContent = offerData.price;
    confirmCustomerName.textContent = name;
    confirmCustomerPhone.textContent = phone;

    // Показываем модалку
    confirmationModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Обработчики для модалки
  modalCancel.addEventListener("click", function () {
    confirmationModal.classList.remove("active");
    document.body.style.overflow = "";
  });

  modalConfirm.addEventListener("click", function () {
    // Закрываем модалку
    confirmationModal.classList.remove("active");
    document.body.style.overflow = "";

    // Вызываем функцию отправки формы
    submitBookingForm();
  });

  // Закрытие модалки по клику вне контента
  confirmationModal.addEventListener("click", function (e) {
    if (e.target === confirmationModal) {
      confirmationModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Закрытие модалки по Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && confirmationModal.classList.contains("active")) {
      confirmationModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Функция отправки формы
  function submitBookingForm() {
    const nameInput = document.getElementById("full-name");
    const phoneInput = document.getElementById("phone-number");
    const submitBtn = document.querySelector(".submit-btn");

    // ✅ Disable button + show spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="spinner"></div> Hold on, almost done...`;

    // ✅ Получаем цену из объекта offerInfo
    const offerData = offerInfo[currentOffer];
    const price = offerData ? offerData.priceValue : 96;

    // ✅ Сохраняем название активности в localStorage
    const activityName = offerData ? offerData.name : "JAIS FLIGHT";
    localStorage.setItem("activityName", activityName);

    const formData = {
      fullName: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      clientId: "jabel-jais",
      price: price,
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

        // ✅ Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = "SUBMIT BOOKING";

        const errorBox = document.getElementById("form-error");
        errorBox.innerText = "Something went wrong. Please try again.";
        errorBox.style.display = "block";
      });
  }

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
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  // Устанавливаем дату окончания (текущая дата + 30 дней)
  const countDownDate = new Date();
  countDownDate.setDate(countDownDate.getDate() + 30);
  countDownDate.setHours(23, 59, 59, 999);

  function updateTimer() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance < 0) {
      // Таймер истек
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Анимируем изменение чисел
    animateNumber(daysElement, days);
    animateNumber(hoursElement, hours);
    animateNumber(minutesElement, minutes);
    animateNumber(secondsElement, seconds);
  }

  function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent);
    if (currentValue !== newValue) {
      element.style.animation = "none";
      void element.offsetWidth; // Trigger reflow
      element.style.animation = "countdown 1s ease";
      element.textContent = newValue.toString().padStart(2, "0");
    }
  }

  // Обновляем таймер каждую секунду
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
