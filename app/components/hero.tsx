import React from "react";
import heroImage from "../assets/undraw_calculation.svg";

export default function Hero({ jsx }: { jsx: React.ReactNode }) {
  return (
    <section id="hero" className="w-auto ml-5rem lg:ml-[2rem] pb-10	lg:p-0">
      <div className="w-full px-2 flex flex-col-reverse gap-10 lg:flex-row">
        <div className="max-w-[40rem] flex flex-col gap-6">
          {jsx}
        </div>
        <div className="w-full flex items-center mb-8 md:mb-0] md:w-[25rem]">
          <img
            src={heroImage}
            alt="Man using a calculator"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
