import { products } from "../../helpers/products";
import ProductList from "../components/ProductList/ProductList";

export default async function ProductsPage() {
  return (
    <ProductList
      selectedCategory={null}
      category={null}
      productsList={products}
    />
  );
}
