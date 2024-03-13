import { SheetTrigger, SheetContent, Sheet } from "./ui/sheet.tsx";
import { Button } from "./ui/button.tsx";
import { Link } from "@remix-run/react";
import React, { SVGProps, useState } from "react";
import logo from "../assets/ibm-logo.svg";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu.tsx";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header
        key="1"
        className="flex h-20 w-full shrink-0 items-center px-4 md:px-6"
      >
        <Link className="mr-6 flex items-center" to="#">
          <ScaleIcon className="h-6 w-6" />
          <span className="sr-only">Kunan AI</span>
        </Link>
        <nav className="lg:flex lg:gap-5 lg:items-center hidden">
          <NavigationMenu className="invisible lg:visible px-4 lg:px-6 h-16 flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  as="a"
                  href="/"
                  className={navigationMenuTriggerStyle()}
                >
                  <img src={logo} alt="IBM Logo" className="h-5" />
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  as="a"
                  href="/calculate-emissions"
                  className={navigationMenuTriggerStyle()}
                >
                  Calculate Emissions
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  as="a"
                  href="/projects"
                  className={navigationMenuTriggerStyle()}
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  as="a"
                  href="/data-visualization"
                  className={navigationMenuTriggerStyle()}
                >
                  Data Visualization
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  Item One
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink as="a" href="/link1">
                    Link One
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="ml-auto">
          <Button
            className="rounded-full lg:hidden"
            size="icon"
            variant="ghost"
            onClick={toggleMenu}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
          <Button
            className="rounded-full hidden lg:block"
            size="icon"
            variant="ghost"
          >
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>

        {isOpen && (
          <div
            className={
              "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
            }
          ></div>
        )}
      </header>
    </>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function ScaleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}
