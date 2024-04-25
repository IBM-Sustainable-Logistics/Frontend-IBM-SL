import React, { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Label } from "./ui/label.tsx";
import { Combobox, ComboboxOption } from "./ui/combobox.tsx";
import AutoSuggest from "react-autosuggest";
import { Input } from "./ui/input.tsx";
import * as T from "../lib/Transport.ts";
import { Link, redirect } from "@remix-run/react";

/* Termonology:
 * - Chain:
 *      Some routes grouped by the user, either in a project
 *      or in the calculator.
 *
 * - Route:
 *      A list of stages that represents a logistics route.
 *      The CO2 emission of a route can be estimated by the
 *      back-end.
 *
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
 * React requires that every html element in a list has a
 * unique key. This type is simply used to add a key field.
 */
type Keyed = {
  key: number;
};

type Address = T.Address & {
  exists: boolean;
};

type Stage =
  & ({
    usesAddress: false;
    transportMethod: T.TransportMethod;
    distance: number | undefined;
  } | {
    usesAddress: true;
    transportMethod: T.TruckTransportMethod;
    from: Address;
    to: Address;
    impossible: boolean;
  })
  & {
    cargo: number | undefined;
  }
  & Keyed
  & T.Estimated;

type Route =
  & {
    name: string;
    stages: Stage[];
  }
  & Keyed
  & T.Estimated;

export type Chain = {
  routes: Route[];
} & T.Estimated;

export const defaultChain = (from?: T.Address, to?: T.Address): Chain => ({
  routes: [
    {
      name: "Route 1",
      stages: [
        {
          usesAddress: true,
          transportMethod: "truck",
          cargo: undefined,
          from: from
            ? { ...from, exists: true }
            : { ...T.emptyAddress, exists: true },
          to: to
            ? { ...to, exists: true }
            : { ...T.emptyAddress, exists: true },
          impossible: false,
          key: Math.random(),
          emission: undefined,
        },
      ],
      key: Math.random(),
      emission: undefined,
    },
  ],
  emission: undefined,
});

const transportMethodOptions: ComboboxOption[] = T.truckTransportMethods.map(
  (method: T.TransportMethod) => ({
    value: method,
    label: T.getTransportMethodLabel(method),
  }),
);

export function goToUploadPage() {
  return redirect("/upload", {});
}

export const loadChain = (
  chain: T.Chain,
): Chain => ({
  routes: chain.routes.map((route, index): Route => ({
    ...route,
    name: route.name,
    stages: route.stages.map((stage, index): Stage => (
      stage.usesAddress
        ? {
          ...stage,
          from: { ...stage.from, exists: true },
          to: { ...stage.to, exists: true },
          impossible: false,
          key: index,
          emission: undefined,
        }
        : {
          ...stage,
          key: index,
          emission: undefined,
        }
    )),
    key: index,
    emission: undefined,
  })),
  emission: undefined,
});

type CalculatorProps = {
  isCreateProject: boolean;
  chain: Chain;
  setChain: React.Dispatch<React.SetStateAction<Chain>>;
};

const Calculator = ({
  isCreateProject,
  chain,
  setChain,
}: CalculatorProps) => {
  const [error, setError] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const [suggestions, setSuggestions] = useState<Address[]>([]);

  /**
   * Given an index of a route and a stage, returns a combobox onChange
   * function that updates the stage's transportMethod.
   */
  const onTransportMethodChange =
    (routeIndex: number, stageIndex: number) =>
      (_: string, comboboxValue: T.TransportMethod): void => {
        setChain((oldChain: Chain): Chain => {
          const oldRoute = oldChain.routes[routeIndex];
          const oldStage = oldRoute.stages[stageIndex];

          // if the old stage used addresses
          if (oldStage.usesAddress) {
            // and if the new transport method allows for addresses
            if (T.isTruckTransportMethod(comboboxValue)) {
              // then keep the addresses
              return {
                ...oldChain,
                routes: oldChain.routes.with(routeIndex, {
                  ...oldRoute,
                  stages: oldRoute.stages.with(stageIndex, {
                    ...oldStage,
                    transportMethod: comboboxValue as T.TruckTransportMethod,
                  }),
                }),
              };
            } // but if the new transport method does not allow for addresses
            else {
              // then use default distance of 0
              return {
                ...oldChain,
                routes: oldChain.routes.with(routeIndex, {
                  ...oldRoute,
                  stages: oldRoute.stages.with(stageIndex, {
                    ...oldStage,
                    usesAddress: false,
                    transportMethod: comboboxValue,
                    distance: 0,
                  }),
                }),
              };
            }
          } // or if the old stage used distance
          else {
            // then keep the distance
            return {
              ...oldChain,
              routes: oldChain.routes.with(routeIndex, {
                ...oldRoute,
                stages: oldRoute.stages.with(stageIndex, {
                  ...oldStage,
                  transportMethod: comboboxValue,
                }),
              }),
            };
          }
        });
      };

  /**
   * TODO
   */
  const onCargoChanged =
    (routeIndex: number, stageIndex: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target as EventTarget;

      let inputNumber: number | undefined;

      if (inputValue === "") {
        inputNumber = undefined;
      } else {
        inputNumber = Number(inputValue);
        if (isNaN(inputNumber) || inputNumber < 0) {
          inputNumber = undefined;
        }
      }

      setChain((oldChain: Chain): Chain => {
        const oldRoute = oldChain.routes[routeIndex];
        const oldStage = oldRoute.stages[stageIndex];

        return {
          ...oldChain,
          routes: oldChain.routes.with(routeIndex, {
            ...oldRoute,
            stages: oldRoute.stages.with(stageIndex, {
              ...oldStage,
              cargo: inputNumber,
            }),
          }),
        };
      });
    };

  /**
   * TODO
   */
  const onCargoChanged =
    (routeIndex: number, stageIndex: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target as EventTarget;

      let inputNumber: number | undefined;

      if (inputValue === "") {
        inputNumber = undefined;
      } else {
        inputNumber = Number(inputValue);
        if (isNaN(inputNumber) || inputNumber < 0) {
          inputNumber = undefined;
        }
      }

      setChain((oldChain: Chain): Chain => {
        const oldRoute = oldChain.routes[routeIndex];
        const oldStage = oldRoute.stages[stageIndex];

        return {
          ...oldChain,
          routes: oldChain.routes.with(routeIndex, {
            ...oldRoute,
            stages: oldRoute.stages.with(stageIndex, {
              ...oldStage,
              cargo: inputNumber,
            }),
          }),
        };
      });
    };

  /**
   * Given an index of a stage and whether it should use
   * the from or to address, returns an auto-suggest
   * onSuggestionsFetchRequested that updates the current
   * suggestions.
   */
  const onSuggestionsRequested =
    (routeIndex: number, stageIndex: number, fromOrTo: "from" | "to") =>
      async ({ value }: { value: string }) => {
        const route = chain.routes[routeIndex];
        const stage = route.stages[stageIndex];

        if (!stage.usesAddress) throw Error("Stage uses distance");

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

        const response = await fetch("/api/fuzzy", {
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
          setSuggestions([]);
          return;
        }

        /** The json schema that the back-end uses for the output. */
        type Output = {
          city: string;
          country: string;
        }[];

        const output: Output = await response.json();

        if (output.length === 0) {
          setChain((oldChain: Chain): Chain => {
            const oldRoute = oldChain.routes[routeIndex];
            const oldStage = oldRoute.stages[stageIndex];

            if (!oldStage.usesAddress) throw Error("Stage uses distance");

            if (fromOrTo === "from") oldStage.from.exists = false;
            else oldStage.to.exists = false;

            return {
              ...oldChain,
              routes: oldChain.routes.with(routeIndex, {
                ...oldRoute,
                stages: oldRoute.stages.with(stageIndex, oldStage),
              }),
            };
          });

          setSuggestions([]);
          return;
        }

        setChain((oldChain: Chain): Chain => {
          const oldRoute = oldChain.routes[routeIndex];
          const oldStage = oldRoute.stages[stageIndex];

          if (!oldStage.usesAddress) throw Error("Stage uses distance");

          return {
            ...oldChain,
            routes: oldChain.routes.with(routeIndex, {
              ...oldRoute,
              stages: oldRoute.stages.with(stageIndex, {
                ...oldStage,
                from: { ...oldStage.from, exists: true },
                to: { ...oldStage.to, exists: true },
              }),
            }),
          };
        });

        setSuggestions(output);
      };

  /**
   * TODO
   */
  const onSuggestionSelected =
    (routeIndex: number, stageIndex: number, fromOrTo: "from" | "to") =>
      (_: any, { suggestion }: { suggestion: Address }) => {
        setChain((oldChain: Chain): Chain => {
          const oldRoute = oldChain.routes[routeIndex];
          const oldStage = oldRoute.stages[stageIndex];

          if (!oldStage.usesAddress) throw new Error("Stage uses distance");

          if (fromOrTo === "from") oldStage.from = suggestion;
          else oldStage.to = suggestion;

          return {
            ...oldChain,
            routes: oldChain.routes.with(routeIndex, {
              ...oldRoute,
              stages: oldRoute.stages.with(stageIndex, oldStage),
            }),
          };
        });
      };

  /**
   * TODO
   */
  const renderSuggestion = (place: "city" | "country") =>
  (
    suggestion: Address,
    {
      query: inputValue,
      isHighlighted,
    }: {
      query: string;
      isHighlighted: boolean;
    },
  ) => {
    // const city =
    //   place === "city" ? (
    //     <>
    //       <b>{inputValue}</b>
    //       {suggestion.city.slice(inputValue.length)}
    //     </>
    //   ) : (
    //     <>{suggestion.city}</>
    //   );
    //
    // const country =
    //   place === "country" ? (
    //     <>
    //       <b>{inputValue}</b>
    //       {suggestion.country.slice(inputValue.length)}
    //     </>
    //   ) : (
    //     <>{suggestion.country}</>
    //   );

    return (
      <span className={isHighlighted ? "bg-blue-200" : ""}>
        {suggestion.city}, {suggestion.country}
      </span>
    );
  };

  interface EventTarget {
    value?: string;
  }

  /**
   * Given an index of a route and a stage, whether it refers to the
   * "from" or "to" address, and whether it refers to the "city" input or
   * "country" input, returns an input onChange function that
   * updates the stage's address.
   *
   * The place parameter determines whether the city or
   * country input field of the address should be updated.
   */
  const onAddressChange = (
    routeIndex: number,
    stageIndex: number,
    fromOrTo: "from" | "to",
    place: "city" | "country",
  ) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const { value: inputValue } = event.target as EventTarget;

    if (inputValue === undefined) return;

    setChain((oldChain: Chain): Chain => {
      const oldRoute = oldChain.routes[routeIndex];
      const oldStage = oldRoute.stages[stageIndex];

        if (!oldStage.usesAddress) throw Error("Stage uses distance");

      if (inputValue !== undefined) {
        // check which address to update
        const addressToUpdate = fromOrTo === "from"
          ? oldStage.from
          : oldStage.to;
        // addressToUpdate.exists = true;

        // either update the city or country
        if (place === "city") addressToUpdate.city = inputValue;
        else addressToUpdate.country = inputValue;
      }

      oldStage.impossible = false;

        return {
          ...oldChain,
          routes: oldChain.routes.with(routeIndex, {
            ...oldRoute,
            stages: oldRoute.stages.with(stageIndex, oldStage),
          }),
        };
      });
    };

  /**
   * Given an index of a route and stage, returns an input onChange
   * function that updates the stage's distance.
   */
  const onDistanceChange =
    (routeIndex: number, stageIndex: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target as EventTarget;

      let inputNumber: number | undefined;

      if (inputValue === "") {
        inputNumber = undefined;
      } else {
        inputNumber = Number(inputValue);
        if (isNaN(inputNumber) || inputNumber < 0) {
          inputNumber = undefined;
        }
      }

        setChain((oldChain: Chain): Chain => {
          const oldRoute = oldChain.routes[routeIndex];
          const oldStage = oldRoute.stages[stageIndex];

          if (oldStage.usesAddress) throw Error("Stage uses addresses");

          return {
            ...oldChain,
            routes: oldChain.routes.with(routeIndex, {
              ...oldRoute,
              stages: oldRoute.stages.with(stageIndex, {
                ...oldStage,
                distance: inputNumber,
              }),
            }),
          };
        });
      };

  /**
   * Given an index of a route and stage, returns a button onClick
   * function that changes wether that stage uses addresses
   * or distances.
   */
  const onToggleUsesAddress =
    (routeIndex: number, stageIndex: number, use: "address" | "distance") =>
      () => {
        setChain((oldChain: Chain): Chain => {
          const oldRoute = oldChain.routes[routeIndex];
          const oldStage = oldRoute.stages[stageIndex];

          // if we want to change stage to use addresses
          if (use === "address") {
            if (oldStage.usesAddress) {
              throw Error("Stage already uses addresses");
            }

            if (!T.isTruckTransportMethod(oldStage.transportMethod)) {
              throw Error("Stage uses non-truck transport method");
            }

            return {
              ...oldChain,
              routes: oldChain.routes.with(routeIndex, {
                ...oldRoute,
                stages: oldRoute.stages.with(stageIndex, {
                  ...oldStage,
                  usesAddress: true,
                  transportMethod: oldStage
                    .transportMethod as T.TruckTransportMethod,
                  from: { ...T.emptyAddress, exists: true },
                  to: { ...T.emptyAddress, exists: true },
                  impossible: false,
                }),
              }),
            };
          } // or if we want to change stage to use distances
          else {
            if (!oldStage.usesAddress) {
              throw new Error("Stage already uses distances");
            }

            return {
              ...oldChain,
              routes: oldChain.routes.with(routeIndex, {
                ...oldRoute,
                stages: oldRoute.stages.with(stageIndex, {
                  ...oldStage,
                  usesAddress: false,
                  distance: 0,
                }),
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
  const onInsertStageAfter =
    (routeIndex: number, stageIndex: number | -1) => () => {
      setChain((oldChain: Chain): Chain => {
        const oldRoute = oldChain.routes[routeIndex];

        // if index is -1, insert as first stage
        if (stageIndex === -1) {
          return {
            ...oldChain,
            routes: oldChain.routes.with(routeIndex, {
              ...oldRoute,
              stages: [
                {
                  usesAddress: true,
                  transportMethod: "truck",
                  cargo: 0,
                  from: { ...T.emptyAddress, exists: true },
                  to: { ...T.emptyAddress, exists: true },
                  impossible: false,
                  key: Math.random(),
                  emission: undefined,
                },
                ...oldRoute.stages,
              ],
            }),
          };
        }

        const beforeStage = oldRoute.stages[stageIndex];

        const newStage: Stage = beforeStage.usesAddress
          ? {
            usesAddress: true,
            transportMethod: beforeStage.transportMethod,
            cargo: undefined,
            from: {
              ...beforeStage.to,
            },
            to: { ...T.emptyAddress, exists: false },
            impossible: false,
            key: Math.random(),
            emission: undefined,
          }
          : {
            usesAddress: false,
            transportMethod: beforeStage.transportMethod,
            cargo: undefined,
            distance: 0,
            key: Math.random(),
            emission: undefined,
          };

        return {
          ...oldChain,
          routes: oldChain.routes.with(routeIndex, {
            ...oldRoute,
            stages: [
              ...oldRoute.stages.slice(0, stageIndex + 1),
              newStage,
              ...oldRoute.stages.slice(stageIndex + 1),
            ],
          }),
        };
      });
    };

  /**
   * Given an index of a stage, returns a button onClick
   * function that removes the stage at the given index.
   */
  const onRemoveStage = (routeIndex: number, stageIndex: number) => () => {
    setChain((oldChain: Chain): Chain => {
      const oldRoute = oldChain.routes[routeIndex];

      return {
        ...oldChain,
        routes: oldChain.routes.with(routeIndex, {
          ...oldRoute,
          stages: [
            ...oldRoute.stages.slice(0, stageIndex),
            ...oldRoute.stages.slice(stageIndex + 1),
          ],
        }),
      };
    });
  };

  const onAddRoute = () => {
    setChain((oldChain: Chain): Chain => {
      const used_numbers: number[] = [];

      for (const route of oldChain.routes) {
        if (route.name.startsWith("Route ")) {
          const number = parseInt(route.name.substring(6));

          if (!isNaN(number)) {
            used_numbers.push(number);
          }
        }
      }

      let suffix_number = 1;
      next_number: while (true) {
        for (const number of used_numbers) {
          console.log(number, " === ", suffix_number);
          if (number === suffix_number) {
            suffix_number++;
            continue next_number;
          }
        }
        break;
      }

      return {
        ...oldChain,
        routes: [
          ...oldChain.routes,
          {
            name: "Route " + suffix_number,
            stages: [
              {
                usesAddress: true,
                transportMethod: "truck",
                cargo: 0,
                from: { ...T.emptyAddress, exists: true },
                to: { ...T.emptyAddress, exists: true },
                impossible: false,
                key: Math.random(),
                emission: undefined,
              },
            ],
            key: Math.random(),
            emission: undefined,
          },
        ],
      };
    });
  };

  const onRemoveRoute = (index: number) => () => {
    setChain((old: Chain): Chain => {
      if (index < 0 || index >= old.routes.length || old.routes.length <= 1) {
        throw Error("Cannot remove route index: " + index);
      }

      return {
        ...old,
        routes: [
          ...old.routes.slice(0, index),
          ...old.routes.slice(index + 1),
        ],
      };
    });
  };

  const onCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      /** The json schema that the back-end uses for the input. */
      type Input = {
        id: string;
        stages: (
          & (
            | {
              transport_form: T.TransportMethod;
              distance_km: number;
            }
            | {
              transport_form: T.TruckTransportMethod;
              from: { city: string; country?: string };
              to: { city: string; country?: string };
            }
          )
          & {
            cargo_t?: number;
          }
        )[];
      }[];

      const input: Input = chain.routes.map(
        (route: Route) => ({
          id: route.name,
          stages: route.stages.map(
            (stage: Stage) =>
              stage.usesAddress
                ? {
                  transport_form: stage.transportMethod,
                  cargo_t: stage.cargo,
                  from: { city: stage.from.city, country: stage.from.country },
                  to: { city: stage.to.city, country: stage.to.country },
                }
                : {
                  transport_form: stage.transportMethod,
                  cargo_t: stage.cargo,
                  distance_km: stage.distance || 0,
                },
          ),
        }),
      );

      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      /** The json schema that the back-end uses for the output. */
      type Output = {
        chain_kg: number;
        routes: {
          id: string;
          route_kg: number;
          stages: {
            stage_kg: number;
            transport_form: string;
          }[];
        }[];
      } | {
        error: string;
      } | {
        // TODO: Error should also contains full address
        error: "Could not connect locations";
        route_id: string;
        stage_index: number;
      };

      const output: Output = await response.json();

      if ("error" in output) {
        if (
          output.error === "Could not connect locations" && "route_id" in output
        ) {
          setChain((oldChain: Chain): Chain => {
            const routeIndex = oldChain.routes.findIndex((route) =>
              route.name === output.route_id
            );
            const oldRoute = oldChain.routes[routeIndex];
            const oldStage = oldRoute.stages[output.stage_index];

            if (!oldStage.usesAddress) throw Error("Stage uses distance");

            setError(
              "Error! Could not connect `" +
                oldStage.from.city + ", " + oldStage.from.country + "` to `" +
                oldStage.to.city + ", " + oldStage.to.country + "`. " +
                "Please make sure the stage is connected by roads.",
            );
            setMessage(undefined);

            return {
              ...oldChain,
              routes: oldChain.routes.with(routeIndex, {
                ...oldRoute,
                stages: oldRoute.stages.with(output.stage_index, {
                  ...oldStage,
                  impossible: true,
                }),
              }),
            };
          });
        } else {
          setError("Error! Failed to calculate emissions. Please try again.");
          setMessage(undefined);
          console.error(
            "Error! Got response code: " +
            response.status +
            " " +
            (await response.text()),
          );
        }
        return;
      }

      if (!response.ok) {
        setError("Error! Failed to calculate emissions. Please try again.");
        setMessage(undefined);
        console.error(
          "Error! Got response code: " +
          response.status +
          " " +
          await response.text(),
        );
      }

      setChain((oldChain: Chain): Chain => {
        return {
          ...oldChain,
          emission: output.chain_kg,
          routes: oldChain.routes.map((oldRoute): Route => {
            const outputRoute = output.routes.find((route) =>
              route.id === oldRoute.name
            );
            if (outputRoute === undefined) throw Error("Route not found");

            return {
              ...oldRoute,
              emission: outputRoute.route_kg,
              stages: oldRoute.stages.map((oldStage, index): Stage => ({
                ...oldStage,
                emission: outputRoute.stages[index].stage_kg,
              })),
            };
          }),
        };
      });

      setMessage("Total estimated CO2 emission: " + output.chain_kg + " kg.");
      setError(undefined);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={isCreateProject
        ? "justify-center items-center flex flex-col gap-4  font-mono"
        : "flex flex-col gap-4 font-mono "}
    >
      <h1 className=" text-primary text-4xl font-bold font-mono">
        {isCreateProject ? "" : "Calculate Emissions"}
      </h1>
      <form onSubmit={onCalculate}>
        <Button
          className="w-full"
          variant={"secondary"}
          type="button"
          onClick={onAddRoute}
        >
          Add Route
        </Button>

        {chain.routes.map((route, routeIndex) => (
          <>
            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
              {route.name}
            </h2>
            <Button
              className="w-full"
              variant={"secondary"}
              type="button"
              onClick={onInsertStageAfter(routeIndex, -1)}
            >
              Add Stage
            </Button>

            {route.stages.map((stage, stageIndex) => (
              <div className=" flex flex-col gap-4 " key={stage.key}>
                <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {route.stages.length <= 1
                    ? <>Transport Method:</>
                    : <>Route Stage {stageIndex + 1}:</>}
                </Label>

                <Combobox
                  options={transportMethodOptions}
                  defaultOption={transportMethodOptions.find(
                    (option) =>
                      option.value === "truck",
                  )}
                  type="transportType"
                  onChange={onTransportMethodChange(routeIndex, stageIndex)}
                />

                <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Cargo Weight (Tons):
                </Label>
                <Input
                  type="number"
                  id="cargo"
                  name="cargo"
                  className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
                  onChange={onCargoChanged(routeIndex, stageIndex)}
                />

                {T.isTruckTransportMethod(stage.transportMethod) && (
                  <Button
                    className="w-full"
                    variant={"secondary"}
                    type="button"
                    onClick={onToggleUsesAddress(
                      routeIndex,
                      stageIndex,
                      "address",
                    )}
                  >
                    Use Addresses?
                  </Button>
                )}

                {stage.usesAddress
                  ? (
                    <>
                      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Origin Address:
                      </Label>
                      <AutoSuggest
                        suggestions={suggestions as Address[]}
                        onSuggestionsFetchRequested={onSuggestionsRequested(
                          routeIndex,
                          stageIndex,
                          "from",
                        )}
                        onSuggestionsClearRequested={() => setSuggestions([])}
                        onSuggestionSelected={onSuggestionSelected(
                          routeIndex,
                          stageIndex,
                          "from",
                        )}
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
                            (!stage.from.exists ? " text-red-500" : ""),
                          placeholder: "City",
                          onChange: onAddressChange(
                            routeIndex,
                            stageIndex,
                            "from",
                            "city",
                          ),
                        }}
                        id={String(stage.key) + "from city"}
                      />
                      <AutoSuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsRequested(
                          routeIndex,
                          stageIndex,
                          "from",
                        )}
                        onSuggestionsClearRequested={() =>
                          setSuggestions([])}
                        onSuggestionSelected={onSuggestionSelected(
                          routeIndex,
                          stageIndex,
                          "from",
                        )}
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
                            (!stage.from.exists ? " text-red-500" : ""),
                          placeholder: "Country",
                          onChange: onAddressChange(
                            routeIndex,
                            stageIndex,
                            "from",
                            "country",
                          ),
                        }}
                        id={String(stage.key) + "from country"}
                      />

                      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Destination Address:
                      </Label>
                      <AutoSuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsRequested(
                          routeIndex,
                          stageIndex,
                          "to",
                        )}
                        onSuggestionsClearRequested={() => setSuggestions([])}
                        onSuggestionSelected={onSuggestionSelected(
                          routeIndex,
                          stageIndex,
                          "to",
                        )}
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
                            (!stage.to.exists ? " text-red-500" : ""),
                          placeholder: "City",
                          onChange: onAddressChange(
                            routeIndex,
                            stageIndex,
                            "to",
                            "city",
                          ),
                        }}
                        id={String(stage.key) + "to city"}
                      />
                      <AutoSuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsRequested(
                          routeIndex,
                          stageIndex,
                          "to",
                        )}
                        onSuggestionsClearRequested={() => setSuggestions([])}
                        onSuggestionSelected={onSuggestionSelected(
                          routeIndex,
                          stageIndex,
                          "to",
                        )}
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
                            (!stage.to.exists ? " text-red-500" : ""),
                          placeholder: "Country",
                          onChange: onAddressChange(
                            routeIndex,
                            stageIndex,
                            "to",
                            "country",
                          ),
                        }}
                        id={String(stage.key) + "to country"}
                      />

                      {stage.impossible && (
                        <Label className="text-base font-medium text-red-500 dark:text-gray-100">
                          Error: Could not connect these addresses
                        </Label>
                      )}

                      {T.isTruckTransportMethod(stage.transportMethod) && (
                        <Button
                          className="w-full"
                          variant={"secondary"}
                          type="button"
                          onClick={onToggleUsesAddress(
                            routeIndex,
                            stageIndex,
                            "distance",
                          )}
                        >
                          Use Distance?
                        </Button>
                      )}
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
                        onChange={onDistanceChange(routeIndex, stageIndex)}
                      />

                      {T.isTruckTransportMethod(stage.transportMethod) && (
                        <Button
                          className="w-full"
                          variant={"secondary"}
                          type="button"
                          onClick={onToggleUsesAddress(
                            routeIndex,
                            stageIndex,
                            "address",
                          )}
                        >
                          Use Addresses?
                        </Button>
                      )}
                    </>
                  )}

                {route.stages.length > 1 && (
                  <Button
                    onClick={onRemoveStage(routeIndex, stageIndex)}
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
                  onClick={onInsertStageAfter(routeIndex, stageIndex)}
                >
                  Add Stage
                </Button>
              </div>
            ))}
            {chain.routes.length > 1 && (
              <Button
                className="w-full"
                variant={"destructive"}
                type="button"
                onClick={onRemoveRoute(routeIndex)}
              >
                Remove Route
              </Button>
            )}
          </>
        ))}
        <Button
          className="w-full mt-5"
          variant={"ibm_green"}
          onClick={goToUploadPage}
        >
          Upload File
        </Button>
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
