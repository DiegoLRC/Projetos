// Função para carregar a sidebar
async function loadSidebar() {
  try {
    const response = await fetch("sidebar.html");
    const html = await response.text();
    document.getElementById("sidebar-container").innerHTML = html;

    // Após carregar, executar as inicializações (toggle, indicador ativo, etc)
    initializeSidebar();
  } catch (error) {
    console.error("Erro ao carregar sidebar:", error);
  }
}

function initializeSidebar() {
  // Código que antes estava no script principal (referente à sidebar)
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  // Funções de toggle (já existentes)
  window.toggleOpen = function () {
    sidebar.classList.toggle("open");
  };

  window.toggleMobileSidebar = function () {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
    document.body.style.overflow = sidebar.classList.contains("open")
      ? "hidden"
      : "";
  };

  window.closeSidebar = function () {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  // Atualizar indicador ativo baseado na URL
  const menuLinks = document.querySelectorAll(".menu a");
  const currentPage =
    window.location.pathname.split("/").pop() || "dashboard.html";
  menuLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Posicionar a barra roxa (--top)
  const menu = document.querySelector(".menu");
  function updateMenuIndicator() {
    const activeIndex = Array.from(menuLinks).findIndex((link) =>
      link.classList.contains("active"),
    );
    if (activeIndex !== -1) {
      menu.style.setProperty("--top", `${activeIndex * 56}px`);
    }
  }
  updateMenuIndicator();

  // Observar mudanças de classe (embora não seja necessário agora, mas mantemos)
  const observer = new MutationObserver(updateMenuIndicator);
  menuLinks.forEach((link) => {
    observer.observe(link, { attributes: true, attributeFilter: ["class"] });
  });

  // Ajuste de resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// Carregar a sidebar assim que a página for carregada
loadSidebar();
