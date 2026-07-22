document.addEventListener('DOMContentLoaded', () => {
  const rentaSlider = document.getElementById('rentaSlider');
  const rentaValue = document.getElementById('rentaValue');
  
  const setupIntelligential = document.getElementById('setupIntelligential');
  const rentaAnualIntelligential = document.getElementById('rentaAnualIntelligential');
  const tcoIntelligential = document.getElementById('tcoIntelligential');
  
  const setupDynamicore = document.getElementById('setupDynamicore');
  const rentaAnualDynamicore = document.getElementById('rentaAnualDynamicore');
  const extrasDynamicore = document.getElementById('extrasDynamicore');
  const tcoDynamicore = document.getElementById('tcoDynamicore');
  
  const savingsAmount = document.getElementById('savingsAmount');
  const savingsPercent = document.getElementById('savingsPercent');

  function formatCurrency(val) {
    return '$' + val.toLocaleString('es-MX') + ' MXN';
  }

  function updateCalculator() {
    const renta = parseInt(rentaSlider.value, 10);
    rentaValue.textContent = '$' + renta.toLocaleString('es-MX');

    // Formula Intelligential:
    // Setup = 2x Renta
    // Renta Anual = 12 * Renta
    // TCO Intelligential = Setup + Renta Anual
    const setupInt = renta * 2;
    const rentaAnualInt = renta * 12;
    const totalInt = setupInt + rentaAnualInt;

    // Formula Competidor DynamiCore + Extras:
    // Renta base suele ser ~20% mayor por comisiones/módulos
    // Setup base de desarrollos = ~$350,000 MXN fijas promedio
    // Extras (PLD + conectores) = ~$200,000 MXN al año
    const setupDyn = 350000;
    const rentaAnualDyn = Math.round(renta * 1.2) * 12;
    const extrasDyn = 200000;
    const totalDyn = setupDyn + rentaAnualDyn + extrasDyn;

    const ahorro = totalDyn - totalInt;
    const porcentaje = ((ahorro / totalDyn) * 100).toFixed(1);

    // Update UI:
    setupIntelligential.textContent = formatCurrency(setupInt);
    rentaAnualIntelligential.textContent = formatCurrency(rentaAnualInt);
    tcoIntelligential.textContent = formatCurrency(totalInt);

    setupDynamicore.textContent = formatCurrency(setupDyn);
    rentaAnualDynamicore.textContent = formatCurrency(rentaAnualDyn);
    extrasDynamicore.textContent = formatCurrency(extrasDyn);
    tcoDynamicore.textContent = formatCurrency(totalDyn);

    savingsAmount.textContent = formatCurrency(ahorro);
    savingsPercent.textContent = `(${porcentaje}% de Ahorro Real)`;
  }

  if (rentaSlider) {
    rentaSlider.addEventListener('input', updateCalculator);
    updateCalculator(); // Initialize on load
  }
});
