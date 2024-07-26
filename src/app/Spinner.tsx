const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex space-x-2 mb-2">
        <div className="w-6 h-6 bg-teal-500 rounded-full animate-wave"></div>
        <div className="w-6 h-6 bg-teal-500 rounded-full animate-wave animation-delay-200"></div>
        <div className="w-6 h-6 bg-teal-500 rounded-full animate-wave animation-delay-400"></div>
      </div>
      <p className="text-teal-500 font-bold text-xl">La Esmeralda Cafe</p>
    </div>
  );
};

export default Spinner;
