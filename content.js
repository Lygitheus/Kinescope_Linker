console.log("[Kinescope Linker] Kinescope Linker запущен");

function addDirectLinks() {
  const iframes = document.querySelectorAll('iframe[src*="kinescope.io/chat/"]');
  if (!iframes || iframes.length === 0) {
    console.log("[Kinescope Linker] Ссылки не найдены");
    return;
  }

  console.log(`[Kinescope Linker] Найдено ссылок: ${iframes.length}`);

  iframes.forEach(iframe => {
    if (!iframe) return;

    const src = iframe.getAttribute("src");
    if (!src || !src.includes("/chat/")) return;

    const directLink = src.replace("/chat/", "/");
    if (!directLink) return;

    const container = iframe.closest("div.rounded-2xl");
    if (!container) {
      console.warn("[Kinescope Linker] Контейнер .rounded-2xl не найден для", src);
      return;
    }

    // Проверка на существующую кнопку
    if (container.querySelector(".direct-link-btn")) return;

    // Создание кнопки
    const btn = document.createElement("a");
    if (!btn) return;

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
    if (header) {
      header.appendChild(btn);
    } else {
      console.warn("[Kinescope Linker] Элемент для вставки кнопки не найден");
    }
  });
}

// Первый запуск
addDirectLinks();

// Наблюдение за динамическими элементами
const observer = new MutationObserver(() => addDirectLinks());
observer.observe(document.body, { childList: true, subtree: true });
