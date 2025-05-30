import ProductList from "@/components/ProductList/ProductList";
import {
  getCategories,
  getProductsByCategory,
} from "@/helpers/CategoriesServices.helper";

export async function generateStaticParams() {
  const categories = await getCategories();
  if (!categories) return [];
  return categories?.map((category: any) => ({
    categories: category.id,
  }));
}

export default async function ProductsPage({
  params,
}: {
  params: { products: string };
}) {
  const selectedCategory = params.products;
  const categories = await getCategories();
  const category =
    categories?.find((cat) => Number(cat.id) === Number(selectedCategory)) || null;

  const productsList = await getProductsByCategory(category?.name || "");


  return (
    <ProductList
      selectedCategory={selectedCategory}
      category={category}
      productsList={productsList}
    />
  );
}
