import { SheetTrigger, SheetContent, Sheet } from "./ui/sheet.tsx";
import { Button } from "./ui/button.tsx";
import { Link } from "@remix-run/react";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.tsx";

export default function NavBar() {
  return (
    <>
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <img />
        <nav className="ml-auto flex gap-4 sm:gap-6"></nav>
      </header>
    </>
  );
}
