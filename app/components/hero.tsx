import React from "react";
import heroImage from "../assets/undraw_calculation.svg";
import { AspectRatio } from "./ui/aspect-ratio.tsx";

export default function Hero({ jsx }: { jsx: React.ReactNode }) {
  return (
    <section id="hero" className="w-auto ml-5rem lg:ml-[2rem] pb-10	lg:p-0">
      <div className="w-full px-2 flex flex-col-reverse gap-10 lg:flex-row">
        <div className="max-w-[40rem] flex flex-col gap-6">{jsx}</div>
        <div className="w-full flex items-center mb-8 md:mb-0] md:w-[25rem]">
          <div className="w-[350px] lg:w-[500px]">
            <img
              src={heroImage}
              alt="Man using a calculator"
              className=" overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
