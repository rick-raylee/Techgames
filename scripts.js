/**
 * Script de Inicialização da Aplicação - VERSÃO COMPLETA
 *
 * Contém funcionalidades de:
 * 1. Alternância de Tema (Claro/Escuro) com persistência em localStorage
 * 2. SIDEBAR (Desktop sempre visível + Mobile toggle)
 * 3. Acordeão de FAQ com controle via classe CSS
 * 4. Modal para visualização de Produtos
 * 5. Scroll Suave para navegação interna
 * 6. Integração e inicialização do Chatbot
 * 7. Otimização para Home (stats, banner)
 */

// Função auxiliar para verificar se um elemento existe
function checkElement(selector, errorMessage) {
    const element = document.querySelector(selector);
    if (!element) console.warn(errorMessage);
    return element;
}

// === 1. SIDEBAR FUNCTIONALITY ===
function initializeSidebar() {
    const sidebar = checkElement('#sidebar', 'Sidebar não encontrado.');
    const mobileToggle = checkElement('#mobileToggle', 'Botão mobile toggle não encontrado.');
    const closeBtn = checkElement('#closeSidebar', 'Botão fechar sidebar não encontrado.');
    const overlay = checkElement('#sidebarOverlay', 'Overlay do sidebar não encontrado.');
    const mainContent = checkElement('main', 'Main content não encontrado.');
    const categoriaBtns = document.querySelectorAll('.categoria-btn');

    if (!sidebar || !mobileToggle || !closeBtn || !overlay || !mainContent) return;

    // Função abrir sidebar (Mobile)
    function openSidebar() {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
        mainContent.classList.remove('expanded');
        document.body.style.overflow = 'hidden'; // Previne scroll da página
    }

    // Função fechar sidebar
    function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        mainContent.classList.add('expanded');
        document.body.style.overflow = ''; // Restaura scroll
    }

    // Eventos Mobile
    mobileToggle.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Navegação por categorias (Sidebar + Header)
    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            // Remove active de todos
            categoriaBtns.forEach(b => b.classList.remove('active'));
            // Adiciona active no clicado
            btn.classList.add('active');
            
            // Scroll suave
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                closeSidebar(); // Fecha sidebar no mobile após navegação
            }
        });
    });

    // Fechar sidebar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
            closeSidebar();
        }
    });

    console.log('✅ Sidebar inicializado!');
}

// === 2. CHATBOT ===
function initializeChatbot() {
    const chatbotButton = checkElement('#chatbot-button', 'Botão do chatbot não encontrado.');
    const chatbotWindow = checkElement('#chatbot-window', 'Janela do chatbot não encontrada.');
    const chatbotCloseButton = checkElement('#chatbot-close-button', 'Botão fechar chatbot não encontrado.');

    if (chatbotButton && chatbotWindow && chatbotCloseButton) {
        chatbotButton.addEventListener('click', () => {
            chatbotWindow.classList.toggle('chatbot-hidden-window');
            chatbotWindow.classList.toggle('chatbot-visible-window');
            const isVisible = chatbotWindow.classList.contains('chatbot-visible-window');
            chatbotButton.setAttribute('aria-expanded', isVisible);
            if (isVisible) chatbotCloseButton.focus();
        });

        chatbotCloseButton.addEventListener('click', () => {
            chatbotWindow.classList.remove('chatbot-visible-window');
            chatbotWindow.classList.add('chatbot-hidden-window');
            chatbotButton.setAttribute('aria-expanded', false);
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatbotWindow.classList.contains('chatbot-visible-window')) {
                chatbotWindow.classList.remove('chatbot-visible-window');
                chatbotWindow.classList.add('chatbot-hidden-window');
                chatbotButton.setAttribute('aria-expanded', false);
            }
        });

        console.log('✅ Chatbot inicializado!');
    }
}

// === 3. TEMA (Dark/Light) ===
function initializeTheme() {
    const themeToggle = checkElement('#theme-toggle-checkbox', 'Checkbox de tema não encontrado.');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'light' : 'dark';
            applyTheme(newTheme);
        });

        // Carrega tema salvo
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);
        themeToggle.checked = savedTheme === 'light';
        
        console.log(`✅ Tema carregado: ${savedTheme}`);
    }
}

// === 4. FAQ ACCORDION ===
function initializeFAQ() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const faqItem = toggle.closest('.faq-item');
            if (toggle.checked) {
                faqItem.classList.add('active');
            } else {
                faqItem.classList.remove('active');
            }
        });

        // Previne scroll com Space
        toggle.addEventListener('keydown', (e) => {
            if (e.key === ' ') e.preventDefault();
        });
    });

    console.log(`✅ FAQ inicializado (${faqToggles.length} itens)`);
}

// === 5. MODAL PRODUTOS ===
function initializeModal() {
    const modal = checkElement('#myModal', 'Modal não encontrado.');
    const modalImg = checkElement('#modalImg', 'Imagem modal não encontrada.');
    const modalDesc = checkElement('#modalDesc', 'Descrição modal não encontrada.');
    const produtoImgs = document.querySelectorAll('.produto-item img');
    const closeBtn = checkElement('.close', 'Botão fechar modal não encontrado.');

    if (produtoImgs.length > 0 && modal && modalImg && modalDesc) {
        produtoImgs.forEach(img => {
            img.addEventListener('click', () => {
                const src = img.src || '';
                const desc = img.getAttribute('data-desc') || 'Sem descrição';
                modal.style.display = 'flex';
                modalImg.src = src;
                modalDesc.textContent = desc;
                if (closeBtn) closeBtn.focus();
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.style.display = 'none');
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });

        console.log(`✅ Modal inicializado (${produtoImgs.length} produtos)`);
    }
}

// === 6. SCROLL SUAVE ===
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Acessibilidade
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus();
                targetSection.removeAttribute('tabindex');
            }
        });
    });

    console.log('✅ Scroll suave ativado');
}

// === 7. CARREGAR CHATBOT ===
function loadChatbot() {
    const chatbotContainer = checkElement('#chatbot-container', 'Container chatbot não encontrado.');
    if (chatbotContainer) {
        fetch('chatbot.html')
            .then(response => {
                if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
                return response.text();
            })
            .then(html => {
                chatbotContainer.innerHTML = html;
                initializeChatbot();
            })
            .catch(error => console.error('❌ Chatbot erro:', error));
    }
}

// === INICIALIZAÇÃO PRINCIPAL ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando aplicação...');
    
    // Ordem de inicialização (importante!)
    initializeTheme();           // 1. Tema primeiro
    initializeSidebar();         // 2. Sidebar
    initializeFAQ();            // 3. FAQ
    initializeModal();          // 4. Modal
    initializeSmoothScroll();   // 5. Scroll
    loadChatbot();              // 6. Chatbot (async)
    
    console.log('✅ TODOS OS SCRIPTS INICIALIZADOS!');
});

// === OTIMIZAÇÕES GLOBAIS ===
window.addEventListener('load', () => {
    // Remove loader se existir
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
    
    // Ajusta altura do sidebar
    const sidebar = document.querySelector('#sidebar');
    if (sidebar) {
        sidebar.style.height = '100vh';
    }
});