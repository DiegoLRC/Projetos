/**
 * ===================================================
 * ARQUIVO PRINCIPAL: main.js
 * 
 * Este arquivo é responsável por:
 * 1. Carregar a sidebar de /components/sidebar.html
 * 2. Gerenciar funções de abrir/fechar sidebar
 * 3. Marcar o link ativo na navegação
 * 4. Atualizar a posição do indicador visual (barra roxa)
 * 5. Adaptar a sidebar para mobile
 * 
 * Qualquer página que precisar da sidebar deve importar este arquivo
 * ===================================================
 */

/**
 * PASSO 1: Carrega a sidebar do arquivo HTML
 * Busca o arquivo /components/sidebar.html e insere no #sidebar-container
 */
async function loadSidebar() {
  try {
    const response = await fetch("/components/sidebar.html");
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status} ao carregar sidebar`);
    }
    const html = await response.text();
    const container = document.getElementById("sidebar-container");
    if (!container) {
      console.warn("Container #sidebar-container não encontrado na página");
      return;
    }

    container.innerHTML = html;
    initializeSidebar(); // Inicializa após inserir o HTML
  } catch (error) {
    console.error("❌ Erro ao carregar sidebar:", error);
  }
}

/**
 * PASSO 2: Inicializa todas as funcionalidades da sidebar
 * Esta função roda após a sidebar ser inserida no DOM
 */
function initializeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const menuLinks = document.querySelectorAll(".menu a");
  const menu = document.querySelector(".menu");

  // Verifica se todos os elementos necessários existem
  if (!sidebar || !overlay || !menu || !menuLinks.length) {
    console.error("❌ Elementos da sidebar não encontrados no HTML");
    return;
  }

  // ============================================
  // SEÇÃO 1: Funções para controlar a sidebar
  // ============================================
  
  /**
   * Abre/Fecha a sidebar no DESKTOP
   * Apenas muda a largura (não afeta o overlay)
   */
  const toggleSidebar = () => {
    sidebar.classList.toggle("open");
  };

  /**
   * Abre/Fecha a sidebar no MOBILE
   * Também mostra/esconde o overlay escuro (fundo)
   * Bloqueia scroll do body quando abrir
   */
  const toggleMobileSidebar = () => {
    const isOpen = sidebar.classList.toggle("open");
    overlay.classList.toggle("active", isOpen);
    // Bloqueia scroll da página quando sidebar está aberta
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  /**
   * Fecha a sidebar completamente
   * Usada quando clica no overlay ou redimensiona a tela
   */
  const closeSidebar = () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  // Expõe as funções globalmente para serem usadas em onclick do HTML
  window.toggleOpen = toggleSidebar;
  window.toggleMobileSidebar = toggleMobileSidebar;
  window.closeSidebar = closeSidebar;

  // ============================================
  // SEÇÃO 2: Marcar o link ativo
  // ============================================
  
  /**
   * Descobre qual página está aberta agora
   * Extrai o nome do arquivo da URL (ex: "dashboard.html", "cards.html")
   */
  const currentUrl = window.location.pathname;
  const currentFile = currentUrl.split('/').pop().split('?')[0].split('#')[0] || 'index.html';

  // Percorre todos os links do menu
  menuLinks.forEach((link) => {
    const linkHref = link.getAttribute('href');
    // Extrai o nome do arquivo do link (ignora caminho completo)
    const linkFile = linkHref.split('/').pop().split('?')[0].split('#')[0];
    
    // Marca como ativo se o arquivo do link é o mesmo da página atual
    const isActive = (linkFile === currentFile);
    link.classList.toggle('active', isActive);
  });

  // ============================================
  // SEÇÃO 3: Movimento da barra roxa (indicador)
  // ============================================
  
  /**
   * Atualiza a posição da barra roxa do lado da sidebar
   * Ela deve ficar ao lado do link ativo
   * A propriedade CSS --top controla a posição
   */
  const updateMenuIndicator = () => {
    // Encontra o índice do link ativo
    const activeIndex = Array.from(menuLinks).findIndex((link) =>
      link.classList.contains('active')
    );
    if (activeIndex === -1) return; // Nenhum link ativo encontrado

    // Altura de cada item do menu em pixels (padrão 56px)
    const itemHeight = menuLinks[0]?.offsetHeight || 56;
    
    // Calcula a posição: índice * altura = posição vertical
    // Essa propriedade CSS faz a barra roxa animar para a nova posição
    menu.style.setProperty('--top', `${activeIndex * itemHeight}px`);
  };

  // Aguarda um pouco para o navegador calcular as dimensões corretas
  setTimeout(updateMenuIndicator, 50);

  // ============================================
  // SEÇÃO 4: Responsividade - adaptar para mobile
  // ============================================
  
  /**
   * Monitora quando a tela é redimensionada
   * Se virar desktop (> 768px), fecha a sidebar
   */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });
}

/**
 * PASSO 3: Inicia tudo quando a página carregar
 * Este é o primeiro código que roda quando o JavaScript é carregado
 */
loadSidebar();