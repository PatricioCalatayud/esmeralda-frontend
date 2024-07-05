import ProductList from "@/app/components/ProductList/ProductList";
import { categories, getCategoryById } from "../../../helpers/categories";
import { getProductsByCategory } from "../../../helpers/products";

export async function generateStaticParams() {
  return categories.map((category) => ({
    categories: category.id.toString(),
  }));
}

export default async function ProductsPage({
  params,
}: {
  params: { categories: string };
}) {
  const selectedCategory = parseInt(params.categories);
  const category = getCategoryById(selectedCategory) || null;
  const productsList = getProductsByCategory(selectedCategory);

  return (
    <ProductList
      selectedCategory={selectedCategory}
      category={category}
      productsList={productsList}
    />
  );
}
