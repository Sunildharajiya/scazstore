import { useEffect, useState } from "react";

const bannerFiles = import.meta.glob(
  "../../assets/banners/horizontal/*.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const banners = Object.entries(bannerFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, image]) => ({
    id: path,
    image,
    name: path.split("/").pop().split(".")[0],
  }));

const BannerCarousel = ({
  interval = 4500,
  showControls = true,
  showIndicators = true,
}) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = banners.length;

  useEffect(() => {
    if (total <= 1 || paused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, paused, total]);

  if (!total) return null;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      {/* Responsive banner frame */}
      <div
        className="
          relative w-full
          h-[180px]
          xs:h-[220px]
          sm:h-[280px]
          md:h-[360px]
          lg:h-[430px]
          xl:h-[480px]
          2xl:h-[520px]
        "
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`
              absolute inset-0 flex items-center justify-center
              transition-opacity duration-700 ease-in-out
              ${current === index ? "opacity-100 z-[1]" : "opacity-0 z-0"}
            `}
            aria-hidden={current !== index}
          >
            <img
              src={banner.image}
              alt={`ScazStore promotion ${index + 1}`}
              draggable="false"
              loading={index === 0 ? "eager" : "lazy"}
              className="
                w-full h-full
                object-contain
                object-center
                select-none
              "
            />
          </div>
        ))}

        {/* Bottom opacity fade */}
        <div
          className="
            absolute bottom-0 left-0 right-0 z-[2]
            h-16 sm:h-20 md:h-28
            pointer-events-none
          "
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))",
          }}
        />
      </div>

      {/* Previous button */}
      {showControls && total > 1 && (
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous banner"
          className="
            absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 sm:w-11 sm:h-11
            rounded-full bg-white/90 shadow-md
            hover:bg-white transition
          "
        >
          &#10094;
        </button>
      )}

      {/* Next button */}
      {showControls && total > 1 && (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next banner"
          className="
            absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 sm:w-11 sm:h-11
            rounded-full bg-white/90 shadow-md
            hover:bg-white transition
          "
        >
          &#10095;
        </button>
      )}

      {/* Indicators */}
      {showIndicators && total > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 z-10 flex justify-center gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-current={current === index}
              className={`
                h-2 rounded-full transition-all duration-300
                ${
                  current === index
                    ? "w-7 bg-green-600"
                    : "w-2 bg-gray-400/70"
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BannerCarousel;