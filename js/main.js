document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todos os efeitos assim que a página é carregada

    handleTimelineScroll();
    handleStatsAnimation();
});

// ==========================================================
// 1. SCROLL TIMELINE: Anima a linha e os itens da Jornada
// ==========================================================

function handleTimelineScroll() {
    // Seleciona todos os itens da timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    // Seleciona o elemento UL que contém a linha animada (o :after)
    const timelineElement = document.querySelector('.timeline');
    
    // Altura da janela (viewport) para calcular quando o elemento está visível
    const windowHeight = window.innerHeight;

    // Função principal que verifica a visibilidade dos elementos
    function checkTimelineVisibility() {
        let maxScrollPosition = 0; 

        timelineItems.forEach(item => {
            // Posição vertical do topo do elemento em relação ao topo da viewport
            const itemTop = item.getBoundingClientRect().top;
            
            // Ponto de gatilho: 80% da altura da tela
            const triggerPoint = windowHeight * 0.8;

            // Ativa a visibilidade se o item estiver visível
            if (itemTop < triggerPoint && !item.classList.contains('is-visible')) {
                item.classList.add('is-visible');
            }

            // Calcula a distância para animar a linha central
            if (item.classList.contains('is-visible')) {
                // Calcula a distância do topo até o ponto central do item
                const timelineTop = timelineElement.getBoundingClientRect().top + window.scrollY;
                const itemCenter = item.getBoundingClientRect().top + window.scrollY + (item.offsetHeight / 2);
                
                // Distância que a linha deve se estender
                const distance = itemCenter - timelineTop;
                maxScrollPosition = Math.max(maxScrollPosition, distance);
            }
        });

        // Aplica a altura calculada à linha animada (usando a variável CSS --timeline-height)
        if (maxScrollPosition > 0) {
            timelineElement.style.setProperty('--timeline-height', `${maxScrollPosition}px`);
        }
    }

    // Adiciona o evento de scroll e checa visibilidade na carga
    window.addEventListener('scroll', checkTimelineVisibility);
    checkTimelineVisibility(); 
}

// ==========================================================
// 2. COUNT UP: Anima os números das Estatísticas
// ==========================================================

function handleStatsAnimation() {
    const statsSection = document.getElementById('estatisticas');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animationStarted = false;

    // Função de Animação de Contagem
    function animateCount(element, finalValue) {
        let start = 0;
        const duration = 2000; // 2 segundos
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            const currentValue = Math.floor(percentage * finalValue);

            // Adiciona o símbolo correto para exibição ('+' ou texto)
            const displayValue = finalValue > 100 ? currentValue + '+' : currentValue;

            element.textContent = displayValue;

            if (percentage < 1) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }

    // Verifica a visibilidade da seção de Estatísticas
    function checkStatsVisibility() {
        const statsTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Se a seção estiver visível (70% da altura da tela) e a animação não tiver começado
        if (statsTop < windowHeight * 0.7 && !animationStarted) {
            animationStarted = true; 

            statNumbers.forEach(numberEl => {
                const finalValue = parseInt(numberEl.getAttribute('data-target'));
                animateCount(numberEl, finalValue);
            });
            
            // Remove o evento de scroll após iniciar para performance
            window.removeEventListener('scroll', checkStatsVisibility);
        }
    }

    window.addEventListener('scroll', checkStatsVisibility);
    checkStatsVisibility(); 
}