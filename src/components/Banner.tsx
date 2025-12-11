import Image from '../assets/photography_banner.jpg';

const Banner = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">

      <img
        src={Image} 
        alt="Photography Background"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"     
        decoding="async"    
        fetchPriority="high" 
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 sm:px-8 lg:px-12 text-center max-w-4xl mx-auto">
        {/* Main Header */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
          Lucia Calderini Photography
        </h1>

        {/* Subheader */}
        <p className="text-base sm:text-lg text-gray-200 leading-relaxed mb-10 max-w-3xl mx-auto font-normal">
          In a tiny moment of peace, I found that bliss can be brought to you by
          places and people. To capture that bliss is the commitment I honor
          behind the lens, in order to hand over a piece of soul together with
          the light captured in a still frame.
        </p>

        {/* CTA Button - light themed */}
        <a href="#portfolio" aria-label="View Portfolio">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-white/95 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold tracking-wide shadow-md border border-gray-200 hover:shadow-lg transform transition duration-150 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-white"
          >
            View Portfolio
          </button>
        </a>
      </div>
    </div>
  );
};

export default Banner;

