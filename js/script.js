/* ═══════════════════════════════════════════════
   MEGANE_LEARN — script.js
   Fusion de structure.js + convert.js
   Convertisseur d'unités avec historique, hors ligne, PWA
   + Copie, Comparaison multi-unités
   + Noms complets des unités dans les headers
   (Sans animations pour stabilité)
═══════════════════════════════════════════════ */

// ═══════════════════════════════════════════════
// 1. DONNÉES DES CONVERSIONS (20 catégories)
// ═══════════════════════════════════════════════
const unitFullNames = {
  // Tension
  'V': 'Volt', 'kV': 'Kilovolt', 'mV': 'Millivolt', 'µV': 'Microvolt', 'nV': 'Nanovolt', 'pV': 'Picovolt',
  // Courant
  'A': 'Ampère', 'kA': 'Kiloampère', 'mA': 'Milliampère', 'µA': 'Microampère', 'nA': 'Nanoampère', 'pA': 'Picoampère',
  // Résistance
  'Ω': 'Ohm', 'kΩ': 'Kiloohm', 'MΩ': 'Mégaohm', 'GΩ': 'Gigaohm', 'mΩ': 'Milliohm',
  // Inductance
  'H': 'Henry', 'kH': 'Kilohenry', 'mH': 'Millihenry', 'µH': 'Microhenry', 'nH': 'Nanohenry',
  // Capacité
  'F': 'Farad', 'kF': 'Kilofarad', 'mF': 'Millifarad', 'µF': 'Microfarad', 'nF': 'Nanofarad', 'pF': 'Picofarad',
  // Fréquence
  'Hz': 'Hertz', 'kHz': 'Kilohertz', 'MHz': 'Mégahertz', 'GHz': 'Gigahertz', 'THz': 'Térahertz',
  // Température
  '°C': 'Degré Celsius', '°F': 'Degré Fahrenheit', 'K': 'Kelvin',
  // Longueur
  'km': 'Kilomètre', 'hm': 'Hectomètre', 'dam': 'Décamètre', 'm': 'Mètre', 'dm': 'Décimètre', 'cm': 'Centimètre', 'mm': 'Millimètre', 'µm': 'Micromètre', 'nm': 'Nanomètre', 'pm': 'Picomètre',
  // Masse
  't': 'Tonne', 'q': 'Quintal', 'kg': 'Kilogramme', 'hg': 'Hectogramme', 'dag': 'Décagramme', 'g': 'Gramme', 'dg': 'Décigramme', 'cg': 'Centigramme', 'mg': 'Milligramme', 'µg': 'Microgramme', 'ng': 'Nanogramme',
  // Temps
  'h': 'Heure', 'min': 'Minute', 's': 'Seconde', 'ms': 'Milliseconde', 'µs': 'Microseconde', 'ns': 'Nanoseconde', 'ps': 'Picoseconde',
  // Données
  'B': 'Octet', 'KB': 'Kilooctet', 'MB': 'Mégaoctet', 'GB': 'Gigaoctet', 'TB': 'Téraoctet', 'PB': 'Pétaoctet',
  // Vitesse
  'm/s': 'Mètre par seconde', 'km/h': 'Kilomètre par heure', 'mph': 'Mile par heure', 'nœuds': 'Nœud',
  // Énergie
  'J': 'Joule', 'kJ': 'Kilojoule', 'MJ': 'Mégajoule', 'GJ': 'Gigajoule', 'Wh': 'Watt-heure', 'kWh': 'Kilowatt-heure', 'MWh': 'Mégawatt-heure', 'cal': 'Calorie', 'kcal': 'Kilocalorie',
  // Puissance
  'W': 'Watt', 'kW': 'Kilowatt', 'MW': 'Mégawatt', 'GW': 'Gigawatt', 'CV': 'Cheval-vapeur', 'ch': 'Cheval', 'hp': 'Horsepower',
  // Pression
  'Pa': 'Pascal', 'hPa': 'Hectopascal', 'kPa': 'Kilopascal', 'MPa': 'Mégapascal', 'bar': 'Bar', 'mbar': 'Millibar', 'psi': 'Psi', 'atm': 'Atmosphère', 'mmHg': 'Millimètre de mercure',
  // Surface
  'km²': 'Kilomètre carré', 'hm²': 'Hectomètre carré', 'dam²': 'Décamètre carré', 'm²': 'Mètre carré', 'dm²': 'Décimètre carré', 'cm²': 'Centimètre carré', 'mm²': 'Millimètre carré', 'ha': 'Hectare', 'a': 'Are',
  // Volume
  'm³': 'Mètre cube', 'dm³': 'Décimètre cube', 'cm³': 'Centimètre cube', 'mm³': 'Millimètre cube', 'L': 'Litre', 'dL': 'Décilitre', 'cL': 'Centilitre', 'mL': 'Millilitre', 'gal': 'Gallon', 'qt': 'Quart', 'pt': 'Pinte',
  // Angle
  'deg': 'Degré', 'rad': 'Radian', 'grad': 'Gradien', 'tour': 'Tour', 'arcmin': 'Minute d\'arc', 'arcsec': 'Seconde d\'arc',
  // Pourcentage
  '%': 'Pourcent', '‰': 'Pour mille', 'fraction': 'Fraction', 'ratio': 'Ratio',
  // Charge électrique
  'C': 'Coulomb', 'mC': 'Millicoulomb', 'µC': 'Microcoulomb', 'nC': 'Nanocoulomb', 'pC': 'Picocoulomb', 'Ah': 'Ampère-heure', 'mAh': 'Milliampère-heure'
};

function getUnitDisplayName(unit) {
  const fullName = unitFullNames[unit];
  if (!fullName) return unit;
  if (fullName.length > 12) {
    return unit;
  }
  return fullName;
}

const conversions = {
  tension: {
    name: 'Tension',
    icon: 'fa-bolt',
    units: ['V', 'kV', 'mV', 'µV', 'nV', 'pV'],
    factors: { V: 1, kV: 1000, mV: 0.001, µV: 0.000001, nV: 1e-9, pV: 1e-12 },
    toBase: (val, unit) => val * conversions.tension.factors[unit],
    fromBase: (val, unit) => val / conversions.tension.factors[unit]
  },
  courant: {
    name: 'Courant',
    icon: 'fa-waveform',
    units: ['A', 'kA', 'mA', 'µA', 'nA', 'pA'],
    factors: { A: 1, kA: 1000, mA: 0.001, µA: 0.000001, nA: 1e-9, pA: 1e-12 },
    toBase: (val, unit) => val * conversions.courant.factors[unit],
    fromBase: (val, unit) => val / conversions.courant.factors[unit]
  },
  resistance: {
    name: 'Résistance',
    icon: 'fa-resistor',
    units: ['Ω', 'kΩ', 'MΩ', 'GΩ', 'mΩ'],
    factors: { Ω: 1, kΩ: 1000, MΩ: 1e6, GΩ: 1e9, mΩ: 0.001 },
    toBase: (val, unit) => val * conversions.resistance.factors[unit],
    fromBase: (val, unit) => val / conversions.resistance.factors[unit]
  },
  inductance: {
    name: 'Inductance',
    icon: 'fa-coil',
    units: ['H', 'kH', 'mH', 'µH', 'nH'],
    factors: { H: 1, kH: 1000, mH: 0.001, µH: 0.000001, nH: 1e-9 },
    toBase: (val, unit) => val * conversions.inductance.factors[unit],
    fromBase: (val, unit) => val / conversions.inductance.factors[unit]
  },
  capacite: {
    name: 'Capacité',
    icon: 'fa-capacitor',
    units: ['F', 'kF', 'mF', 'µF', 'nF', 'pF'],
    factors: { F: 1, kF: 1000, mF: 0.001, µF: 0.000001, nF: 1e-9, pF: 1e-12 },
    toBase: (val, unit) => val * conversions.capacite.factors[unit],
    fromBase: (val, unit) => val / conversions.capacite.factors[unit]
  },
  frequence: {
    name: 'Fréquence',
    icon: 'fa-chart-line',
    units: ['Hz', 'kHz', 'MHz', 'GHz', 'THz'],
    factors: { Hz: 1, kHz: 1000, MHz: 1e6, GHz: 1e9, THz: 1e12 },
    toBase: (val, unit) => val * conversions.frequence.factors[unit],
    fromBase: (val, unit) => val / conversions.frequence.factors[unit]
  },
  temperature: {
    name: 'Température',
    icon: 'fa-temperature-high',
    units: ['°C', '°F', 'K'],
    toBase: (val, unit) => {
      if (unit === '°C') return val;
      if (unit === '°F') return (val - 32) * 5/9;
      if (unit === 'K') return val - 273.15;
      return val;
    },
    fromBase: (val, unit) => {
      if (unit === '°C') return val;
      if (unit === '°F') return val * 9/5 + 32;
      if (unit === 'K') return val + 273.15;
      return val;
    }
  },
  longueur: {
    name: 'Longueur',
    icon: 'fa-ruler',
    units: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm', 'µm', 'nm', 'pm'],
    factors: { km: 1000, hm: 100, dam: 10, m: 1, dm: 0.1, cm: 0.01, mm: 0.001, µm: 1e-6, nm: 1e-9, pm: 1e-12 },
    toBase: (val, unit) => val * conversions.longueur.factors[unit],
    fromBase: (val, unit) => val / conversions.longueur.factors[unit]
  },
  masse: {
    name: 'Masse',
    icon: 'fa-weight-hanging',
    units: ['t', 'q', 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg', 'µg', 'ng'],
    factors: { t: 1000, q: 100, kg: 1, hg: 0.1, dag: 0.01, g: 0.001, dg: 0.0001, cg: 0.00001, mg: 0.000001, µg: 1e-9, ng: 1e-12 },
    toBase: (val, unit) => val * conversions.masse.factors[unit],
    fromBase: (val, unit) => val / conversions.masse.factors[unit]
  },
  temps: {
    name: 'Temps',
    icon: 'fa-hourglass-half',
    units: ['h', 'min', 's', 'ms', 'µs', 'ns', 'ps'],
    factors: { h: 3600, min: 60, s: 1, ms: 0.001, µs: 1e-6, ns: 1e-9, ps: 1e-12 },
    toBase: (val, unit) => val * conversions.temps.factors[unit],
    fromBase: (val, unit) => val / conversions.temps.factors[unit]
  },
  donnees: {
    name: 'Données',
    icon: 'fa-database',
    units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
    factors: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 },
    toBase: (val, unit) => val * conversions.donnees.factors[unit],
    fromBase: (val, unit) => val / conversions.donnees.factors[unit]
  },
  vitesse: {
    name: 'Vitesse',
    icon: 'fa-tachometer-alt',
    units: ['m/s', 'km/h', 'mph', 'nœuds'],
    factors: { 'm/s': 1, 'km/h': 0.2777778, 'mph': 0.44704, 'nœuds': 0.514444 },
    toBase: (val, unit) => val * conversions.vitesse.factors[unit],
    fromBase: (val, unit) => val / conversions.vitesse.factors[unit]
  },
  energie: {
    name: 'Énergie',
    icon: 'fa-charging-station',
    units: ['J', 'kJ', 'MJ', 'GJ', 'Wh', 'kWh', 'MWh', 'cal', 'kcal'],
    factors: { J: 1, kJ: 1000, MJ: 1e6, GJ: 1e9, Wh: 3600, kWh: 3.6e6, MWh: 3.6e9, cal: 4.184, kcal: 4184 },
    toBase: (val, unit) => val * conversions.energie.factors[unit],
    fromBase: (val, unit) => val / conversions.energie.factors[unit]
  },
  puissance: {
    name: 'Puissance',
    icon: 'fa-chart-pie',
    units: ['W', 'kW', 'MW', 'GW', 'CV', 'ch', 'hp'],
    factors: { W: 1, kW: 1000, MW: 1e6, GW: 1e9, CV: 735.5, ch: 735.5, hp: 745.7 },
    toBase: (val, unit) => val * conversions.puissance.factors[unit],
    fromBase: (val, unit) => val / conversions.puissance.factors[unit]
  },
  pression: {
    name: 'Pression',
    icon: 'fa-thermometer-half',
    units: ['Pa', 'hPa', 'kPa', 'MPa', 'bar', 'mbar', 'psi', 'atm', 'mmHg'],
    factors: { Pa: 1, hPa: 100, kPa: 1000, MPa: 1e6, bar: 1e5, mbar: 100, psi: 6894.76, atm: 101325, mmHg: 133.322 },
    toBase: (val, unit) => val * conversions.pression.factors[unit],
    fromBase: (val, unit) => val / conversions.pression.factors[unit]
  },
  surface: {
    name: 'Surface',
    icon: 'fa-table-cells-large',
    units: ['km²', 'hm²', 'dam²', 'm²', 'dm²', 'cm²', 'mm²', 'ha', 'a'],
    factors: { 'km²': 1e6, 'hm²': 10000, 'dam²': 100, 'm²': 1, 'dm²': 0.01, 'cm²': 0.0001, 'mm²': 1e-6, 'ha': 10000, 'a': 100 },
    toBase: (val, unit) => val * conversions.surface.factors[unit],
    fromBase: (val, unit) => val / conversions.surface.factors[unit]
  },
  volume: {
    name: 'Volume',
    icon: 'fa-cube',
    units: ['m³', 'dm³', 'cm³', 'mm³', 'L', 'dL', 'cL', 'mL', 'gal', 'qt', 'pt'],
    factors: { 'm³': 1, 'dm³': 0.001, 'cm³': 1e-6, 'mm³': 1e-9, L: 0.001, dL: 0.0001, cL: 0.00001, mL: 0.000001, gal: 0.00378541, qt: 0.000946353, pt: 0.000473176 },
    toBase: (val, unit) => val * conversions.volume.factors[unit],
    fromBase: (val, unit) => val / conversions.volume.factors[unit]
  },
  angle: {
    name: 'Angle',
    icon: 'fa-angle-double-right',
    units: ['deg', 'rad', 'grad', 'tour', 'arcmin', 'arcsec'],
    factors: { deg: 1, rad: 57.2958, grad: 0.9, tour: 360, arcmin: 0.0166667, arcsec: 0.000277778 },
    toBase: (val, unit) => val * conversions.angle.factors[unit],
    fromBase: (val, unit) => val / conversions.angle.factors[unit]
  },
  pourcentage: {
    name: 'Pourcentage',
    icon: 'fa-percent',
    units: ['%', '‰', 'fraction', 'ratio'],
    factors: { '%': 1, '‰': 0.1, fraction: 100, ratio: 100 },
    toBase: (val, unit) => val * conversions.pourcentage.factors[unit],
    fromBase: (val, unit) => val / conversions.pourcentage.factors[unit]
  },
  charge: {
    name: 'Charge électrique',
    icon: 'fa-battery-full',
    units: ['C', 'mC', 'µC', 'nC', 'pC', 'Ah', 'mAh'],
    factors: { C: 1, mC: 0.001, µC: 1e-6, nC: 1e-9, pC: 1e-12, Ah: 3600, mAh: 3.6 },
    toBase: (val, unit) => val * conversions.charge.factors[unit],
    fromBase: (val, unit) => val / conversions.charge.factors[unit]
  }
};

const conversionKeys = Object.keys(conversions);
let currentConversion = 'tension';
let inputUnit = 'V';
let outputUnit = 'V';

// État de la comparaison
let comparisonMode = false;
let selectedCompareUnits = [];

// ═══════════════════════════════════════════════
// 2. RÉFÉRENCES DOM
// ═══════════════════════════════════════════════
const inputUnitsContainer = document.getElementById('inputUnits');
const outputUnitsContainer = document.getElementById('outputUnits');
const inputValue = document.getElementById('inputValue');
const resultValue = document.getElementById('resultValue');
const conversionNav = document.getElementById('conversionNav');
const inputHeader = document.getElementById('inputHeader');
const outputHeader = document.getElementById('outputHeader');
const inputSelectedUnit = document.getElementById('inputSelectedUnit');

// Sidebar elements
const logoBtn = document.getElementById('logoBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement;

// Vue historique
const converterView = document.getElementById('converterView');
const historyView = document.getElementById('historyView');
const historyList = document.getElementById('historyList');
const historyBackBtn = document.getElementById('historyBackBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Comparaison éléments
const compareBtn = document.getElementById('compareBtn');
const copyResultBtn = document.getElementById('copyResultBtn');
const compareModal = document.getElementById('compareModal');
const unitsSelectionGrid = document.getElementById('unitsSelectionGrid');
const selectedCountSpan = document.getElementById('selectedCount');
const validateCompareBtn = document.getElementById('validateCompareBtn');
const cancelCompareBtn = document.getElementById('cancelCompareBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const normalResultDisplay = document.getElementById('normalResultDisplay');
const comparisonContainer = document.getElementById('comparisonContainer');
const comparisonScroll = document.getElementById('comparisonScroll');

// ═══════════════════════════════════════════════
// 3. GESTION DE L'HISTORIQUE
// ═══════════════════════════════════════════════
const HISTORY_KEY = 'megane_conversion_history';
const MAX_HISTORY = 50;

function getHistory() {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

function saveToHistory(inputVal, inputUnitVal, outputVal, outputUnitVal, category) {
  if (inputVal === undefined || outputVal === undefined) return;
  
  const history = getHistory();
  const newEntry = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    category: conversions[category].name,
    categoryKey: category,
    inputValue: inputVal,
    inputUnit: inputUnitVal,
    outputValue: outputVal,
    outputUnit: outputUnitVal
  };
  
  history.unshift(newEntry);
  if (history.length > MAX_HISTORY) history.pop();
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function deleteHistoryEntry(id) {
  let history = getHistory();
  history = history.filter(entry => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistoryList();
}

function clearAllHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  renderHistoryList();
}

function renderHistoryList() {
  if (!historyList) return;
  
  const history = getHistory();
  
  if (history.length === 0) {
    historyList.innerHTML = `
      <div class="empty-history">
        <i class="fas fa-history"></i>
        <p>Aucune conversion enregistrée</p>
        <small>Effectuez une conversion pour la voir apparaître ici</small>
      </div>
    `;
    return;
  }
  
  historyList.innerHTML = history.map(entry => `
    <div class="history-item" data-id="${entry.id}">
      <div class="history-item-header">
        <span class="history-category"><i class="fas ${conversions[entry.categoryKey]?.icon || 'fa-calculator'}"></i> ${entry.category}</span>
        <span class="history-date"><i class="far fa-clock"></i> ${entry.date}</span>
      </div>
      <div class="history-conversion">
        ${entry.inputValue} ${entry.inputUnit} → ${entry.outputValue} ${entry.outputUnit}
      </div>
      <div class="history-actions">
        <button class="delete-history-btn" data-id="${entry.id}">
          <i class="fas fa-trash-alt"></i> Supprimer
        </button>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.delete-history-btn')) return;
      const id = parseInt(item.dataset.id);
      const entry = getHistory().find(h => h.id === id);
      if (entry) {
        currentConversion = entry.categoryKey;
        inputUnit = entry.inputUnit;
        outputUnit = entry.outputUnit;
        inputValue.value = entry.inputValue;
        
        if (comparisonMode) {
          exitComparisonMode();
        }
        
        renderNav();
        renderUnits();
        convert();
        showConverterView();
      }
    });
  });
  
  document.querySelectorAll('.delete-history-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      deleteHistoryEntry(id);
    });
  });
}

function showHistoryView() {
  if (converterView) converterView.style.display = 'none';
  if (historyView) historyView.style.display = 'block';
  renderHistoryList();
}

function showConverterView() {
  if (converterView) converterView.style.display = 'block';
  if (historyView) historyView.style.display = 'none';
}

// ═══════════════════════════════════════════════
// 4. FONCTIONS DE CONVERSION
// ═══════════════════════════════════════════════
function formatResult(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  if (Number.isInteger(value)) return value.toString();
  
  let str = value.toString();
  if (str.includes('e')) {
    str = value.toFixed(20).replace(/\.?0+$/, '');
  }
  str = str.replace(/\.?0+$/, '');
  if (str === '0' && value !== 0) {
    str = value.toFixed(15).replace(/\.?0+$/, '');
  }
  return str;
}

function adjustResultFontSize() {
  const resultElement = document.querySelector('.result-value');
  if (!resultElement) return;
  const textLength = resultElement.textContent.length;
  if (textLength < 6) resultElement.style.fontSize = '2.5rem';
  else if (textLength < 10) resultElement.style.fontSize = '1.8rem';
  else if (textLength < 15) resultElement.style.fontSize = '1.4rem';
  else if (textLength < 20) resultElement.style.fontSize = '1.1rem';
  else resultElement.style.fontSize = '0.9rem';
}

function updateCardHeaders() {
  const inputDisplayName = getUnitDisplayName(inputUnit);
  const outputDisplayName = getUnitDisplayName(outputUnit);
  
  if (inputHeader) {
    inputHeader.innerHTML = `<i class="fas fa-arrow-left-from-bracket"></i> Valeur <span class="selected-unit">${inputDisplayName} (${inputUnit})</span>`;
  }
  if (outputHeader) {
    const headerContent = `<i class="fas fa-arrow-right-to-bracket"></i> Résultat <div class="header-actions"><button class="header-action-btn" id="copyResultBtn" title="Copier la conversion"><i class="fas fa-copy"></i></button><button class="header-action-btn" id="compareBtn" title="Comparer avec d'autres unités"><i class="fas fa-chart-simple"></i></button></div>`;
    outputHeader.innerHTML = headerContent;
    const newCopyBtn = document.getElementById('copyResultBtn');
    const newCompareBtn = document.getElementById('compareBtn');
    if (newCopyBtn) newCopyBtn.addEventListener('click', copyConversion);
    if (newCompareBtn) newCompareBtn.addEventListener('click', openCompareModal);
  }
  if (inputSelectedUnit) {
    inputSelectedUnit.textContent = `${getUnitDisplayName(inputUnit)} (${inputUnit})`;
  }
}

let lastSavedInput = null;
let lastSavedOutput = null;

function getCurrentConvertedValue() {
  const conv = conversions[currentConversion];
  const val = parseFloat(inputValue.value) || 0;
  let baseVal = conv.toBase(val, inputUnit);
  let result = conv.fromBase(baseVal, outputUnit);
  return result;
}

function convert() {
  const conv = conversions[currentConversion];
  const val = parseFloat(inputValue.value) || 0;
  
  let baseVal = conv.toBase(val, inputUnit);
  let result = conv.fromBase(baseVal, outputUnit);
  
  resultValue.textContent = formatResult(result);
  adjustResultFontSize();
  
  const currentInput = val;
  const currentOutput = parseFloat(result);
  
  if (lastSavedInput !== currentInput || lastSavedOutput !== currentOutput) {
    if (currentInput !== 0 || (lastSavedInput !== 0 && currentInput === 0)) {
      saveToHistory(currentInput, inputUnit, currentOutput, outputUnit, currentConversion);
      lastSavedInput = currentInput;
      lastSavedOutput = currentOutput;
    }
  }
  
  if (comparisonMode && selectedCompareUnits.length > 0) {
    renderComparison();
  }
}

// ═══════════════════════════════════════════════
// 5. COPIE DE CONVERSION
// ═══════════════════════════════════════════════
function copyConversion() {
  const inputVal = parseFloat(inputValue.value) || 0;
  const outputVal = getCurrentConvertedValue();
  const textToCopy = `${inputUnit} (${inputVal}) → ${outputUnit} (${formatResult(outputVal)})`;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    const copyBtn = document.getElementById('copyResultBtn');
    if (copyBtn) {
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
      }, 1500);
    }
    showToast('Conversion copiée !', 'success');
  }).catch(() => {
    showToast('Impossible de copier', 'error');
  });
}

// ═══════════════════════════════════════════════
// 6. MODE COMPARAISON
// ═══════════════════════════════════════════════
function openCompareModal() {
  const units = conversions[currentConversion].units;
  if (!unitsSelectionGrid) return;
  
  unitsSelectionGrid.innerHTML = units.map(unit => `
    <button class="unit-select-btn ${selectedCompareUnits.includes(unit) ? 'selected' : ''}" data-unit="${unit}">
      ${unit}<br><small>${getUnitDisplayName(unit)}</small>
    </button>
  `).join('');
  
  updateSelectedCount();
  
  document.querySelectorAll('.unit-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = btn.dataset.unit;
      if (selectedCompareUnits.includes(unit)) {
        selectedCompareUnits = selectedCompareUnits.filter(u => u !== unit);
      } else {
        if (selectedCompareUnits.length >= 3) {
          selectedCompareUnits.shift();
        }
        selectedCompareUnits.push(unit);
      }
      openCompareModal();
    });
  });
  
  compareModal.style.display = 'flex';
}

function closeCompareModal() {
  compareModal.style.display = 'none';
}

function updateSelectedCount() {
  if (selectedCountSpan) {
    selectedCountSpan.textContent = selectedCompareUnits.length;
  }
}

function validateComparison() {
  if (selectedCompareUnits.length === 0) {
    showToast('Sélectionnez au moins une unité', 'error');
    return;
  }
  
  comparisonMode = true;
  closeCompareModal();
  renderComparison();
}

function renderComparison() {
  if (!comparisonMode || selectedCompareUnits.length === 0) return;
  
  const conv = conversions[currentConversion];
  const inputVal = parseFloat(inputValue.value) || 0;
  const baseVal = conv.toBase(inputVal, inputUnit);
  
  const comparisons = selectedCompareUnits.map(unit => {
    let result;
    if (currentConversion === 'temperature') {
      result = conv.fromBase(baseVal, unit);
    } else {
      result = conv.fromBase(baseVal, unit);
    }
    return { unit, value: result };
  });
  
  comparisons.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  
  const maxValue = Math.max(...comparisons.map(c => Math.abs(c.value)), 1);
  
  comparisonScroll.innerHTML = comparisons.map(comp => {
    const percentage = (Math.abs(comp.value) / maxValue) * 100;
    const displayValue = formatResult(comp.value);
    return `
      <div class="comparison-card">
        <div class="comparison-unit">${comp.unit}<br><small>${getUnitDisplayName(comp.unit)}</small></div>
        <div class="comparison-value">${displayValue}</div>
        <div class="comparison-bar-container">
          <div class="comparison-bar" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join('');
  
  normalResultDisplay.style.display = 'none';
  comparisonContainer.style.display = 'block';
  
  if (!document.getElementById('exitCompareBtn')) {
    const exitBtn = document.createElement('button');
    exitBtn.id = 'exitCompareBtn';
    exitBtn.className = 'header-action-btn';
    exitBtn.innerHTML = '<i class="fas fa-times"></i>';
    exitBtn.title = 'Fermer la comparaison';
    exitBtn.style.marginLeft = '8px';
    exitBtn.addEventListener('click', exitComparisonMode);
    const headerActions = document.querySelector('.output-card .header-actions');
    if (headerActions) headerActions.appendChild(exitBtn);
  }
}

function exitComparisonMode() {
  comparisonMode = false;
  selectedCompareUnits = [];
  normalResultDisplay.style.display = 'flex';
  comparisonContainer.style.display = 'none';
  
  const exitBtn = document.getElementById('exitCompareBtn');
  if (exitBtn) exitBtn.remove();
  
  convert();
}

// ═══════════════════════════════════════════════
// 7. AFFICHAGE DES UNITÉS ET NAVIGATION
// ═══════════════════════════════════════════════
function renderUnits() {
  const conv = conversions[currentConversion];
  const units = conv.units;
  
  inputUnitsContainer.innerHTML = units.map(unit => `
    <button class="unit-btn ${unit === inputUnit ? 'active' : ''}" data-unit="${unit}" data-type="input">
      ${unit}
    </button>
  `).join('');
  
  outputUnitsContainer.innerHTML = units.map(unit => `
    <button class="unit-btn ${unit === outputUnit ? 'active' : ''}" data-unit="${unit}" data-type="output">
      ${unit}
    </button>
  `).join('');
  
  document.querySelectorAll('.unit-btn[data-type="input"]').forEach(btn => {
    btn.addEventListener('click', () => {
      inputUnit = btn.getAttribute('data-unit');
      if (comparisonMode) exitComparisonMode();
      renderUnits();
      updateCardHeaders();
      convert();
    });
  });
  
  document.querySelectorAll('.unit-btn[data-type="output"]').forEach(btn => {
    btn.addEventListener('click', () => {
      outputUnit = btn.getAttribute('data-unit');
      if (comparisonMode) exitComparisonMode();
      renderUnits();
      updateCardHeaders();
      convert();
    });
  });
  
  updateCardHeaders();
}

function renderNav() {
  conversionNav.innerHTML = conversionKeys.map(key => `
    <button class="conversion-nav-btn ${key === currentConversion ? 'active' : ''}" data-conversion="${key}">
      <i class="fas ${conversions[key].icon}"></i>
      <span>${conversions[key].name}</span>
    </button>
  `).join('');
  
  document.querySelectorAll('.conversion-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentConversion = btn.getAttribute('data-conversion');
      inputUnit = conversions[currentConversion].units[0];
      outputUnit = conversions[currentConversion].units[0];
      if (comparisonMode) exitComparisonMode();
      renderNav();
      renderUnits();
      convert();
    });
  });
}

// ═══════════════════════════════════════════════
// 8. SIDEBAR ET DARK MODE
// ═══════════════════════════════════════════════
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function applyTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('ml_theme', dark ? 'dark' : 'light');
  if (darkToggle) darkToggle.checked = dark;
}

// ═══════════════════════════════════════════════
// 9. FAVORIS
// ═══════════════════════════════════════════════
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('megane_favorites') || '[]');
  const favoritesSection = document.getElementById('favoritesSection');
  if (!favoritesSection) return;
  
  if (favorites.length === 0) {
    favoritesSection.innerHTML = '';
    return;
  }
  
  favoritesSection.innerHTML = `
    <div class="sidebar-divider"></div>
    <div class="favorites-header">
      <i class="fas fa-star"></i> Mes favoris
    </div>
    <nav class="sidebar-nav">
      ${favorites.map(fav => `
        <a href="${fav.href}" class="sidebar-btn fav-btn" data-name="${fav.name}">
          <i class="fas fa-star"></i> ${fav.name}
        </a>
      `).join('')}
    </nav>
  `;
  
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = btn.getAttribute('href');
      if (href && href !== '#') {
        window.location.href = href;
      }
    });
  });
}

// ═══════════════════════════════════════════════
// 10. UTILITAIRES
// ═══════════════════════════════════════════════
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.style.background = type === 'success' ? 'var(--green)' : 'var(--red)';
  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function showInfoModal(title, content) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(4px);
  `;
  
  modal.innerHTML = `
    <div style="
      background: var(--surface);
      border-radius: 24px;
      max-width: 90%;
      width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="color: var(--accent); margin: 0;">${title}</h2>
        <button id="closeInfoModalBtn" style="
          background: var(--surface);
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-muted);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          box-shadow: 3px 3px 8px var(--shadow-dark), -3px -3px 8px var(--shadow-light);
        ">×</button>
      </div>
      <div style="color: var(--text-main); line-height: 1.6;">
        ${content}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const closeBtn = modal.querySelector('#closeInfoModalBtn');
  closeBtn.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

const pageContents = {
  apropos: `<p><strong>MEGANE_LEARN</strong> est un convertisseur d'unités universel.</p>
    <p>Version 2.0 - PWA</p>
    <p>20 catégories de conversion disponibles.</p>
    <p>Fonctionne hors ligne et sauvegarde votre historique.</p>`,
  contact: `<p>📧 Email: contact@megane-learn.fr</p>
    <p>🌐 Site: www.megane-learn.fr</p>`,
  faq: `<p><strong>Q: L'application fonctionne-t-elle sans internet ?</strong></p>
    <p>R: Oui, entièrement hors ligne après la première visite.</p>
    <p><strong>Q: Comment supprimer l'historique ?</strong></p>
    <p>R: Allez dans l'historique et cliquez sur "Tout effacer".</p>`,
  aide: `<p><strong>Comment utiliser le convertisseur ?</strong></p>
    <p>1. Sélectionnez une catégorie en bas de l'écran</p>
    <p>2. Choisissez l'unité d'entrée et de sortie</p>
    <p>3. Saisissez une valeur</p>
    <p>4. Le résultat s'affiche instantanément</p>
    <p>5. Utilisez 📋 pour copier, 📊 pour comparer</p>`,
  confidentialite: `<p><strong>Politique de confidentialité</strong></p>
    <p>Aucune donnée n'est envoyée à des serveurs externes.</p>
    <p>Toutes les données sont stockées localement dans votre navigateur.</p>`
};

// ═══════════════════════════════════════════════
// 11. INITIALISATION
// ═══════════════════════════════════════════════
function init() {
  if (logoBtn) logoBtn.addEventListener('click', () => openSidebar());
  if (overlay) overlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });
  
  const savedTheme = localStorage.getItem('ml_theme');
  if (savedTheme) applyTheme(savedTheme === 'dark');
  else applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (darkToggle) darkToggle.addEventListener('change', () => applyTheme(darkToggle.checked));
  
  const historyBtn = document.getElementById('historyBtnSidebar');
  if (historyBtn) historyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSidebar();
    if (comparisonMode) exitComparisonMode();
    showHistoryView();
  });
  
  const aboutBtn = document.getElementById('aboutBtnSidebar');
  if (aboutBtn) aboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSidebar();
    showInfoModal('À propos', pageContents.apropos);
  });
  
  const contactBtn = document.getElementById('contactBtnSidebar');
  if (contactBtn) contactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSidebar();
    showInfoModal('Contact', pageContents.contact);
  });
  
  const faqBtn = document.getElementById('faqBtnSidebar');
  if (faqBtn) faqBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSidebar();
    showInfoModal('FAQ', pageContents.faq);
  });
  
  const helpBtn = document.getElementById('helpBtnSidebar');
  if (helpBtn) helpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSidebar();
    showInfoModal('Aide', pageContents.aide);
  });
  
  const privacyBtn = document.getElementById('privacyBtnSidebar');
  if (privacyBtn) privacyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSidebar();
    showInfoModal('Confidentialité', pageContents.confidentialite);
  });
  
  if (historyBackBtn) historyBackBtn.addEventListener('click', showConverterView);
  if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Supprimer tout l\'historique ?')) clearAllHistory();
  });
  
  if (copyResultBtn) copyResultBtn.addEventListener('click', copyConversion);
  if (compareBtn) compareBtn.addEventListener('click', openCompareModal);
  
  if (validateCompareBtn) validateCompareBtn.addEventListener('click', validateComparison);
  if (cancelCompareBtn) cancelCompareBtn.addEventListener('click', closeCompareModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeCompareModal);
  if (compareModal) compareModal.addEventListener('click', (e) => {
    if (e.target === compareModal) closeCompareModal();
  });
  
  renderNav();
  renderUnits();
  inputValue.value = 0;
  inputValue.addEventListener('input', convert);
  loadFavorites();
  convert();
  
  setTimeout(() => {
    document.querySelectorAll('.converter-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  }, 100);
  
  window.addEventListener('storage', loadFavorites);
}

init();