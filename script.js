document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ANIMAÇÕES DE SCROLL (REVEAL)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Anima apenas uma vez ao descer
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Fechar todas as outras perguntas antes de abrir a atual
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Se não estava aberta antes de clicar, abre a atual
            if (!isOpen) {
                item.classList.add('active');
                // Adiciona o height real do conteúdo para a transição do max-height funcionar perfeitamente
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // CARROSSEL DE PROVAS SOCIAIS
    // ==========================================
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        let currentIndex = 0;
        let autoplayInterval;
        const autoplayTime = 7000;

        const updateSlider = (index) => {
            track.style.transition = 'transform 0.4s ease-in-out';
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('current-indicator'));
            if(dots[index]) dots[index].classList.add('current-indicator');
        };

        const moveToNextSlide = () => {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            updateSlider(currentIndex);
        };

        const moveToPrevSlide = () => {
            currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            updateSlider(currentIndex);
        };

        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(moveToNextSlide, autoplayTime);
        };

        nextButton.addEventListener('click', () => { moveToNextSlide(); resetAutoplay(); });
        prevButton.addEventListener('click', () => { moveToPrevSlide(); resetAutoplay(); });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;
            currentIndex = dots.findIndex(dot => dot === targetDot);
            updateSlider(currentIndex);
            resetAutoplay();
        });

        // SWIPE INTERACTION
        const trackContainer = document.querySelector('.carousel-track-container');
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let animationID;

        const getPositionX = (event) => event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;

        const touchStart = (event) => {
            isDragging = true;
            startPos = getPositionX(event);
            track.style.transition = 'none';
            clearInterval(autoplayInterval);
            animationID = requestAnimationFrame(animation);
        };

        const touchMove = (event) => {
            if (isDragging) {
                currentTranslate = getPositionX(event) - startPos;
            }
        };

        const touchEnd = () => {
            isDragging = false;
            cancelAnimationFrame(animationID);
            
            const threshold = 60; // min px to swipe
            
            if (currentTranslate < -threshold) {
                currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            } else if (currentTranslate > threshold) {
                currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            }
            
            currentTranslate = 0; // reset
            updateSlider(currentIndex);
            resetAutoplay();
        };

        const animation = () => {
            if (isDragging) {
                track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}px))`;
                requestAnimationFrame(animation);
            }
        };

        trackContainer.addEventListener('mousedown', touchStart);
        trackContainer.addEventListener('touchstart', touchStart, {passive: true});
        trackContainer.addEventListener('mouseup', touchEnd);
        trackContainer.addEventListener('mouseleave', () => { if(isDragging) touchEnd(); });
        trackContainer.addEventListener('touchend', touchEnd);
        trackContainer.addEventListener('mousemove', touchMove);
        trackContainer.addEventListener('touchmove', touchMove, {passive: true});

        autoplayInterval = setInterval(moveToNextSlide, autoplayTime);
    }

    // ==========================================
    // PROVA SOCIAL DINÂMICA (NOTIFICAÇÃO V2 - NOMES REAIS)
    // ==========================================
    const nomes = [
        "João Silva", "Carlos Henrique", "Marcos Souza", 
        "Rafael Oliveira", "Bruno Santos", "André Pereira",
        "Thiago Costa", "Pedro Almeida", "Lucas Fernandes",
        "Fernando Gomes", "Diego Martins", "Marcelo Batista"
    ];
    
    const acoes = [
        "acabou de garantir o Acesso Completo",
        "acabou de adquirir o material",
        "garantiu o acesso agora",
        "acabou de entrar",
        "liberou o acesso completo",
        "acabou de comprar"
    ];

    const notificationElement = document.getElementById('social-proof-notification');
    const notificationText = document.getElementById('sp-notification-text');

    if (notificationElement && notificationText) {
        let lastNomeIndex = -1;

        function showNotification() {
            // Escolher nome sem repetir o último iterado
            let randomNomeIndex;
            do {
                randomNomeIndex = Math.floor(Math.random() * nomes.length);
            } while (randomNomeIndex === lastNomeIndex);
            lastNomeIndex = randomNomeIndex;

            const randomNome = nomes[randomNomeIndex];
            const randomAcao = acoes[Math.floor(Math.random() * acoes.length)];
            
            // Injetar no HTML
            notificationText.innerHTML = `<strong>${randomNome}</strong> ${randomAcao}`;
            
            // Exibir a notificação
            notificationElement.classList.remove('hidden');
            void notificationElement.offsetWidth; // Force Reflow
            notificationElement.classList.add('show');
            
            // Ocultar após 4-5 segundos
            const displayTime = Math.floor(Math.random() * (5000 - 4000 + 1)) + 4000;
            
            setTimeout(() => {
                notificationElement.classList.remove('show');
                
                // Agendar próxima exibição (15 a 35 segundos)
                const nextInterval = Math.floor(Math.random() * (35000 - 15000 + 1)) + 15000;
                setTimeout(showNotification, nextInterval);
            }, displayTime);
        }
        
        // Primeira exibição após 10 segundos para ancorar
        setTimeout(showNotification, 10000);
    }
});
