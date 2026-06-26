export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function clampPercent(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(Math.round(numericValue), 100));
}

export function todayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isoToBrazilDate(value) {
  if (!value) {
    return '';
  }

  const dateOnly = String(value).slice(0, 10);
  const [year, month, day] = dateOnly.split('-');

  return day && month && year ? `${day}/${month}/${year}` : String(value);
}

export function brazilDateToIso(value) {
  if (!value) {
    return todayInputValue();
  }

  if (value.includes('-')) {
    return value.slice(0, 10);
  }

  const [day, month, year] = value.split('/');

  return day && month && year ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : value;
}

export function formatTransactionDate(value, options = {}) {
  const isoValue = brazilDateToIso(value);
  const [year, month, day] = isoValue.split('-').map(Number);

  if (!year || !month || !day) {
    return String(value || '');
  }

  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', options);
}
