"use client";
import { LoginUser } from "@/helpers/Autenticacion.helper";
import { ILoginErrorProps, ILoginProps } from "@/types/login";
import { validateLoginForm } from "@/utils/loginFormValidation";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const Login = () => {
  const Router = useRouter();

  const initialUserData: ILoginProps = {
    email: "",
    password: "",
  };
  const initialErrorState: ILoginErrorProps = {
    email: "",
    password: "",
  };

  const [dataUser, setDataUser] = useState<ILoginProps>(initialUserData);
  const [error, setError] = useState<ILoginErrorProps>(initialErrorState);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<
    Record<keyof ILoginErrorProps, boolean>
  >({
    email: false,
    password: false,
  });

  //! Funcion para iniciar sesion
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    setDataUser((prevDataUser) => ({
      ...prevDataUser,
      [name]: value,
    }));

    if (!touched[name as keyof ILoginErrorProps]) {
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
    }

    const fieldErrors = validateLoginForm({
      ...dataUser,
      [name]: value,
    });

    setError((prevError) => ({
      ...prevError,
      [name]: fieldErrors[name as keyof ILoginErrorProps] || "", // Asegurar que siempre se asigna un string
    }));
  };

  //! Funcion para iniciar sesion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar el formulario
    const errors = validateLoginForm(dataUser);
    setError(errors);

    // Marcar todos los campos como tocados
    setTouched({
      email: true,
      password: true,
    });

    // Si hay errores, no proceder con el envío
    if (Object.values(errors).some((x) => x !== "")) {
      return;
    }

    // Limpiar errores de envío previos
    setSubmitError(null);

    // Iniciar carga
    setLoading(true);

    console.log(dataUser); // Captura los datos del usuario (email y password

    try {
      const response = await LoginUser(dataUser);

      console.log(response); // Captura la respuesta del servidor

      // Verificar si se recibió un usuario en la respuesta

      if (response) {
        // Guardar datos de usuario en localStorage
        //localStorage.setItem("userSession", JSON.stringify({ userData: response }));

        // Mostrar mensaje de éxito usando Swal
        Swal.fire({
          icon: "success",
          title: "¡Bienvenido a La Esmeralda Café!",
          showConfirmButton: false,
          timer: 1500,
        });

        // Limpiar campos del formulario después del éxito
        setDataUser(initialUserData);
        setTouched({
          email: false,
          password: false,
        });

        // Redirigir a la página principal después de un tiempo
        setTimeout(() => {
          Router.push("/");
        }, 1500);
      } else {
        // Mostrar mensaje de error si no se encontró el usuario
        Swal.fire({
          icon: "error",
          title: "Usuario o contraseña incorrecta",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error: any) {
      // Capturar errores durante el inicio de sesión
      setSubmitError(`Error al iniciar sesión: ${error.message}`);
      toast.error(`Error al iniciar sesión: ${error.message}`);
    } finally {
      // Detener la carga después de finalizar
      setLoading(false);
    }
  };
  const isDisabled = Object.values(error).some((x) => x !== "");

  return (
    <div className="relative flex justify-center items-center font-sans h-full min-h-screen p-4">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/roaster.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 font-sans max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-8 h-full">
          <form
            onSubmit={handleSubmit}
            className="max-w-lg w-full p-6 bg-opacity-50 bg-white rounded-2xl shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)] flex flex-col justify-center"
          >
            <div className="mb-12">
              <h3 className="text-gray-800 text-4xl font-extrabold animate-fade-down animate-once">
                Iniciar sesión
              </h3>
              <p className="text-gray-800 text-sm mt-6 animate-fade animate-once">
                Vive una <b>EXPERIENCIA</b> distinta. ¡Regístrate y disfruta de
                los mejores productos!
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-gray-800 font-semibold text-[15px] mb-2 block"
              >
                Correo
              </label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="text"
                  id="email"
                  value={dataUser.email}
                  onChange={handleChange}
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                  placeholder="Ingrese correo"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-[18px] h-[18px] absolute right-4"
                  viewBox="0 0 682.667 682.667"
                >
                  <defs>
                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                      <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                    </clipPath>
                  </defs>
                  <g
                    clipPath="url(#a)"
                    transform="matrix(1.33 0 0 -1.33 0 682.667)"
                  >
                    <path
                      fill="none"
                      strokeMiterlimit="10"
                      strokeWidth="40"
                      d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                      data-original="#000000"
                    ></path>
                    <path
                      d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </div>
              {error.email && <p className="text-red-500">{error.email}</p>}
            </div>
            <div className="mt-6">
              <label
                htmlFor="password"
                className="text-gray-800 font-semibold text-[15px] mb-2 block"
              >
                Contraseña
              </label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  id="password"
                  value={dataUser.password}
                  onChange={handleChange}
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-green-700"
                  placeholder="Ingrese contraseña"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                  viewBox="0 0 128 128"
                >
                  <path
                    d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
              {error.password && (
                <p className="text-red-500">{error.password}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 justify-between mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="shrink-0 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded-md"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm text-gray-800"
                >
                  Recordar
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="text-green-00 font-semibold hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isDisabled}
                className={`w-full shadow-xl py-3 px-6 text-sm tracking-wide font-semibold rounded-md text-white focus:outline-none animate-bounce animate-thrice ${
                  isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-800"
                }`}
              >
                Iniciar sesión
              </button>
            </div>
            <p className="text-sm mt-8 text-center font-semibold text-gray-800">
              ¿No tienes cuenta?{" "}
              <a
                href="/user"
                className="text-green-900 font-bold tracking-wide hover:underline ml-1"
              >
                Regístrate Aquí
              </a>
            </p>
            {submitError && <p className="text-red-500 mt-4">{submitError}</p>}
            <div>
              {" "}
              <hr className="border-gray-600 border-2 my-3" />
            </div>

            <div className="space-x-6 flex justify-center mt-2">
              <button type="button" className="border-none outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32px"
                  className="inline"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                    data-original="#fbbd00"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                    data-original="#0f9d58"
                  />
                  <path
                    fill="#31aa52"
                    d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                    data-original="#31aa52"
                  />
                  <path
                    fill="#3c79e6"
                    d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                    data-original="#3c79e6"
                  />
                  <path
                    fill="#cf2d48"
                    d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                    data-original="#cf2d48"
                  />
                  <path
                    fill="#eb4132"
                    d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                    data-original="#eb4132"
                  />
                </svg>
              </button>

              <button type="button" className="border-none outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32px"
                  fill="#007bff"
                  viewBox="0 0 167.657 167.657"
                >
                  <path
                    d="M83.829.349C37.532.349 0 37.881 0 84.178c0 41.523 30.222 75.911 69.848 82.57v-65.081H49.626v-23.42h20.222V60.978c0-20.037 12.238-30.956 30.115-30.956 8.562 0 15.92.638 18.056.919v20.944l-12.399.006c-9.72 0-11.594 4.618-11.594 11.397v14.947h23.193l-3.025 23.42H94.026v65.653c41.476-5.048 73.631-40.312 73.631-83.154 0-46.273-37.532-83.805-83.828-83.805z"
                    data-original="#010002"
                  ></path>
                </svg>
              </button>
            </div>
          </form>

          <div className="h-full md:py-6 flex items-center relative max-md:before:hidden before:absolute before:bg-gradient-to-r before:h-full before:w-3/4 before:right-0 before:z-0">
            <img
              src="/LogoCafe.png"
              alt="Imagen de café"
              className="rounded-xl lg:w-4/5 md:w-11/12 z-50 relative"
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
