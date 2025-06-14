import React from "react";
import Slider from "react-slick";
import BgImage from "../../assets/testimonial.png";

const bgStyle = {
  backgroundImage: `url(${BgImage.src})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "repeat",
};

const TestimonialData = [
  {
    id: 1,
    name: "John Doe",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    img: "https://picsum.photos/101-101",
  },
  {
    id: 2,
    name: "Jane Smith",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    img: "https://picsum.photos/102-102",
  },
  {
    id: 3,
    name: "Alice Johnson",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    img: "https://picsum.photos/103-103",
  },
  {
    id: 4,
    name: "Bob Brown",
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    img: "https://picsum.photos/104-104",
  },
  {
    id: 5,
    name: "Charlie Green",
    text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
    img: "https://picsum.photos/105-105",
  },
];

const Testimonial = () => {
  //slider config
  const settings = {
    dots: true,
    arrow: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    casEase: "linear",
    pauseonHover: true,
    pauseonFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div style={bgStyle}>
      <div className="border shadow-lg py-14 bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-purple-800/70 backdrop-blur-lg border-white/20 dark:text-white">
        <div className="container">
          {/* header section */}
          <div data-aos="fade-up" className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-white">Testimonials</h1>
          </div>

          {/* Testimonials cards Section */}
          <div data-aos="zoom-in">
            <Slider {...settings}>
              {TestimonialData.map(({ id, name, text, img }) => {
                return (
                  <div key={id} className="my-6">
                    <div className="flex flex-col gap-6 px-6 py-8 mx-4 border shadow-lg rounded-3xl bg-white/30 dark:bg-dark/60 border-white/20 backdrop-blur-md">
                      {/* content section */}
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-xs text-white">{text}</p>
                      </div>
                      {/* image section */}
                      <div className="flex items-center gap-4">
                        <img
                          src={img}
                          alt={name}
                          className="w-16 h-16 border-2 rounded-full border-white/40"
                        />
                        <div className="space-y-2">
                          <h1 className="text-xl font-bold text-white font-cursive">
                            {name}
                          </h1>
                          <p className="text-sm font-bold text-white/70">
                            Developer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
