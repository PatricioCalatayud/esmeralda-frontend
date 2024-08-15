import {
    IProductUpdate,
    IProductErrorUpdate,
  } from "@/interfaces/IProductList";
  
  export function productUpdateValidation(
    product: IProductUpdate
  ): IProductErrorUpdate {
    const errors: IProductErrorUpdate = {
      //article_id: "",
      description: "",
      //imgUrl: "",
      price: "",
      stock: "",
      discount: "",
      presentacion: "",
      tipoGrano: "",
      medida: "",
      categoryID: "",
      /*category: {
        id: "",
        name: "",
      },*/
        
    };
    /*if (!product.article_id) {
      errors.article_id = "El código de artículo es obligatorio";
    }
  
    if (!product.description) {
      errors.description = "La descripción es obligatoria";
    }
  
    if (!product.imgUrl) {
      errors.imgUrl = "La imagen es obligatoria";
    }*/
  
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
  
    if (!product.medida) {
      errors.medida = "La medida es obligatoria";
    }
  
    /*if (!product.category.id) {
      errors.category.id = "La categoría es obligatoria";
    }*/
    return errors;
  }
  