// Script para la pantalla de Inicio

document.addEventListener('DOMContentLoaded', function() {
    // Animación de contadores en las estadísticas
    function animateCounter(elementId, targetValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let currentValue = 0;
        const increment = targetValue / 100;
        const duration = 1500; // 1.5 segundos
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            if (suffix === '%') {
                element.textContent = Math.floor(currentValue) + suffix;
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
            }
        }, stepTime);
    }
    
    // Iniciar animación de contadores cuando sean visibles
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animar contadores
                    animateCounter('totalStudents', 1247);
                    animateCounter('totalCourses', 18);
                    animateCounter('successRate', 92, '%');
                    animateCounter('satisfactionRate', 96, '%');
                    
                    // Dejar de observar después de animar
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Efecto de hover mejorado para las tarjetas de características
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animación para el botón CTA
    const ctaButton = document.querySelector('.cta .btn');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Efecto de parpadeo para el icono del logo
    const logoIcon = document.querySelector('.logo-icon');
    if (logoIcon) {
        setInterval(() => {
            logoIcon.style.transform = 'scale(1.1)';
            logoIcon.style.color = '#1abc9c';
            
            setTimeout(() => {
                logoIcon.style.transform = 'scale(1)';
                logoIcon.style.color = '';
            }, 300);
        }, 3000);
    }
});