"use client"
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Category } from '@/interfaces/IProductList';

import { getCategories } from '@/helpers/CategoriesServices.helper';

interface CategoryContextType {
  categories: Category[] | undefined;
  categoriesLoading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[] | undefined>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  type CategoryName = "Coffee" | "Tea" | "Accesory" | "Sweetener" | "Mate";

  useEffect(() => {
    const fetchCategory = async () => {
      const categoryTranslations: Record<CategoryName, string> = {
        "Coffee": "Café",
        "Tea": "Té",
        "Accesory": "Accesorio",
        "Sweetener": "Endulzante",
        "Mate": "Mate",
      };
  
      const categories = await getCategories();
      const translatedCategories = categories?.map(category => ({
        ...category,
        name: categoryTranslations[category.name as CategoryName] || category.name
      }));
      setCategories(translatedCategories);
      setCategoriesLoading(false);
    };
  
    fetchCategory();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, categoriesLoading }}>
      {children}
    </CategoryContext.Provider>
  );
};