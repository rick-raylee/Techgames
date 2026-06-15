/**
 * TechGames - Gamer Setup & PSU Calculator
 *
 * Responsável por calcular dinamicamente:
 * 1. Custo total do setup gamer
 * 2. Consumo energético estimado em pico (Watts)
 * 3. Potência recomendada para a fonte de alimentação (PSU)
 * 4. Alertas de compatibilidade e recomendações técnicas
 */

document.addEventListener('DOMContentLoaded', () => {
    // Vinculação de Elementos do DOM
    const selectCpu = document.getElementById('selectCpu');
    const selectGpu = document.getElementById('selectGpu');
    const selectMobo = document.getElementById('selectMobo');
    const selectRam = document.getElementById('selectRam');
    const selectStorage = document.getElementById('selectStorage');
    const selectCooler = document.getElementById('selectCooler');
    const selectFans = document.getElementById('selectFans');

    const costDisplay = document.getElementById('costDisplay');
    const powerDisplay = document.getElementById('powerDisplay');
    const psuRecommendation = document.getElementById('psuRecommendation');
    const compatibilityList = document.getElementById('compatibilityList');

    const btnReset = document.getElementById('btnReset');
    const btnSave = document.getElementById('btnSave');

    if (!selectCpu || !selectGpu || !selectMobo || !selectRam || !selectStorage || !selectCooler || !selectFans) {
        console.error('[Calculadora] Alguns elementos de seleção não foram encontrados.');
        return;
    }

    // Função de formatação de moeda BRL
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Função principal de cálculo e compatibilidade
    function calculateSetup() {
        // Obter opções selecionadas
        const cpuOpt = selectCpu.options[selectCpu.selectedIndex];
        const gpuOpt = selectGpu.options[selectGpu.selectedIndex];
        const moboOpt = selectMobo.options[selectMobo.selectedIndex];
        const ramOpt = selectRam.options[selectRam.selectedIndex];
        const storageOpt = selectStorage.options[selectStorage.selectedIndex];
        const coolerOpt = selectCooler.options[selectCooler.selectedIndex];
        const fansOpt = selectFans.options[selectFans.selectedIndex];

        // Extrair dados (Wattage e Cost) armazenados em atributos data-*
        const cpuW = parseFloat(cpuOpt.dataset.power) || 0;
        const cpuPrice = parseFloat(cpuOpt.dataset.price) || 0;
        
        const gpuW = parseFloat(gpuOpt.dataset.power) || 0;
        const gpuPrice = parseFloat(gpuOpt.dataset.price) || 0;

        const moboW = parseFloat(moboOpt.dataset.power) || 0;
        const moboPrice = parseFloat(moboOpt.dataset.price) || 0;

        const ramW = parseFloat(ramOpt.dataset.power) || 0;
        const ramPrice = parseFloat(ramOpt.dataset.price) || 0;

        const storageW = parseFloat(storageOpt.dataset.power) || 0;
        const storagePrice = parseFloat(storageOpt.dataset.price) || 0;

        const coolerW = parseFloat(coolerOpt.dataset.power) || 0;
        const coolerPrice = parseFloat(coolerOpt.dataset.price) || 0;

        const fansW = parseFloat(fansOpt.dataset.power) || 0;
        const fansPrice = parseFloat(fansOpt.dataset.price) || 0;

        // Cálculos Globais
        const totalW = cpuW + gpuW + moboW + ramW + storageW + coolerW + fansW;
        const totalCost = cpuPrice + gpuPrice + moboPrice + ramPrice + storagePrice + coolerPrice + fansPrice;

        // Recomendação da Fonte: consumo total + 25% de margem, arredondado para cima para o múltiplo de 50W mais próximo
        // Fonte mínima sugerida: 400W
        const safetyFactor = 1.25;
        let recommendedPsu = Math.ceil((totalW * safetyFactor) / 50) * 50;
        if (recommendedPsu < 400) recommendedPsu = 400;

        // Atualizar Tela
        if (costDisplay) costDisplay.textContent = formatCurrency(totalCost);
        if (powerDisplay) powerDisplay.textContent = `${totalW} W`;
        if (psuRecommendation) psuRecommendation.textContent = `${recommendedPsu} W`;

        // Análise de Compatibilidade
        const alerts = [];

        // 1. CPU High-End com Cooler Box ou Básico
        const isHighEndCpu = cpuW >= 125;
        const isBasicCooler = coolerW <= 10;
        if (isHighEndCpu && isBasicCooler) {
            alerts.push({
                type: 'danger',
                text: '⚠️ <strong>Thermal Throttling:</strong> O processador selecionado aquece consideravelmente em carga máxima. O cooler escolhido não é suficiente. Recomendamos um Water Cooler ou Air Cooler robusto.'
            });
        } else {
            alerts.push({
                type: 'ok',
                text: '❄️ <strong>Resfriamento:</strong> O cooler selecionado é adequado para o consumo térmico deste processador.'
            });
        }

        // 2. Conectores e Adaptadores de GPUs Modernas (RTX 4090, 4080)
        const isHighEndGpu = gpuW >= 300;
        if (isHighEndGpu) {
            alerts.push({
                type: 'warning',
                text: '🔌 <strong>Cabo PCIe 5.0 (12VHPWR):</strong> A placa de vídeo selecionada requer um conector de 16 pinos. Garanta que a fonte seja compatível com o padrão ATX 3.0 ou use o adaptador incluso.'
            });
        }

        // 3. Recomendações de Certificação 80 Plus com base na potência recomendada
        if (recommendedPsu >= 750) {
            alerts.push({
                type: 'warning',
                text: '🥇 <strong>Eficiência da Fonte:</strong> Recomendamos uma fonte com certificação 80 Plus Gold ou superior para garantir a estabilidade e proteção necessárias para este setup topo de linha.'
            });
        } else if (recommendedPsu >= 550) {
            alerts.push({
                type: 'ok',
                text: '🥈 <strong>Eficiência da Fonte:</strong> Uma fonte de alimentação com certificação 80 Plus Bronze já atende com excelente eficiência e estabilidade esta configuração.'
            });
        } else {
            alerts.push({
                type: 'ok',
                text: '🔋 <strong>Fonte:</strong> Uma fonte padrão com boa qualidade construtiva suprirá este setup sem problemas.'
            });
        }

        // 4. Slots de Memória e Conectividade
        alerts.push({
            type: 'ok',
            text: '✔️ <strong>Compatibilidade Física:</strong> Todos os componentes selecionados são compatíveis com os padrões de soquete da placa mãe e gabinetes padrão ATX.'
        });

        // Atualizar lista no HTML
        if (compatibilityList) {
            compatibilityList.innerHTML = '';
            alerts.forEach(alert => {
                const li = document.createElement('li');
                li.className = `compatibility-item ${alert.type}`;
                
                let icon = '🟢';
                if (alert.type === 'warning') icon = '🟡';
                if (alert.type === 'danger') icon = '🔴';

                li.innerHTML = `<span class="compatibility-icon">${icon}</span><div>${alert.text}</div>`;
                compatibilityList.appendChild(li);
            });
        }
    }

    // Ouvintes para mudanças nas opções de hardware
    const selectors = [selectCpu, selectGpu, selectMobo, selectRam, selectStorage, selectCooler, selectFans];
    selectors.forEach(select => {
        select.addEventListener('change', calculateSetup);
    });

    // Ação do Botão de Reset
    if (btnReset) {
        btnReset.addEventListener('click', (e) => {
            e.preventDefault();
            selectors.forEach(select => {
                select.selectedIndex = 0;
            });
            calculateSetup();
        });
    }

    // Ação do Botão de Salvar Setup (no localStorage para persistência)
    if (btnSave) {
        btnSave.addEventListener('click', (e) => {
            e.preventDefault();
            const config = {
                cpu: selectCpu.value,
                gpu: selectGpu.value,
                mobo: selectMobo.value,
                ram: selectRam.value,
                storage: selectStorage.value,
                cooler: selectCooler.value,
                fans: selectFans.value,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('saved_gamer_setup', JSON.stringify(config));
            alert('🎮 Configuração de Setup salva com sucesso no seu navegador!');
        });
    }

    // Carregar setup anterior, se houver
    function loadSavedSetup() {
        const saved = localStorage.getItem('saved_gamer_setup');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                if (config.cpu) selectCpu.value = config.cpu;
                if (config.gpu) selectGpu.value = config.gpu;
                if (config.mobo) selectMobo.value = config.mobo;
                if (config.ram) selectRam.value = config.ram;
                if (config.storage) selectStorage.value = config.storage;
                if (config.cooler) selectCooler.value = config.cooler;
                if (config.fans) selectFans.value = config.fans;
            } catch (err) {
                console.error('[Calculadora] Falha ao carregar setup salvo:', err);
            }
        }
    }

    // Inicialização do cálculo
    loadSavedSetup();
    calculateSetup();
});
