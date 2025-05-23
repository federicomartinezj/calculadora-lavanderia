// Wizard navigation logic
const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4')
];
let currentStep = 0;

function showStep(index) {
    steps.forEach((step, i) => {
        if (step) step.classList.toggle('active', i === index);
    });
    currentStep = index;
}

// Validación simple para el primer paso
function validateStep1() {
    const rooms = document.getElementById('rooms').value;
    const occupancy = document.getElementById('occupancy').value;
    const operatingDays = document.getElementById('operatingDays').value;
    const operatingHours = document.getElementById('operatingHours').value;
    if (!rooms || rooms < 1) return false;
    if (!occupancy || occupancy < 1 || occupancy > 100) return false;
    if (!operatingDays || operatingDays < 1 || operatingDays > 7) return false;
    if (!operatingHours || operatingHours < 1 || operatingHours > 24) return false;
    return true;
}

document.getElementById('toStep2').addEventListener('click', function() {
    if (validateStep1()) {
        showStep(1);
    } else {
        alert('Por favor, completa todos los campos correctamente antes de continuar.');
    }
});

// Mostrar/ocultar campos F&B y piscina/spa
const hasFB = document.getElementById('hasFB');
const fbFields = document.getElementById('fbFields');
hasFB.addEventListener('change', function() {
    fbFields.style.display = hasFB.value === 'si' ? 'block' : 'none';
});

const hasPoolSpa = document.getElementById('hasPoolSpa');
const poolSpaFields = document.getElementById('poolSpaFields');
hasPoolSpa.addEventListener('change', function() {
    poolSpaFields.style.display = hasPoolSpa.value === 'si' ? 'block' : 'none';
});

// Validación para el paso 2
function validateStep2() {
    // Ropa especial: no requiere validación extra
    // F&B
    if (hasFB.value === 'si') {
        const fbSeats = document.getElementById('fbSeats').value;
        const fbMeals = document.getElementById('fbMeals').value;
        if (!fbSeats || fbSeats < 0) return false;
        if (!fbMeals || fbMeals < 0) return false;
    }
    // Piscina/spa
    if (hasPoolSpa.value === 'si') {
        const poolSpaUsers = document.getElementById('poolSpaUsers').value;
        if (!poolSpaUsers || poolSpaUsers < 0) return false;
    }
    return true;
}

document.getElementById('toStep1').addEventListener('click', function() {
    showStep(0);
});

document.getElementById('toStep3').addEventListener('click', function() {
    if (validateStep2()) {
        showStep(2);
    } else {
        alert('Por favor, completa todos los campos correctamente antes de continuar.');
    }
});

// Validación para el paso 3
function validateStep3() {
    const soilLevel = document.getElementById('soilLevel').value;
    const gForce = document.getElementById('gForce').value;
    if (!soilLevel) return false;
    if (!gForce) return false;
    return true;
}

document.getElementById('toStep4').addEventListener('click', function() {
    if (validateStep3()) {
        showStep(3);
        // Aquí se llamará a la función para calcular y mostrar resultados
    } else {
        alert('Por favor, completa todos los campos correctamente antes de continuar.');
    }
});

// Preparar para futuros pasos (retroceso, avance, etc.)
// Ejemplo:
// document.getElementById('toStep1').addEventListener('click', function() { showStep(0); });
// document.getElementById('toStep3').addEventListener('click', function() { showStep(2); });

// Inicializar wizard en el primer paso
showStep(0); 