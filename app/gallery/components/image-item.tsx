"use client";

import { useState, useRef } from "react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type Image = {
  image: string;
  alt: string;
  ar: string;
};

const filterAnimation = {
  hover: { stdDeviation: 30 },
  rest: { stdDeviation: 0 },
};

export default function ImageItem({ image, alt, ar }: Image) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      setIsHovered(true);
      videoRef.current.play();
      videoRef.current.loop = true;
      videoRef.current.style.filter = "url(#ambilight-trigger)";
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.style.filter = "none";
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setIsLoading(true);
        }
      }}
    >
      <DialogTrigger>
        <svg width="0" height="0">
          <filter
            id="ambilight-trigger"
            width="300%"
            height="300%"
            x="-0.75"
            y="-0.75"
            color-interpolation-filters="sRGB"
          >
            <feOffset in="SourceGraphic" result="source-copy" />
            <feColorMatrix
              in="source-copy"
              type="saturate"
              values="2"
              result="saturated-copy"
            />
            <feColorMatrix
              in="saturated-copy"
              type="matrix"
              values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    33 33 33 101 -140"
              result="bright-colors"
            />
            <feGaussianBlur
              in="bright-colors"
              operator="dilate"
              result="spread"
              radius="5"
            />
            <motion.feGaussianBlur
              in="spread"
              animate={isHovered ? "hover" : "rest"}
              variants={filterAnimation}
              transition={{ duration: 0.25 }}
              result="ambilight-light"
            />
            <feOffset in="SourceGraphic" result="source" />
            <feComposite in="source" in2="ambilight-light" operator="over" />
          </filter>
        </svg>
        <video
          ref={videoRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          src={image}
          onLoadedData={() => setIsLoading(false)}
          className={clsx(
            "duration-700 ease-in-out group-hover:cursor-pointer rounded-sm",
            isLoading
              ? "scale-120 blur-3xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
        />
      </DialogTrigger>
      <style>
        {`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              50%, 100% { /* Adjust this percentage to control the speed of rotation */
                transform: rotate(180deg);
              }
            }
          `}
      </style>
      <DialogContent className="max-w-2xl border-0 p-0 gap-0">
        <svg width="0" height="0">
          <filter
            id="ambilight-content"
            width="300%"
            height="300%"
            x="-0.75"
            y="-0.75"
            color-interpolation-filters="sRGB"
          >
            <feOffset in="SourceGraphic" result="source-copy" />
            <feColorMatrix
              in="source-copy"
              type="saturate"
              values="2"
              result="saturated-copy"
            />
            <feColorMatrix
              in="saturated-copy"
              type="matrix"
              values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    33 33 33 101 -140"
              result="bright-colors"
            />
            <feGaussianBlur
              in="bright-colors"
              operator="dilate"
              result="spread"
              radius="15"
            />
            <feGaussianBlur
              in="spread"
              result="ambilight-light"
              stdDeviation="30"
            />
            <feOffset in="SourceGraphic" result="source" />
            <feComposite in="source" in2="ambilight-light" operator="over" />
          </filter>
        </svg>
        <video
          loop
          autoPlay
          controls
          src={image}
          onLoadedData={() => setIsLoading(false)}
          className={clsx(
            "w-full h-full duration-700 ease-in-out rounded-md",
            isLoading
              ? "scale-120 blur-3xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          style={{ filter: "url(#ambilight-content)" }}
        />

        <Link
          href={image}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-12 top-4 rounded-sm opacity-70 ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <ExternalLinkIcon className="h-4 w-4" />
          <span className="sr-only">External Link</span>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
