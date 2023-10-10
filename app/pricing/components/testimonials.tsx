import Image from "next/image";

export function Testimonials() {
  return (
    <div className="max-w-6xl mx-auto sm:py-24 px-10 lg:px-20">
      <div className="py-12 mx-auto max-w-7xl">
        <h2 className="text-center text-xl font-semibold leading-8 text-black">
          Trusted by the world’s most innovative brands
        </h2>
        <div className="mx-auto mt-10 max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-3 flex justify-center">
          {" "}
          <Image
            className="col-span-1 max-h-16 w-full object-contain lg:col-span-1 grayscale hover:grayscale-0 transition-all duration-300"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png"
            alt="AWS"
            width={158}
            height={48}
          />
        </div>
      </div>
    </div>
  );
}
