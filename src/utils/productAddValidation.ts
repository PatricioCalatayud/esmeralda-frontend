import {
  IProductResponse,
  IProductErrorResponse,
} from "@/interfaces/IProductList";

export function productAddValidation(
  product: IProductResponse
): IProductErrorResponse {
  const errors: IProductErrorResponse = {
    description: "",
    categoryID: "",
    presentacion: "",
    tipoGrano: "",
    file: undefined,
    amount: "",
    unit: "",
    stock: "",
    price: "",
    discount: "",
  };
 

  if (!product.description) {
    errors.description = "La descripción es obligatoria";
  }

  if (!product.file) {
    errors.file = "La imagen es obligatoria";
  }

  if (!product.price) {
    errors.price = "El precio es obligatorio";
  }

  if (!product.stock) {
    errors.stock = "El stock es obligatorio";
  }

  if (!product.discount) {
    errors.discount = "El descuento es obligatorio";
  }

  if (!product.presentacion) {
    errors.presentacion = "La presentación es obligatoria";
  }

  if (!product.tipoGrano) {
    errors.tipoGrano = "El tipo de grano es obligatorio";
  }

  if (!product.amount) {
    errors.amount = "La medida es obligatoria";
  }

  if (!product.unit) {
    errors.unit = "La unidad es obligatoria";
  }
  if (!product.categoryID) {
    errors.categoryID = "La categoría es obligatoria";
  }

  return errors;
}
