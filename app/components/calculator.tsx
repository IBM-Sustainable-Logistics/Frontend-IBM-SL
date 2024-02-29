import React, { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Label } from "./ui/label.tsx";
import { Combobox } from "./ui/combobox.tsx";
import { Input } from "./ui/input.tsx";

interface FormState {
  transportMethod: string;
  distance: number;
  emissions: number | null;
}

const Calculator = () => {
  const transportMethod = [
    { value: "truck", label: "Truck" },
    { value: "ship", label: "Ship" },
    { value: "aircraft", label: "Aircraft" },
  ];

  const initialFormState: FormState = {
    transportMethod: "car",
    distance: 0,
    emissions: null,
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);

    // Update the corresponding property in the form data
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let calculatedEmissions = 0;
    const distance = Number(formData.distance);

    const emissionFactors = {
      truck: 2.68, // kg CO2e per km
      ship: 3.2, // kg CO2e per km
      aircraft: 2.52, // kg CO2e per km
    };
    const fuelEfficiency = {
      truck: 0.2, // L/km
      ship: 0.02, // tonnes/km
      aircraft: 0.15, // L/km per seat (assuming full occupancy for simplification)
    };
    console.log(formData);
    setShowMessage(true);
    setShowError(false);
    // Calculate the emissions based on the transport method
    switch (formData.transportMethod) {
      case "truck":
        calculatedEmissions = formData.distance *
          fuelEfficiency.truck *
          emissionFactors.truck;
        break;
      case "ship":
        calculatedEmissions = formData.distance *
          fuelEfficiency.ship *
          emissionFactors.ship;
        break;
      case "aircraft":
        calculatedEmissions = formData.distance *
          fuelEfficiency.aircraft *
          emissionFactors.aircraft *
          150; // Assuming 150 seats for simplicity
        break;
      default:
        setErrorMessage("Invalid transportation method selected.");
        setShowError(true);
        return;
    }

    formData.emissions = calculatedEmissions;

    setMessage(
      `Emissions calculated successfully which was ${formData.emissions}`,
    );

    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className=" text-primary text-4xl font-bold">
        Calculate Emissions
      </h1>
      <form onSubmit={handleSubmit}>
        <div className=" flex flex-col gap-4 ">
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Transport Method:
          </Label>
          <Combobox
            options={transportMethod}
            onChangeTransport={handleSelectChange}
            type="transportMethod"
          />
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Distance (km):
          </Label>
          <Input
            type="number"
            id="distance"
            name="distance"
            className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
            onChange={handleInputChange}
          />
          <Button
            className="w-full"
            variant={"ibm_blue"}
            type="submit"
          >
            Calculate
          </Button>
        </div>
      </form>
      {showMessage && (
        <div className="bg-green-200 p-3 mb-3 rounded-md text-green-800 w-[330px]">
          {message}
        </div>
      )}
      {showError && (
        <div className="bg-red-200 p-3 mb-3 rounded-md text-red-800 mt-6 w-[330px]">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Calculator;
