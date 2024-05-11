import React from "react";
import Hero from "../components/hero.tsx";

const privacy = () => {
  return (
    <main
      className='flex flex-col justify-center items-center mb-16 mt-10 bg-background gap-16 
      md:mt-20
      md:gap-32'
    >
      <Hero
        jsx={(<>
          <h1 className='text-4xl lg:text-[3vw] leading-[3rem] font-bold min-[1800px]:leading-[4.25rem]'>
            We value your privacy.
          </h1>
          <p className='text-2xl lg:text-[1.5vw] min-[1800px]:leading-[3.5rem]'>
            No information or data that you share with us will be shared with anyone else.
          </p>
          <p className='text-2xl lg:text-[1.5vw] min-[1800px]:leading-[3.5rem]'>
            The only information that we keep about your is the information needed to allow you to log into your account and save your projects.
            As soon as your account is deleted, any information about your account is deleted from our database.
          </p>
        </>)}
      />
    </main>
  );
};

export default privacy;
