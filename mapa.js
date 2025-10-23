/* === MAPA INTERATIVO COM LEAFLET.JS === */

/**
 * CONFIGURAÇÃO INICIAL
 * Aqui definimos as coordenadas das unidades do negócio
 * IMPORTANTE: Substitua pelas coordenadas reais do seu negócio
 */

// Dados das unidades - PERSONALIZE AQUI
const unidades = [{
        id: 'unidade1',
        nome: 'Unidade Centro',
        lat: -25.4284, // Latitude - ALTERE para sua localização real
        lng: -49.2733, // Longitude - ALTERE para sua localização real
        endereco: 'Rua Exemplo, 123<br>Centro - Curitiba/PR',
        telefone: '+5541999998888',
        horario: 'Seg-Sex: 8h-18h | Sáb: 8h-14h',
        descricao: 'Nossa unidade principal no centro da cidade.'
    },
    {
        id: 'unidade2',
        nome: 'Unidade Batel',
        lat: -25.4195,
        lng: -49.2646,
        endereco: 'Av. do Batel, 456<br>Batel - Curitiba/PR',
        telefone: '+5541888887777',
        horario: 'Seg-Sex: 9h-19h | Sáb: 9h-15h',
        descricao: 'Unidade moderna com estacionamento amplo.'
    }
    // Adicione mais unidades conforme necessário
];

/**
 * CLASSE PRINCIPAL DO MAPA
 * Gerencia todas as funcionalidades do mapa interativo
 */
class MapaInterativo {
    constructor() {
        // Elementos do DOM
        this.mapaElement = document.getElementById('mapa');
        this.btnMinhaLocalizacao = document.getElementById('btnMinhaLocalizacao');
        this.btnCalcularRota = document.getElementById('btnCalcularRota');
        this.btnCompartilhar = document.getElementById('btnCompartilhar');
        this.tipoMapa = document.getElementById('tipoMapa');
        this.infoPanel = document.getElementById('infoPanel');
        this.fecharPanel = document.getElementById('fecharPanel');

        // Variáveis do mapa
        this.mapa = null;
        this.marcadores = [];
        this.minhaLocalizacao = null;
        this.rotaAtual = null;

        // Camadas de mapa disponíveis
        this.camadasMapa = {
            streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }),
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri'
            }),
            terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenTopoMap'
            })
        };

        this.init();
    }

    /**
     * INICIALIZAÇÃO DO MAPA
     * Configura o mapa e adiciona os marcadores
     */
    init() {
        // Verificar se o Leaflet está carregado
        if (typeof L === 'undefined') {
            console.error('Leaflet não foi carregado. Verifique a conexão com a internet.');
            return;
        }

        // Criar o mapa centralizado na primeira unidade
        const primeiraUnidade = unidades[0];
        this.mapa = L.map('mapa').setView([primeiraUnidade.lat, primeiraUnidade.lng], 13);

        // Adicionar camada padrão (ruas)
        this.camadasMapa.streets.addTo(this.mapa);

        // Adicionar marcadores das unidades
        this.adicionarMarcadores();

        // Configurar eventos
        this.configurarEventos();

        // Calcular distâncias se houver geolocalização
        if (navigator.geolocation) {
            this.calcularDistancias();
        }

        console.log('Mapa inicializado com sucesso!');
    }

    /**
     * ADICIONAR MARCADORES NO MAPA
     * Cria um marcador para cada unidade do negócio
     */
    adicionarMarcadores() {
        unidades.forEach(unidade => {
            // Criar ícone customizado
            const iconeCustomizado = L.divIcon({
                className: 'custom-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });

            // Criar marcador
            const marcador = L.marker([unidade.lat, unidade.lng], {
                icon: iconeCustomizado,
                title: unidade.nome
            }).addTo(this.mapa);

            // Criar conteúdo do popup
            const popupContent = `
                <div style="text-align: center;">
                    <h4 style="margin: 0 0 10px 0;">${unidade.nome}</h4>
                    <p style="margin: 5px 0;">${unidade.endereco}</p>
                    <p style="margin: 5px 0; font-size: 0.9em; color: #666;">${unidade.horario}</p>
                    <a href="tel:${unidade.telefone}" style="
                        display: inline-block;
                        margin-top: 10px;
                        padding: 8px 15px;
                        background: #28a745;
                        color: white;
                        text-decoration: none;
                        border-radius: 15px;
                        font-size: 0.9em;
                    ">📞 Ligar</a>
                </div>
            `;

            marcador.bindPopup(popupContent);

            // Adicionar evento de clique
            marcador.on('click', () => {
                this.mostrarInfoUnidade(unidade);
            });

            // Salvar referência
            this.marcadores.push({ unidade: unidade.id, marcador });
        });
    }

    /**
     * CONFIGURAR EVENTOS
     * Vincula os botões às suas funções
     */
    configurarEventos() {
        // Botão Minha Localização
        this.btnMinhaLocalizacao.addEventListener('click', () => {
            this.obterMinhaLocalizacao();
        });

        // Botão Calcular Rota
        this.btnCalcularRota.addEventListener('click', () => {
            this.calcularRota();
        });

        // Botão Compartilhar
        this.btnCompartilhar.addEventListener('click', () => {
            this.compartilharLocalizacao();
        });

        // Seletor de tipo de mapa
        this.tipoMapa.addEventListener('change', (e) => {
            this.trocarTipoMapa(e.target.value);
        });

        // Fechar painel de informações
        this.fecharPanel.addEventListener('click', () => {
            this.infoPanel.classList.remove('show');
        });

        // Botões "Ver no Mapa" dos cards
        document.querySelectorAll('.btn-ir-mapa').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const unidadeId = e.target.getAttribute('data-target');
                const unidade = unidades.find(u => u.id === unidadeId);
                if (unidade) {
                    this.centralizarUnidade(unidade);
                }
            });
        });
    }

    /**
     * OBTER LOCALIZAÇÃO DO USUÁRIO
     * Usa a API de Geolocalização do navegador
     */
    obterMinhaLocalizacao() {
        // Verificar se o navegador suporta geolocalização
        if (!navigator.geolocation) {
            alert('Seu navegador não suporta geolocalização.');
            return;
        }

        // Desabilitar botão durante carregamento
        this.btnMinhaLocalizacao.disabled = true;
        this.btnMinhaLocalizacao.textContent = 'Localizando...';

        // Obter posição
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Sucesso - pegar coordenadas
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Salvar localização
                this.minhaLocalizacao = { lat, lng };

                // Remover marcador anterior se existir
                if (this.marcadorUsuario) {
                    this.mapa.removeLayer(this.marcadorUsuario);
                }

                // Criar ícone do usuário
                const iconeUsuario = L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background: #28a745; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                // Adicionar marcador do usuário
                this.marcadorUsuario = L.marker([lat, lng], {
                    icon: iconeUsuario
                }).addTo(this.mapa);

                this.marcadorUsuario.bindPopup('Você está aqui!');

                // Centralizar mapa na localização
                this.mapa.setView([lat, lng], 14);

                // Reabilitar botão
                this.btnMinhaLocalizacao.disabled = false;
                this.btnMinhaLocalizacao.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                    </svg>
                    Minha Localização
                `;

                // Atualizar distâncias
                this.calcularDistancias();

                console.log('Localização obtida:', lat, lng);
            },
            (error) => {
                // Erro ao obter localização
                console.error('Erro ao obter localização:', error);

                let mensagem = 'Não foi possível obter sua localização. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        mensagem += 'Você negou a permissão de localização.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mensagem += 'Informação de localização indisponível.';
                        break;
                    case error.TIMEOUT:
                        mensagem += 'Tempo limite excedido.';
                        break;
                }

                alert(mensagem);

                // Reabilitar botão
                this.btnMinhaLocalizacao.disabled = false;
                this.btnMinhaLocalizacao.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                    </svg>
                    Minha Localização
                `;
            }
        );
    }

    /**
     * CALCULAR DISTÂNCIAS
     * Calcula a distância do usuário até cada unidade
     */
    calcularDistancias() {
        if (!this.minhaLocalizacao) {
            // Tentar obter localização primeiro
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.minhaLocalizacao = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.atualizarDistancias();
                },
                () => {
                    // Se falhar, não mostrar distâncias
                    document.querySelectorAll('.distancia').forEach(el => {
                        el.textContent = 'Ative localização para ver distância';
                    });
                }
            );
        } else {
            this.atualizarDistancias();
        }
    }

    /**
     * ATUALIZAR DISTÂNCIAS NA INTERFACE
     * Mostra a distância até cada unidade
     */
    atualizarDistancias() {
        unidades.forEach(unidade => {
            const distancia = this.calcularDistanciaEntre(
                this.minhaLocalizacao.lat,
                this.minhaLocalizacao.lng,
                unidade.lat,
                unidade.lng
            );

            const elemento = document.querySelector(`[data-distancia="${unidade.id}"]`);
            if (elemento) {
                if (distancia < 1) {
                    elemento.textContent = `${Math.round(distancia * 1000)}m de você`;
                } else {
                    elemento.textContent = `${distancia.toFixed(1)}km de você`;
                }
            }
        });
    }

    /**
     * CALCULAR DISTÂNCIA ENTRE DOIS PONTOS
     * Fórmula de Haversine para calcular distância em km
     */
    calcularDistanciaEntre(lat1, lng1, lat2, lng2) {
        const R = 6371; // Raio da Terra em km
        const dLat = this.degreesToRadians(lat2 - lat1);
        const dLng = this.degreesToRadians(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degreesToRadians(lat1)) *
            Math.cos(this.degreesToRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distancia = R * c;

        return distancia;
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * CALCULAR ROTA
     * Abre o Google Maps com direções
     */
    calcularRota() {
        if (!this.minhaLocalizacao) {
            alert('Primeiro ative sua localização clicando em "Minha Localização"');
            return;
        }

        // Encontrar unidade mais próxima
        let unidadeMaisProxima = null;
        let menorDistancia = Infinity;

        unidades.forEach(unidade => {
            const distancia = this.calcularDistanciaEntre(
                this.minhaLocalizacao.lat,
                this.minhaLocalizacao.lng,
                unidade.lat,
                unidade.lng
            );

            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                unidadeMaisProxima = unidade;
            }
        });

        if (unidadeMaisProxima) {
            // Abrir Google Maps com direções
            const origem = `${this.minhaLocalizacao.lat},${this.minhaLocalizacao.lng}`;
            const destino = `${unidadeMaisProxima.lat},${unidadeMaisProxima.lng}`;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}&travelmode=driving`;

            window.open(url, '_blank');
        }
    }

    /**
     * COMPARTILHAR LOCALIZAÇÃO
     * Usa a Web Share API ou copia para área de transferência
     */
    compartilharLocalizacao() {
        const primeiraUnidade = unidades[0];
        const texto = `Confira a localização de ${primeiraUnidade.nome}: https://www.google.com/maps?q=${primeiraUnidade.lat},${primeiraUnidade.lng}`;
        const titulo = 'Localização - ' + primeiraUnidade.nome;

        // Tentar usar Web Share API
        if (navigator.share) {
            navigator.share({
                title: titulo,
                text: texto,
                url: window.location.href
            }).then(() => {
                console.log('Compartilhado com sucesso!');
            }).catch((error) => {
                console.log('Erro ao compartilhar:', error);
                this.copiarParaClipboard(texto);
            });
        } else {
            // Fallback: copiar para clipboard
            this.copiarParaClipboard(texto);
        }
    }

    copiarParaClipboard(texto) {
        // Criar elemento temporário
        const temp = document.createElement('textarea');
        temp.value = texto;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);

        alert('Link copiado para área de transferência!');
    }

    /**
     * TROCAR TIPO DE MAPA
     * Alterna entre ruas, satélite e terreno
     */
    trocarTipoMapa(tipo) {
        // Remover todas as camadas
        Object.values(this.camadasMapa).forEach(camada => {
            this.mapa.removeLayer(camada);
        });

        // Adicionar camada selecionada
        if (this.camadasMapa[tipo]) {
            this.camadasMapa[tipo].addTo(this.mapa);
        }
    }

    /**
     * CENTRALIZAR UNIDADE
     * Centraliza o mapa em uma unidade específica
     */
    centralizarUnidade(unidade) {
        this.mapa.setView([unidade.lat, unidade.lng], 16);

        // Abrir popup do marcador
        const marcadorInfo = this.marcadores.find(m => m.unidade === unidade.id);
        if (marcadorInfo) {
            marcadorInfo.marcador.openPopup();
        }

        // Mostrar informações no painel
        this.mostrarInfoUnidade(unidade);

        // Scroll suave até o mapa
        this.mapaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * MOSTRAR INFORMAÇÕES DA UNIDADE
     * Exibe detalhes no painel lateral
     */
    mostrarInfoUnidade(unidade) {
        const infoContent = document.getElementById('infoContent');

        let distanciaText = '';
        if (this.minhaLocalizacao) {
            const distancia = this.calcularDistanciaEntre(
                this.minhaLocalizacao.lat,
                this.minhaLocalizacao.lng,
                unidade.lat,
                unidade.lng
            );
            distanciaText = distancia < 1 ?
                `<p><strong>Distância:</strong> ${Math.round(distancia * 1000)}m</p>` :
                `<p><strong>Distância:</strong> ${distancia.toFixed(1)}km</p>`;
        }

        infoContent.innerHTML = `
            <h4>${unidade.nome}</h4>
            <p>${unidade.endereco}</p>
            <p><strong>Horário:</strong><br>${unidade.horario}</p>
            ${distanciaText}
            <p>${unidade.descricao}</p>
            <a href="tel:${unidade.telefone}" class="btn-rota">📞 Ligar Agora</a>
        `;

        this.infoPanel.classList.add('show');
    }
}

// Inicializar o mapa quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.mapaInterativo = new MapaInterativo();
    console.log('Sistema de mapa carregado!');
});