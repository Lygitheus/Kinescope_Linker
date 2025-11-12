console.log("[Kinescope Linker] Kinescope Linker запущен");

function parseDateTime(dateStr, timeStr) {
  const months = {
    "Янв": 0, "Фев": 1, "Мар": 2, "Апр": 3, "Май": 4, "Июн": 5,
    "Июл": 6, "Авг": 7, "Сен": 8, "Окт": 9, "Ноя": 10, "Дек": 11
  };
  const [day, mon, year] = dateStr.replace(",", "").trim().split(" ");
  const [hours, minutes] = timeStr.trim().split(":").map(Number);
  return new Date(Number(year), months[mon], Number(day), hours, minutes);
}

function highlightDivs() {
  const containers = document.querySelectorAll("div.rounded-2xl");
  const now = new Date();

  containers.forEach(container => {
    const times = container.querySelectorAll("time");
    if (times.length < 4) return;

    const startDateStr = times[0].textContent.trim();
    const startTimeStr = times[1].textContent.trim();
    const endDateStr = times[2].textContent.trim();
    const endTimeStr = times[3].textContent.trim();

    const start = parseDateTime(startDateStr, startTimeStr);
    const end = parseDateTime(endDateStr, endTimeStr);

    container.style.backgroundColor = "";
    container.style.transition = "background-color 0.4s ease";

    const sameDay = start.toDateString() === now.toDateString();

    if (now > end) {
      // Трансляция завершена
      container.style.backgroundColor = "#daffef";
    } else if (now >= start && now <= end) {
      // Трансляция идет прямо сейчас
      container.style.backgroundColor = "#ffebda";
    } else if (sameDay && now < start) {
      // Сегодня, но ещё не началась
      container.style.backgroundColor = "#ddefff";
    }
  });
}

function addDirectLinks() {
  const iframes = document.querySelectorAll('iframe[src*="kinescope.io/chat/"]');
  if (!iframes || iframes.length === 0) {
    console.log("[Kinescope Linker] Ссылки не найдены");
    return;
  }

  console.log(`[Kinescope Linker] Найдено ссылок: ${iframes.length}`);

  iframes.forEach(iframe => {
    const src = iframe.getAttribute("src");
    if (!src || !src.includes("/chat/")) return;

    const directLink = src.replace("/chat/", "/");
    const container = iframe.closest("div.rounded-2xl");
    if (!container) return;

    if (container.querySelector(".direct-link-btn")) return;

    const btn = document.createElement("a");
    btn.href = directLink;
    btn.textContent = "Открыть трансляцию";
    btn.target = "_blank";
    btn.className = "direct-link-btn";
    Object.assign(btn.style, {
      marginLeft: "10px",
      background: "#4F46E5",
      color: "white",
      borderRadius: "6px",
      padding: "4px 10px",
      fontSize: "14px",
      textDecoration: "none",
      fontWeight: "500",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background 0.2s",
    });

    btn.addEventListener("mouseenter", () => (btn.style.background = "#3730A3"));
    btn.addEventListener("mouseleave", () => (btn.style.background = "#4F46E5"));

    const header = container.querySelector(".flex.justify-between") || container.firstElementChild;
    if (header) header.appendChild(btn);
  });
}

// Первый запуск
addDirectLinks();
highlightDivs();

const observer = new MutationObserver(() => {
  addDirectLinks();
  highlightDivs();
});
observer.observe(document.body, { childList: true, subtree: true });

// Проверка каждые 30 секунд
setInterval(highlightDivs, 30 * 1000);
