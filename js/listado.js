// Script para la pantalla de Listado

let currentPage = 1;
let itemsPerPage = 10;
let filteredMatriculas = [];
let allMatriculas = [];

document.addEventListener('DOMContentLoaded', function() {
    // Cargar matrículas
    loadMatriculas();
    
    // Configurar eventos
    setupEventListeners();
    
    // Inicializar tabla
    renderTable();
    
    // Actualizar estadísticas
    updateStats();
});

// Función para cargar matrículas
function loadMatriculas() {
    allMatriculas = loadFromLocalStorage('matriculas', []);
    filteredMatriculas = [...allMatriculas];
}

// Función para configurar event listeners
function setupEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterMatriculas();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', filterMatriculas);
    }
    
    // Filtros
    const filterStatus = document.getElementById('filterStatus');
    const filterCourse = document.getElementById('filterCourse');
    const clearFilters = document.getElementById('clearFilters');
    
    if (filterStatus) {
        filterStatus.addEventListener('change', filterMatriculas);
    }
    
    if (filterCourse) {
        filterCourse.addEventListener('change', filterMatriculas);
    }
    
    if (clearFilters) {
        clearFilters.addEventListener('click', clearAllFilters);
    }
    
    // Paginación
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    
    if (prevPage) {
        prevPage.addEventListener('click', goToPrevPage);
    }
    
    if (nextPage) {
        nextPage.addEventListener('click', goToNextPage);
    }
    
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function() {
            itemsPerPage = parseInt(this.value);
            currentPage = 1;
            renderTable();
        });
    }
    
    // Acciones
    const exportBtn = document.getElementById('exportBtn');
    const printBtn = document.getElementById('printBtn');
    const selectAll = document.getElementById('selectAll');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportMatriculas);
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', printTable);
    }
    
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.matricula-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Modal
    const modal = document.getElementById('detailsModal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Función para filtrar matrículas
function filterMatriculas() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    const courseFilter = document.getElementById('filterCourse')?.value || 'all';
    
    filteredMatriculas = allMatriculas.filter(matricula => {
        // Filtrar por búsqueda
        const searchMatch = searchTerm === '' || 
            matricula.estudiante.nombres.toLowerCase().includes(searchTerm) ||
            matricula.estudiante.apellidos.toLowerCase().includes(searchTerm) ||
            matricula.estudiante.dni.toLowerCase().includes(searchTerm) ||
            matricula.matricula.curso.toLowerCase().includes(searchTerm);
        
        // Filtrar por estado
        const statusMatch = statusFilter === 'all' || matricula.estado === statusFilter;
        
        // Filtrar por curso
        const courseMatch = courseFilter === 'all' || matricula.matricula.curso === courseFilter;
        
        return searchMatch && statusMatch && courseMatch;
    });
    
    currentPage = 1;
    renderTable();
    updateStats();
}

// Función para limpiar filtros
function clearAllFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterCourse = document.getElementById('filterCourse');
    
    if (searchInput) searchInput.value = '';
    if (filterStatus) filterStatus.value = 'all';
    if (filterCourse) filterCourse.value = 'all';
    
    filteredMatriculas = [...allMatriculas];
    currentPage = 1;
    renderTable();
    updateStats();
}

// Función para renderizar la tabla
function renderTable() {
    const tableBody = document.getElementById('matriculasBody');
    const emptyMessage = document.getElementById('emptyTableMessage');
    
    if (!tableBody || !emptyMessage) return;
    
    // Calcular índices para paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageMatriculas = filteredMatriculas.slice(startIndex, endIndex);
    
    // Mostrar u ocultar mensaje de tabla vacía
    if (filteredMatriculas.length === 0) {
        tableBody.innerHTML = '';
        emptyMessage.classList.add('show');
        return;
    } else {
        emptyMessage.classList.remove('show');
    }
    
    // Generar filas de la tabla
    let tableHTML = '';
    
    pageMatriculas.forEach((matricula, index) => {
        const estudiante = matricula.estudiante;
        const matriculaData = matricula.matricula;
        
        // Formatear nombres
        const nombresCompletos = `${estudiante.nombres} ${estudiante.apellidos}`;
        
        // Formatear fecha de inicio
        const fechaInicio = formatDate(matriculaData.fechaInicio);
        
        // Obtener nombre del curso
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
        
        const cursoNombre = cursos[matriculaData.curso] || matriculaData.curso;
        
        // Obtener nombre de la modalidad
        const modalidades = {
            'presencial': 'Presencial',
            'virtual': 'Virtual',
            'hibrida': 'Híbrida'
        };
        
        const modalidadNombre = modalidades[matriculaData.modalidad] || matriculaData.modalidad;
        
        // Obtener clase para el estado
        const estadoClases = {
            'active': 'badge-active',
            'pending': 'badge-pending',
            'completed': 'badge-completed',
            'cancelled': 'badge-cancelled'
        };
        
        const estadoTexto = {
            'active': 'Activa',
            'pending': 'Pendiente',
            'completed': 'Completada',
            'cancelled': 'Cancelada'
        };
        
        const estadoClass = estadoClases[matricula.estado] || 'badge-pending';
        const estadoText = estadoTexto[matricula.estado] || 'Pendiente';
        
        // Generar fila
        tableHTML += `
            <tr data-id="${matricula.id}">
                <td>
                    <input type="checkbox" class="matricula-checkbox" data-id="${matricula.id}">
                </td>
                <td>${nombresCompletos}</td>
                <td>${estudiante.dni}</td>
                <td>${cursoNombre}</td>
                <td>${modalidadNombre}</td>
                <td>${fechaInicio}</td>
                <td><span class="badge ${estadoClass}">${estadoText}</span></td>
                <td>
                    <div class="action-buttons-cell">
                        <button class="action-btn action-btn-view" data-id="${matricula.id}" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn action-btn-edit" data-id="${matricula.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn-delete" data-id="${matricula.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
    
    // Configurar eventos para botones de acción
    setupTableActionButtons();
    
    // Actualizar controles de paginación
    updatePaginationControls();
}

// Función para configurar botones de acción en la tabla
function setupTableActionButtons() {
    // Botones de vista
    const viewButtons = document.querySelectorAll('.action-btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matriculaId = this.getAttribute('data-id');
            showMatriculaDetails(matriculaId);
        });
    });
    
    // Botones de edición
    const editButtons = document.querySelectorAll('.action-btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matriculaId = this.getAttribute('data-id');
            editMatricula(matriculaId);
        });
    });
    
    // Botones de eliminación
    const deleteButtons = document.querySelectorAll('.action-btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matriculaId = this.getAttribute('data-id');
            deleteMatricula(matriculaId);
        });
    });
}

// Función para mostrar detalles de matrícula
function showMatriculaDetails(matriculaId) {
    const matricula = allMatriculas.find(m => m.id === matriculaId);
    
    if (!matricula) {
        alert('Matrícula no encontrada');
        return;
    }
    
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    // Obtener nombres de curso y modalidad
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
    
    const modalidades = {
        'presencial': 'Presencial',
        'virtual': 'Virtual',
        'hibrida': 'Híbrida'
    };
    
    const estados = {
        'active': 'Activa',
        'pending': 'Pendiente',
        'completed': 'Completada',
        'cancelled': 'Cancelada'
    };
    
    const generos = {
        'masculino': 'Masculino',
        'femenino': 'Femenino',
        'otro': 'Otro',
        'prefiero-no-decir': 'Prefiero no decir'
    };
    
    const estudiante = matricula.estudiante;
    const matriculaData = matricula.matricula;
    
    // Formatear fechas
    const fechaRegistro = formatDate(matricula.fechaRegistro);
    const fechaNacimiento = formatDate(estudiante.fechaNacimiento);
    const fechaInicio = formatDate(matriculaData.fechaInicio);
    const fechaFin = matriculaData.fechaFin ? formatDate(matriculaData.fechaFin) : 'No especificada';
    
    // Generar contenido del modal
    const modalContent = `
        <div class="details-container">
            <div class="details-section">
                <h3><i class="fas fa-user-graduate"></i> Información del Estudiante</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Nombres:</span>
                        <span class="detail-value">${estudiante.nombres}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Apellidos:</span>
                        <span class="detail-value">${estudiante.apellidos}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">DNI:</span>
                        <span class="detail-value">${estudiante.dni}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fecha Nacimiento:</span>
                        <span class="detail-value">${fechaNacimiento}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Género:</span>
                        <span class="detail-value">${generos[estudiante.genero] || 'No especificado'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${estudiante.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Teléfono:</span>
                        <span class="detail-value">${estudiante.telefono}</span>
                    </div>
                    <div class="detail-item full-width">
                        <span class="detail-label">Dirección:</span>
                        <span class="detail-value">${estudiante.direccion}</span>
                    </div>
                </div>
            </div>
            
            <div class="details-section">
                <h3><i class="fas fa-book"></i> Información de la Matrícula</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Curso:</span>
                        <span class="detail-value">${cursos[matriculaData.curso] || matriculaData.curso}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Modalidad:</span>
                        <span class="detail-value">${modalidades[matriculaData.modalidad] || matriculaData.modalidad}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fecha Inicio:</span>
                        <span class="detail-value">${fechaInicio}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fecha Fin:</span>
                        <span class="detail-value">${fechaFin}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Estado:</span>
                        <span class="detail-value badge ${matricula.estado === 'active' ? 'badge-active' : 
                            matricula.estado === 'pending' ? 'badge-pending' : 
                            matricula.estado === 'completed' ? 'badge-completed' : 'badge-cancelled'}">
                            ${estados[matricula.estado] || matricula.estado}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fecha Registro:</span>
                        <span class="detail-value">${fechaRegistro}</span>
                    </div>
                    <div class="detail-item full-width">
                        <span class="detail-label">Observaciones:</span>
                        <span class="detail-value">${matriculaData.observaciones || 'No hay observaciones'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = modalContent;
    modal.classList.add('show');
    
    // Configurar botones del modal
    const editBtn = document.getElementById('editMatricula');
    const deleteBtn = document.getElementById('deleteMatricula');
    
    if (editBtn) {
        editBtn.onclick = function() {
            editMatricula(matriculaId);
        };
    }
    
    if (deleteBtn) {
        deleteBtn.onclick = function() {
            deleteMatricula(matriculaId);
            modal.classList.remove('show');
        };
    }
}

// Función para editar matrícula
function editMatricula(matriculaId) {
    // Aquí podrías redirigir a una página de edición
    // o mostrar un formulario de edición en el modal
    alert(`Función de edición para matrícula ${matriculaId} - En una implementación completa, esto abriría un formulario de edición.`);
}

// Función para eliminar matrícula
function deleteMatricula(matriculaId) {
    if (!confirm('¿Está seguro de que desea eliminar esta matrícula? Esta acción no se puede deshacer.')) {
        return;
    }
    
    // Encontrar índice de la matrícula
    const index = allMatriculas.findIndex(m => m.id === matriculaId);
    
    if (index !== -1) {
        // Eliminar del array
        allMatriculas.splice(index, 1);
        
        // Guardar cambios
        saveToLocalStorage('matriculas', allMatriculas);
        
        // Actualizar datos y vista
        loadMatriculas();
        renderTable();
        updateStats();
        
        // Mostrar mensaje de éxito
        showSuccessMessage('Matrícula eliminada exitosamente!');
    }
}

// Función para actualizar controles de paginación
function updatePaginationControls() {
    const totalPages = Math.ceil(filteredMatriculas.length / itemsPerPage);
    
    // Actualizar información de paginación
    const currentPageStart = document.getElementById('currentPageStart');
    const currentPageEnd = document.getElementById('currentPageEnd');
    const totalItems = document.getElementById('totalItems');
    
    if (currentPageStart && currentPageEnd && totalItems) {
        const startItem = filteredMatriculas.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
        const endItem = Math.min(currentPage * itemsPerPage, filteredMatriculas.length);
        
        currentPageStart.textContent = startItem;
        currentPageEnd.textContent = endItem;
        totalItems.textContent = filteredMatriculas.length;
    }
    
    // Actualizar botones de paginación
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (prevPage) {
        prevPage.disabled = currentPage <= 1;
    }
    
    if (nextPage) {
        nextPage.disabled = currentPage >= totalPages;
    }
    
    // Actualizar números de página
    const pageNumbers = document.getElementById('pageNumbers');
    if (!pageNumbers) return;
    
    let pageNumbersHTML = '';
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Botón para primera página
    if (startPage > 1) {
        pageNumbersHTML += `<button class="page-btn" data-page="1">1</button>`;
        if (startPage > 2) {
            pageNumbersHTML += `<span class="page-dots">...</span>`;
        }
    }
    
    // Números de página
    for (let i = startPage; i <= endPage; i++) {
        pageNumbersHTML += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Botón para última página
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbersHTML += `<span class="page-dots">...</span>`;
        }
        pageNumbersHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    pageNumbers.innerHTML = pageNumbersHTML;
    
    // Configurar eventos para botones de página
    const pageButtons = pageNumbers.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            goToPage(page);
        });
    });
}

// Funciones de navegación de páginas
function goToPage(page) {
    const totalPages = Math.ceil(filteredMatriculas.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
}

function goToPrevPage() {
    goToPage(currentPage - 1);
}

function goToNextPage() {
    goToPage(currentPage + 1);
}

// Función para actualizar estadísticas
function updateStats() {
    const totalMatriculas = document.getElementById('totalMatriculas');
    const matriculasActivas = document.getElementById('matriculasActivas');
    const matriculasPendientes = document.getElementById('matriculasPendientes');
    const tasaCompletamiento = document.getElementById('tasaCompletamiento');
    
    if (!totalMatriculas || !matriculasActivas || !matriculasPendientes || !tasaCompletamiento) return;
    
    // Calcular estadísticas
    const total = filteredMatriculas.length;
    const activas = filteredMatriculas.filter(m => m.estado === 'active').length;
    const pendientes = filteredMatriculas.filter(m => m.estado === 'pending').length;
    const completadas = filteredMatriculas.filter(m => m.estado === 'completed').length;
    const tasa = total > 0 ? Math.round((completadas / total) * 100) : 0;
    
    // Actualizar con animación
    animateCounter(totalMatriculas, total);
    animateCounter(matriculasActivas, activas);
    animateCounter(matriculasPendientes, pendientes);
    animateCounter(tasaCompletamiento, tasa, '%');
}

// Función para animar contadores
function animateCounter(element, targetValue, suffix = '') {
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    const diff = targetValue - currentValue;
    const duration = 500;
    const steps = 20;
    const stepValue = diff / steps;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    let currentDisplayValue = currentValue;
    
    const timer = setInterval(() => {
        currentStep++;
        currentDisplayValue += stepValue;
        
        if (currentStep >= steps) {
            currentDisplayValue = targetValue;
            clearInterval(timer);
        }
        
        element.textContent = suffix === '%' ? 
            Math.round(currentDisplayValue) + suffix : 
            Math.round(currentDisplayValue).toLocaleString();
    }, stepTime);
}

// Función para exportar matrículas
function exportMatriculas() {
    if (filteredMatriculas.length === 0) {
        alert('No hay matrículas para exportar');
        return;
    }
    
    // Crear contenido CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados
    csvContent += "ID,Nombres,Apellidos,DNI,Curso,Modalidad,Fecha Inicio,Estado,Email,Teléfono\n";
    
    // Datos
    filteredMatriculas.forEach(matricula => {
        const estudiante = matricula.estudiante;
        const matriculaData = matricula.matricula;
        
        const row = [
            matricula.id,
            `"${estudiante.nombres}"`,
            `"${estudiante.apellidos}"`,
            estudiante.dni,
            matriculaData.curso,
            matriculaData.modalidad,
            matriculaData.fechaInicio,
            matricula.estado,
            estudiante.email,
            estudiante.telefono
        ].join(',');
        
        csvContent += row + "\n";
    });
    
    // Crear enlace de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `matriculas_${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostrar mensaje de éxito
    showSuccessMessage('Matrículas exportadas exitosamente!');
}

// Función para imprimir tabla
function printTable() {
    const printWindow = window.open('', '_blank');
    const tableContent = document.querySelector('.table-container').outerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Listado de Matrículas</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #2c3e50; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .badge { padding: 3px 8px; border-radius: 10px; font-size: 12px; }
                .badge-active { background-color: #d4edda; color: #155724; }
                .badge-pending { background-color: #fff3cd; color: #856404; }
                .badge-completed { background-color: #d1ecf1; color: #0c5460; }
                .badge-cancelled { background-color: #f8d7da; color: #721c24; }
                h1 { color: #2c3e50; }
                .print-info { margin-bottom: 20px; color: #666; }
            </style>
        </head>
        <body>
            <h1>Listado de Matrículas</h1>
            <div class="print-info">
                <p>Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
                <p>Total de matrículas: ${filteredMatriculas.length}</p>
            </div>
            ${tableContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}