import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaStar } from 'react-icons/fa';
import { testimonials as testimonialsData } from '@/helpers/testimonialhelper';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  description: string;
  punctuation: number;
}

const getAvatarUrl = (id: string) => 
  `https://api.dicebear.com/8.x/thumbs/svg?seed=${id}&backgroundColor=FFCC99&primaryColor=FFDAB9&secondaryColor=FFE4B2&tertiaryColor=FFA07A`;

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setTestimonials(testimonialsData);
  }, []);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          centerPadding: '0',
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
          centerPadding: '0',
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '0',
        },
      },
    ],
  };

  return (
    <div className="py-10 mb-10">
      <div className="container mx-auto px-4">
        {/* header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Lo que nuestros clientes están diciendo
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Testimonios
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-500">
            ¡Descubre por qué a nuestros invitados les encantan nuestras hamburguesas gourmet!
          </p>
        </div>

        {/* Testimonial cards */}
        <div data-aos="zoom-in">
          <Slider {...settings}>
            {testimonials.map((data) => (
              <div key={data.id} className="px-4">
                <div className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl bg-white relative shadow-lg">
                  <div className="mb-4 flex justify-center">
                    <img
                      src={getAvatarUrl(data.id)}
                      alt={`Avatar of ${data.name}`}
                      className="rounded-full w-20 h-20 shadow-lg bg-gray-200"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="space-y-3 text-center">
                      <p className="text-xl font-bold text-black/80 dark:text-white">{data.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-bold">{data.description}</p>
                      <div className="flex justify-center">
                        {[...Array(5)].map((star, index) => (
                          <FaStar
                            key={index}
                            className={`h-5 w-5 ${
                              index < data.punctuation ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">
                    “
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;