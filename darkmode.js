// dark-mode.js - Lógica para alternância de tema escuro com persistência, detecção e API

// Função auxiliar para manipular cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// API JavaScript
const DarkMode = {
    toggleTheme: () => {
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        setCookie('theme', newTheme, 365);
        updateToggleButton(newTheme);
        console.log(`Tema alterado para: ${newTheme}`); // Depuração
        return newTheme;
    },
    setTheme: (theme) => {
        if (theme === 'dark' || theme === 'light') {
            const htmlElement = document.documentElement;
            htmlElement.setAttribute('data-theme', theme);
            setCookie('theme', theme, 365);
            updateToggleButton(theme);
            console.log(`Tema definido para: ${theme}`); // Depuração
        } else {
            console.warn('Tema inválido. Use "dark" ou "light".');
        }
    },
    isDarkMode: () => {
        const htmlElement = document.documentElement;
        return htmlElement.getAttribute('data-theme') === 'dark';
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Criar ou obter botão flutuante
    let toggleButton = document.querySelector('.dark-mode-toggle');
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.className = 'dark-mode-toggle';
        toggleButton.innerHTML = '🌙'; // Padrão inicial
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '80px'; // Alinhado com o CSS
        toggleButton.style.left = '80px'; // Alinhado com o CSS
        toggleButton.style.visibility = 'visible';
        toggleButton.style.opacity = '1';
        document.body.appendChild(toggleButton);
        console.log('Botão criado em: top 80px, left 80px');
    } else {
        console.log('Botão existente encontrado em: top', toggleButton.style.top, 'left', toggleButton.style.left);
    }

    // Detecção da preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let initialTheme = getCookie('theme');
    if (!initialTheme) {
        initialTheme = prefersDark ? 'dark' : 'light';
        setCookie('theme', initialTheme, 365);
        console.log(`Tema inicial definido como: ${initialTheme} (baseado em preferência do sistema)`);
    } else {
        console.log(`Tema inicial carregado do cookie: ${initialTheme}`);
    }

    // Aplicar tema inicial
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', initialTheme);
    updateToggleButton(initialTheme);

    // Alternância de tema
    toggleButton.addEventListener('click', () => {
        const newTheme = DarkMode.toggleTheme();
        updateToggleButton(newTheme);
    });

    // Atalho de teclado (Alt + T)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            const newTheme = DarkMode.toggleTheme();
            updateToggleButton(newTheme);
        }
    });

    // Atualizar ícone do botão
    function updateToggleButton(theme) {
        if (toggleButton) {
            toggleButton.innerHTML = theme === 'dark' ? '🌙' : '☀️';
            toggleButton.style.visibility = 'visible';
            toggleButton.style.opacity = '1';
            toggleButton.style.position = 'fixed';
            toggleButton.style.top = '80px'; // Reforçar posição
            toggleButton.style.left = '80px'; // Reforçar posição
            console.log(`Ícone atualizado para: ${theme === 'dark' ? '🌙' : '☀️'}, Posição: top ${toggleButton.style.top}, left ${toggleButton.style.left}`);
        } else {
            console.warn('Botão .dark-mode-toggle não encontrado.');
            toggleButton = document.querySelector('.dark-mode-toggle');
            if (toggleButton) {
                toggleButton.innerHTML = theme === 'dark' ? '🌙' : '☀️';
                toggleButton.style.position = 'fixed';
                toggleButton.style.top = '80px';
                toggleButton.style.left = '80px';
                console.log(`Botão recriado e ícone atualizado para: ${theme === 'dark' ? '🌙' : '☀️'}, Posição: top ${toggleButton.style.top}, left ${toggleButton.style.left}`);
            }
        }
    }
});

// Expor a API globalmente
window.DarkMode = DarkMode;