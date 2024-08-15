"use client"
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Category } from '@/interfaces/IProductList';

import { getCategories } from '@/helpers/categories.helper';

interface CategoryContextType {
  categories: Category[] | undefined;
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

  useEffect(() => {
    const fetchCategory = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };

    fetchCategory();
  }, []);


  return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  );
};