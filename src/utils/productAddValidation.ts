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
    presentation: "",
    tipoGrano: "",
    imgUrl:"",

  };
 

  if (!product.description) {
    errors.description = "La descripción es obligatoria";
  }
  if (!product.imgUrl) {
    errors.imgUrl = "La imagen es obligatoria";
  }
  if (!product.presentation) {
    errors.presentation = "La presentación es obligatoria";
  }

  if (!product.tipoGrano) {
    errors.tipoGrano = "El tipo de grano es obligatorio";
  }
  if (!product.categoryID) {
    errors.categoryID = "La categoría es obligatoria";
  }

  return errors;
}
