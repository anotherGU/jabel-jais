document.addEventListener("DOMContentLoaded", () => {
  /* ---------- ACTIVITY MAP & DESCRIPTION ---------- */
  const activity = localStorage.getItem("activityName") || "Jais Flight";
  const titleEl = document.getElementById("activity-title");
  const descEl = document.getElementById("activity-desc");
  const mapEl = document.getElementById("activity-map");

  const detailsContainer = document.createElement("div");
  detailsContainer.className = "activity-details";
  if (mapEl && mapEl.parentElement) {
    mapEl.parentElement.after(detailsContainer);
  }

  const activityData = {
    "JAIS FLIGHT": {
      desc: "Soar over the Hajar Mountains on the world's longest zipline — pure adrenaline and panoramic beauty.",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.635204902045!2d56.12766407541459!3d25.95366627724008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f10!3m3!1m2!1s0x3ef6733b3d1a9473%3A0x1a171bc49cb9d13!2sJebel%20Jais%20Flight%20-%20World%E2%80%99s%20Longest%20Zipline!5e0!3m2!1sen!2sae!4v1706207453921!5m2!1sen!2sae&z=0",
      details: {
        duration: "2 hours total",
        bring: "Comfortable clothes",
        difficulty: "Moderate",
      },
    },
    "JAIS SKY TOUR": {
      desc: "Glide through 5 km of mountain ziplines and sky bridges — adventure with scenic views at 1,600m altitude.",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.612038941148!2d56.12619727541465!3d25.95451397723958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f10!3m3!1m2!1s0x3ef6733b9a7b1cdb%3A0x6df65d2dc99b7c1!2sJais%20Sky%20Tour!5e0!3m2!1sen!2sae!4v1706207512342!5m2!1sen!2sae",
      details: {
        duration: "1.5 hours",
        bring: "Sport shoes, sunglasses",
        difficulty: "Easy to Moderate",
      },
    },
    "BEAR GRYLLS EXPLORERS CAMP": {
      desc: "Learn survival skills in the rugged wilderness of Ras Al Khaimah, inspired by Bear Grylls himself.",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.4536152417135!2d56.15314947541481!3d25.960320577239027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f10!3m3!1m2!1s0x3ef67332c909f7a1%3A0xc0f01664e705fd2a!2sBear%20Grylls%20Explorers%20Camp!5e0!3m2!1sen!2sae!4v1706207601905!5m2!1sen!2sae",
      details: {
        duration: "Half-day or full-day",
        bring: "Outdoor wear, water bottle, hat",
        difficulty: "Challenging",
      },
    },
  };

  if (titleEl && descEl && mapEl) {
    titleEl.textContent = activity;
    const data =
      activityData[activity.toUpperCase()] || activityData["JAIS FLIGHT"];
    descEl.textContent = data.desc;
    mapEl.src = data.map;

    // Блок деталей
    detailsContainer.innerHTML = `
      <div class="details-grid">
        <div class="detail-item">
          <span class="icon">⏱</span>
          <span><strong>Duration:</strong> ${data.details.duration}</span>
        </div>
        <div class="detail-item">
          <span class="icon">🎒</span>
          <span><strong>Bring:</strong> ${data.details.bring}</span>
        </div>
        <div class="detail-item">
          <span class="icon">⚡</span>
          <span><strong>Difficulty:</strong> ${data.details.difficulty}</span>
        </div>
      </div>
    `;
  }

  /* ---------- DATE & TIME PICKER LOGIC ---------- */
  const dpTrigger = document.getElementById("dp-trigger");
  const dpTriggerText = document.getElementById("dp-trigger-text");
  const dpModal = document.getElementById("dp-modal");
  const dpClose = document.getElementById("dp-close");
  const dpCancel = document.getElementById("dp-cancel");
  const dpPrev = document.getElementById("dp-prev");
  const dpNext = document.getElementById("dp-next");
  const dpMonthLabel = document.getElementById("dp-month-label");
  const dpGrid = document.getElementById("dp-grid");

  const tpTrigger = document.getElementById("tp-trigger");
  const tpTriggerText = document.getElementById("tp-trigger-text");
  const tpModal = document.getElementById("tp-modal");
  const tpClose = document.getElementById("tp-close");
  const tpCancel = document.getElementById("tp-cancel");
  const tpGrid = document.getElementById("tp-grid");

  const timeBlock = document.getElementById("time-block");
  const confirmBtn = document.getElementById("confirm");
  const errorBox = document.getElementById("form-error");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = null;
  let selectedTime = null;

  const setStartOfDay = (d) => d.setHours(0, 0, 0, 0);
  const formatButtonDate = (date) =>
    date.toLocaleDateString("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  const formatTime = (h, m) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const showError = (msg) => {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  };
  const hideError = () => (errorBox.style.display = "none");

  /* ---------- DATE PICKER ---------- */
  function updateArrows() {
    const isAtMin =
      viewDate.getFullYear() === minMonth.getFullYear() &&
      viewDate.getMonth() === minMonth.getMonth();
    dpPrev.disabled = isAtMin;
  }

  function renderCalendar() {
    dpGrid.innerHTML = "";
    dpMonthLabel.textContent = viewDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    updateArrows();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const firstDay = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++)
      dpGrid.appendChild(document.createElement("div"));

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "dp-cell";
      cell.textContent = day;

      const cellDate = new Date(year, month, day);
      setStartOfDay(cellDate);

      if (cellDate < today) {
        cell.classList.add("disabled");
      } else {
        cell.addEventListener("click", () => {
          document
            .querySelectorAll(".dp-cell.selected")
            .forEach((c) => c.classList.remove("selected"));
          cell.classList.add("selected");
          selectedDate = cellDate;
          dpTriggerText.textContent = formatButtonDate(cellDate);
          dpModal.style.display = "none";
          timeBlock.classList.remove("hidden");
          setTimeout(() => timeBlock.classList.add("visible"), 20);
        });
      }
      dpGrid.appendChild(cell);
    }
  }

  function openDp() {
    dpModal.style.display = "flex";
    renderCalendar();
  }
  function closeDp() {
    dpModal.style.display = "none";
  }

  dpTrigger.addEventListener("click", openDp);
  dpClose.addEventListener("click", closeDp);
  if (dpCancel) dpCancel.addEventListener("click", closeDp);
  dpPrev.addEventListener("click", () => {
    const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    if (prev >= minMonth) viewDate = prev;
    renderCalendar();
  });
  dpNext.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  /* ---------- TIME PICKER ---------- */
  function renderTimeSlots() {
    tpGrid.innerHTML = "";
    const startHour = 5;
    const endHour = 22;
    const step = 30;
    const now = new Date();

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of [0, 30]) {
        if (hour === endHour && minute === 30) break;
        const cell = document.createElement("div");
        cell.className = "dp-cell";
        const timeStr = formatTime(hour, minute);
        cell.textContent = timeStr;

        if (selectedDate) {
          const slot = new Date(selectedDate);
          slot.setHours(hour, minute, 0, 0);
          if (
            selectedDate.toDateString() === new Date().toDateString() &&
            slot <= now
          ) {
            cell.classList.add("disabled");
          }
        }

        cell.addEventListener("click", () => {
          if (cell.classList.contains("disabled")) return;
          document
            .querySelectorAll("#tp-grid .dp-cell.selected")
            .forEach((c) => c.classList.remove("selected"));
          cell.classList.add("selected");
          selectedTime = timeStr;
          tpTriggerText.textContent = timeStr;
          tpModal.style.display = "none";
        });

        tpGrid.appendChild(cell);
      }
    }
  }

  function openTp() {
    if (!selectedDate) {
      showError("Please select a date first.");
      return;
    }
    hideError();
    tpModal.style.display = "flex";
    renderTimeSlots();
  }
  function closeTp() {
    tpModal.style.display = "none";
  }

  tpTrigger.addEventListener("click", openTp);
  tpClose.addEventListener("click", closeTp);
  if (tpCancel) tpCancel.addEventListener("click", closeTp);

  /* ---------- CONFIRM ---------- */
  confirmBtn.addEventListener("click", () => {
    hideError();
    if (!selectedDate) {
      showError("Please select a date.");
      return;
    }
    if (!selectedTime) {
      showError("Please select a time slot.");
      return;
    }

    localStorage.setItem("selectedDate", selectedDate.toISOString());
    localStorage.setItem("selectedTime", selectedTime);
    window.location.href = "/card";
  });
});
