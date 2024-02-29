import * as React from 'react';
import logo from "../assets/ibm-logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu.tsx';

export default function NavBar() {
  return (
    <>
      <header >
        <NavigationMenu className='px-4 lg:px-6 h-16 flex '>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink as="a" href="/" className={navigationMenuTriggerStyle()}>
                <img src={logo} alt="IBM Logo" className="h-5" />
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink as="a" href="/calculate-emissions" className={navigationMenuTriggerStyle()}>
                Calculate Emissions
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink as="a" href="/transportation" className={navigationMenuTriggerStyle()}>
                Transportation
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink as="a" href="/data-visualization" className={navigationMenuTriggerStyle()}>
                Data Visualization
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink as="a" href="/link1">Link One</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    </>
  );
}

