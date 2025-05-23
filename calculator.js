document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const rooms = parseFloat(document.getElementById('rooms').value);
    const occupancy = parseFloat(document.getElementById('occupancy').value) / 100;
    const stayDuration = parseFloat(document.getElementById('stayDuration').value);
    const roomWeight = parseFloat(document.getElementById('roomWeight').value);
    const operatingDays = parseFloat(document.getElementById('operatingDays').value);
    const operatingHours = parseFloat(document.getElementById('operatingHours').value);

    // Constantes
    const CYCLE_TIME = 50; // minutos por ciclo
    const EFFICIENCY = 0.90; // 90% de eficiencia
    const MACHINE_CAPACITIES = [18, 24, 29, 35, 45, 60, 80, 100]; // Capacidades disponibles en kg

    // Cálculos
    // 1. Cálculo de kilos diarios
    const dailyWeight = (rooms * occupancy * roomWeight) / stayDuration;

    // 2. Cálculo de capacidad por hora
    const hourlyCapacity = dailyWeight / operatingHours;

    // 3. Cálculo de capacidad por ciclo
    const cycleCapacity = hourlyCapacity * (CYCLE_TIME / 60);

    // 4. Cálculo de ciclos por día
    const cyclesPerDay = (dailyWeight / cycleCapacity) / EFFICIENCY;

    // 5. Recomendación de equipos
    let equipmentRecommendation = '';
    let totalCapacity = 0;
    let machines = [];

    // Calcular la capacidad total necesaria
    const requiredCapacity = cycleCapacity / EFFICIENCY;

    // Encontrar la mejor combinación de máquinas
    let remainingCapacity = requiredCapacity;
    while (remainingCapacity > 0) {
        // Encontrar la máquina más grande que no exceda la capacidad restante
        let bestMachine = MACHINE_CAPACITIES.reduce((best, current) => {
            if (current <= remainingCapacity && current > best) {
                return current;
            }
            return best;
        }, 0);

        if (bestMachine === 0) {
            // Si no encontramos una máquina que se ajuste, usamos la más pequeña
            bestMachine = MACHINE_CAPACITIES[0];
        }

        machines.push(bestMachine);
        totalCapacity += bestMachine;
        remainingCapacity -= bestMachine;
    }

    // Formatear la recomendación
    const machineCounts = machines.reduce((acc, capacity) => {
        acc[capacity] = (acc[capacity] || 0) + 1;
        return acc;
    }, {});

    equipmentRecommendation = Object.entries(machineCounts)
        .map(([capacity, count]) => `${count} Lavadora${count > 1 ? 's' : ''} de ${capacity} kg`)
        .join(' + ');

    // Mostrar resultados
    document.getElementById('dailyCapacity').textContent = `${dailyWeight.toFixed(2)} kg/día`;
    document.getElementById('hourlyCapacity').textContent = `${hourlyCapacity.toFixed(2)} kg/hora`;
    document.getElementById('cycleCapacity').textContent = `${cycleCapacity.toFixed(2)} kg/ciclo`;
    document.getElementById('cyclesPerDay').textContent = `${cyclesPerDay.toFixed(1)} ciclos`;
    document.getElementById('equipmentRecommendation').textContent = equipmentRecommendation;

    // Mostrar la sección de resultados
    document.getElementById('results').style.display = 'block';
}); 