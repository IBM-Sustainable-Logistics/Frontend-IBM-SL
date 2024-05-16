import React from "react";
import { Link } from "@remix-run/react";

interface SectionProps {
  backgroundColor: string;
  textColor: string; // Added a new prop
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = (
  { backgroundColor, textColor, children },
) => {
  // Corrected the props destructuring
  const message = "Empowering the future of sustainable logistics with IBM";
  return (
    <section
      id="hero"
      className="w-full"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      {children}
    </section>
  );
};

export default Section;
