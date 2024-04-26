import { Button } from "./ui/button.tsx";
import { Link, useOutletContext } from "@remix-run/react";
import React, { SVGProps, useState } from "react";
import logo from "../assets/ibm-logo.svg";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx";
import type {
  Session,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.39.7";
import calc from "../assets/CALC.svg";

interface NavBar {
  serverSession: Session | null;
  supabase: any;
}

export const NavBar = ({ serverSession, supabase }: NavBar) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  const navElem = [
    {
      value: "Calculate Emissions",
      href: "/calculate-emissions",
    },
    {
      value: "Dashboard",
      href: "/projects",
    },
  ];

  return (
    <>
      <header
        key="1"
        className="flex h-20 w-full shrink-0 items-center px-4 md:px-6"
      >
        <Link className="mr-6 flex items-center" to="/">
          <img src={calc} alt="IBM Logo" className=" h-14 ml-5" />
        </Link>
        <nav className="lg:flex lg:gap-5 lg:items-center hidden">
          <NavigationMenu className="invisible lg:visible px-4 lg:px-6 h-16 flex">
            <NavigationMenuList>
              {navElem.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    as="a"
                    href={item.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {item.value}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="ml-auto">
          <div className="lg:block hidden mt-10">
            <div className="flex gap-4">
              {serverSession ? (
                <Button onClick={handleSignOut}>Sign out</Button>
              ) : (
                <>
                  <Link to={"/signin"}>
                    <Button className="lg:block" variant="default">
                      Sign In
                    </Button>{" "}
                  </Link>
                  <Link to={"/signup"}>
                    <Button className="lg:block" variant="default">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
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
              "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 lg:hidden"
            }
          >
            <ScrollArea className="h-[300px] px-1 ">
              <div className="space-y-1 p-2 ">
                {navElem.map((item, index) => (
                  <Link to={item.href}>
                    <Button
                      key={index}
                      className="w-full justify-start font-normal bg-slate-50 text-black"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.value}
                    </Button>
                  </Link>
                ))}
                <div className="flex gap-4 justify-center items-center">
                  {serverSession ? (
                    <Button onClick={handleSignOut}>Sign out</Button>
                  ) : (
                    <>
                      <Link to={"/signin"}>
                        <Button
                          className="lg:block"
                          variant="default"
                          onClick={() => setIsOpen(false)}
                        >
                          Sign In
                        </Button>{" "}
                      </Link>
                      <Link to={"/signup"} onClick={() => setIsOpen(false)}>
                        <Button className="lg:block" variant="default">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </header>
    </>
  );
};

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
