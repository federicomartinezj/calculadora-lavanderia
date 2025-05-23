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
    if (cycleCapacity <= 10) {
        equipmentRecommendation = '1 Lavadora de 10 kg';
    } else if (cycleCapacity <= 20) {
        equipmentRecommendation = '1 Lavadora de 20 kg';
    } else if (cycleCapacity <= 30) {
        equipmentRecommendation = '1 Lavadora de 30 kg';
    } else {
        const machines = Math.ceil(cycleCapacity / 30);
        equipmentRecommendation = `${machines} Lavadoras de 30 kg`;
    }

    // Mostrar resultados
    document.getElementById('dailyCapacity').textContent = `${dailyWeight.toFixed(2)} kg/día`;
    document.getElementById('hourlyCapacity').textContent = `${hourlyCapacity.toFixed(2)} kg/hora`;
    document.getElementById('cycleCapacity').textContent = `${cycleCapacity.toFixed(2)} kg/ciclo`;
    document.getElementById('cyclesPerDay').textContent = `${cyclesPerDay.toFixed(1)} ciclos`;
    document.getElementById('equipmentRecommendation').textContent = equipmentRecommendation;

    // Mostrar la sección de resultados
    document.getElementById('results').style.display = 'block';
}); 