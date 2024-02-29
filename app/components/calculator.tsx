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
    { value: "container-vessel", label: "Container Vessel" },
    { value: "road", label: "Road" },
    { value: "rail", label: "Rail" },
    { value: "air", label: "Air" },
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // We just log the values for now
    setMessage(
      `Calculating emissions for ${formData.distance} km using ${formData.transportMethod}`
    );
    setShowMessage(true);
    setShowError(false);
    // This is a placeholder for emissions calculation
    const calculatedEmissions = formData.distance * 0.2;

    formData.emissions = calculatedEmissions;

    setMessage(
      `Emissions calculated successfully which was ${formData.emissions}`
    );

    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className=" text-primary text-4xl font-bold">Calculate Emissions</h1>
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
          <Button className="w-full" variant={"ibm_blue"} type="submit">
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
