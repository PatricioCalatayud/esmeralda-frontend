import React from "react";

interface TrackingComponent1Props {
  statusBack: string;
  width?: number;
  height?: number;
}

const TrackingComponent1: React.FC<TrackingComponent1Props> = ({
  statusBack,
  width = 50,
  height = 264,
}) => {
  const steps = [
    { name: "Recibido", activeColor: "#00695C", inactiveColor: "#D1D5DB" },
    { name: "Empaquetado", activeColor: "#00695C", inactiveColor: "#D1D5DB" },
    { name: "Transito", activeColor: "#00695C", inactiveColor: "#D1D5DB" },
    { name: "Entregado", activeColor: "#00695C", inactiveColor: "#D1D5DB" },
  ];

  const activeIndex = steps.findIndex((step) => step.name === statusBack);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 264"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Línea que conecta los círculos */}
          {index > 0 && (
            <rect
              x="24"
              y={index * 76 - 44}
              width="2"
              height="76"
              fill={
                index <= activeIndex 
                  ? step.activeColor 
                  : index === activeIndex + 1 
                  ? step.activeColor 
                  : step.inactiveColor
              }
            />
          )}
          {/* Círculo del estado */}
          <rect
            x="10"
            y={index * 76 + 3}
            width="30"
            height="30"
            rx="15"
            fill="white"
          />
          <rect
            x="10"
            y={index * 76 + 3}
            width="30"
            height="30"
            rx="15"
            stroke={
              index <= activeIndex
                ? step.activeColor
                : index === activeIndex + 1
                ? step.activeColor
                : step.inactiveColor
            }
            strokeWidth="2"
          />
          {index <= activeIndex && (
            <rect
              x="10"
              y={index * 76 + 3}
              width="30"
              height="30"
              rx="15"
              fill={step.activeColor}
            />
          )}
          {index <= activeIndex && (
            <path
              d="M20.5 13L14 19.5L10.5 16"
              transform={`translate(10 ${index * 76 + 2})`}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </React.Fragment>
      ))}
    </svg>
  );
};

export default TrackingComponent1;
