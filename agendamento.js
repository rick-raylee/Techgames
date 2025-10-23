
/*Expandindo o Projeto - Sistema de Agendamento Online
LUCAS MATEUS DRESSLER DE BARROS
•
Ontem (editado: Ontem)
100 pontos
Vamos criar um sistema completo de agendamento com calendário interativo, seleção de horários e confirmação.

Crie os seguintes arquivos:
agendamento_html (nova página)
agendamento_css (estilos do sistema)
agendamento_js (lógica de agendamento)
/*As demais instruções de implementação seguem no arquivo do guia em pdf.

agendamento.html
HTML


agendamento.css


agendamento.js
JavaScript
Comentários da turma
Seus trabalhos
Atribuído
Comentários particulares*/
/* === SISTEMA DE AGENDAMENTO ONLINE - COMPLETO === */

/**
 * CLASSE PRINCIPAL DO AGENDAMENTO
 */
class SistemaAgendamento {
    constructor() {
        this.etapaAtual = 1;
        this.agendamento = {
            servico: null,
            data: null,
            horario: null,
            cliente: {}
        };
        
        this.dataAtual = new Date();
        this.dataSelecionada = null;
        
        // PERSONALIZE AQUI
        this.horariosFuncionamento = {
            inicio: 8,
            fim: 18,
            intervalo: 10,
            almoco: { inicio: 11, fim: 12 }
        };
        
        this.diasIndisponiveis = [0]; // Domingo
        
        this.agendamentosExistentes = [
            { data: this.formatarData(new Date()), horario: '09:00' },
            { data: this.formatarData(new Date()), horario: '16:00' }
        ];
        
        this.init();
    }

    init() {
        this.renderizarCalendario();
        this.configurarEventosCalendario();
        this.aplicarMascaras();
        console.log('Sistema de Agendamento inicializado!');
    }

    irParaEtapa(numero) {
        if (numero > this.etapaAtual && !this.validarEtapa(this.etapaAtual)) {
            return;
        }

        document.querySelectorAll('.etapa').forEach(etapa => {
            etapa.classList.remove('active');
        });

        const novaEtapa = document.getElementById(`etapa${numero}`);
        if (novaEtapa) {
            novaEtapa.classList.add('active');
        }

        this.atualizarProgressBar(numero);
        this.etapaAtual = numero;

        if (numero === 4) {
            this.preencherResumo();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    atualizarProgressBar(etapa) {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const numeroStep = index + 1;
            
            if (numeroStep < etapa) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (numeroStep === etapa) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    validarEtapa(etapa) {
        switch(etapa) {
            case 1:
                if (!this.agendamento.servico) {
                    alert('Por favor, selecione um serviço.');
                    return false;
                }
                return true;
            
            case 2:
                if (!this.agendamento.data || !this.agendamento.horario) {
                    alert('Por favor, selecione uma data e horário.');
                    return false;
                }
                return true;
            
            case 3:
                return this.validarFormulario();
            
            default:
                return true;
        }
    }

    validarFormulario() {
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const confirmaInfo = document.getElementById('confirmaInfo').checked;
        const aceitaTermos = document.getElementById('aceitaTermos').checked;

        if (!nome) {
            alert('Por favor, preencha seu nome.');
            document.getElementById('nome').focus();
            return false;
        }

        if (!email || !this.validarEmail(email)) {
            alert('Por favor, preencha um e-mail válido.');
            document.getElementById('email').focus();
            return false;
        }

        if (!telefone) {
            alert('Por favor, preencha seu telefone.');
            document.getElementById('telefone').focus();
            return false;
        }

        if (!confirmaInfo) {
            alert('Por favor, confirme que as informações estão corretas.');
            return false;
        }

        if (!aceitaTermos) {
            alert('Por favor, aceite os termos de agendamento.');
            return false;
        }

        this.agendamento.cliente = {
            nome,
            email,
            telefone,
            cpf: document.getElementById('cpf').value.trim(),
            observacoes: document.getElementById('observacoes').value.trim(),
            lembretes: document.getElementById('lembretes').checked
        };

        return true;
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    renderizarCalendario() {
        const mes = this.dataAtual.getMonth();
        const ano = this.dataAtual.getFullYear();

        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        document.getElementById('mesAnoAtual').textContent = `${meses[mes]} ${ano}`;

        const primeiroDia = new Date(ano, mes, 1);
        const ultimoDia = new Date(ano, mes + 1, 0);
        const diasMesAnterior = primeiroDia.getDay();
        
        const container = document.getElementById('calendarioDias');
        container.innerHTML = '';

        const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
        for (let i = diasMesAnterior - 1; i >= 0; i--) {
            const dia = ultimoDiaMesAnterior - i;
            const diaElement = this.criarDiaElement(dia, true, false);
            container.appendChild(diaElement);
        }

        const hoje = new Date();
        for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
            const data = new Date(ano, mes, dia);
            const ehHoje = this.ehMesmaData(data, hoje);
            const estaNoPassado = data < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            const diaElement = this.criarDiaElement(dia, false, estaNoPassado || this.diaIndisponivel(data));
            
            if (ehHoje) {
                diaElement.classList.add('hoje');
            }

            if (!diaElement.classList.contains('desabilitado')) {
                diaElement.addEventListener('click', () => this.selecionarData(data));
            }

            container.appendChild(diaElement);
        }

        const diasRestantes = 42 - container.children.length;
        for (let dia = 1; dia <= diasRestantes; dia++) {
            const diaElement = this.criarDiaElement(dia, true, false);
            container.appendChild(diaElement);
        }
    }

    criarDiaElement(numero, outroMes, desabilitado) {
        const div = document.createElement('div');
        div.className = 'dia';
        div.textContent = numero;

        if (outroMes) {
            div.classList.add('outro-mes');
        }

        if (desabilitado) {
            div.classList.add('desabilitado');
        }

        return div;
    }

    diaIndisponivel(data) {
        const diaSemana = data.getDay();
        return this.diasIndisponiveis.includes(diaSemana);
    }

    ehMesmaData(data1, data2) {
        return data1.getDate() === data2.getDate() &&
               data1.getMonth() === data2.getMonth() &&
               data1.getFullYear() === data2.getFullYear();
    }

    configurarEventosCalendario() {
        document.getElementById('mesAnterior').addEventListener('click', () => {
            this.dataAtual.setMonth(this.dataAtual.getMonth() - 1);
            this.renderizarCalendario();
        });

        document.getElementById('proximoMes').addEventListener('click', () => {
            this.dataAtual.setMonth(this.dataAtual.getMonth() + 1);
            this.renderizarCalendario();
        });
    }

    selecionarData(data) {
        this.dataSelecionada = data;
        this.agendamento.data = this.formatarData(data);

        document.querySelectorAll('.dia').forEach(dia => {
            dia.classList.remove('selecionado');
        });

        event.target.classList.add('selecionado');

        const dataFormatada = data.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('dataSelcionadaTexto').textContent = dataFormatada;

        this.renderizarHorarios();
    }

    renderizarHorarios() {
        const container = document.getElementById('horariosGrid');
        container.innerHTML = '';

        const { inicio, fim, intervalo, almoco } = this.horariosFuncionamento;

        for (let hora = inicio; hora < fim; hora++) {
            for (let minuto = 0; minuto < 60; minuto += intervalo) {
                if (almoco && hora >= almoco.inicio && hora < almoco.fim) {
                    continue;
                }

                const horarioTexto = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
                const disponivel = this.horarioDisponivel(horarioTexto);

                const btn = document.createElement('button');
                btn.className = 'horario-btn';
                btn.textContent = horarioTexto;

                if (!disponivel) {
                    btn.classList.add('indisponivel');
                } else {
                    btn.addEventListener('click', () => this.selecionarHorario(horarioTexto, btn));
                }

                container.appendChild(btn);
            }
        }
    }

    horarioDisponivel(horario) {
        const dataFormatada = this.formatarData(this.dataSelecionada);
        return !this.agendamentosExistentes.some(ag => 
            ag.data === dataFormatada && ag.horario === horario
        );
    }

    selecionarHorario(horario, botao) {
        this.agendamento.horario = horario;

        document.querySelectorAll('.horario-btn').forEach(btn => {
            btn.classList.remove('selecionado');
        });
        botao.classList.add('selecionado');

        document.getElementById('btnProximoEtapa2').disabled = false;
    }

    preencherResumo() {
        const servicoCard = document.querySelector('.servico-card.selecionado');
        
        if (servicoCard) {
            document.getElementById('resumoServico').textContent = 
                servicoCard.querySelector('h4').textContent;
            
            document.getElementById('resumoDuracao').textContent = 
                servicoCard.querySelector('.servico-duracao').textContent;
            
            document.getElementById('resumoValor').textContent = 
                servicoCard.querySelector('.servico-preco').textContent;
        }

        if (this.agendamento.data) {
            const data = new Date(this.agendamento.data);
            document.getElementById('resumoData').textContent = 
                data.toLocaleDateString('pt-BR', { dateStyle: 'full' });
        }

        document.getElementById('resumoHorario').textContent = this.agendamento.horario || '-';
        document.getElementById('resumoNome').textContent = this.agendamento.cliente.nome || '-';
    }

    formatarData(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    gerarCodigoConfirmacao() {
        const timestamp = Date.now().toString().slice(-5);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `AG-${timestamp}${random}`;
    }

    aplicarMascaras() {
        const telefoneInput = document.getElementById('telefone');
        telefoneInput.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length <= 11) {
                valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
            }
            e.target.value = valor;
        });

        const cpfInput = document.getElementById('cpf');
        cpfInput.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length <= 11) {
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            e.target.value = valor;
        });
    }

    adicionarAoCalendario() {
        const servico = document.querySelector('.servico-card.selecionado h4').textContent;
        const data = new Date(this.agendamento.data + 'T' + this.agendamento.horario);
        const duracao = parseInt(document.querySelector('.servico-card.selecionado').dataset.duracao);
        
        const dataFim = new Date(data.getTime() + duracao * 60000);

        const formatoGoogle = (d) => {
            return d.toISOString().replace(/-|:|\.\d+/g, '');
        };

        const titulo = encodeURIComponent(`Agendamento: ${servico}`);
        const descricao = encodeURIComponent(`Agendamento confirmado`);
        const localizacao = encodeURIComponent('Seu Endereço Aqui');

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${formatoGoogle(data)}/${formatoGoogle(dataFim)}&details=${descricao}&location=${localizacao}`;

        window.open(url, '_blank');
    }
}

let sistemaAgendamento;

document.addEventListener('DOMContentLoaded', () => {
    sistemaAgendamento = new SistemaAgendamento();
});

function selecionarServico(botao) {
    const card = botao.closest('.servico-card');
    const servicoId = card.dataset.servico;

    document.querySelectorAll('.servico-card').forEach(c => {
        c.classList.remove('selecionado');
        c.querySelector('.btn-selecionar').textContent = 'Selecionar';
    });

    card.classList.add('selecionado');
    botao.textContent = 'Selecionado ✓';

    sistemaAgendamento.agendamento.servico = {
        id: servicoId,
        nome: card.querySelector('h4').textContent,
        duracao: card.dataset.duracao,
        preco: card.dataset.preco
    };

    setTimeout(() => {
        proximaEtapa();
    }, 500);
}

function proximaEtapa() {
    sistemaAgendamento.irParaEtapa(sistemaAgendamento.etapaAtual + 1);
}

function voltarEtapa() {
    if (sistemaAgendamento.etapaAtual > 1) {
        sistemaAgendamento.irParaEtapa(sistemaAgendamento.etapaAtual - 1);
    }
}

function confirmarAgendamento() {
    if (!sistemaAgendamento.validarEtapa(3)) {
        return;
    }

    console.log('Agendamento confirmado:', sistemaAgendamento.agendamento);

    const codigo = sistemaAgendamento.gerarCodigoConfirmacao();
    document.getElementById('codigoConfirmacao').textContent = codigo;

    sistemaAgendamento.agendamentosExistentes.push({
        data: sistemaAgendamento.agendamento.data,
        horario: sistemaAgendamento.agendamento.horario,
        codigo: codigo
    });

    document.getElementById('modalSucesso').classList.add('show');

    enviarNotificacoes();

    if (window.analyticsManager) {
        window.analyticsManager.trackEvent('agendamento_confirmado', {
            servico: sistemaAgendamento.agendamento.servico.nome,
            data: sistemaAgendamento.agendamento.data,
            horario: sistemaAgendamento.agendamento.horario
        });
    }
}

function enviarNotificacoes() {
    const { cliente, servico, data, horario } = sistemaAgendamento.agendamento;

    console.log('📧 Email enviado para:', cliente.email);
    console.log('Conteúdo:', {
        servico: servico.nome,
        data: data,
        horario: horario
    });

    if (cliente.lembretes) {
        console.log('📱 WhatsApp enviado para:', cliente.telefone);
    }
}

function adicionarCalendario() {
    sistemaAgendamento.adicionarAoCalendario();
}

function novoAgendamento() {
    sistemaAgendamento.agendamento = {
        servico: null,
        data: null,
        horario: null,
        cliente: {}
    };

    document.getElementById('formDados').reset();
    sistemaAgendamento.irParaEtapa(1);
    document.getElementById('modalSucesso').classList.remove('show');

    document.querySelectorAll('.servico-card').forEach(card => {
        card.classList.remove('selecionado');
        card.querySelector('.btn-selecionar').textContent = 'Selecionar';
    });

    document.querySelectorAll('.dia').forEach(dia => {
        dia.classList.remove('selecionado');
    });

    document.querySelectorAll('.horario-btn').forEach(btn => {
        btn.classList.remove('selecionado');
    });
}

console.log('Sistema de Agendamento carregado com sucesso!');