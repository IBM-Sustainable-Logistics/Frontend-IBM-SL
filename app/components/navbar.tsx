import { SheetTrigger, SheetContent, Sheet } from "./ui/sheet.tsx";
import { Button } from "./ui/button.tsx";
import { Link } from "@remix-run/react";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.tsx";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu.tsx";

export default function NavBar() {
  return (
    <>
      <header className='px-4 lg:px-6 h-16 flex items-center'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Calculate Emissions
              </NavigationMenuLink>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Transportation
              </NavigationMenuLink>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Data Visualization
              </NavigationMenuLink>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>{" "}
      </header>
    </>
  );
}
