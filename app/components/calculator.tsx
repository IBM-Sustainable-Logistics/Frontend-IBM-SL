import React, { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Label } from "./ui/label.tsx";
import { Combobox } from "./ui/combobox.tsx";
import { Input } from "./ui/input.tsx";
import { transportMethods } from "../lib/Transport.ts";
import type { TransportListItem } from "../lib/Transport.ts";

interface FormState {
  transportMethod: string;
  distance: number;
  from: string;
  to: string;
  emissions: number | null;
}

type CalculatorProps = {
  isCreateProject: boolean;
};

const Calculator = ({ isCreateProject }: CalculatorProps) => {
  const transportMethod = [
    { value: "cargoship", label: "Cargoship" },
    { value: "aircraft", label: "Aircraft" },
    { value: "train", label: "Train" },
    { value: "truck", label: "Truck" },
  ];

  const initialFormState: FormState = {
    transportMethod: "",
    distance: 0,
    from: "",
    to: "",
    emissions: null,
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [distanceOnly, setDistanceOnly] = useState(false);

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
    if (name === "transportMethod") {
      setDistanceOnly(!(value === "truck" || value === "etruck"));
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const list: TransportListItem[] = [];

      let response;

      // TODO: Maybe refactor all these conditionals

      if (formData.transportMethod === "") {
        setShowError(true);
        setShowMessage(false);
        setErrorMessage("Please choose a Transport Method!");
        return;
      }

      if (
        formData.from == "" &&
        formData.to == "" &&
        formData.distance == null
      ) {
        console.log("all empty");
        if (
          formData.transportMethod === "truck" ||
          formData.transportMethod === "etruck"
        ) {
          setShowError(true);
          setShowMessage(false);
          setErrorMessage(
            "Please specify either origin and destination address or distance!"
          );
          return;
        } else {
          setShowError(true);
          setShowMessage(false);
          setErrorMessage("Please specify a distance!");
          return;
        }
      }

      const usesAddress = formData.from !== "" || formData.to !== "";

      // If we are using addresses
      if (usesAddress) {
        if (
          !(
            formData.transportMethod === "truck" ||
            formData.transportMethod === "etruck"
          )
        ) {
          setShowError(true);
          setShowMessage(false);
          setErrorMessage(
            "Only `Truck` and `Electric Truck` allows for specifying origin and destination address!"
          );
          return;
        }

        if (formData.from == "" || formData.to == "") {
          setShowError(true);
          setShowMessage(false);
          setErrorMessage(
            "Please specify both origin and destination address!"
          );
          return;
        }

        if (formData.distance) {
          setShowError(true);
          setShowMessage(false);
          setErrorMessage(
            "Please specify either origin and destination address or distance, not both!"
          );
          return;
        }

        list.push({
          transport_form: formData.transportMethod,
          from: formData.from,
          to: formData.to,
        });

        response = await fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(list),
        });
      } else {
        if (!formData.distance) {
          setShowError(true);
          setShowMessage(false);
          setErrorMessage("Please specify a distance!");
          return;
        }

        if (formData.distance < 1) {
          setShowError(true);
          setShowMessage(false);
          setErrorMessage("Distance must be greater than 0!");
          return;
        }

        list.push({
          transport_form: formData.transportMethod,
          distance_km: formData.distance,
        });

        response = await fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(list),
        });
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
        usesAddress
          ? `Emissions for ${formData.transportMethod} from ${
              transportMethods[formData.from]
            } to ${formData.to}: ${responseData.total_kg} kg`
          : `Emissions for ${formData.transportMethod} over ${formData.distance} km: ${responseData.total_kg} kg`
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!isCreateProject && (
        <h1 className=" text-primary text-4xl font-bold">
          Calculate Emissions
        </h1>
      )}
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

          {!distanceOnly ? (
            <>
              <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Origin Address:
              </Label>
              <Input
                type="string"
                id="from"
                name="from"
                className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                onChange={handleInputChange}
              />

              <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Destination Address:
              </Label>
              <Input
                type="string"
                id="to"
                name="to"
                className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                onChange={handleInputChange}
              />
            </>
          ) : null}

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
          {!isCreateProject && (
            <Button className="w-full" variant={"ibm_blue"} type="submit">
              Calculate
            </Button>
          )}
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
