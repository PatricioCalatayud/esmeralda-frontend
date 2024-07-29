"use client";
import React, { useState, useEffect } from "react";
import { Textarea } from "flowbite-react";
import RatingStars from "@/components/ratingStars/ratingStars";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {jwtDecode} from "jwt-decode"; // Asegúrate de importar jwt-decode

const apiURL = "http://localhost:3001/testimony"; // Endpoint actualizado

const Contacto: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const [punctuation, setPunctuation] = useState<number>(0);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("userSession") || "{}");
    if (userSession.accessToken) {
      const decodedToken: any = jwtDecode(userSession.accessToken);
      if (decodedToken) {
        setUserName(decodedToken.name);
        setUserId(decodedToken.sub);
        setIsUserLoggedIn(true);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Debes estar logueado para poder hacer un comentario",
        text: "Redirigiendo a la página de inicio de sesión...",
      }).then(() => {
        router.push("/login");
      });
    }
  }, [router]);

  const handleCambioDeCalificacion = (calificacion: number) => {
    setPunctuation(calificacion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUserLoggedIn || !userId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario no autenticado",
      });
      return;
    }

    const review = {
      userId, // Enviar el UUID del usuario
      userName, // También enviar el nombre del usuario
      description,
      punctuation,
    };

    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!res.ok) {
        const errorDetails = await res.json();
        throw new Error(
          `Error creando review: ${res.status} - ${errorDetails.message}`
        );
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Review creada correctamente",
      });

      setDescription("");
      setPunctuation(0);
      router.push("/");
    } catch (error: any) {
      console.error("Error creando review:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear la review",
      });
    }
  };

  return (
    <div>
      <section className="text-gray-600 body-font relative">
        <div
          className="absolute inset-0 bg-gray-300"
          style={{ margin: "20px" }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.635490915495!2d-58.4381041!3d-34.6127627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca9288b43ef7%3A0x9c8e841db5753d45!2sC.%20Dr.%20Juan%20Felipe%20Aranguren%201528%2C%20C1406FWB%20CABA%2C%20Argentina!5e0!3m2!1ses!2sus!4v1626747469640!5m2!1ses!2sus"
            width="100%"
            height="600px"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="mapa"
            scrolling="no"
            style={{ opacity: 0.4 }}
          ></iframe>
        </div>
        <div className="container px-5 py-24 mx-auto flex">
          <div className="lg:w-1/3 md:w-1/2 bg-white dark:bg-gray-700  rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font dark:text-teal-500">
              Danos tu Opinión!
            </h2>
            <p className="leading-relaxed mb-5 text-gray-600 dark:text-white">
              Valoramos tus comentarios y preocupaciones. Por favor, háznos
              saber cómo fue tu experiencia de compra y cómo podemos mejorar
              nuestros servicios.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <label
                  htmlFor="message"
                  className="leading-7 text-sm text-gray-600 dark:text-teal-400"
                >
                  Tu Mensaje
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Ingresa tu mensaje"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="rating"
                  className="leading-7 text-sm text-gray-600 dark:text-teal-400"
                >
                  Calificación
                </label>
                <RatingStars onChange={handleCambioDeCalificacion} />
              </div>
              <button
                type="submit"
                className="text-white bg-teal-500 border-0 py-2 px-6 focus:outline-none hover:bg-teal-800 rounded text-lg"
                disabled={!isUserLoggedIn}
              >
                Enviar Opinión
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              ¡Gracias por ayudarnos a mejorar tus futuras experiencias!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;