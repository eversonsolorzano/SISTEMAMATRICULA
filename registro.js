// Script para la pantalla de Registro

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos de matrículas existentes
    const matriculas = loadFromLocalStorage('matriculas', []);
    
    // Configurar fecha mínima para fecha de nacimiento (18 años atrás)
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    if (fechaNacimientoInput) {
        const hoy = new Date();
        const fechaMinima = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
        fechaNacimientoInput.max = fechaMinima.toISOString().split('T')[0];
        fechaNacimientoInput.min = '1900-01-01';
    }
    
    // Configurar fecha mínima para fecha de inicio (hoy)
    const fechaInicioInput = document.getElementById('fechaInicio');
    if (fechaInicioInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInicioInput.min = hoy;
        fechaInicioInput.value = hoy;
    }
    
    // Configurar fecha mínima para fecha de fin (después de fecha inicio)
    const fechaFinInput = document.getElementById('fechaFin');
    if (fechaFinInput && fechaInicioInput) {
        fechaInicioInput.addEventListener('change', function() {
            fechaFinInput.min = this.value;
        });
    }
    
    // Escuchar cambios en el formulario para actualizar el resumen
    const form = document.getElementById('registrationForm');
    if (form) {
        const formInputs = form.querySelectorAll('input, select, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('input', updateSummary);
            input.addEventListener('change', updateSummary);
        });
        
        // Configurar envío del formulario
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Configurar botón de limpiar
    const resetBtn = form.querySelector('button[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            setTimeout(updateSummary, 100);
        });
    }
    
    // Inicializar resumen
    updateSummary();
});

// Función para actualizar el resumen en tiempo real
function updateSummary() {
    // Obtener valores del formulario
    const nombres = document.getElementById('nombres')?.value || '';
    const apellidos = document.getElementById('apellidos')?.value || '';
    const dni = document.getElementById('dni')?.value || '';
    const curso = document.getElementById('curso')?.value || '';
    const modalidad = document.getElementById('modalidad')?.value || '';
    const fechaInicio = document.getElementById('fechaInicio')?.value || '';
    
    // Actualizar resumen
    const resumenNombres = document.getElementById('resumenNombres');
    const resumenDNI = document.getElementById('resumenDNI');
    const resumenCurso = document.getElementById('resumenCurso');
    const resumenModalidad = document.getElementById('resumenModalidad');
    const resumenFechaInicio = document.getElementById('resumenFechaInicio');
    
    if (resumenNombres) {
        resumenNombres.textContent = nombres && apellidos ? 
            `${nombres} ${apellidos}`.trim() : '---';
    }
    
    if (resumenDNI) {
        resumenDNI.textContent = dni || '---';
    }
    
    if (resumenCurso) {
        const cursos = {
            'matematicas': 'Matemáticas Avanzadas',
            'ciencias': 'Ciencias de la Computación',
            'literatura': 'Literatura Contemporánea',
            'historia': 'Historia Universal',
            'idiomas': 'Idiomas Extranjeros',
            'arte': 'Arte y Diseño',
            'administracion': 'Administración de Empresas',
            'ingenieria': 'Ingeniería de Software'
        };
        resumenCurso.textContent = cursos[curso] || '---';
    }
    
    if (resumenModalidad) {
        const modalidades = {
            'presencial': 'Presencial',
            'virtual': 'Virtual',
            'hibrida': 'Híbrida'
        };
        resumenModalidad.textContent = modalidades[modalidad] || '---';
    }
    
    if (resumenFechaInicio && fechaInicio) {
        const fecha = new Date(fechaInicio);
        resumenFechaInicio.textContent = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } else if (resumenFechaInicio) {
        resumenFechaInicio.textContent = '---';
    }
}

// Función para manejar el envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
        return;
    }
    
    // Obtener datos del formulario
    const matriculaData = getFormData();
    
    // Guardar matrícula
    const success = saveMatricula(matriculaData);
    
    if (success) {
        // Mostrar mensaje de éxito
        showSuccessMessage('Matrícula registrada exitosamente!');
        
        // Redirigir a listado después de 2 segundos
        setTimeout(() => {
            window.location.href = 'listado.html';
        }, 2000);
    }
}

// Función para validar el formulario
function validateForm() {
    let isValid = true;
    
    // Validar campos requeridos
    const requiredFields = [
        'nombres', 'apellidos', 'dni', 'fechaNacimiento',
        'email', 'telefono', 'direccion', 'curso',
        'modalidad', 'fechaInicio', 'terminos'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        let fieldValid = true;
        let errorMessage = '';
        
        if (field.type === 'checkbox') {
            if (!field.checked) {
                fieldValid = false;
                errorMessage = 'Debe aceptar los términos y condiciones';
            }
        } else if (!field.value.trim()) {
            fieldValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else {
            // Validaciones específicas por campo
            switch (fieldId) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value.trim())) {
                        fieldValid = false;
                        errorMessage = 'Ingrese un correo electrónico válido';
                    }
                    break;
                    
                case 'dni':
                    const dniRegex = /^\d{8,12}$/;
                    if (!dniRegex.test(field.value.trim())) {
                        fieldValid = false;
                        errorMessage = 'Ingrese un número de documento válido (8-12 dígitos)';
                    }
                    break;
                    
                case 'telefono':
                    const phoneRegex = /^\d{9,15}$/;
                    if (!phoneRegex.test(field.value.trim())) {
                        fieldValid = false;
                        errorMessage = 'Ingrese un número de teléfono válido';
                    }
                    break;
                    
                case 'fechaNacimiento':
                    const fechaNacimiento = new Date(field.value);
                    const edadMinima = new Date();
                    edadMinima.setFullYear(edadMinima.getFullYear() - 18);
                    
                    if (fechaNacimiento > edadMinima) {
                        fieldValid = false;
                        errorMessage = 'Debe ser mayor de 18 años';
                    }
                    break;
            }
        }
        
        // Mostrar/ocultar error
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            if (!fieldValid) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
                field.classList.add('error');
                field.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
                field.classList.remove('error');
                field.style.borderColor = '';
            }
        }
    });
    
    return isValid;
}

// Función para obtener datos del formulario
function getFormData() {
    // Obtener valores del formulario
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const genero = document.getElementById('genero').value;
    const curso = document.getElementById('curso').value;
    const modalidad = document.getElementById('modalidad').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const observaciones = document.getElementById('observaciones').value.trim();
    
    // Generar ID único
    const id = generateId();
    
    // Generar fecha de registro
    const fechaRegistro = new Date().toISOString();
    
    // Determinar estado inicial (pendiente)
    const estado = 'pending';
    
    // Devolver objeto con datos de la matrícula
    return {
        id,
        fechaRegistro,
        estado,
        estudiante: {
            nombres,
            apellidos,
            dni,
            fechaNacimiento,
            email,
            telefono,
            direccion,
            genero
        },
        matricula: {
            curso,
            modalidad,
            fechaInicio,
            fechaFin,
            observaciones
        }
    };
}

// Función para guardar matrícula
function saveMatricula(matriculaData) {
    try {
        // Cargar matrículas existentes
        const matriculas = loadFromLocalStorage('matriculas', []);
        
        // Agregar nueva matrícula
        matriculas.push(matriculaData);
        
        // Guardar en localStorage
        const success = saveToLocalStorage('matriculas', matriculas);
        
        if (success) {
            console.log('Matrícula guardada exitosamente:', matriculaData);
            return true;
        } else {
            console.error('Error al guardar matrícula');
            return false;
        }
    } catch (error) {
        console.error('Error al guardar matrícula:', error);
        return false;
    }
}

// Función para mostrar animación de éxito
function showSuccessAnimation() {
    const successIcon = document.createElement('div');
    successIcon.className = 'success-animation';
    successIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    successIcon.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        font-size: 8rem;
        color: #2ecc71;
        z-index: 1001;
        animation: successScale 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(successIcon);
    
    // Agregar estilos de animación
    const animationStyles = `
        @keyframes successScale {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
    
    // Remover después de la animación
    setTimeout(() => {
        successIcon.remove();
        styleSheet.remove();
    }, 1500);
}