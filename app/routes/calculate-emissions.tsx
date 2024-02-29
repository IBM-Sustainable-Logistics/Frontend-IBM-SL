import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from "../components/ui/navigation-menu.tsx";

const CalculateEmissionsPage = () => {
  const [transportMethod, setTransportMethod] = useState("");
  const [distance, setDistance] = useState(0);
  const [emissions, setEmissions] = useState<number | null>(null);

  const calculateEmissions = () => {
    // We just log the values for now
    console.log(
      `Calculating emissions for ${distance} km using ${transportMethod}`,
    );
    // This is a placeholder for emissions calculation
    const calculatedEmissions = distance * 0.2;
    setEmissions(calculatedEmissions);
  };

  return (
    <div>
      <NavigationMenu>
        <NavigationMenuItem>
          <NavigationMenuLink as="a" href="/calculate-emissions">
            Calculate Emissions
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>

      <h1>Calculate Emissions</h1>
      <div>
        <label htmlFor="transport-method">Transport Method:</label>
        <select
          id="transport-method"
          value={transportMethod}
          onChange={(e) => setTransportMethod(e.target.value)}
        >
          <option value="car">Truck</option>
          <option value="bus">Aircraft</option>
          <option value="train">Ship</option>
        </select>
      </div>
      <div>
        <label htmlFor="distance">Distance (km):</label>
        <input
          type="number"
          id="distance"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
        />
      </div>
      <button onClick={calculateEmissions}>Calculate</button>

      {emissions !== null && (
        <p>
          Estimated Emissions: {emissions} kg of CO<sub>2</sub>
        </p>
      )}
    </div>
  );
};

export default CalculateEmissionsPage;
