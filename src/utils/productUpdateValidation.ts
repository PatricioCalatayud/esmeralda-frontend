import {
    IProductUpdate,
    IProductErrorUpdate,
  } from "@/interfaces/IProductList";
  
  export function productUpdateValidation(
    product: IProductUpdate
  ): IProductErrorUpdate {
    const errors: IProductErrorUpdate = {
      description: "",
      imgUrl : "",
      presentation: "",
      tipoGrano: "",
      categoryID: "",

    };

    if (!product.imgUrl ) {
      errors.imgUrl = "La imagen es obligatoria";
    }
  
    if (!product.description) {
      errors.description = "La descripción es obligatoria";
    }
  

    if (!product.categoryID) {
      errors.categoryID = "La categoría es obligatoria";
    }
  
    if (!product.presentation) {
      errors.presentation = "La presentación es obligatoria";
    }
  
    if (!product.tipoGrano) {
      errors.tipoGrano = "El tipo de grano es obligatorio";
    }
  

    return errors;
  }
  