const MercadoPagoIcon = ({ color, width, height }: { color?: string, width?: string, height?: string }) => {
  return (
    <svg
      width={width || "24px"}
      height={height || "24px"}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Si deseas usar estilos embebidos, puedes descomentarlo */}
        {/* <style>
          {`.a{fill:none;stroke:${color || "#000000"};stroke-linecap:round;stroke-linejoin:round;}`}
        </style> */}
      </defs>
      {/* Aplica el color directamente al atributo stroke */}
      <ellipse
        fill="none"
        stroke={color || "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="24"
        cy="24"
        rx="19.5"
        ry="12.978"
      />
      <path
        fill="none"
        stroke={color || "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.7044,15.5305A20.8345,20.8345,0,0,0,16.09,17.3957a22.8207,22.8207,0,0,0,4.546-.7731"
      />
      <path
        fill="none"
        stroke={color || "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M38.8824,15.6143a8.6157,8.6157,0,0,1-5.1653,1.4849c-3.3351,0-6.2255-2.1987-9.2148-2.1987-2.6681,0-7.189,4.3727-7.189,5.1633s1.3094,1.26,2.3717.7411c.6215-.3036,3.31-2.9151,5.4843-2.9151s9.2186,7.1361,9.8571,7.8066c.9882,1.0376-.9264,3.2733-2.1493,2.05s-3.4092-3.1621-3.4092-3.1621"
      />
      <path
        fill="none"
        stroke={color || "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M43.4,22.6826a23.9981,23.9981,0,0,0-8.5467,2.6926"
      />
      <path
        fill="none"
        stroke={color || "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M32.5807,27.4555c.9881,1.0376-.9265,3.2733-2.1493,2.05S27.85,26.9933,27.85,26.9933"
      />
      <path
        fill="none"
        stroke={color || "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M30.1349,29.2147c.9882,1.0376-.9264,3.2733-2.1493,2.05S25.96,29.3032,25.96,29.3032"
      />
      <path
        fill="none"
        stroke={color || "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.2015,31.3156A2.309,2.309,0,0,0,27.85,31.13"
      />
      <path
        fill="none"
        stroke={color || "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.2015,31.3156c.5306-.6964.49-3.1817-2.2437-2.6876.6423-1.2188.0658-3.1457-2.3881-2.0093A1.69,1.69,0,0,0,16.424,25.96a1.4545,1.4545,0,0,0-2.8-.28c-.5435,1.1035.2964,3.0963,2.0916,1.9763-.1812,1.9435.84,2.5364,2.6845,1.7788.0989,1.91,1.367,1.7457,2.2728,1.3011A1.9376,1.9376,0,0,0,24.2015,31.3156Z"
      />
      <path
        fill="none"
        stroke={color || "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.6706,22.2785a18.3081,18.3081,0,0,1,9.0635,3.2144"
      />
    </svg>
  );
};

export default MercadoPagoIcon;