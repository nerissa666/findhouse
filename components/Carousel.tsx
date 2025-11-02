import React, { useEffect, useState } from "react";
import { Image } from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "@/lib/axios";
import styles from "./index.module.scss";
import { BASE_URL } from "@/lib/consts";
const fetchData = async (): Promise<itemType[]> =>
  await axios.get("/home/swiper");
interface itemType {
  alt: string;
  id: number;
  imgSrc: string;
}

const Carousel = () => {
  const [data, setData] = useState<itemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      try {
        setLoading(true);
        setError(null);
        const data = await fetchData();
        setData(data);
      } catch (err) {
        console.error("Failed to load carousel data:", err);
        setError("Failed to load carousel data");
        // 设置默认数据
        setData([
          { id: 1, alt: "Default Image 1", imgSrc: "/next.svg" },
          { id: 2, alt: "Default Image 2", imgSrc: "/vercel.svg" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => {
      // setSlides([]);
    };
  }, []);
  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        加载中...
      </div>
    );
  }

  if (error) {
    console.warn("Carousel error:", error);
  }

  return (
    <div className="w-full">
      <Slider {...settings} className={`w-full ${styles.slickDots}`}>
        {data.map((item) => (
          <div key={item.id}>
            <h3>
              <Image alt={item.alt} src={BASE_URL + item.imgSrc} width="100%" />
            </h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
