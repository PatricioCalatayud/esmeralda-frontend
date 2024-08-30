import { getProducts } from "@/helpers/ProductsServices.helper";
import ProductList from "@/components/ProductList/ProductList";

export default async  function PromotionsPage() {

  const products = await getProducts();

    const productsWithDiscount = products?.filter(product => 
      product.subproducts.some(subproduct => {
        const discount = Number(subproduct.discount); // Asegúrate de convertirlo a número
        return !isNaN(discount) && discount > 0; // Verifica que es un número y que es mayor a 0
      })
    );
    
  
  
  return (
      <ProductList
        selectedCategory={"promociones"}
        category={null}
        productsList={productsWithDiscount}
      />

  );
}
