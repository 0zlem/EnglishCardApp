"use client";
import React, { useState } from "react";
import { Card, CardBody, Image, Button } from "@heroui/react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { CardContent } from "./ui/card";
import { PiArrowFatDownFill } from "react-icons/pi";
import { useRouter } from "next/navigation";

type IconProps = {
  size?: number;
  width?: number;
  height?: number;
  strokeWidth?: number;
  fill?: string;
} & React.SVGProps<SVGSVGElement>;

export const PlayCircleIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      width={size || width}
      viewBox="0 0 24 24"
      role="presentation"
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const NextIcon = ({ size = 24, width, height, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M3.76172 7.21957V16.7896C3.76172 18.7496 5.89172 19.9796 7.59172 18.9996L11.7417 16.6096L15.8917 14.2096C17.5917 13.2296 17.5917 10.7796 15.8917 9.79957L11.7417 7.39957L7.59172 5.00957C5.89172 4.02957 3.76172 5.24957 3.76172 7.21957Z"
        fill="currentColor"
      />
      <path
        d="M20.2383 18.9303C19.8283 18.9303 19.4883 18.5903 19.4883 18.1803V5.82031C19.4883 5.41031 19.8283 5.07031 20.2383 5.07031C20.6483 5.07031 20.9883 5.41031 20.9883 5.82031V18.1803C20.9883 18.5903 20.6583 18.9303 20.2383 18.9303Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PreviousIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M20.2409 7.21957V16.7896C20.2409 18.7496 18.1109 19.9796 16.4109 18.9996L12.2609 16.6096L8.11094 14.2096C6.41094 13.2296 6.41094 10.7796 8.11094 9.79957L12.2609 7.39957L16.4109 5.00957C18.1109 4.02957 20.2409 5.24957 20.2409 7.21957Z"
        fill="currentColor"
      />
      <path
        d="M3.76172 18.9303C3.35172 18.9303 3.01172 18.5903 3.01172 18.1803V5.82031C3.01172 5.41031 3.35172 5.07031 3.76172 5.07031C4.17172 5.07031 4.51172 5.41031 4.51172 5.82031V18.1803C4.51172 18.5903 4.17172 18.9303 3.76172 18.9303Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function HomeApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const images = ["/flashcard.png", "/learn2.png"];

  const carouselPrev = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const carouselNext = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handlePlay = () => {
    if (currentIndex === 0) {
      router.push("/flashcard");
    } else if (currentIndex === 1) {
      router.push("/learn");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card
        isBlurred
        className="w-full max-w-[1000px] rounded-2xl p-6 bg-[#001233]"
      >
        <CardBody>
          <div>
            <h1 className="text-white text-4xl flex justify-center items-center">
              𝔼ℕ𝔾𝕃İ𝕊ℍ 𝕋İ𝕄𝔼
            </h1>
          </div>
          <div className="grid grid-cols-12 gap-6 items-center">
            {/* Soldaki büyük resim */}
            <div className="col-span-7 md:col-span-7 lg:col-span-7">
              <Image
                alt="Album cover"
                src="/home1.png"
                width={1000}
                height={400}
                className="object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Sağdaki carousel */}
            <div className="mt-14 col-span-5 md:col-span-5 lg:col-span-5 flex flex-col items-center">
              <Carousel>
                <CarouselContent>
                  <CarouselItem key={currentIndex}>
                    <Card className="w-full h-full">
                      <CardContent className="bg-gray-100 aspect-square rounded-lg p-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={images[currentIndex]}
                          alt="homeImages"
                          className="w-full h-full object-fill rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>

              <div className="flex items-center justify-center mt-2">
                <PiArrowFatDownFill className="text-2xl text-[#fefdf5]" />
              </div>

              {/* Kontroller */}
              <div className="flex items-center justify-center mt-3 bg-[#fefdf5] rounded-2xl mx-auto p-1">
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  className="mr-4"
                  onPress={() => carouselPrev()}
                >
                  <PreviousIcon size={24} />
                </Button>
                <Button
                  onPress={() => handlePlay()}
                  isIconOnly
                  radius="full"
                  variant="light"
                  className="mx-4"
                >
                  <PlayCircleIcon size={54} />
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  className="ml-4"
                  onPress={() => carouselNext()}
                >
                  <NextIcon size={24} />
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
