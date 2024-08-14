'use client';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { NewUser } from "@/helpers/Autenticacion.helper";
import { IUserErrorProps, IUserProps } from "@/interfaces/user";
import { validateRegisterUserForm } from "@/utils/userFormValidation";

import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterUser = () => {
  const Router = useRouter();

  const initialUserData: IUserProps = {
    name: "",
    email: "",
    password: "",
    phone: "",
  };

  const initialErrorState: IUserErrorProps = {
    name: "",
    email: "",
    password: "",
    phone: "",
  };

  const [dataUser, setDataUser] = useState<IUserProps>(initialUserData);
  const [error, setError] = useState<IUserErrorProps>(initialErrorState);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<keyof IUserErrorProps, boolean>>({
    name: false,
    email: false,
    password: false,
    phone: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    setDataUser((prevDataUser) => ({
      ...prevDataUser,
      [name]: value,
    }));

    if (!touched[name as keyof IUserErrorProps]) {
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
    }

    // Validar el campo específico que se ha cambiado
    const fieldErrors = validateRegisterUserForm({
      ...dataUser,
      [name]: value,
    });

    setError((prevError) => ({
      ...prevError,
      [name]: fieldErrors[name as keyof IUserErrorProps] || "", // Asegurar que siempre se asigna un string
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateRegisterUserForm(dataUser);
    setError(errors);

    // Marcar todos los campos como tocados para mostrar errores
    setTouched({
      name: true,
      email: true,
      password: true,
      phone: true,
    });

    // Si hay errores, no proceder con el envío
    if (Object.values(errors).some((x) => x !== "")) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      await NewUser(dataUser);
      toast.success("Usuario registrado correctamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setDataUser(initialUserData); // Limpiar campos del formulario
      setTouched({
        name: false,
        email: false,
        password: false,
        phone: false,
      });

      setTimeout(() => {
        Router.push("/login");
      }, 3000);
    } catch (error: any) {
      if (error.response) {
        setSubmitError(
          `Error al registrar el usuario: ${error.response.data.message}`
        );
      } else if (error.request) {
        setSubmitError(
          "Error al registrar el usuario: No se recibió respuesta del servidor."
        );
      } else {
        setSubmitError(`Error al registrar el usuario: ${error.message}`);
      }
      toast.error("Error al registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

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
                      {touched.name && error.name && (
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
                      {touched.email && error.email && (
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
                      {touched.password && error.password && (
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
                      {touched.phone && error.phone && (
                        <p className="text-red-500">{error.phone}</p>
                      )}
                    </div>

                    <div className="md:col-span-5 text-right">
                      <div className="font-sans max-w-7xl mx-auto pt-5">
                        <button
                          type="submit"
                          disabled={isDisabled || loading}
                          className={`w-full shadow-xl py-3 px-6 text-sm tracking-wide font-semibold rounded-md text-white focus:outline-none animate-bounce animate-thrice ${
                            isDisabled || loading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-800"
                          }`}
                        >
                          {loading ? "Registrando..." : "Registrar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {submitError && (
                <p className="text-red-500 mt-4">{submitError}</p>
              )}
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterUser;


