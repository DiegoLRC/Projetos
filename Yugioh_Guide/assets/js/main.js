// ==========================
// CARREGA SIDEBAR
// ==========================
async function loadSidebar() {
  try {
    const res = await fetch("/components/sidebar.html");
    if (!res.ok) throw new Error(res.status);

    const container = document.getElementById("sidebar-container");
    if (!container) return;

    container.innerHTML = await res.text();
    initSidebar();
  } catch (e) {
    console.error("Erro ao carregar sidebar:", e);
  }
}

// ==========================
// INICIALIZA SIDEBAR
// ==========================
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const menu = document.querySelector(".menu");
  const links = document.querySelectorAll(".menu a");

  if (!sidebar || !overlay || !menu || !links.length) return;

  // ===== CONTROLE =====
  const toggle = () => sidebar.classList.toggle("open");

  const toggleMobile = () => {
    const open = sidebar.classList.toggle("open");
    overlay.classList.toggle("active", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  const close = () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  Object.assign(window, {
    toggleOpen: toggle,
    toggleMobileSidebar: toggleMobile,
    closeSidebar: close
  });

  // ===== LINK ATIVO =====
  const current = location.pathname.split("/").pop()?.split(/[?#]/)[0] || "index.html";

  links.forEach(link => {
    const file = link.getAttribute("href")?.split("/").pop()?.split(/[?#]/)[0];
    link.classList.toggle("active", file === current);
  });

  // ===== INDICADOR =====
  const updateIndicator = () => {
    const index = [...links].findIndex(l => l.classList.contains("active"));
    if (index < 0) return;

    const h = links[0].offsetHeight || 56;
    menu.style.setProperty("--top", `${index * h}px`);
  };

  setTimeout(updateIndicator, 50);

  // ===== RESPONSIVO =====
  window.addEventListener("resize", () => {
    if (innerWidth > 768) close();
  });

  // ===== SPA =====
  links.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      const href = link.getAttribute("href");
      if (!href) return;

      if (innerWidth <= 768) close();

      try {
        const res = await fetch(href);
        if (!res.ok) throw new Error();

        const html = await res.text();
        const temp = document.createElement("div");
        temp.innerHTML = html;

        const newContent = temp.querySelector("main.content");
        if (!newContent) return;

        document.querySelector("main.content").replaceWith(newContent);

        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        setTimeout(updateIndicator, 50);

        const title = newContent.querySelector("h2");
        if (title) document.title = title.textContent;

        const script = newContent.querySelector('script[type="module"]');
        if (script) {
          const s = document.createElement("script");
          s.type = "module";
          s.textContent = script.textContent;
          document.body.appendChild(s);
        }

      } catch {
        location.href = href;
      }
    });
  });
}

// ==========================
// START
// ==========================
loadSidebar();