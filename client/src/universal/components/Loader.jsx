const Loader = ({ message = "Preparing your experience..." }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">

      {/* CUSTOM CIRCLE LOADER */}
      <div className="relative w-20 h-20 flex items-center justify-center">

        {/* Outer rotating circle */}
        <div className="absolute inset-0 rounded-full border-[5px] border-green-100 border-t-green-600 animate-spin" />

        {/* Inner circle */}
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">

          <div className="w-5 h-5 rounded-full bg-green-600" />

        </div>

      </div>

      {/* BRAND NAME */}
      <h2 className="mt-6 text-2xl font-black text-green-950">
        Scaz<span className="text-green-500">Store</span>
      </h2>

      {/* LOADING MESSAGE */}
      <p className="mt-2 text-sm text-gray-400 animate-pulse">
        {message}
      </p>

    </div>
  );
};

export default Loader;