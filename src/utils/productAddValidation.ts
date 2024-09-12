import {
  IProductResponse,
  IProductErrorResponse,
  IProductErrorUpdate,
  IProductUpdate,
} from "@/interfaces/IProductList";

export function productAddValidation(
  product: IProductUpdate 
): IProductErrorUpdate {
  const errors: IProductErrorUpdate = {
    description: "",
    categoryID: "",
    presentacion: "",
    tipoGrano: "",
    imgUrl:"",

  };
 

  if (!product.description) {
    errors.description = "La descripción es obligatoria";
  }
  if (!product.imgUrl) {
    errors.imgUrl = "La imagen es obligatoria";
  }
  if (!product.presentacion) {
    errors.presentacion = "La presentación es obligatoria";
  }

  if (!product.tipoGrano) {
    errors.tipoGrano = "El tipo de grano es obligatorio";
  }
  if (!product.categoryID) {
    errors.categoryID = "La categoría es obligatoria";
  }

  return errors;
}
