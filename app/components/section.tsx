import React from "react";
import { Link } from "@remix-run/react";

interface SectionProps {
    backgroundColor: string;
    textColor: string; // Added a new prop
}

const Section: React.FC<SectionProps> = ({ backgroundColor, textColor }) => { // Corrected the props destructuring
    const message = "Empowering the future of sustainable logistics with IBM";
  return (
    <section
      id='hero'
      className='w-full'
      style={{ backgroundColor: backgroundColor, color: textColor}}
    >
      <div className="text-center mx-[2rem] lg:mx-[18rem] my-[2.5rem] flex flex-col gap-2">
         <h1 className='text-4xl lg:text-[2.5rem] leading-10 font-bold'>
        Our vision</h1>
      <p className="text-[1.1rem] text-left lg:text-[1.2rem] ">
        Our goal is to make it easy and quick for companies and other groups to
        measure their CO2 emissions. This will help companies report their
        environmental impact more accurately, and together we can work towards a
        more sustainable future.
      </p>
      </div>
    </section>
  );
}

export default Section;