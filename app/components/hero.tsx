import React from "react";
import { TextGenerateEffect } from "../components/ui/text-generate-effect.tsx";
import { Button } from "../components/ui/button.tsx";
import { GitHub } from "../lib/Icons.tsx";
import { Link } from "@remix-run/react";
import env from "../assets/env.svg";

export default function Hero() {
  const message = "Empowering the future of sustainable logistics with IBM";
  return (
    <section id="hero">
      <div className="w-screen flex">
        <div className="">
          <div className="w-screen flex flex-col items-center justify-center h-screen gap-10">
            <img src={env} alt="IBM Logo" className="h-40" />
            <TextGenerateEffect
              words={message}
              className="text-center text-2xl lg:text-4xl"
            />
            <Link to="https://github.com/IBM-Sustainable-Logistics">
              <Button variant={"ibm_blue"} className="flex gap-2">
                {GitHub()} View on Github
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
