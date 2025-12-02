// Script común para todas las páginas

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips
    initTooltips();
    
    // Inicializar mensajes de alerta
    initAlerts();
    
    // Configurar navegación activa
    setActiveNavigation();
    
    // Configurar año actual en el footer
    setCurrentYear();
    
    // Configurar validaciones básicas de formularios
    initFormValidations();
});

// Función para inicializar tooltips simples
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            if (!tooltipText) return;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            
            this._currentTooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._currentTooltip) {
                this._currentTooltip.remove();
                this._currentTooltip = null;
            }
        });
    });
}

// Función para inicializar alertas
function initAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // Agregar botón de cierre si no existe
        if (!alert.querySelector('.alert-close')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'alert-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', function() {
                alert.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            });
            alert.appendChild(closeBtn);
        }
        
        // Auto-ocultar alertas después de 5 segundos
        if (alert.classList.contains('alert-auto-dismiss')) {
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        alert.remove();
                    }, 300);
                }
            }, 5000);
        }
    });
}

// Función para establecer navegación activa
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Función para establecer año actual en el footer
function setCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Función para inicializar validaciones básicas de formularios
function initFormValidations() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Validar campos requeridos al enviar
        form.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    highlightError(field, 'Este campo es obligatorio');
                } else {
                    clearError(field);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showFormError(this, 'Por favor, complete todos los campos obligatorios.');
            }
        });
        
        // Limpiar errores al escribir
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    });
}

// Función para resaltar errores en campos
function highlightError(field, message) {
    const errorDiv = field.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('form-error')) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        const newErrorDiv = document.createElement('div');
        newErrorDiv.className = 'form-error';
        newErrorDiv.textContent = message;
        newErrorDiv.style.display = 'block';
        
        if (field.nextElementSibling) {
            field.parentNode.insertBefore(newErrorDiv, field.nextElementSibling);
        } else {
            field.parentNode.appendChild(newErrorDiv);
        }
    }
    
    field.classList.add('error');
    field.style.borderColor = '#e74c3c';
}

// Función para limpiar errores
function clearError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorDiv = field.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('form-error')) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

// Función para mostrar error general del formulario
function showFormError(form, message) {
    // Remover error anterior si existe
    const existingError = form.querySelector('.form-general-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Crear nuevo mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger form-general-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `;
    
    // Insertar al inicio del formulario
    if (form.firstChild) {
        form.insertBefore(errorDiv, form.firstChild);
    } else {
        form.appendChild(errorDiv);
    }
    
    // Configurar botón de cierre
    const closeBtn = errorDiv.querySelector('.alert-close');
    closeBtn.addEventListener('click', function() {
        errorDiv.remove();
    });
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(message) {
    // Crear elemento de mensaje
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Agregar al cuerpo del documento
    document.body.appendChild(successDiv);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Función para cargar datos desde localStorage
function loadFromLocalStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return defaultValue;
    }
}

// Función para guardar datos en localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error al guardar datos:', error);
        return false;
    }
}

// Función para formatear fecha
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Agregar estilos CSS para tooltips
const tooltipStyles = `
    .custom-tooltip {
        position: fixed;
        background-color: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.85rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    
    .custom-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
    }
    
    .form-general-error {
        margin-bottom: 1.5rem;
    }
    
    .success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideInTop 0.5s ease-out, fadeOut 0.5s ease-out 4s forwards;
    }
    
    @keyframes slideInTop {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        to { opacity: 0; transform: translateY(-20px); }
    }
`;

// Inyectar estilos en el documento
const styleSheet = document.createElement('style');
styleSheet.textContent = tooltipStyles;
document.head.appendChild(styleSheet);