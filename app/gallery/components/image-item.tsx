"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

type Image = {
  image: string;
  alt: string;
  ar: string;
};

export default function ImageItem({ image, alt, ar }: Image) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.loop = true;
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
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
        <video
          ref={videoRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          src={image}
          className={clsx(
            "object-cover duration-700 ease-in-out group-hover:cursor-pointer",
            isLoading
              ? "scale-120 blur-3xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoadedData={() => setIsLoading(false)}
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
      <DialogContent className="max-w-2xl p-0 gap-0">
        <video
          loop
          autoPlay
          controls
          src={image}
          onLoadedData={() => setIsLoading(false)}
          className={clsx(
            "w-full h-full duration-700 ease-in-out",
            isLoading
              ? "scale-120 blur-3xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
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
