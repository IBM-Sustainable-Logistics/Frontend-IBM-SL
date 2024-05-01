import React from "react";
import { Button } from "../components/ui/button.tsx";
import { Link } from "@remix-run/react";
import heroImage from "../assets/undraw_calculation.svg";

export default function Hero() {
  return (
    <section id='hero' className='w-auto ml-5rem lg:ml-[2rem] pb-10	lg:p-0'>
      <div className='w-full px-2 flex flex-col-reverse gap-10 lg:flex-row'>
        <div className='max-w-[40rem] flex flex-col gap-6'>
          <h1 className='text-4xl lg:text-[3vw] leading-[3rem] font-bold min-[1800px]:leading-[4.25rem]'>
            Calculate your footprint emissions for
            <span style={{color: "#3d815c"}}> FREE</span>
          </h1>
          <p className='text-2xl lg:text-[1.5vw] min-[1800px]:leading-[3.5rem]'>
            Use our web service to calculate your carbon footprint from the
            transportation of your truck and e-truck.
          </p>
          <Link to='/calculate-emissions'>
            <Button className='bg-black text-white w-fit	md:w-88 text-2xl py-7 px-10'>
              Try it out
            </Button>
          </Link>
        </div>

        <div className='w-full flex items-center mb-8 md:mb-0] md:w-[25rem]'>
          <img
            src={heroImage}
            alt='Man using a calculator'
            className='w-full'
          />
        </div>
      </div>
    </section>
  );
}
