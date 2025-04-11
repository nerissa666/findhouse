import React, { useEffect, useState } from "react";
import { Image } from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "@/axios";
const fetchData = async (): Promise<itemType[]> =>
  await axios.get("/home/swiper");
interface itemType {
  alt: string;
  id: number;
  imgSrc: string;
}

const Carousel = () => {
  const [data, setData] = useState<itemType[]>([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      setData(data);
    };

    loadData();
    return () => {
      // setSlides([]);
    };
  }, []);
  return (
    <Slider {...settings} className="w-full mb-4">
      {data.map((item) => (
        <div key={item.id}>
          <h3>
            <Image alt={item.alt} src={item.imgSrc} />
          </h3>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
