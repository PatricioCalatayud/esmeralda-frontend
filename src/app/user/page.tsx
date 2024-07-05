import React from "react";

const RegisterUser = () => {
  return (
    <div
      className="flex justify-center items-center font-sans h-full min-h-screen p-4"
      style={{
        backgroundImage: `url("/hermoso-jardin-fresas-amanecer-doi-ang-khang-chiang-mai-tailandia.jpg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className=" p-16 bg-white bg-opacity-50 flex  justify-center rounded-md">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
              <div className="text-gray-600 ">
                <p className="font-bold text-4xl animate-fade-down animate-once">
                  Datos del usuario
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-5 font-semibold">
                    <label htmlFor="names">Nombres</label>
                    <input
                      type="text"
                      name="names"
                      id="names"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                    />
                  </div>
                  <div className="md:col-span-5 font-semibold">
                    <label htmlFor="lastName">Apellidos</label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                    />
                  </div>

                  <div className="md:col-span-5 font-semibold">
                    <label htmlFor="email">Correo</label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                      placeholder="email@domain.com"
                    />
                  </div>

                  <div className="md:col-span-5 font-semibold">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="text"
                      name="password"
                      id="password"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                      placeholder="*********"
                    />
                  </div>

                  <div className="md:col-span-5 font-semibold">
                    <label htmlFor="ConfirmPassword">
                      Confirmar contraseña
                    </label>
                    <input
                      type="text"
                      name="ConfirmPassword"
                      id="ConfirmPassword"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                      placeholder="*********"
                    />
                  </div>

                  <div className="md:col-span-3 font-semibold">
                    <label htmlFor="address">Dirección</label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                    />
                  </div>

                  <div className="md:col-span-2 font-semibold">
                    <label htmlFor="city">Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                    />
                  </div>

                  <div className="md:col-span-3 font-semibold">
                    <label htmlFor="region">Región</label>
                    <input
                      type="text"
                      name="region"
                      id="region"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                    />
                  </div>

                  <div className="md:col-span-2 font-semibold">
                    <label htmlFor="province">Provincia</label>
                    <input
                      type="text"
                      name="province"
                      id="province"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                    />
                  </div>
                  <div className="md:col-span-3 font-semibold">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                    />
                  </div>
                  <div className="md:col-span-5 text-right">
                    <div className="font-sans max-w-7xl mx-auto pt-5">
                      <button
                        type="button"
                        className="w-full shadow-xl py-3 px-6 text-sm tracking-wide font-semibold rounded-md text-white bg-green-800 hover:bg-green-900 focus:outline-none animate-bounce animate-thrice"
                      >
                        Registrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
