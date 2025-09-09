function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl card">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-gray-100" />
        <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-gray-100" />
      </div>
      <div className="px-6 md:px-10 py-10 md:py-14 text-center relative">
        <div className="flex items-center justify-center gap-3 md:gap-4">
          <img
            src="/image/Logo_PLN-removebg-preview.png"
            alt="Logo PLN"
            className="h-10 md:h-14 w-auto object-contain"
          />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Dashboard GRO
          </h1>
        </div>
        <p className="mt-3 max-w-2xl mx-auto text-gray-600">
          Monitor key metrics, view reports, and manage settings in one place.
        </p>
      </div>
    </section>
  );
}

export default Hero;
