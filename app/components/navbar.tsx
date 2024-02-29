import * as React from 'react';
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
      <header className='px-4 lg:px-6 h-16 flex items-center'>
        <NavigationMenu>
          <NavigationMenuList>
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

