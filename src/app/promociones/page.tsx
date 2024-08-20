import { getProducts } from "@/helpers/ProductsServices.helper";
import ProductList from "@/components/ProductList/ProductList";
import { useProductContext } from "@/context/product.context";



export default async  function PromotionsPage() {

  const products = await getProducts();

  if (products) {
    const productsWithDiscount = products.filter(product => parseFloat(product.discount) > 0);
  
  
  return (
      <ProductList
        selectedCategory={"promociones"}
        category={null}
        productsList={productsWithDiscount}
      />

  );
}
}