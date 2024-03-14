import React, { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Label } from "./ui/label.tsx";
import { Combobox } from "./ui/combobox.tsx";
import { Input } from "./ui/input.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx"
import { transportMethods } from "../lib/Transport.ts";
import type { TransportListItem } from "../lib/Transport.ts";


interface FormState {
  transportMethod: string;
  distance: number;
  emissions: number | null;
}

const Calculator = () => {
  const initialFormState: FormState = {
    transportMethod: "",
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

    // Update the corresponding property in the form data
    setFormData({
      ...formData,
      [name]: name === "distance" ? Number(value) : value,
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

    try {
      const list: TransportListItem[] = [
        {
          transport_form: formData.transportMethod,
          distance_km: formData.distance,
        },
      ];

      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      if (formData.transportMethod === "" || !formData.distance) {
        setShowError(true);
        setShowMessage(false);
        setErrorMessage("Please fill in all fields!");
        return;
      }

      if (formData.distance < 1) {
        setShowError(true);
        setShowMessage(false);
        setErrorMessage("Distance must be greater than 0!");
        return;
      }

      if (!response.ok) {
        setShowError(true);
        setShowMessage(false);
        setErrorMessage("Error! Please try again");
        throw new Error("Error! Got response: " + response.status);
      }

      const responseData = await response.json();
      setFormData({ ...formData, emissions: responseData });
      setShowMessage(true);
      setShowError(false);
      setMessage(
        `Emissions for ${formData.transportMethod} over ${formData.distance} km: ${responseData.total_kg} kg`
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
//<div className=" min-h-screen flex items-center justify-center">
  return (
    <div className="flex flex-row h-screen">
      <div className="basis-2/3 flex justify-center items-center">
        <div className="flex flex-col gap-4 ">
          <h1 className=" text-primary text-4xl font-bold">Calculate Emissions</h1>
          <form onSubmit={handleSubmit}>
            <div className=" flex flex-col gap-4 ">
              <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Transport Method:
              </Label>
              <Combobox
                options={transportMethods}
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
      </div>
      <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 basis-1/3 h-screen">
        <div className="border border-black p-5 my-5">
          <h1 className="text-2xl font-bold">Total Emissions</h1>
          <p className="text-xl font-bold"> 25 Kg</p>
        </div>

        <hr></hr>

        <div className="border border-black p-5 my-5">
          <h1 className="text-2xl font-bold">Train</h1>
          <div className="flex flex-row justify-between">
            <p className="text-lg">Distance</p>
            <p className="text-lg">50 km</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-lg">Emissions</p>
            <p className="text-lg">13 kg</p>
          </div>
        </div>

        <Button className="w-full" variant={"ibm_blue"} type="submit">
          Add Another
        </Button>
      </ScrollArea>
    </div>
  );
};

export default Calculator;
