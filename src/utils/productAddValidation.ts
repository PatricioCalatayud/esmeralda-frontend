import { IProductResponse, IProductErrorResponse}from "@/interfaces/IProductList";

export function productAddValidation(product: IProductResponse): IProductErrorResponse {
  const errors: IProductErrorResponse = {
    description: "",
    imgUrl: "",
    price: "",
    stock: 0,
    discount: "",
    presentacion: "",
    tipoGrano: "",
    medida: "",
    categoryId  : "",
  };

  if (!product.description) {
    errors.description = "La descripción es obligatoria";
  }

  if (!product.imgUrl) {
    errors.imgUrl = "La imagen es obligatoria";
  }

  if (!product.price) {
    errors.price = "El precio es obligatorio";
  }

  if (product.stock === 0) {
    errors.stock = 0;
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

    if (!product.medida) {
        errors.medida = "La medida es obligatoria";
    }

  if (!product.categoryId) {
    errors.categoryId = "La categoría es obligatoria";
  }

  return errors;
}