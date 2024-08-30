// validation.js

interface validationResults {

      amount: string;
      unit: string;
      stock: string;
      price: string;
      discount: string;
  
}

// Definir las reglas de validación para cada campo
function validateSubproduct(subproduct: validationResults) {
  const errors = { amount: '', unit: '', stock: '', price: '', discount: ''};

  // Validar que amount sea un número mayor que 0
  if (!subproduct.amount  || Number(subproduct.amount) <= 0) {
    errors.amount = "El campo 'amount' debe ser un número mayor que 0.";
  }

  // Validar que discount sea un número entre 0 y 100
  if (!subproduct.discount  || Number(subproduct.discount) < 0 || Number(subproduct.discount) > 100) {
    errors.discount = "El campo 'discount' debe ser un número entre 0 y 100.";
  }

  // Validar que price sea un número mayor que 0
  if (!subproduct.price  || Number(subproduct.price) <= 0) {
    errors.price = "El campo 'price' debe ser un número mayor que 0.";
  }

  // Validar que stock sea un número mayor o igual que 0
  if (!subproduct.stock  || Number(subproduct.stock) < 0) {
    errors.stock = "El campo 'stock' debe ser un número mayor o igual que 0.";
  }

  // Validar que unit no esté vacío y sea una cadena válida
  if (!subproduct.unit || typeof subproduct.unit !== 'string' || subproduct.unit.trim() === "") {
    errors.unit = "El campo 'unit' no debe estar vacío.";
  }

  return errors;
}

// Exportar la función de validación
export { validateSubproduct };
