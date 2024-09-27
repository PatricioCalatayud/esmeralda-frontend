import React from "react";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiCoffeeBeans, GiDeliveryDrone } from "react-icons/gi";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faLock, faMugSaucer, faTruck } from "@fortawesome/free-solid-svg-icons";

const Banner = () => {
  return (
    <div className="min-h-[550px] flex justify-center items-center py-12 sm:py-0">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* sección de imagen */}
          <div data-aos="zoom-in" className="flex justify-center">
            <Image
              width={500}
              height={500}
              src="/esmeralda1.webp"
              alt="Café en Grano"
              className="w-3/4 sm:w-3/4 lg:w-3/4 h-auto mx-auto mb-11 drop-shadow-[-10px_10px_12px_rgba(0,0,0,1)] object-cover"
            />
          </div>

          {/* sección de detalles de texto */}
          <div className="flex flex-col justify-center gap-6 sm:px-0 mx-10 ">
            <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold">
              ¡Descubre Nuestro Café en Grano Premium!
            </h1>
            <p
              data-aos="fade-up"
              className="text-sm text-gray-500 tracking-wide leading-5"
            >
              Sumérgete en el mundo de sabores con nuestro café en grano de
              primera calidad. Granos seleccionados y un sabor inolvidable -
              todo a un excelente precio.
            </p>
            <div className="flex flex-col gap-4">
              <div data-aos="fade-up" className="flex items-center gap-4">
              <div className="shadow-sm w-12 h-12 flex justify-center items-center rounded-full bg-teal-100 dark:bg-teal-400">
              <FontAwesomeIcon icon={faLock} size="lg"/>
              </div  >
                <p>Calidad Garantizada</p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
              <div className="shadow-sm w-12 h-12 flex justify-center items-center rounded-full bg-teal-100 dark:bg-teal-400">
              <FontAwesomeIcon icon={faCircleExclamation} size="lg"/>
              </div  >
                <p>Servicio Rápido</p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
              <div className="shadow-sm w-12 h-12 flex justify-center items-center rounded-full bg-teal-100 dark:bg-teal-400">
                <FontAwesomeIcon icon={faMugSaucer} size="lg"/>
                </div>
                <p>Café en Grano Seleccionado</p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
                <div className="shadow-sm w-12 h-12 flex justify-center items-center rounded-full bg-teal-100 dark:bg-teal-400">
              <FontAwesomeIcon icon={faTruck} size="lg"/>
              </div  >
                <p>Entrega Rápida</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;