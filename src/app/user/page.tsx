"use client";
import { IUserErrorProps, IUserProps } from "@/types/user";
import { validateRegisterUserForm } from "@/utils/userFormValidation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RegisterUser = () => {
  const Router = useRouter();

  const [dataUser, setDataUser] = useState<IUserProps>({
    name: "",
    email: "",
    password: "",
    //address: "",
    phone: "",
  });

  const [error, setError] = useState<IUserErrorProps>({
    name: "",
    email: "",
    password: "",
    //address: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    setDataUser((prevDataUser) => ({
      ...prevDataUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegisterUserForm(dataUser);
    setError(errors);
    console.log(dataUser);
    try {
      const res = await axios.post(
        "http://localhost:3001/users/signup",
        dataUser,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200) {
        throw new Error(
          `Error registrando usuario: ${res.status} - ${res.data.message}`
        );
      }

      const User = res.data;
      console.log(User);

      return User;
    } catch (error: any) {}
  };

  useEffect(() => {
    const errors = validateRegisterUserForm(dataUser);
    setError(errors);
  }, [dataUser]);

  const isDisabled = Object.values(error).some((x) => x !== "");

  return (
    <div
      className="flex justify-center items-center font-sans h-full min-h-screen p-4"
      style={{
        backgroundImage: `url("/hermoso-jardin-fresas-amanecer-doi-ang-khang-chiang-mai-tailandia.jpg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="p-16 bg-white bg-opacity-40 flex justify-center rounded-md">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                <div className="text-gray-600 ">
                  <p className="font-bold text-4xl animate-fade-down animate-once">
                    Datos del usuario
                  </p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5 font-semibold">
                      <label htmlFor="names">Apellidos y Nombres:</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={dataUser.name}
                        onChange={handleChange}
                        placeholder="Apellidos y Nombres"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                      />
                      {error.name && (
                        <p className="text-red-500">{error.name}</p>
                      )}
                    </div>

                    <div className="md:col-span-5 font-semibold">
                      <label htmlFor="email">Correo</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        value={dataUser.email}
                        onChange={handleChange}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                        placeholder="email@domain.com"
                      />
                      {error.email && (
                        <p className="text-red-500">{error.email}</p>
                      )}
                    </div>

                    <div className="md:col-span-5 font-semibold">
                      <label htmlFor="password">Contraseña</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={dataUser.password}
                        onChange={handleChange}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                        placeholder="*********"
                      />
                      {error.password && (
                        <p className="text-red-500">{error.password}</p>
                      )}
                    </div>

                
                    <div className="md:col-span-3 font-semibold">
                      <label htmlFor="phone">Teléfono</label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={dataUser.phone}
                        onChange={handleChange}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                      />
                      {error.phone && (
                        <p className="text-red-500">{error.phone}</p>
                      )}
                    </div>

                    <div className="md:col-span-5 text-right">
                      <div className="font-sans max-w-7xl mx-auto pt-5">
                        <button
                          type="submit"
                          disabled={isDisabled}
                          className={`w-full shadow-xl py-3 px-6 text-sm tracking-wide font-semibold rounded-md text-white focus:outline-none animate-bounce animate-thrice ${
                            isDisabled
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-800"
                          }`}
                        >
                          Registrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
