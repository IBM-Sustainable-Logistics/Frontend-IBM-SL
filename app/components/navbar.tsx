import { SheetTrigger, SheetContent, Sheet } from "./ui/sheet.tsx";
import { Button } from "./ui/button.tsx";
import { Link } from "@remix-run/react";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.tsx";

export default function NavBar() {
  return (
    <>
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center " to="/"></Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Popover>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
          </Popover>
        </nav>
      </header>
    </>
  );
}
