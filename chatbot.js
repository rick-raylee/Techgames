/* === CHATBOT JAVASCRIPT === */

class ChatBot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.conversationHistory = [];
        this.responses = this.initializeResponses();
        this.userInfo = {};
        
        this.init();
        this.bindEvents();
        this.showWelcomeNotification();
    }

    init() {
        // Elementos do DOM
        this.chatButton = document.getElementById('chatButton');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatBadge = document.getElementById('chatBadge');
        this.closeChatBtn = document.getElementById('closeChatBtn');
        this.minimizeBtn = document.getElementById('minimizeChat');
        this.whatsappBtn = document.getElementById('whatsappBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.chatNotification = document.getElementById('chatNotification');
        this.quickSuggestions = document.getElementById('quickSuggestions');

        // Estado inicial
        this.updateChatButton();
    }

    initializeResponses() {
        // Base de conhecimento do chatbot - PERSONALIZE AQUI
        return {
            // Saudações
            saudacoes: [
                'olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'hello'
            ],
            respostas_saudacao: [
                'Olá! Como posso ajudá-lo hoje? 😊',
                'Oi! Em que posso ser útil?',
                'Olá! Seja bem-vindo(a)! Como posso ajudar?'
            ],

            // Horários - PERSONALIZE
            horarios: [
                'horário', 'horarios', 'funcionamento', 'aberto', 'fechado', 'quando'
            ],
            resposta_horarios: `📅 <strong>Nossos horários:</strong><br>
                Segunda à Sexta: 8h às 18h<br>
                Sábados: 8h às 14h<br>
                Domingos: Fechado<br><br>
                Precisa de mais informações?`,

            // Serviços - PERSONALIZE
            servicos: [
                'serviço', 'serviços', 'produto', 'produtos', 'oferece', 'fazem'
            ],
            resposta_servicos: `💼 <strong>Nossos principais serviços:</strong><br>
                • [SERVIÇO 1 - Ex: Consultas especializadas]<br>
                • [SERVIÇO 2 - Ex: Atendimento personalizado]<br>
                • [SERVIÇO 3 - Ex: Produtos premium]<br><br>
                Gostaria de saber mais sobre algum específico?`,

            // Contato - PERSONALIZE
            contato: [
                'contato', 'telefone', 'whatsapp', 'email', 'falar'
            ],
            resposta_contato: `📞 <strong>Entre em contato conosco:</strong><br>
                Telefone: (41) 3333-4444<br>
                WhatsApp: (41) 99999-8888<br>
                Email: contato@seunegocio.com<br><br>
                Prefere falar pelo WhatsApp? Clique no botão abaixo! 👇`,

            // Localização - PERSONALIZE
            localizacao: [
                'onde', 'endereço', 'localização', 'fica', 'local'
            ],
            resposta_localizacao: `📍 <strong>Nossa localização:</strong><br>
                Rua Exemplo, 123<br>
                Centro - Sua Cidade/UF<br>
                CEP: 00000-000<br><br>
                Fácil acesso por transporte público!`,

            // Preços
            precos: [
                'preço', 'precos', 'valor', 'custa', 'quanto'
            ],
            resposta_precos: `💰 <strong>Preços e orçamentos:</strong><br>
                Nossos valores variam conforme o serviço escolhido.<br>
                Para um orçamento personalizado, entre em contato:<br><br>
                📱 WhatsApp: (41) 99999-8888<br>
                Teremos prazer em atendê-lo!`,

            // Agendamento
            agendamento: [
                'agendar', 'marcar', 'consulta', 'horario', 'disponível'
            ],
            resposta_agendamento: `📅 <strong>Agendamentos:</strong><br>
                Para marcar seu horário:<br>
                • Ligue: (41) 3333-4444<br>
                • WhatsApp: (41) 99999-8888<br>
                • Ou visite nossa página de contato<br><br>
                Temos horários flexíveis para melhor atendê-lo!`,

            // Respostas padrão
            nao_entendi: [
                'Desculpe, não entendi muito bem. Pode reformular sua pergunta?',
                'Hmm, não tenho certeza sobre isso. Pode ser mais específico?',
                'Não consegui compreender. Pode tentar perguntar de outra forma?'
            ],

            despedida: [
                'tchau', 'bye', 'obrigado', 'obrigada', 'valeu', 'até logo'
            ],
            resposta_despedida: [
                'Foi um prazer ajudar! Até logo! 👋',
                'Obrigado pelo contato! Esperamos vê-lo em breve! 😊',
                'Até mais! Estamos sempre aqui quando precisar!'
            ]
        };
    }

    bindEvents() {
        // Toggle do chat
        this.chatButton.addEventListener('click', () => {
            this.toggleChat();
        });

        // Fechar chat
        this.closeChatBtn.addEventListener('click', () => {
            this.closeChat();
        });

        // Minimizar chat
        this.minimizeBtn.addEventListener('click', () => {
            this.minimizeChat();
        });

        // Enviar mensagem
        this.sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter para enviar
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Sugestões rápidas
        this.quickSuggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const suggestion = e.target.getAttribute('data-suggestion');
                this.handleQuickSuggestion(suggestion);
            }
        });

        // WhatsApp redirect
        this.whatsappBtn.addEventListener('click', () => {
            this.redirectToWhatsApp();
        });

        // Fechar notificação ao clicar
        this.chatNotification.addEventListener('click', () => {
            this.hideNotification();
            this.openChat();
        });

        // Auto-hide notification
        setTimeout(() => {
            this.hideNotification();
        }, 8000);
    }

    showWelcomeNotification() {
        setTimeout(() => {
            if (!this.isOpen) {
                this.showNotification('Nova mensagem!', 'Olá! Como posso ajudá-lo hoje?');
            }
        }, 3000);
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.isMinimized = false;
        this.chatWindow.classList.add('show');
        this.chatWindow.classList.remove('minimized');
        this.updateChatButton();
        this.hideBadge();
        this.hideNotification();
        
        // Focus no input
        setTimeout(() => {
            this.chatInput.focus();
        }, 300);
    }

    closeChat() {
        this.isOpen = false;
        this.isMinimized = false;
        this.chatWindow.classList.remove('show');
        this.chatWindow.classList.remove('minimized');
        this.updateChatButton();
    }

    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        this.chatWindow.classList.toggle('minimized');
    }

    updateChatButton() {
        const chatIcon = this.chatButton.querySelector('.chat-icon');
        const closeIcon = this.chatButton.querySelector('.close-icon');
        
        if (this.isOpen) {
            this.chatButton.classList.add('chat-open');
            chatIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        } else {
            this.chatButton.classList.remove('chat-open');
            chatIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        
        // Limpar input
        this.chatInput.value = '';
        
        // Salvar no histórico
        this.conversationHistory.push({ type: 'user', message, time: new Date() });
        
        // Mostrar typing indicator
        this.showTypingIndicator();
        
        // Processar resposta com delay realista
        setTimeout(() => {
            this.processMessage(message);
        }, Math.random() * 1500 + 500);
    }

    addMessage(message, sender, isHTML = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const avatar = sender === 'user' ? 'U' : '<img src="imagens/logo.png" alt="Bot">';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatar}
            </div>
            <div class="message-content">
                <p>${isHTML ? message : this.escapeHtml(message)}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Mostrar badge se chat fechado
        if (!this.isOpen && sender === 'bot') {
            this.showBadge();
        }
    }

    processMessage(userMessage) {
        this.hideTypingIndicator();
        
        const message = userMessage.toLowerCase();
        let response = this.findBestResponse(message);
        
        // Adicionar resposta do bot
        this.addMessage(response, 'bot', true);
        
        // Salvar no histórico
        this.conversationHistory.push({ 
            type: 'bot', 
            message: response, 
            time: new Date() 
        });
        
        // Mostrar notificação se chat fechado
        if (!this.isOpen) {
            this.showNotification('Nova resposta!', 'O assistente respondeu sua pergunta');
        }
    }

    findBestResponse(message) {
        // Verificar saudações
        if (this.containsAny(message, this.responses.saudacoes)) {
            return this.getRandomResponse(this.responses.respostas_saudacao);
        }
        
        // Verificar despedida
        if (this.containsAny(message, this.responses.despedida)) {
            return this.getRandomResponse(this.responses.resposta_despedida);
        }
        
        // Verificar tópicos específicos
        if (this.containsAny(message, this.responses.horarios)) {
            return this.responses.resposta_horarios;
        }
        
        if (this.containsAny(message, this.responses.servicos)) {
            return this.responses.resposta_servicos;
        }
        
        if (this.containsAny(message, this.responses.contato)) {
            return this.responses.resposta_contato;
        }
        
        if (this.containsAny(message, this.responses.localizacao)) {
            return this.responses.resposta_localizacao;
        }
        
        if (this.containsAny(message, this.responses.precos)) {
            return this.responses.resposta_precos;
        }
        
        if (this.containsAny(message, this.responses.agendamento)) {
            return this.responses.resposta_agendamento;
        }
        
        // Resposta padrão se não encontrou match
        return this.getRandomResponse(this.responses.nao_entendi);
    }

    handleQuickSuggestion(suggestion) {
        let message = '';
        switch(suggestion) {
            case 'horarios':
                message = 'Quais são os horários de funcionamento?';
                break;
            case 'servicos':
                message = 'Quais serviços vocês oferecem?';
                break;
            case 'contato':
                message = 'Como posso entrar em contato?';
                break;
            case 'localizacao':
                message = 'Onde vocês ficam localizados?';
                break;
        }
        
        if (message) {
            this.chatInput.value = message;
            this.sendMessage();
        }
    }

    containsAny(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    showBadge() {
        this.chatBadge.classList.remove('hidden');
        const currentCount = parseInt(this.chatBadge.textContent) || 0;
        this.chatBadge.textContent = currentCount + 1;
    }

    hideBadge() {
        this.chatBadge.classList.add('hidden');
        this.chatBadge.textContent = '1';
    }

    showNotification(title, message) {
        const notification = this.chatNotification;
        notification.querySelector('strong').textContent = title;
        notification.querySelector('p').textContent = message;
        notification.style.display = 'block';
        
        // Auto-hide após 5 segundos
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        this.chatNotification.style.display = 'none';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    redirectToWhatsApp() {
        // PERSONALIZE o número do WhatsApp aqui
        const phoneNumber = '5541999998888'; // Formato: código país + DDD + número
        const message = this.generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    }

    generateWhatsAppMessage() {
        let message = 'Olá! Vim através do chat do site.\n\n';
        
        // Incluir histórico recente se houver
        const recentMessages = this.conversationHistory.slice(-3);
        if (recentMessages.length > 0) {
            message += 'Histórico da conversa:\n';
            recentMessages.forEach(msg => {
                if (msg.type === 'user') {
                    message += `Eu: ${msg.message}\n`;
                }
            });
            message += '\nGostaria de continuar nossa conversa.';
        } else {
            message += 'Gostaria de mais informações sobre seus serviços.';
        }
        
        return message;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Método público para adicionar respostas personalizadas
    addCustomResponse(keywords, response) {
        this.responses[`custom_${Date.now()}`] = {
            keywords,
            response
        };
    }

    // Método para obter estatísticas
    getStats() {
        return {
            totalMessages: this.conversationHistory.length,
            userMessages: this.conversationHistory.filter(m => m.type === 'user').length,
            botMessages: this.conversationHistory.filter(m => m.type === 'bot').length,
            isActive: this.isOpen,
            startTime: this.startTime || new Date()
        };
    }
}

// Inicializar o chatbot quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se todos os elementos necessários existem
    if (document.getElementById('chatButton')) {
        window.chatBot = new ChatBot();
        console.log('Chatbot inicializado com sucesso!');
    } else {
        console.warn('Elementos do chatbot não encontrados. Certifique-se de incluir o HTML do widget.');
    }
});

// Funções globais para controle externo
function openChatBot() {
    if (window.chatBot) {
        window.chatBot.openChat();
    }
}

function closeChatBot() {
    if (window.chatBot) {
        window.chatBot.closeChat();
    }
}

function addChatBotResponse(keywords, response) {
    if (window.chatBot) {
        window.chatBot.addCustomResponse(keywords, response);
    }
}

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatBot, openChatBot, closeChatBot };
}