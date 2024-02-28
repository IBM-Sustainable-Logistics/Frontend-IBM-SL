import React, { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Label } from "./ui/label.tsx";
import { Combobox } from "./ui/combobox.tsx";

interface FormState {
  transportMethod: string;
  distance: number;
  emissions: number | null;
}

const Calculator = () => {
  const transportMethod = [
    { value: "boat", label: "Boat" },
    { value: "truck", label: "Truck" },
    { value: "ship", label: "Ship" },
  ];

  const initialFormState: FormState = {
    transportMethod: "car",
    distance: 0,
    emissions: null,
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // We just log the values for now
    console.log(
      `Calculating emissions for ${formData.distance} km using ${formData.transportMethod}`
    );
    // This is a placeholder for emissions calculation
    const calculatedEmissions = formData.distance * 0.2;
    formData.emissions = calculatedEmissions;
  };

  return (
    <div className="flex flex-col gap-20 ">
      <h1 className=" text-primary text-4xl font-bold">Calculate Emissions</h1>
      <form onSubmit={handleSubmit}>
        <div className=" flex flex-col gap-4">
          <div className="flex flex-col ">
            <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Transport Method:
            </Label>
            <Combobox
              options={transportMethod}
              onChangeTransport={handleSelectChange}
              type="transportMethod"
            />
          </div>

          <label htmlFor="distance">Distance (km):</label>
          <input
            type="number"
            id="distance"
            className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
            onChange={handleInputChange}
          />
          <Button className="w-full" variant={"ibm_blue"} type="submit">
            Calculate
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Calculator;
