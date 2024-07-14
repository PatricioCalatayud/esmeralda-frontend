"use client";
import React, { useState } from "react";
import { TextInput, Textarea } from "flowbite-react";
import RatingStars from "@/components/ratingStars/ratingStars";
import { useRouter } from "next/navigation";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const Contacto: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [punctuation, setPunctuation] = useState<number>(0);

  const router = useRouter();

  const handleCambioDeCalificacion = (calificacion: number) => {
    setPunctuation(calificacion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const review = {
      name,
      email,
      description,
      punctuation,
    };

    try {
      const res = await fetch(`${apiURL}/testimony/`, {
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

      alert("Review creada correctamente");
      setName("");
      setEmail("");
      setDescription("");
      setPunctuation(0);
      router.push("/");
    } catch (error: any) {
      console.error("Error creando review:", error);
      alert("No se pudo crear la review");
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
            src="https://www.google.com/maps/d/u/0/embed?mid=1kew-d7XLDgB5lY5pFufQQpq5unMj4r0&ehbc=2E312F&z=10"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="mapa"
            scrolling="no"
            style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
          ></iframe>
        </div>
        <div className="container px-5 py-24 mx-auto flex">
          <div className="lg:w-1/3 md:w-1/2 bg-white dark:bg-gray-700  rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font dark:text-orange-500">
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
                  htmlFor="name"
                  className="leading-7 text-sm text-gray-600 dark:text-orange-400"
                >
                  Tu Nombre
                </label>
                <TextInput
                  id="name"
                  name="name"
                  placeholder="Ingresa tu nombre"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="email"
                  className="leading-7 text-sm text-gray-600 dark:text-orange-400"
                >
                  Tu Correo Electrónico
                </label>
                <TextInput
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Ingresa tu correo electrónico"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="message"
                  className="leading-7 text-sm text-gray-600 dark:text-orange-400"
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
                  className="leading-7 text-sm text-gray-600 dark:text-orange-400"
                >
                  Calificación
                </label>
                <RatingStars onChange={handleCambioDeCalificacion} />
              </div>
              <button
                type="submit"
                className="text-white bg-orange-500 border-0 py-2 px-6 focus:outline-none hover:bg-orange-800 rounded text-lg"
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
