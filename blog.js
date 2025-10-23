document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando script...');

    // Dados fictícios das notícias
    const noticias = [
        { id: 1, title: 'Feira Tech na Praça', summary: 'Evento reúne criadores locais.', text: 'A Feira Tech na Praça, realizada em 05/10/2025 às 14:00, reuniu mais de 300 criadores locais...', image: 'assets/news1.jpg', author: 'João Silva', date: '05/10/2025 14:00' },
        { id: 2, title: 'Campeonato Escolar de Robótica', summary: 'Alunos mostram habilidades em competições.', text: 'O Campeonato Escolar de Robótica, em 04/10/2025 às 10:00, destacou projetos inovadores...', image: 'assets/news2.jpg', author: 'Maria Oliveira', date: '04/10/2025 10:00' },
        { id: 3, title: 'Iniciativa Verde nas Escolas', summary: 'Projetos sustentáveis ganham destaque.', text: 'A Iniciativa Verde nas Escolas, lançada em 03/10/2025 às 09:00, promoveu sustentabilidade...', image: 'assets/news3.jpg', author: 'Pedro Santos', date: '03/10/2025 09:00' },
        { id: 4, title: 'Festival de Games Futurista', summary: 'Inovações em realidade virtual expostas.', text: 'O Festival de Games Futurista, em 02/10/2025 às 15:00, apresentou novas tecnologias...', image: 'assets/news4.jpg', author: 'Ana Costa', date: '02/10/2025 15:00' },
        { id: 5, title: 'Workshop de IA Criativa', summary: 'Artistas exploram inteligência artificial.', text: 'O Workshop de IA Criativa, em 01/10/2025 às 13:00, reuniu artistas e programadores...', image: 'assets/news5.jpg', author: 'Lucas Almeida', date: '01/10/2025 13:00' },
        { id: 6, title: 'Expo de Gadgets 2025', summary: 'Novas tecnologias em exposição.', text: 'A Expo de Gadgets 2025, em 30/09/2025 às 14:00, exibiu inovações tecnológicas...', image: 'assets/news6.jpg', author: 'Fernanda Lima', date: '30/09/2025 14:00' },
        { id: 7, title: 'Maratona de Programação', summary: 'Desafios para jovens desenvolvedores.', text: 'A Maratona de Programação, em 29/09/2025 às 09:00, testou habilidades de coding...', image: 'assets/news7.jpg', author: 'Carlos Souza', date: '29/09/2025 09:00' },
        { id: 8, title: 'Revolução dos Drones', summary: 'Novas aplicações em entregas urbanas.', text: 'A Revolução dos Drones, em 28/09/2025 às 16:00, explorou entregas eficientes...', image: 'assets/news8.jpg', author: 'Juliana Pereira', date: '28/09/2025 16:00' },
        { id: 9, title: 'Futuro da Energia Limpa', summary: 'Inovações sustentáveis em destaque.', text: 'A conferência de Energia Limpa, em 27/09/2025 às 14:00, apresentou baterias orgânicas...', image: 'assets/news9.jpg', author: 'Eduardo Ferreira', date: '27/09/2025 14:00' }
    ];

    // Funções de gerenciamento de tema
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.cookie = `theme=${theme};path=/;max-age=31536000`;
        console.log('Tema alterado para:', theme);
    }

    function getThemeFromCookie() {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const themeCookie = cookies.find(cookie => cookie.startsWith('theme='));
        return themeCookie ? themeCookie.split('=')[1] : null;
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    // Inicializar tema
    const savedTheme = getThemeFromCookie();
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }

    // Criar botão flutuante de dark mode
    const toggleButton = document.createElement('button');
    toggleButton.className = 'dark-mode-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    toggleButton.addEventListener('click', toggleTheme);
    document.body.appendChild(toggleButton);

    // Atalho de teclado (tecla 'T')
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' || e.key === 'T') {
            toggleTheme();
            console.log('Tema alternado via atalho de teclado (T)');
        }
    });

    // API para controle programático
    window.toggleDarkMode = toggleTheme;
    window.setDarkMode = () => setTheme('dark');
    window.setLightMode = () => setTheme('light');

    // Gerenciar abas de notícias
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.news-panel');
    console.log('Tab btns encontrados:', tabBtns.length, 'Painéis encontrados:', panels.length);
    if (tabBtns.length > 0 && panels.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                panels.forEach(panel => {
                    panel.setAttribute('aria-hidden', panel.getAttribute('data-panel') !== tabId ? 'true' : 'false');
                });
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateVisibleCards();
                console.log('Aba ativa:', tabId);
            });
        });
        tabBtns[0].click(); // Ativa a primeira aba por padrão
    } else {
        console.log('Erro: Botões de aba ou painéis não encontrados.');
    }

    // Gerenciar modal de notícias
    const newsModal = document.getElementById('newsModal');
    console.log('Modal de notícias encontrado:', !!newsModal);
    const modalClose = newsModal ? newsModal.querySelector('.modal-close') : null;
    const modalImg = document.getElementById('newsModalImg');
    const modalTitle = document.getElementById('newsModalTitle');
    const modalMeta = document.getElementById('newsModalMeta');
    const modalBody = document.getElementById('newsModalBody');
    const newsCards = document.querySelectorAll('.news-card');
    console.log('Cards de notícias encontrados:', newsCards.length);
    if (newsCards.length > 0 && newsModal) {
        newsCards.forEach(card => {
            const img = card.querySelector('.news-thumb');
            const readMore = card.querySelector('.read-more');
            const newsId = card.getAttribute('data-news-id');
            const noticia = noticias.find(n => n.id === parseInt(newsId));
            if (img && readMore && noticia) {
                [img, readMore].forEach(el => {
                    el.addEventListener('click', () => {
                        modalImg.src = noticia.image;
                        modalTitle.textContent = noticia.title;
                        modalMeta.textContent = `${noticia.date} — por ${noticia.author}`;
                        modalBody.textContent = noticia.text;
                        closeAllModals();
                        newsModal.classList.add('active');
                        newsModal.setAttribute('aria-hidden', 'false');
                        console.log('Modal de notícias aberto para:', noticia.title);
                    });
                });
            }
        });
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                newsModal.classList.remove('active');
                newsModal.setAttribute('aria-hidden', 'true');
                console.log('Modal de notícias fechado.');
            });
        }
        newsModal.addEventListener('click', (e) => {
            if (e.target === newsModal) {
                newsModal.classList.remove('active');
                newsModal.setAttribute('aria-hidden', 'true');
                console.log('Modal fechado por clique externo.');
            }
        });
    }

    // Gerenciar modais de login e cadastro
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const loginClose = loginModal ? loginModal.querySelector('.modal-close') : null;
    const signupClose = signupModal ? signupModal.querySelector('.modal-close') : null;
    console.log('Botão Login encontrado:', !!showLoginBtn, 'Botão Cadastro encontrado:', !!showRegisterBtn);

    if (showLoginBtn && loginModal) {
        showLoginBtn.addEventListener('click', () => {
            closeAllModals();
            loginModal.classList.add('active');
            loginModal.setAttribute('aria-hidden', 'false');
            console.log('Modal de login aberto.');
        });
    }

    if (showRegisterBtn && signupModal) {
        showRegisterBtn.addEventListener('click', () => {
            closeAllModals();
            signupModal.classList.add('active');
            signupModal.setAttribute('aria-hidden', 'false');
            console.log('Modal de cadastro aberto.');
        });
    }

    if (loginClose) {
        loginClose.addEventListener('click', () => {
            loginModal.classList.remove('active');
            loginModal.setAttribute('aria-hidden', 'true');
            console.log('Modal de login fechado.');
        });
    }

    if (signupClose) {
        signupClose.addEventListener('click', () => {
            signupModal.classList.remove('active');
            signupModal.setAttribute('aria-hidden', 'true');
            console.log('Modal de cadastro fechado.');
        });
    }

    [loginModal, signupModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                    console.log('Modal fechado por clique externo:', modal.id);
                }
            });
        }
    });

    // Função para fechar todos os modals
    function closeAllModals() {
        [newsModal, loginModal, signupModal].forEach(modal => {
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Gerenciar paginação, filtros e pesquisa
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const artigoCards = document.querySelectorAll('.artigo-card');
    const searchInput = document.querySelector('#searchInput');
    const pageBtns = document.querySelectorAll('.page-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const artigosGrid = document.getElementById('artigosGrid');
    console.log('Filtros encontrados:', filtroBtns.length, 'Cards encontrados:', artigoCards.length, 'Search Input encontrado:', !!searchInput);

    let currentPage = 1;
    let currentFilter = 'todos';

    // Função para normalizar texto (remove acentos)
    function normalizeText(text) {
        return text ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
    }

    // Função para verificar correspondência na pesquisa
    function matchesSearch(card, term) {
        if (!term) return true;
        let title = '';
        let description = '';
        if (card.classList.contains('news-card')) {
            title = card.querySelector('.news-title') ? normalizeText(card.querySelector('.news-title').textContent) : '';
            description = card.querySelector('.news-summary') ? normalizeText(card.querySelector('.news-summary').textContent) : '';
        } else if (card.classList.contains('artigo-card')) {
            title = card.querySelector('h3') ? normalizeText(card.querySelector('h3').textContent) : '';
            description = card.querySelector('p') ? normalizeText(card.querySelector('p').textContent) : '';
        }
        return title.includes(term) || description.includes(term);
    }

    // Função para calcular o número total de páginas
    function getTotalPages() {
        const term = searchInput ? normalizeText(searchInput.value.trim()) : '';
        const pagesSet = new Set();
        const allCards = [...document.querySelectorAll('.news-card'), ...document.querySelectorAll('.artigo-card')];
        if (allCards.length > 0) {
            allCards.forEach(card => {
                const cardPage = parseInt(card.getAttribute('data-page')) || 1;
                const cardCat = (card.getAttribute('data-categoria') || '').toLowerCase();
                const panel = card.closest('.news-panel');
                const isVisiblePanel = !panel || (panel && panel.getAttribute('aria-hidden') === 'false');
                const matchesFilter = currentFilter === 'todos' || cardCat === currentFilter;
                const matchesTerm = matchesSearch(card, term);
                if (isVisiblePanel && matchesFilter && matchesTerm) {
                    pagesSet.add(cardPage);
                }
            });
        }
        return pagesSet.size === 0 ? 1 : Math.max(...pagesSet);
    }

    // Função para atualizar os botões de paginação
    function updatePaginationButtons() {
        const totalPages = getTotalPages();
        if (currentPage > totalPages) currentPage = 1;

        if (pageBtns.length > 0) {
            pageBtns.forEach(btn => {
                const btnPage = parseInt(btn.getAttribute('data-page'));
                btn.classList.toggle('active', btnPage === currentPage && totalPages > 0);
                btn.disabled = btnPage > totalPages || totalPages === 0;
                btn.setAttribute('aria-disabled', btn.disabled.toString());
            });
        }

        if (prevBtn) {
            prevBtn.disabled = currentPage <= 1;
            prevBtn.setAttribute('aria-disabled', prevBtn.disabled.toString());
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage >= getTotalPages();
            nextBtn.setAttribute('aria-disabled', nextBtn.disabled.toString());
        }
    }

    // Função para atualizar os cartões visíveis
    function updateVisibleCards() {
        const term = searchInput ? normalizeText(searchInput.value.trim()) : '';
        const totalPages = getTotalPages();
        if (currentPage > totalPages) currentPage = 1;

        const allCards = [...document.querySelectorAll('.news-card'), ...document.querySelectorAll('.artigo-card')];
        if (allCards.length > 0) {
            allCards.forEach(card => {
                const cardPage = parseInt(card.getAttribute('data-page')) || 1;
                const cardCat = (card.getAttribute('data-categoria') || '').toLowerCase();
                const panel = card.closest('.news-panel');
                const isVisiblePanel = !panel || (panel && panel.getAttribute('aria-hidden') === 'false');
                const matchesFilter = currentFilter === 'todos' || cardCat === currentFilter;
                const matchesTerm = matchesSearch(card, term);
                const shouldShow = isVisiblePanel && matchesFilter && matchesTerm && cardPage === currentPage;
                card.style.display = shouldShow ? 'block' : 'none';
            });
        }

        updatePaginationButtons();
        console.log('Cards atualizados - Filtro:', currentFilter, 'Página:', currentPage, 'Termo:', term);
    }

    // Configurar eventos de filtros
    if (filtroBtns.length > 0) {
        filtroBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filtroBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filtro').toLowerCase();
                currentPage = 1;
                updateVisibleCards();
                if (artigosGrid) artigosGrid.scrollIntoView({ behavior: 'smooth' });
                console.log('Filtro ativo:', currentFilter);
            });
        });
        filtroBtns[0].click();
    }

    // Configurar evento de pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            updateVisibleCards();
            console.log('Pesquisa atualizada:', searchInput.value);
        });
    } else {
        console.error('Erro: Campo de pesquisa (#searchInput) não encontrado.');
    }

    // Configurar eventos de paginação
    if (pageBtns.length > 0) {
        pageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page')) || 1;
                if (page >= 1 && page <= getTotalPages()) {
                    currentPage = page;
                    updateVisibleCards();
                    if (artigosGrid) artigosGrid.scrollIntoView({ behavior: 'smooth' });
                    console.log('Página ativa:', currentPage);
                }
            });
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateVisibleCards();
                if (artigosGrid) artigosGrid.scrollIntoView({ behavior: 'smooth' });
                console.log('Página anterior:', currentPage);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = getTotalPages();
            if (currentPage < totalPages) {
                currentPage++;
                updateVisibleCards();
                if (artigosGrid) artigosGrid.scrollIntoView({ behavior: 'smooth' });
                console.log('Próxima página:', currentPage);
            }
        });
    }

    // Scroll suave para o botão Blog
    const blogLink = document.querySelector('.navigation a[href="blog.html"]');
    if (blogLink) {
        blogLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Scroll suave para o topo.');
        });
    }

    updateVisibleCards();
    console.log('Script inicializado.');
});