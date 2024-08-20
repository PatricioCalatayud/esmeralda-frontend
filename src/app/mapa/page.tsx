"use client";
import React from "react";

const Mapa: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Contenedor del mapa que ocupa todo el fondo */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.635490915495!2d-58.4381041!3d-34.6127627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca9288b43ef7%3A0x9c8e841db5753d45!2sC.%20Dr.%20Juan%20Felipe%20Aranguren%201528%2C%20C1406FWB%20CABA%2C%20Argentina!5e0!3m2!1ses!2sus!4v1626747469640!5m2!1ses!2sus"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
        title="mapa"
        className="absolute inset-0"
      ></iframe>
    </div>
  );
};

export default Mapa;