// --- Constantes de Conversión ---
const KG_PER_LB = 0.453592;
const LB_PER_KG = 2.20462;

const BASE_CAPACITY_PER_ROOM_LBS = {
    "Estancia Prolongada": 8.0,
    "Económico": 10.0,
    "Servicio Limitado": 12.0,
    "Servicio Selecto": 14.0,
    "Lujo": 16.0,
    "Resort": 18.0
};
const BASE_CAPACITY_PER_ROOM_KG = {
    "Estancia Prolongada": (8.0 * KG_PER_LB),
    "Económico": (10.0 * KG_PER_LB),
    "Servicio Limitado": (12.0 * KG_PER_LB),
    "Servicio Selecto": (14.0 * KG_PER_LB),
    "Lujo": (16.0 * KG_PER_LB),
    "Resort": (18.0 * KG_PER_LB)
};

function updateRoomWeight() {
    const hotelType = document.getElementById('hotelType').value;
    const unit = document.getElementById('unit').value;
    let value = 0;
    if (unit === 'kg') {
        value = BASE_CAPACITY_PER_ROOM_KG[hotelType] ? BASE_CAPACITY_PER_ROOM_KG[hotelType].toFixed(2) : '';
    } else {
        value = BASE_CAPACITY_PER_ROOM_LBS[hotelType] ? BASE_CAPACITY_PER_ROOM_LBS[hotelType].toFixed(2) : '';
    }
    document.getElementById('roomWeight').value = value;
    document.getElementById('unitLabel').textContent = unit;
}

document.getElementById('hotelType').addEventListener('change', updateRoomWeight);
document.getElementById('unit').addEventListener('change', updateRoomWeight);

document.addEventListener('DOMContentLoaded', updateRoomWeight);

document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const rooms = parseFloat(document.getElementById('rooms').value);
    const occupancy = parseFloat(document.getElementById('occupancy').value) / 100;
    const stayDuration = parseFloat(document.getElementById('stayDuration').value);
    const roomWeight = parseFloat(document.getElementById('roomWeight').value);
    const operatingDays = parseFloat(document.getElementById('operatingDays').value);
    const operatingHours = parseFloat(document.getElementById('operatingHours').value);
    const unit = document.getElementById('unit').value;

    // Constantes
    const CYCLE_TIME = 50; // minutos por ciclo
    const EFFICIENCY = 0.90; // 90% de eficiencia
    const MACHINE_CAPACITIES_KG = [18, 24, 29, 35, 45, 60, 80, 100];
    const MACHINE_CAPACITIES_LB = [40, 60, 80, 100, 125, 160, 200, 220];
    const MACHINE_CAPACITIES = unit === 'kg' ? MACHINE_CAPACITIES_KG : MACHINE_CAPACITIES_LB;

    // Cálculos
    // 1. Cálculo de kilos/libras diarios
    const dailyWeight = (rooms * occupancy * roomWeight) / stayDuration;

    // 2. Cálculo de capacidad por hora
    const hourlyCapacity = dailyWeight / operatingHours;

    // 3. Cálculo de capacidad por ciclo
    const cycleCapacity = hourlyCapacity * (CYCLE_TIME / 60);

    // 4. Cálculo de ciclos por día
    const cyclesPerDay = (dailyWeight / cycleCapacity) / EFFICIENCY;

    // 5. Recomendación de equipos (3 mejores opciones)
    const requiredCapacity = cycleCapacity / EFFICIENCY;
    let combinations = [];

    // Generar todas las combinaciones posibles de 1, 2 y 3 máquinas
    for (let i = 0; i < MACHINE_CAPACITIES.length; i++) {
        // 1 máquina
        let sum1 = MACHINE_CAPACITIES[i];
        if (sum1 >= requiredCapacity) {
            combinations.push({
                machines: [MACHINE_CAPACITIES[i]],
                total: sum1,
                excess: sum1 - requiredCapacity
            });
        }
        // 2 máquinas
        for (let j = i; j < MACHINE_CAPACITIES.length; j++) {
            let sum2 = MACHINE_CAPACITIES[i] + MACHINE_CAPACITIES[j];
            if (sum2 >= requiredCapacity) {
                combinations.push({
                    machines: [MACHINE_CAPACITIES[i], MACHINE_CAPACITIES[j]],
                    total: sum2,
                    excess: sum2 - requiredCapacity
                });
            }
            // 3 máquinas
            for (let k = j; k < MACHINE_CAPACITIES.length; k++) {
                let sum3 = MACHINE_CAPACITIES[i] + MACHINE_CAPACITIES[j] + MACHINE_CAPACITIES[k];
                if (sum3 >= requiredCapacity) {
                    combinations.push({
                        machines: [MACHINE_CAPACITIES[i], MACHINE_CAPACITIES[j], MACHINE_CAPACITIES[k]],
                        total: sum3,
                        excess: sum3 - requiredCapacity
                    });
                }
            }
        }
    }

    // Ordenar por menor exceso y menor cantidad de máquinas
    combinations.sort((a, b) => {
        if (a.excess !== b.excess) return a.excess - b.excess;
        return a.machines.length - b.machines.length;
    });

    // Tomar las 3 mejores opciones
    const bestOptions = combinations.slice(0, 3);

    // Formatear la recomendación
    let equipmentRecommendation = bestOptions.map((option, idx) => {
        // Contar máquinas iguales
        const machineCounts = option.machines.reduce((acc, capacity) => {
            acc[capacity] = (acc[capacity] || 0) + 1;
            return acc;
        }, {});
        const machinesStr = Object.entries(machineCounts)
            .map(([capacity, count]) => `${count} Lavadora${count > 1 ? 's' : ''} de ${capacity} ${unit}`)
            .join(' + ');
        return `Opción ${idx + 1}: ${machinesStr} (Capacidad instalada: ${option.total} ${unit}, Exceso: ${(option.excess).toFixed(2)} ${unit})`;
    }).join('\n');

    // Mostrar resultados
    document.getElementById('dailyCapacity').textContent = `${dailyWeight.toFixed(2)} ${unit}/día`;
    document.getElementById('hourlyCapacity').textContent = `${hourlyCapacity.toFixed(2)} ${unit}/hora`;
    document.getElementById('cycleCapacity').textContent = `${cycleCapacity.toFixed(2)} ${unit}/ciclo`;
    document.getElementById('cyclesPerDay').textContent = `${cyclesPerDay.toFixed(1)} ciclos`;
    document.getElementById('equipmentRecommendation').textContent = equipmentRecommendation;

    // Mostrar la sección de resultados
    document.getElementById('results').style.display = 'block';
}); 