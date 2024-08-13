import Image from "next/image";

const Hero = () => {
  return (
    <div className="max-w-[1640px] mx-auto p-4">
      <div className="max-h-[500px] relative">
        {/* Superposición visual para aumentar el contraste del texto */}
        <div className="absolute w-full h-full text-gray-200 max-h-[500px] bg-black/60 flex flex-col justify-center">
          <h1 className="px-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Descubre los <span className="text-teal-800">Mejores</span>
          </h1>
          <h2 className="px-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-teal-800">Sabores</span> que Llegan a Tu Taza
          </h2>
        </div>
        <Image priority={true} width={500} height={500}
          className="w-full max-h-[500px] object-cover"
          src="https://images.pexels.com/photos/867466/pexels-photo-867466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="imagen destacada"
        />
      </div>
    </div>
  );
};

export default Hero;