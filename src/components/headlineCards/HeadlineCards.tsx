import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/helpers/CategoriesServices.helper';
import { Category } from '@/interfaces/IProductList';
import Image from 'next/image';
import { useCategoryContext } from '@/context/categories.context';
import { Spinner } from '@material-tailwind/react';

function HeadlineCards() {

  const [accessoriesCategoryId, setAccessoriesCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const {categories, categoriesLoading} = useCategoryContext();
  
  useEffect(() => {
  if (!categoriesLoading) { 
    const accessoriesCategory = categories?.find(category => category.name.toLowerCase() === 'accesorio');
    console.log(categories);
    console.log(accessoriesCategory);
    if (accessoriesCategory) {
      setAccessoriesCategoryId(accessoriesCategory.id);
    }
    setLoading(false);
  } else {
    console.log('Categories loading...');
  }
}, [categoriesLoading, categories]);

  if (loading) {
    return <div className='flex items-center justify-center w-full h-72'>
    <Spinner
    color="teal"
    className="h-12 w-12"
    onPointerEnterCapture={() => {}}
    onPointerLeaveCapture={() => {}}
  /></div>; // Puedes personalizar este mensaje de carga si es necesario
  }

  return (
    <div className='max-w-[1640px] mx-auto p-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
      <div className='rounded-xl relative'>
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white flex flex-col justify-center items-center p-4'>
          <p className='font-bold text-xl sm:text-2xl px-2'>Tienda Online</p>
          <p className='px-2 text-center'>¡Comienza tu pedido ahora!</p>
          <Link href='/categories'>
            <button type="button" className="focus:outline-none text-white bg-teal-800 hover:bg-emerald-950 focus:ring-4 focus:ring-teal-500 font-medium rounded-lg text-sm sm:text-base px-5 py-2.5 mt-4">Pedir Ahora</button>
          </Link>
        </div>
        < Image priority={true} width={500} height={500} className='w-full object-cover rounded-xl' style={{ height: '200px' }} src='https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt='imagen de comida' />
      </div>

      <div className='rounded-xl relative'>
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white flex flex-col justify-center items-center p-4'>
          <p className='font-bold text-xl sm:text-2xl px-2'>Donde estamos ubicados</p>
          <p className='px-2 text-center'>Nos estamos expandiendo!</p>
          <Link href='/contact'>
            <button type="button" className="focus:outline-none text-white bg-teal-800 hover:bg-emerald-950 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-sm sm:text-base px-5 py-2.5 mt-4">Descúbrelos</button>
          </Link>
        </div>
        <Image priority={true} width={500} height={500} className='w-full object-cover rounded-xl' style={{ height: '200px' }} src='https://images.pexels.com/photos/122370/pexels-photo-122370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt='imagen de restaurante' />
      </div>

      <div className='rounded-xl relative'>
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white flex flex-col justify-center items-center p-4'>
          <p className='font-bold text-xl sm:text-2xl px-2'>No solo vendemos Cafe</p>
          <p className='px-2 text-center'>Veni y enterate</p>
          {accessoriesCategoryId ? (
            <Link href={`/categories/${accessoriesCategoryId}`}>
              <button type="button" className="focus:outline-none text-white bg-teal-800 hover:bg-emerald-950 focus:ring-4 focus:ring-teal-500 font-medium rounded-lg text-sm sm:text-base px-5 py-2.5 mt-4">Echa un Vistazo</button>
            </Link>
          ) : (
            <p>No se encontró la categoría accesorios</p>
          )}
        </div>
        <Image priority={true} width={500} height={500} className='w-full object-cover rounded-xl' style={{ height: '200px' }} src='https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt='imagen de postre' />
      </div>
    </div>
  );
}

export default HeadlineCards;