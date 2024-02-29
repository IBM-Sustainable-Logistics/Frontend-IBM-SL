import React from "react";
import { TextGenerateEffect } from "../components/ui/text-generate-effect.tsx";

export default function Hero() {
    const message = "Empowering the future of sustainable logistics with IBM";
    return (
        <section id="hero">
            <div className="w-screen flex">
                <div className="">
                    <div className="w-screen flex flex-col items-center justify-center h-screen">
                        <TextGenerateEffect
                            words={message}
                            className="text-center text-2xl lg:text-4xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
