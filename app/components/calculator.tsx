import React, { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Label } from "./ui/label.tsx";
import { Combobox } from "./ui/combobox.tsx";
import { Input } from "./ui/input.tsx";
import { transportMethods, TransportMethod, TruckTransportMethod } from "../lib/Transport.ts";
import { isTruckTransportMethod, getTransportMethodLabel } from "../lib/Transport.ts";
import { Address, Stage } from "../lib/Transport.ts";

/* Termonology:
 * - Stage:
 *      A part of a route that has a transport method and either
 *      a distance or an origin and destination address.
 *      It can only use addresses if the transport method id a
 *      truck transport method.
 *
 * - Address:
 *      A city and optionally a country.
 *
 * - Transport method
 *      A method of transport, e.g. "truck", "train", "aircraft".
 *
 * - Truck transport method:
 *      A transport method that can use addresses, e.g. "truck".
 */          

type Estimate = {
  total: number,
  perStage: number[],
};

type FormData = {
  stages: Stage[],
  emissions: {
    totalKg: number,
    stages: {
      kg: number,
      transportMethod: TransportMethod,
    }[],
  },
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
  const [message,      setMessage]      = useState("");
  const [showMessage,  setShowMessage]  = useState(false);
  const [showError,    setShowError]    = useState(false);

  /**
   * Given an index of a stage, returns a combobox onChange
   * function that updates the stage's transportMethod.
   */
  const onTransportMethodChange = (index: number) =>
    (_comboboxType: string, comboboxValue: TransportMethod): void => {
      setFormData((old: FormData): FormData => {
        const stage: Stage = old.stages[index];

        // if the old stage used addresses
        if (stage.usesAddress) {
          // and if the new transport method allows for addresses
          if (isTruckTransportMethod(comboboxValue)) {
            // then keep the addresses
            return {
              ...old,
              stages: old.stages.with(index, {
                usesAddress: true,
                transportMethod: comboboxValue as TruckTransportMethod,
                from: stage.from,
                to: stage.to,
              }),
            };
          }
          // but if the new transport method does not allow for addresses
          else {
            // then use default distance of 0
            return {
              ...old,
              stages: old.stages.with(index, {
                usesAddress: false,
                transportMethod: comboboxValue,
                distance: 0,
              }),
            };
          }
        }
        // or if the old stage used distance
        else {
          // then keep the distance
          return {
            ...old,
            stages: old.stages.with(index, {
              usesAddress: false,
              transportMethod: comboboxValue,
              distance: stage.distance,
            }),
          };
        }
      });
    };

  interface EventTarget { name: string, value: string }

  /**
   * Given an index of a stage, returns an input onChange
   * function that updates the stage's address.
   *
   * The place parameter determines whether the city or
   * country part of the address should be updated.
   */
  const onAddressChange = (index: number, place: "city" | "country") =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name: inputName, value: inputValue } = e.target as EventTarget;

      setFormData((old: FormData): FormData => {
        const stage: Stage = { ...old.stages[index] };

        if (!stage.usesAddress)
          throw new Error("Stage uses distance");

        // check which address to update
        const addressToUpdate = inputName === "from"
          ? stage.from
          : stage.to;

        // either update the city or country
        if (place === "city")
          addressToUpdate.city = inputValue;
        else
          addressToUpdate.country = inputValue;

        return {
          ...old,
          stages: old.stages.with(index, stage),
        };
      });
    };

  /**
   * Given an index of a stage, returns an input onChange
   * function that updates the stage's distance.
   */
  const onDistanceChange = (index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target as EventTarget;

      setFormData((old: FormData): FormData => {
        const stage: Stage = old.stages[index];
        
        if (stage.usesAddress)
          throw new Error("Stage uses addresses");

        return {
          ...old,
          stages: old.stages.with(index, {
            usesAddress: stage.usesAddress,
            transportMethod: stage.transportMethod,
            distance: Number(inputValue),
          }),
        };
      });
    };

  /**
   * Given an index of a stage, returns a button onClick
   * function that changes wether that stage uses addresses
   * or distances.
   */
  const onToggleUsesAddress = (index: number, use: "address" | "distance") =>
    () => {
      setFormData((old: FormData): FormData => {
        const stage: Stage = old.stages[index];

        // if we want to change stage to use addresses
        if (use === "address") {
          if (stage.usesAddress)
            throw new Error("Stage already uses addresses");

          if (!isTruckTransportMethod(stage.transportMethod))
            throw new Error("Stage uses non-truck transport method");

          return {
            ...old,
            stages: old.stages.with(index, {
              usesAddress: true,
              transportMethod: stage.transportMethod as TruckTransportMethod,
              from: { city: "", country: "" },
              to: { city: "", country: "" },
            }),
          };
        }
        // or if we want to change stage to use distances
        else {
          if (!stage.usesAddress)
            throw new Error("Stage already uses distances");

          return {
            ...old,
            stages: old.stages.with(index, {
              usesAddress: false,
              transportMethod: stage.transportMethod,
              distance: 0,
            }),
          };
        }
      });
    };

  /**
   * Given an index of a stage, returns a button onClick
   * function that inserts a new stage at the given index.
   *
   * The new stage will be a copy of the stage before it,
   * except distances will be reset.
   *
   * Though, if the stage before it uses addresses then
   * its destination address will be used as the new
   * stage's origin address, and the new stage's
   * destination address will be empty.
   *
   * If the index is -1, the new stage is inserted as the
   * first stage.
   */
  const onInsertAfter = (index: number | -1) => {
    setFormData((old: FormData): FormData => {
      // if index is -1, insert as first stage
      if (index === -1)
        return {
          ...old,
          stages: [
            {
              usesAddress: true,
              transportMethod: "truck",
              from: { city: "", country: "" },
              to: { city: "", country: "" },
            },
            ...old.stages,
          ],
        };

      const beforeStage = old.stages[index];

      let newStage: Stage = beforeStage.usesAddress
        ? {
          usesAddress: true,
          transportMethod: beforeStage.transportMethod,
          from: beforeStage.to,
          to: { city: "", country: "" },
        }
        : {
          usesAddress: false,
          transportMethod: beforeStage.transportMethod,
          distance: 0,
        };

      return {
        ...old,
        stages: [
          ...old.stages.slice(0, index + 1),
          newStage,
          ...old.stages.slice(index + 1),
        ],
      };
    });
  };

  /**
   * Given an index of a stage, returns a button onClick
   * function that removes the stage at the given index.
   */
  const handleRemoveStage = (index: number) =>
    () => {
      setFormData((old: FormData): FormData => {
        return {
          ...old,
          stages: [
            ...old.stages.slice(0, index),
            ...old.stages.slice(index + 1),
          ],
        };
      });
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      type Input = ({
        transport_form: string,
      } & ({
        from: { city: string, country: string },
        to: { city: string, country: string },
      } | {
        distance_km: number,
      }))[]

      const input: Input = formData.stages.map((stage: Stage) =>
        stage.usesAddress
          ? {
              transport_form: stage.transportMethod,
              from: stage.from,
              to: stage.to,
            }
          : {
              transport_form: stage.transportMethod,
              distance_km: stage.distance,
            }
      );

      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        setShowError(true);
        setShowMessage(false);
        setErrorMessage("Error! Please try again");
        throw new Error("Error! Got response code: " + response.status + " " + await response.text());
      }

      type Output = {
        total_kg: number,
        stages: { kg: number, transport_form: string }[],
      };

      const output: Output = await response.json();
      setFormData((old: FormData): FormData => ({
        ...old,
        emissions: {
          totalKg: output.total_kg,
          stages: output.stages.map((stage) => ({
            kg: stage.kg,
            transportMethod: stage.transport_form as TransportMethod,
          })),
        }
      }));

      setMessage("Total estimated CO2 emission: " + output.total_kg + " kg.");
      setShowMessage(true);
      setShowError(false);
    }
    catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={
        isCreateProject
          ? "justify-center items-center flex flex-col gap-4 "
          : "flex flex-col gap-4 "
      }
    >
      <h1 className=" text-primary text-4xl font-bold">Calculate Emissions</h1>
      <form onSubmit={onSubmit}>
        <Button
          className="w-full"
          variant={"secondary"}
          type="button"
          onClick={onInsertAfter(-1)}
        >
          Add Stage
        </Button>

        {formData.stages.map((stage: Stage, index: number) => (
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
              type="transportMethod"
              onChangeTransport={onTransportMethodChange(index)}
            />

            {stage.usesAddress
              ? (<>
                  <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Origin Address:
                  </Label>
                  <Input
                    type="string"
                    id="from"
                    name="from"
                    className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                    placeholder="City"
                    onChange={onAddressChange(index, "city")}
                  />
                  <Input
                    type="string"
                    id="from"
                    name="from"
                    className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                    placeholder="Country"
                    onChange={onAddressChange(index, "country")}
                  />

                  <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Destination Address:
                  </Label>
                  <Input
                    type="string"
                    id="to"
                    name="to"
                    className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                    placeholder="City"
                    onChange={onAddressChange(index, "city")}
                  />
                  <Input
                    type="string"
                    id="to"
                    name="to"
                    className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                    placeholder="Country"
                    onChange={onAddressChange(index, "country")}
                  />

                  {isTruckTransportMethod(stage.transportMethod)
                    ? (<>
                        <Button
                          className="w-full"
                          variant={"secondary"}
                          type="button"
                          onClick={onToggleUsesAddress(index, "distance")}
                        >
                          Use Distance?
                        </Button>
                      </>)
                    : null
                  }
                </>)
              : (<>
                  <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Distance (km):
                  </Label>
                  <Input
                    type="number"
                    id="distance"
                    name="distance"
                    className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                    onChange={onDistanceChange(index)}
                  />

                  {isTruckTransportMethod(stage.transportMethod)
                    ? (<>
                        <Button
                          className="w-full"
                          variant={"secondary"}
                          type="button"
                          onClick={onToggleUsesAddress(index, "address")}
                        >
                          Use Addresses?
                        </Button>
                      </>)
                    : null
                  }
                </>)
            }

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

            <Button
              className="w-full"
              variant={"secondary"}
              type="button"
              onClick={onInsertAfter(index)}
            >
              Add Stage
            </Button>
          </div>
        ))}
        <Button className="w-full mt-5" variant={"ibm_blue"} type="submit">
          Calculate
        </Button>
      </form>

      {showMessage && (
        <div className="bg-green-200 p-3 mb-3 rounded-md text-green-800 w-[330px] ">
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
