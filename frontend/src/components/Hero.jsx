function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-100 shadow-lg">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-blue-100/30" />
        <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-purple-100/30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-yellow-100/20" />
      </div>
      <div className="px-6 md:px-10 py-12 md:py-16 text-center relative">
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <img
              src="/image/Logo_PLN-removebg-preview.png"
              alt="Logo PLN"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard GRO
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              PLN Electricity Services
            </p>
          </div>
        </div>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Platform terintegrasi untuk mengelola tamu, log telepon, dan aktivitas
          GRO dengan efisiensi maksimal
        </p>
      </div>
    </section>
  );
}

export default Hero;
