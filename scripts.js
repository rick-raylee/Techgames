/**
 * TechGames - Script de Inicialização Global
 *
 * Funcionalidades centrais:
 * 1. Controle Unificado de Tema (Dark/Light) via localStorage
 * 2. Controle de Sidebar responsivo (Mobile & Desktop)
 * 3. FAQ Accordion com controle de classes
 * 4. Modal de Visualização de Imagens de Produtos
 * 5. Scroll suave para âncoras internas
 * 6. Injeção dinâmica do Chatbot em todas as páginas
 */

// Função auxiliar segura para buscar elemento do DOM
function checkElement(selector) {
    return document.querySelector(selector);
}

// === 1. TEMA GLOBAL (Dark / Light) ===
function initializeTheme() {
    const themeToggle = checkElement('#theme-toggle-checkbox');
    const galeriaToggle = checkElement('#toggleMode'); // botão da galeria

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Aplica classe de fallback
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-mode'); // galeria
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-mode'); // galeria
        }

        // Sincroniza checkbox
        if (themeToggle) {
            themeToggle.checked = (theme === 'light');
        }

        // Sincroniza botão da galeria
        if (galeriaToggle) {
            galeriaToggle.textContent = (theme === 'light') ? '☀' : '🌙';
        }

        console.log(`[Tema] Aplicado: ${theme}`);
    }

    // Carrega tema inicial
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Ouvinte para checkbox
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const nextTheme = themeToggle.checked ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    // Ouvinte para botão da galeria
    if (galeriaToggle) {
        galeriaToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        });
    }
}

// === 2. SIDEBAR RESPONSIVO ===
function initializeSidebar() {
    const sidebar = checkElement('#sidebar');
    const mobileToggle = checkElement('#mobileToggle');
    const closeBtn = checkElement('#closeSidebar');
    const overlay = checkElement('#sidebarOverlay');
    const mainContent = checkElement('main');
    const categoriaBtns = document.querySelectorAll('.categoria-btn');

    if (!sidebar || !mobileToggle || !closeBtn || !overlay) return;

    function openSidebar() {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
        if (mainContent) mainContent.classList.remove('expanded');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        if (mainContent) mainContent.classList.add('expanded');
        document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target') || btn.getAttribute('href')?.replace('#', '');
            const targetSection = document.getElementById(targetId);

            categoriaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                closeSidebar();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
            closeSidebar();
        }
    });

    console.log('[Sidebar] Inicializado com sucesso.');
}

// === 3. FAQ ACCORDION ===
function initializeFAQ() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const faqItem = toggle.closest('.faq-item');
            if (faqItem) {
                faqItem.classList.toggle('active', toggle.checked);
            }
        });
    });
}

// === 4. MODAL DE DETALHES DO PRODUTO ===
function initializeModal() {
    const modal = checkElement('#myModal');
    const modalImg = checkElement('#modalImg');
    const modalDesc = checkElement('#modalDesc');
    const produtoImgs = document.querySelectorAll('.produto-item img');
    const closeBtn = checkElement('.close') || checkElement('.close-produtos');

    if (!modal || !modalImg || !modalDesc || produtoImgs.length === 0) return;

    produtoImgs.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const src = img.src || '';
            const desc = img.getAttribute('data-desc') || img.alt || 'Visualização de produto';
            modal.style.display = 'flex';
            modalImg.src = src;
            modalDesc.textContent = desc;
            if (closeBtn) closeBtn.focus();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    console.log('[Modal] Inicializado com sucesso.');
}

// === 5. SCROLL SUAVE PARA LINKS INTERNOS ===
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const targetSection = document.getElementById(href.substring(1));
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: 'smooth' });
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus();
                targetSection.removeAttribute('tabindex');
            }
        });
    });
}

// === 6. INJEÇÃO DINÂMICA DO CHATBOT ===
function loadChatbot() {
    let chatbotContainer = checkElement('#chatbot-container');
    if (!chatbotContainer) {
        chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        document.body.appendChild(chatbotContainer);
    }

    fetch('chatbot.html')
        .then(response => {
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            // Remove head, link css e tags script de dentro do html injetado
            const cleanHtml = html.replace(/<head>[\s\S]*?<\/head>/gi, '')
                                  .replace(/<script[\s\S]*?<\/script>/gi, '');
            chatbotContainer.innerHTML = cleanHtml;

            // Injeta o CSS do chatbot se não estiver na página
            if (!document.querySelector('link[href="chatbot.css"]')) {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'chatbot.css';
                document.head.appendChild(cssLink);
            }

            // Injeta o JS do chatbot se não estiver na página
            if (!document.querySelector('script[src="chatbot.js"]')) {
                const jsScript = document.createElement('script');
                jsScript.src = 'chatbot.js';
                jsScript.defer = true;
                document.body.appendChild(jsScript);
            }
        })
        .catch(error => {
            console.warn('[Chatbot] Falha ao injetar widget dinamicamente:', error.message);
        });
}

// === EXECUÇÃO AO CARREGAR O DOM ===
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeSidebar();
    initializeFAQ();
    initializeModal();
    initializeSmoothScroll();
    loadChatbot();
});