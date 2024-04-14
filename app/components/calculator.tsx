import React, { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Label } from "./ui/label.tsx";
import { Combobox, ComboboxOption } from "./ui/combobox.tsx";
import AutoSuggest from "react-autosuggest";
import { Input } from "./ui/input.tsx";
import { Link } from "@remix-run/react";
import {
  Address,
  Stage,
  TransportMethod,
  TruckTransportMethod,
  getTransportMethodLabel,
  isTruckTransportMethod,
  transportMethods,
  truckTransportMethods,
} from "../lib/Transport.ts";

/* Termonology:
 * - Stage:
 *      A part of a route that has a transport method and
 *      either a distance or an origin and destination
 *      address. It can only use addresses if the transport
 *      method id a truck transport method.
 *
 * - Address:
 *      A city and optionally a country.
 *
 * - Transport method
 *      A method of transport, e.g: "truck", "train",
 *
 * - Truck transport method:
 *      A transport method that allows addresses,
 *      specifically "truck" and "etruck".
 */

/**
 * Reach requires that every html element in a list has a
 * unique key. This type is simply used to add a key field.
 */
type Keyed = {
  key: number;
};

// allows us to show errors to specific stages
type StageError = "no such from address" | "no such to address";

type Errored = {
  error?: StageError;
};

export type FormData = {
  stages: (Stage & Keyed & Errored)[];
  emissions:
  | {
    totalKg: number;
    stages: {
      kg: number;
      transportMethod: TransportMethod;
    }[];
  }
  | undefined;
};

export const defaultFormData = (from?: Address, to?: Address): FormData => ({
  stages: [
    {
      usesAddress: true,
      transportMethod: "truck",
      from: from ? from : { city: "", country: "" },
      to: to ? to : { city: "", country: "" },
      key: Math.random(),
      error: undefined,
    },
  ],
  emissions: undefined,
});

const transportMethodOptions: ComboboxOption[] = truckTransportMethods.map(
  (method) => ({
    value: method,
    label: getTransportMethodLabel(method),
  }),
);

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
  const [error, setError] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [hasReceivedFile, setIsReceived] = useState(false);


  /**
   * Given an index of a stage, returns a combobox onChange
   * function that updates the stage's transportMethod.
   */
  const onTransportMethodChange =
    (index: number) => (_: string, comboboxValue: TransportMethod): void => {
      setFormData((old: FormData): FormData => {
        const stage = old.stages[index];

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
                key: stage.key,
                error: stage.error === "no such from address" ||
                  stage.error === "no such to address"
                  ? stage.error
                  : undefined,
              }),
            };
          } // but if the new transport method does not allow for addresses
          else {
            // then use default distance of 0
            return {
              ...old,
              stages: old.stages.with(index, {
                usesAddress: false,
                transportMethod: comboboxValue,
                distance: 0,
                key: old.stages[index].key,
                error: undefined,
              }),
            };
          }
        } // or if the old stage used distance
        else {
          // then keep the distance
          return {
            ...old,
            stages: old.stages.with(index, {
              usesAddress: false,
              transportMethod: comboboxValue,
              distance: stage.distance,
              key: old.stages[index].key,
              error: undefined,
            }),
          };
        }
      });
    };

  /**
   * Given an index of a stage and whether it should use
   * the from or to address, returns an auto-suggest
   * onSuggestionsFetchRequested that updates the current
   * suggestions.
   */
  const onSuggestionsRequested =
    (index: number, fromOrTo: "from" | "to") =>
      async ({ value }: { value: string }) => {
        const stage = formData.stages[index];

        if (!stage.usesAddress) throw new Error("Stage uses distance");

        setError(undefined);

        if (value.length === 0) {
          setSuggestions([]);
          return;
        }

        /** The json schema that the back-end uses for the input. */
        type Input = {
          city: string;
          country?: string;
        };

        const address: Address = fromOrTo === "from" ? stage.from : stage.to;

        const input: Input = {
          city: address.city,
          country: address.country,
        };

        const response = await fetch("/api/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          console.error(
            "Error! Got response code: " +
            response.status +
            " " +
            (await response.text()),
          );
        }

        /** The json schema that the back-end uses for the output. */
        type Output = {
          city: string;
          country: string;
        }[];

        const output: Output = await response.json();

        if (output.length === 0) {
          setFormData((old: FormData): FormData => {
            const stage = { ...old.stages[index] };

            if (!stage.usesAddress) throw new Error("Stage uses distance");

            return {
              ...old,
              stages: old.stages.with(index, {
                ...stage,
                error: fromOrTo === "from"
                  ? "no such from address"
                  : "no such to address",
              }),
            };
          });

          setSuggestions([]);
          return;
        }

        setFormData((old: FormData): FormData => {
          const stage = old.stages[index];

          return {
            ...old,
            stages: old.stages.with(index, {
              ...stage,
              error: stage.error === "no such from address" ||
                stage.error === "no such to address"
                ? undefined
                : stage.error,
            }),
          };
        });

        setSuggestions(output);
      };

  /**
   * TODO
   */
  const onSuggestionSelected = (index: number, fromOrTo: "from" | "to") => (_: any, { suggestion }: { suggestion: Address }) => {
    setFormData((old: FormData): FormData => {
      const stage = { ...old.stages[index] };

      if (!stage.usesAddress) throw new Error("Stage uses distance");

      if (fromOrTo === "from")
        stage.from = suggestion;
      else
        stage.to = suggestion;

      return {
        ...old,
        stages: old.stages.with(index, stage),
      };
    });
  };

  /**
   * TODO
   */
  const renderSuggestion = (place: "city" | "country") =>
    (
      suggestion: Address,
      { query: inputValue, isHighlighted }: {
        query: string;
        isHighlighted: boolean;
      },
    ) => {
      const city = place === "city"
        ? (
          <>
            <b>{inputValue}</b>
            {suggestion.city.slice(inputValue.length)}
          </>
        )
        : <>{suggestion.city}</>;

      const country = place === "country"
        ? (
          <>
            <b>{inputValue}</b>
            {suggestion.country.slice(inputValue.length)}
          </>
        )
        : <>{suggestion.country}</>;

      return (
        <span className={isHighlighted ? "bg-blue-200" : ""}>
          {city}, {country}
        </span>
      );
    };

  interface EventTarget {
    value?: string;
  }

  /**
   * Given an index of a stage, whether it refers to the
   * from or to address, and whether it the city input or
   * country input, returns an input onChange function that
   * updates the stage's address.
   *
   * The place parameter determines whether the city or
   * country part of the address should be updated.
   */
  const onAddressChange =
    (index: number, fromOrTo: "from" | "to", place: "city" | "country") =>
      (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { value: inputValue } = event.target as EventTarget;

        if (inputValue === undefined) return;

        setFormData((old: FormData): FormData => {
          const stage = { ...old.stages[index] };

          if (!stage.usesAddress) throw new Error("Stage uses distance");

          // check which address to update
          const addressToUpdate = fromOrTo === "from" ? stage.from : stage.to;

          // either update the city or country
          if (place === "city") addressToUpdate.city = inputValue;
          else addressToUpdate.country = inputValue;

          return {
            ...old,
            stages: old.stages.with(index, {
              ...stage,
              error: inputValue.length > 0 &&
                (stage.error === "no such from address" ||
                  stage.error === "no such to address")
                ? stage.error
                : undefined,
            }),
          };
        });
      };

  /**
   * Given an index of a stage, returns an input onChange
   * function that updates the stage's distance.
   */
  const onDistanceChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target as EventTarget;

      setFormData((old: FormData): FormData => {
        const stage = old.stages[index];

        if (stage.usesAddress) throw new Error("Stage uses addresses");

        return {
          ...old,
          stages: old.stages.with(index, {
            ...stage,
            distance: Number(inputValue),
            error: undefined,
          }),
        };
      });
    };

  /**
   * Given an index of a stage, returns a button onClick
   * function that changes wether that stage uses addresses
   * or distances.
   */
  const onToggleUsesAddress =
    (index: number, use: "address" | "distance") => () => {
      setFormData((old: FormData): FormData => {
        const stage = old.stages[index];

        // if we want to change stage to use addresses
        if (use === "address") {
          if (stage.usesAddress) {
            throw new Error("Stage already uses addresses");
          }

          if (!isTruckTransportMethod(stage.transportMethod)) {
            throw new Error("Stage uses non-truck transport method");
          }

          return {
            ...old,
            stages: old.stages.with(index, {
              usesAddress: true,
              transportMethod: stage.transportMethod as TruckTransportMethod,
              from: { city: "", country: "" },
              to: { city: "", country: "" },
              key: stage.key,
              error: undefined,
            }),
          };
        } // or if we want to change stage to use distances
        else {
          if (!stage.usesAddress) {
            throw new Error("Stage already uses distances");
          }

          return {
            ...old,
            stages: old.stages.with(index, {
              usesAddress: false,
              transportMethod: stage.transportMethod,
              distance: 0,
              key: stage.key,
              error: undefined,
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
  const onInsertAfter = (index: number | -1) => () => {
    const id = Math.random();

    setFormData((old: FormData): FormData => {
      // if index is -1, insert as first stage
      if (index === -1) {
        return {
          ...old,
          stages: [
            {
              usesAddress: true,
              transportMethod: "truck",
              from: { city: "", country: "" },
              to: { city: "", country: "" },
              key: id,
              error: undefined,
            },
            ...old.stages,
          ],
        };
      }

      const beforeStage = old.stages[index];

      const newStage: Stage & Keyed & Errored = beforeStage.usesAddress
        ? {
          usesAddress: true,
          transportMethod: beforeStage.transportMethod,
          from: {
            city: beforeStage.to.city,
            country: beforeStage.to.country,
          },
          to: { city: "", country: "" },
          key: id,
          error: undefined,
        }
        : {
          usesAddress: false,
          transportMethod: beforeStage.transportMethod,
          distance: 0,
          key: id,
          error: undefined,
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
  const handleRemoveStage = (index: number) => () => {
    setFormData((old: FormData): FormData => {
      return {
        ...old,
        stages: [...old.stages.slice(0, index), ...old.stages.slice(index + 1)],
      };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      /** The json schema that the back-end uses for the input. */
      type Input = (
        & {
          transport_form: string;
        }
        & (
          | {
            from: { city: string; country: string };
            to: { city: string; country: string };
          }
          | {
            distance_km: number;
          }
        )
      )[];

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
        setError("Error! Failed to calculate emissions. Please try again.");
        setMessage(undefined);
        console.error(
          "Error! Got response code: " +
          response.status +
          " " +
          (await response.text()),
        );
      }

      /** The json schema that the back-end uses for the output. */
      type Output = {
        total_kg: number;
        stages: { kg: number; transport_form: string }[];
      };

      const output: Output = await response.json();

      setFormData(
        (old: FormData): FormData => ({
          ...old,
          emissions: {
            totalKg: output.total_kg,
            stages: output.stages.map((stage) => ({
              kg: stage.kg,
              transportMethod: stage.transport_form as TransportMethod,
            })),
          },
        }),
      );

      setMessage("Total estimated CO2 emission: " + output.total_kg + " kg.");
      setError(undefined);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={isCreateProject
        ? "justify-center items-center flex flex-col gap-4 "
        : "flex flex-col gap-4 "}
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

        {formData.stages.map((stage, index) => (
          <div className=" flex flex-col gap-4 " key={stage.key}>
            <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {formData.stages.length <= 1
                ? <>Transport Method:</>
                : <>Route Stage {index + 1}:</>}
            </Label>

            <Combobox
              options={transportMethodOptions}
              defaultOption={transportMethodOptions.find(
                (option) =>
                  option.value === "truck",
              )}
              type="transportType"
              onChange={onTransportMethodChange(index)}
            />

            {stage.usesAddress
              ? (
                <>
                  <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Origin Address:
                  </Label>
                  <AutoSuggest
                    suggestions={suggestions as Address[]}
                    onSuggestionsFetchRequested={onSuggestionsRequested(
                      index,
                      "from",
                    )}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    onSuggestionSelected={onSuggestionSelected(index, "from")}
                    getSuggestionValue={(suggestion: Address) =>
                      suggestion.city}
                    renderSuggestion={renderSuggestion("city")}
                    inputProps={{
                      value: stage.from.city,
                      type: "string",
                      id: "from",
                      name: "from",
                      className:
                        "w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" +
                        (stage.error === "no such from address"
                          ? " text-red-500"
                          : ""),
                      placeholder: "City",
                      onChange: onAddressChange(index, "from", "city"),
                    }}
                    id={String(stage.key) + "from city"}
                  />
                  <AutoSuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsRequested(
                      index,
                      "from",
                    )}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    onSuggestionSelected={onSuggestionSelected(index, "from")}
                    getSuggestionValue={(suggestion: Address) =>
                      suggestion.country}
                    renderSuggestion={renderSuggestion("country")}
                    inputProps={{
                      value: stage.from.country,
                      type: "string",
                      id: "from",
                      name: "from",
                      className:
                        "w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" +
                        (stage.error === "no such from address"
                          ? " text-red-500"
                          : ""),
                      placeholder: "Country",
                      onChange: onAddressChange(index, "from", "country"),
                    }}
                    id={String(stage.key) + "from country"}
                  />

                  <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Destination Address:
                  </Label>
                  <AutoSuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsRequested(
                      index,
                      "to",
                    )}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    onSuggestionSelected={onSuggestionSelected(index, "to")}
                    getSuggestionValue={(suggestion: Address) =>
                      suggestion.city}
                    renderSuggestion={renderSuggestion("city")}
                    inputProps={{
                      value: stage.to.city,
                      type: "string",
                      id: "to",
                      name: "to",
                      className:
                        "w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" +
                        (stage.error === "no such to address"
                          ? " text-red-500"
                          : ""),
                      placeholder: "City",
                      onChange: onAddressChange(index, "to", "city"),
                    }}
                    id={String(stage.key) + "to city"}
                  />
                  <AutoSuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsRequested(
                      index,
                      "to",
                    )}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    onSuggestionSelected={onSuggestionSelected(index, "to")}
                    getSuggestionValue={(suggestion: Address) =>
                      suggestion.country}
                    renderSuggestion={renderSuggestion("country")}
                    inputProps={{
                      value: stage.to.country,
                      type: "string",
                      id: "to",
                      name: "to",
                      className:
                        "w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" +
                        (stage.error === "no such to address"
                          ? " text-red-500"
                          : ""),
                      placeholder: "Country",
                      onChange: onAddressChange(index, "to", "country"),
                    }}
                    id={String(stage.key) + "to country"}
                  />

                  {isTruckTransportMethod(stage.transportMethod)
                    ? (
                      <Button
                        className="w-full"
                        variant={"secondary"}
                        type="button"
                        onClick={onToggleUsesAddress(index, "distance")}
                      >
                        Use Distance?
                      </Button>
                    )
                    : null}
                </>
              )
              : (
                <>
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
                    ? (
                      <Button
                        className="w-full"
                        variant={"secondary"}
                        type="button"
                        onClick={onToggleUsesAddress(index, "address")}
                      >
                        Use Addresses?
                      </Button>
                    )
                    : null}
                </>
              )}

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
        {formData != null && <Link to={'/upload'}>
          <Button className="w-full mt-5"
            variant={"ibm_green"}
            type="button"
          >
            Upload file
          </Button>
        </Link>}
        <Button className="w-full mt-5" variant={"ibm_blue"} type="submit">
          Calculate
        </Button>
      </form>

      {message !== undefined && (
        <div className="bg-green-200 p-3 mb-3 rounded-md text-green-800 w-[330px] ">
          {message}
        </div>
      )}
      {error != undefined && (
        <div className="bg-red-200 p-3 mb-3 rounded-md text-red-800 mt-6 w-[330px]">
          {error}
        </div>
      )}
    </div>
  );
};

export default Calculator;
