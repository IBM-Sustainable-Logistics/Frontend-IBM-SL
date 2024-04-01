import React, { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Label } from "./ui/label.tsx";
import { Combobox } from "./ui/combobox.tsx";
import { Input } from "./ui/input.tsx";
import { transportMethods } from "../lib/Transport.ts";
import type { TransportListItem } from "../lib/Transport.ts";

type FormStage = {
  transportMethod: string;
  distance?: number;
  from: string;
  to: string;
};

type FormData = {
  stages: FormStage[];
  emissions: number | null;
};

type CalculatorProps = {
  isCreateProject: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

const Calculator = ({
  isCreateProject,
  formData,
  setFormData,
}: CalculatorProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [distanceOnly, setDistanceOnly] = useState([false]);

  const handleInputChange =
    (index: number) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setFormData((prev: FormData) => {
        const newFormData = [...prev.stages];
        newFormData[index] = {
          ...newFormData[index],
          [name]: name === "distance" ? Number(value) : value,
        };
        return { ...prev, stages: newFormData };
      });
    };

  const handleSelectChange =
    (index: number) => (name: string, value: string) => {
      let emptyAddresses = false;

      if (name === "transportMethod") {
        const isTruck = !(value === "truck" || value === "etruck");
        emptyAddresses = !isTruck;

        setDistanceOnly((prev: boolean[]) => {
          const newDistanceOnly = [...prev];
          newDistanceOnly[index] = isTruck;
          return newDistanceOnly;
        });
      }

      setFormData((prev: FormData) => {
        const newFormData = [...prev.stages];
        newFormData[index] = {
          ...newFormData[index],
          [name]: value,
        };
        if (emptyAddresses) {
          newFormData[index].from = "";
          newFormData[index].to = "";
        }
        return { ...prev, stages: newFormData };
      });
    };

  const handleAddStage = () => {
    setFormData((prev: FormData) => {
      return {
        ...prev,
        stages: [
          ...prev.stages,
          {
            transportMethod: "",
            distance: 0,
            from: "",
            to: "",
          },
        ],
      };
    });

    setDistanceOnly((prev: boolean[]) => {
      return [...prev, false];
    });
  };

  const handleRemoveStage = (index: number) => () => {
    setFormData((prev: FormData) => {
      const newFormData = [...prev.stages];
      newFormData.splice(index, 1);
      return { ...prev, stages: newFormData };
    });

    setDistanceOnly((prev: boolean[]) => {
      const newDistanceOnly = [...prev];
      newDistanceOnly.splice(index, 1);
      return newDistanceOnly;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const list: TransportListItem[] = [];

      for (let index = 0; index < formData.stages.length; index++) {
        const stage = formData.stages[index];

        // TODO: Maybe refactor all these conditionals

        if (stage.transportMethod === "") {
          setShowError(true);
          setShowMessage(false);
          setErrorMessage(
            "Please choose a Transport Method for stage " + (index + 1)
          );
          return;
        }

        if (stage.from == "" && stage.to == "" && stage.distance == "") {
          if (
            stage.transportMethod === "truck" ||
            stage.transportMethod === "etruck"
          ) {
            setShowError(true);
            setShowMessage(false);
            setErrorMessage(
              "Please specify either origin and destination address or distance for stage " +
                (index + 1)
            );
            return;
          } else {
            setShowError(true);
            setShowMessage(false);
            setErrorMessage(
              "Please specify a distance for stage " + (index + 1)
            );
            return;
          }
        }

        const usesAddress =
          distanceOnly[index] && (stage.from !== "" || stage.to !== "");

        // If we are using addresses
        if (usesAddress) {
          if (
            !(
              stage.transportMethod === "truck" ||
              stage.transportMethod === "etruck"
            )
          ) {
            setShowError(true);
            setShowMessage(false);
            setErrorMessage(
              "Only `Truck` and `Electric Truck` allows for specifying origin and destination address for stage " +
                (index + 1)
            );
            return;
          }

          if (stage.from == "" || stage.to == "") {
            setShowError(true);
            setShowMessage(false);
            setErrorMessage(
              "Please specify both origin and destination address for stage " +
                (index + 1)
            );
            return;
          }

          if (stage.distance) {
            setShowError(true);
            setShowMessage(false);
            setErrorMessage(
              "Please specify either origin and destination address or distance, not both, for stage " +
                (index + 1)
            );
            return;
          }

          list.push({
            transport_form: stage.transportMethod,
            from: stage.from,
            to: stage.to,
          });
        }
        // If we are using distances
        else {
          if (!stage.distance) {
            setShowError(true);
            setShowMessage(false);
            setErrorMessage(
              "Please specify a distance for stage " + (index + 1)
            );
            return;
          }

          if (stage.distance < 1) {
            setShowError(true);
            setShowMessage(false);
            setErrorMessage(
              "Distance must be greater than 0 for stage " + (index + 1)
            );
            return;
          }

          list.push({
            transport_form: stage.transportMethod,
            distance_km: stage.distance,
          });
        }
      }

      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });

      if (!response.ok) {
        setShowError(true);
        setShowMessage(false);
        setErrorMessage("Error! Please try again");
        throw new Error("Error! Got response: " + response.status);
      }

      const responseData = await response.json();
      setFormData({ ...formData, emissions: responseData.total_kg });
      setShowMessage(true);
      setShowError(false);
      setMessage(
        `Estimated CO2 emission for specified route: ${responseData.total_kg} kg`
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
        {[...Array(formData.stages.length)].map((_, index) => (
          <div className=" flex flex-col gap-4 ">
            <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {formData.stages.length <= 1 ? (
                <>Transport Method:</>
              ) : (
                <>Route Stage {index + 1}:</>
              )}
            </Label>
            <Combobox
              options={transportMethods}
              onChangeTransport={handleSelectChange(index)}
              type="transportMethod"
            />

            {!distanceOnly[index] ? (
              <>
                <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Origin Address:
                </Label>
                <Input
                  type="string"
                  id="from"
                  name="from"
                  className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                  onChange={handleInputChange(index)}
                />

                <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Destination Address:
                </Label>
                <Input
                  type="string"
                  id="to"
                  name="to"
                  className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                  onChange={handleInputChange(index)}
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
              onChange={handleInputChange(index)}
            />

            {formData.stages.length <= 1 ? null : (
              <Button
                onClick={handleRemoveStage(index)}
                className="w-full"
                variant={"destructive"}
                type="button"
              >
                Remove Stage
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={handleAddStage}
          className="w-full"
          variant={"secondary"}
          type="button"
        >
          Add Stage
        </Button>
        {!isCreateProject && (
          <Button className="w-full" variant={"ibm_blue"} type="submit">
            Calculate
          </Button>
        )}
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
