/**
 * Formatea un número como precio en pesos argentinos
 * @param price - El precio a formatear
 * @returns El precio formateado con el símbolo $ y formato argentino (punto para miles, coma para decimales)
 * @example
 * formatPrice(1234.56) // "$1.234,56"
 * formatPrice(1000) // "$1.000,00"
 */
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return '$0,00';
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice);
};

/**
 * Formatea un número como precio sin el símbolo de moneda
 * @param price - El precio a formatear
 * @returns El precio formateado sin símbolo (punto para miles, coma para decimales)
 * @example
 * formatPriceWithoutSymbol(1234.56) // "1.234,56"
 */
export const formatPriceWithoutSymbol = (price: number | string): string => {
  const formatted = formatPrice(price);
  // Elimina el símbolo $ y cualquier espacio
  return formatted.replace(/[$\s]/g, '').trim();
};

