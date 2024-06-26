import React, { useState } from "react";
import { ComboboxOption } from "../ui/combobox.tsx";
import * as T from "../../lib/Transport.ts";
import ChainCard from "./ChainCard.tsx";
import RouteCard from "./RouteCard.tsx";
import StageCard from "./StageCard.tsx";
import { Card } from "../ui/card.tsx";
import { MessageDialog } from "../ui/messagedialog.tsx";
import { string } from "../../../../.cache/deno/npm/registry.npmjs.org/@types/prop-types/15.7.12/index.d.ts";
import { ErrorDialog } from "../ui/errordialog.tsx";
import AutoSuggest from "react-autosuggest";

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

export type Address = T.Address & {
  exists: boolean;
};

export type Suggestions = {
  values: Address[];
  time: number;
};

const emptySuggestions = (): Suggestions => ({
  values: [],
  time: Date.now(),
});

type Stage =
  & (
    | {
      usesAddress: false;
      transportMethod: T.TransportMethod;
      distance: number | undefined;
    }
    | {
      usesAddress: true;
      transportMethod: T.TruckTransportMethod;
      from: Address;
      to: Address;
      distance_km: number | undefined;
      impossible: boolean;
    }
  )
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
          distance_km: undefined,
        },
      ],
      key: Math.random(),
      emission: undefined,
    },
  ],
  emission: undefined,
});

export const transportMethodOptions: ComboboxOption<T.TransportMethod>[] = T
  .truckTransportMethods.map((method: T.TransportMethod) => ({
    value: method,
    label: T.getTransportMethodLabel(method),
  }));

export const loadChain = (chain: T.Chain): Chain => ({
  routes: chain.routes.map(
    (route, index): Route => ({
      ...route,
      name: route.name,
      stages: route.stages.map(
        (stage, index): Stage =>
          stage.usesAddress
            ? {
              ...stage,
              from: { ...stage.from, exists: true },
              to: { ...stage.to, exists: true },
              impossible: false,
              key: index,
              emission: undefined,
              distance_km: undefined,
            }
            : {
              ...stage,
              key: index,
              emission: undefined,
            },
      ),
      key: index,
      emission: undefined,
    }),
  ),
  emission: undefined,
});

type CalculatorProps = {
  isProject: boolean;
  userId: string | undefined;
  chain: Chain;
  setChain: React.Dispatch<React.SetStateAction<Chain>>;
};

const Calculator = (
  { isProject, userId, chain, setChain }: CalculatorProps,
) => {
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [suggestions, setSuggestions] = useState(emptySuggestions());
  const [openMessage, setOpenMessage] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [progress, setProgress] = useState<number | undefined>();

  // NOTE: This uses index, but routes should be identified by their names,
  // so that we can support sorting and moving the routes around.
  // That means that if we add a onSortRoutes function, then it should also
  // update the routeIndex.
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [selectedStage, setSelectedStage] = useState(0);

  const onSelectRoute = (routeIndex: number) => () => {
    setSelectedRoute(routeIndex);
    setSelectedStage(0);
  };
  const onSelectStage = (stageIndex: number) => () => {
    setSelectedStage(stageIndex);
  };

  /**
   * Given an index of a route and a stage, returns a combobox onChange
   * function that updates the stage's transportMethod.
   */
  const onTransportMethodChange =
    (routeIndex: number, stageIndex: number) =>
    (_: string, comboboxValue: T.TransportMethod): void => {
      // If the input value was somehow undefined or empty
      if (!comboboxValue) {
        // But we already had a transport method then return
        if (chain.routes[routeIndex].stages[stageIndex].transportMethod) {
          return;
        }
        // But if the current transport method was somehow also undefined
        comboboxValue = "truck"; // we use truck as default
      }

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
  const onCargoChanged = (routeIndex: number, stageIndex: number) =>
  (
    { target: { value: inputValue } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  const onSuggestionsClear = () => {
    setSuggestions(emptySuggestions());
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
      const timeOfRequest = Date.now();

      const route = chain.routes[routeIndex];
      const stage = route.stages[stageIndex];

      if (!stage.usesAddress) throw Error("Stage uses distance");

      setError(undefined);

      if (value.length === 0) {
        onSuggestionsClear();
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
        onSuggestionsClear();
        return;
      }

      /** The json schema that the back-end uses for the output. */
      type Output = {
        city: string;
        country: string;
      }[];

      const output: Output = await response.json();

      setSuggestions((oldSuggestions: Suggestions): Suggestions => {
        // We don't want to keep old suggestions that might have taken longer
        // to fetch than the newest ones.
        if (timeOfRequest <= oldSuggestions.time) return oldSuggestions;

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

          return emptySuggestions();
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
                from: {
                  ...oldStage.from,
                  exists: fromOrTo === "from" ? true : oldStage.from.exists,
                },
                to: {
                  ...oldStage.to,
                  exists: fromOrTo === "to" ? true : oldStage.to.exists,
                },
              }),
            }),
          };
        });

        const values = output.map((suggestion): Address => ({
          ...suggestion,
          exists: true,
        }));

        return { values: values, time: timeOfRequest };
      });
    };

  /**
   * TODO
   */
  const onSuggestionSelected =
    (routeIndex: number, stageIndex: number, fromOrTo: "from" | "to") =>
    (
      _: React.FormEvent<HTMLElement>,
      { suggestion }: { suggestion: Address },
    ) => {
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
  (_: React.FormEvent<HTMLElement>, data: AutoSuggest.ChangeEvent): void => {
    const inputValue = data.newValue;

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
  const onDistanceChange = (routeIndex: number, stageIndex: number) =>
  (
    { target: { value: inputValue } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let inputNumber: number | undefined = Number(inputValue);

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
                distance_km: undefined,
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
                  cargo: undefined,
                  from: { ...T.emptyAddress, exists: true },
                  to: { ...T.emptyAddress, exists: true },
                  impossible: false,
                  key: Math.random(),
                  emission: undefined,
                  distance_km: undefined,
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
              exists: true,
            },
            to: { ...T.emptyAddress, exists: true },
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

      if (
        stageIndex < 0 || stageIndex >= oldRoute.stages.length ||
        oldRoute.stages.length <= 1
      ) {
        throw Error("Cannot remove stage index: " + stageIndex);
      }

      console.log(
        "routeIndex = " + routeIndex + ", stageIndex = " + stageIndex +
          ", oldRoute.stages.length = " + oldRoute.stages.length,
      );

      // If you are viewing the last stage and it is the one that is removed,
      // then select another stage
      if (
        selectedStage === oldRoute.stages.length - 1 &&
        selectedStage === stageIndex
      ) {
        setSelectedStage(selectedStage - 1);
      }

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
                cargo: undefined,
                from: { ...T.emptyAddress, exists: true },
                to: { ...T.emptyAddress, exists: true },
                impossible: false,
                key: Math.random(),
                emission: undefined,
                distance_km: undefined,
              },
            ],
            key: Math.random(),
            emission: undefined,
          },
        ],
      };
    });
  };

  const onRemoveRoute = (routeIndex: number) => () => {
    setChain((oldChain: Chain): Chain => {
      if (
        routeIndex < 0 || routeIndex >= oldChain.routes.length ||
        oldChain.routes.length <= 1
      ) {
        throw Error("Cannot remove route index: " + routeIndex);
      }

      // If you are viewing the last route and it is the one that is removed,
      // then select another route
      if (
        selectedRoute === oldChain.routes.length - 1 &&
        selectedRoute === routeIndex
      ) {
        setSelectedRoute(selectedRoute - 1);
      }

      return {
        ...oldChain,
        routes: [
          ...oldChain.routes.slice(0, routeIndex),
          ...oldChain.routes.slice(routeIndex + 1),
        ],
      };
    });
  };

  const onCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    for (let routeIndex = 0; routeIndex < chain.routes.length; routeIndex++) {
      const route = chain.routes[routeIndex];

      for (let stageIndex = 0; stageIndex < route.stages.length; stageIndex++) {
        const stage = route.stages[stageIndex];

        if (stage.usesAddress) {
          const noFrom = !stage.from.city;
          const noTo = !stage.to.city;

          if (noFrom || noTo) {
            const label = noFrom && noTo
              ? "origin and destination"
              : noFrom
              ? "origin"
              : "destination";

            setError(
              "Error! Missing " +
                label +
                " address in stage " +
                (stageIndex + 1) +
                ' of route "' +
                route.name +
                '".',
            );
            setOpenError(true);
            setMessage(undefined);

            setChain((oldChain: Chain): Chain => {
              const oldRoute = oldChain.routes[routeIndex];
              const oldStage = oldRoute.stages[stageIndex];

              if (!oldStage.usesAddress) throw Error("Stage uses distance");

              if (!oldStage.from.city) oldStage.from.exists = false;
              if (!oldStage.to.city) oldStage.to.exists = false;

              return {
                ...oldChain,
                routes: oldChain.routes.with(routeIndex, {
                  ...oldRoute,
                  stages: oldRoute.stages.with(stageIndex, oldStage),
                }),
              };
            });

            return;
          }
        }
      }
    }

    setProgress(10);

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

      const input: Input = chain.routes.map((route: Route) => ({
        id: route.name,
        stages: route.stages.map((stage: Stage) => ({
          cargo_t: stage.cargo,
          ...(stage.usesAddress
            ? {
              transport_form: stage.transportMethod,
              from: { city: stage.from.city, country: stage.from.country },
              to: { city: stage.to.city, country: stage.to.country },
            }
            : {
              transport_form: stage.transportMethod,
              distance_km: stage.distance || 0,
            }),
        })),
      }));

      setProgress(50);

      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      setProgress(80);

      /** The json schema that the back-end uses for the output. */
      type Output =
        | {
          chain_kg: number;
          routes: {
            id: string;
            route_kg: number;
            stages: {
              stage_kg: number;
              transport_form: string;
              cargo_t: number;
              distance_km: number;
            }[];
          }[];
        }
        | {
          error: string;
        }
        | {
          // TODO: Should error also contains full address?
          error: "Could not connect locations";
          route_id: string;
          stage_index: number;
        }
        | {
          error: "No such address";
          route_id: string;
          stage_index: number;
          fromOrTo: "from" | "to";
        }
        | {
          error: "Ambiguous address";
          route_id: string;
          stage_index: number;
          fromOrTo: "from" | "to";
          addresses: {
            city: string;
            country?: string | undefined;
          }[];
        };

      const output: Output = await response.json();

      if ("error" in output) {
        switch (output.error) {
          case "Could not connect locations":
            {
              if (!("route_id"! in output)) throw Error("Invalid error type");

              setChain((oldChain: Chain): Chain => {
                const routeIndex = oldChain.routes.findIndex(
                  (route) => route.name === output.route_id,
                );
                const oldRoute = oldChain.routes[routeIndex];
                const oldStage = oldRoute.stages[output.stage_index];

                if (!oldStage.usesAddress) throw Error("Stage uses distance");

                const fromAddress = !oldStage.from.country
                  ? '"' + oldStage.from.city + '"'
                  : '"' +
                    oldStage.from.city +
                    '" in "' +
                    oldStage.from.country +
                    '"';

                const toAddress = !oldStage.to.country
                  ? '"' + oldStage.to.city + '"'
                  : '"' +
                    oldStage.to.city +
                    '" in "' +
                    oldStage.to.country +
                    '"';

                setError(
                  "Error! Could not connect city " +
                    fromAddress +
                    " to " +
                    toAddress +
                    ". " +
                    "Please make sure the stage is connected by roads.",
                );
                setOpenError(true);
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
            }
            break;
          case "No such address":
          case "Ambiguous address":
            {
              if (!("fromOrTo" in output)) throw Error("Invalid error type");

              setChain((oldChain: Chain): Chain => {
                const routeIndex = oldChain.routes.findIndex(
                  (route) => route.name === output.route_id,
                );
                const oldRoute = oldChain.routes[routeIndex];
                const oldStage = oldRoute.stages[output.stage_index];

                if (!oldStage.usesAddress) throw Error("Stage uses distance");

                const address = output.fromOrTo === "from"
                  ? oldStage.from
                  : oldStage.to;

                if (output.error === "No such address") {
                  if (!address.country) {
                    setError(
                      "Error! " +
                        "Could find city that matched " +
                        '"' +
                        address.city +
                        '". ' +
                        "Please make sure the address is correct.",
                    );
                    setOpenError(true);
                  } else {
                    setError(
                      "Error! " +
                        "Could find city that matched " +
                        '"' +
                        address.city +
                        '" in "' +
                        address.country +
                        '". ' +
                        "Please make sure the address is correct.",
                    );
                    setOpenError(true);
                  }
                } else {
                  if (!address.country) {
                    setError(
                      "Error! " +
                        "Found multiple cities that matched " +
                        '"' +
                        address.city +
                        '". ' +
                        "Please specify the country.",
                    );
                    setOpenError(true);
                  } else {
                    setError(
                      "Error! " +
                        "Found multiple cities that matched " +
                        '"' +
                        address.city +
                        '" in "' +
                        address.country +
                        '". ' +
                        "Please make sure the address is correct.",
                    );
                    setOpenError(true);
                  }
                }
                setMessage(undefined);

                return {
                  ...oldChain,
                  routes: oldChain.routes.with(routeIndex, {
                    ...oldRoute,
                    stages: oldRoute.stages.with(output.stage_index, {
                      ...oldStage,
                      ...(output.fromOrTo === "from"
                        ? { from: { ...oldStage.from, exists: false } }
                        : { to: { ...oldStage.to, exists: false } }),
                    }),
                  }),
                };
              });
            }
            break;
          default:
            {
              setError(
                "Error! Failed to calculate emissions. Please try again.",
              );
              setOpenError(true);
              setMessage(undefined);
              console.error(
                "Error! Got response code: " +
                  response.status +
                  " " +
                  (await response.text()),
              );
            }
            break;
        }
        return;
      }

      if (!response.ok) {
        setError("Error! Failed to calculate emissions. Please try again.");
        setOpenError(true);

        setMessage(undefined);
        console.error(
          "Error! Got response code: " +
            response.status +
            " " +
            (await response.text()),
        );
      }

      setChain((oldChain: Chain): Chain => {
        return {
          ...oldChain,
          emission: output.chain_kg,
          routes: oldChain.routes.map((oldRoute): Route => {
            const outputRoute = output.routes.find(
              (route) => route.id === oldRoute.name,
            );
            if (outputRoute === undefined) throw Error("Route not found");

            return {
              ...oldRoute,
              emission: outputRoute.route_kg,
              stages: oldRoute.stages.map(
                (oldStage, index): Stage => ({
                  ...oldStage,
                  emission: outputRoute.stages[index].stage_kg,
                  ...(oldStage.usesAddress && {
                    from: { ...oldStage.from, exists: true },
                    to: { ...oldStage.to, exists: true },
                    cargo: outputRoute.stages[index].cargo_t,
                    distance_km: outputRoute.stages[index].distance_km,
                  }),
                }),
              ),
            };
          }),
        };
      });

      setProgress(100);

      setMessage("Total estimated CO2 emission: " + output.chain_kg + " kg.");
      setOpenMessage(true);
      setProgress(undefined);
      setError(undefined);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-9 font-mono justify-center items-center">
      <form onSubmit={onCalculate}>
        <div
          className={"flex flex-col lg:flex-row w-screen ml-4" /* lg:divide-y lg:divide-solid lg:divide-x lg:divide-black-500" */}
        >
          {
            /*
            pt-12 puts the project title ever so slightly above the route and
            stage titles. This is to mitigate the "optical illusion" that make
            it look like the project title lower than it actually is.
          */
          }
          <div className={"px-16 flex-0 pt-12" /* border-t border-black-500"*/}>
            <ChainCard
              isProject={isProject}
              userId={userId}
              chain={chain}
              selectedRoute={selectedRoute}
              onSelectRoute={onSelectRoute}
              onAddRoute={onAddRoute}
              setChain={setChain}
            />
          </div>
          <div
            className={"flex flex-col lg:flex-row lg:px-64 gap-4 pt-10 lg:max-h-[800px]"}
          >
            <Card
              className={"border-2 p-3 mx-10 lg:mx-0 flex flex-col gap-4 lg:w-[400px]"}
            >
              <RouteCard
                chain={chain}
                selectedRoute={selectedRoute}
                selectedStage={selectedStage}
                onSelectStage={onSelectStage}
                onInsertStageAfter={onInsertStageAfter}
                onRemoveRoute={onRemoveRoute}
              />
            </Card>
            <Card className="border-2 p-3 mx-10 flex flex-col gap-4 lg:w-[400px]">
              <StageCard
                chain={chain}
                selectedRoute={selectedRoute}
                selectedStage={selectedStage}
                suggestions={suggestions}
                onTransportMethodChange={onTransportMethodChange}
                onCargoChanged={onCargoChanged}
                onSuggestionsRequested={onSuggestionsRequested}
                onSuggestionsClear={onSuggestionsClear}
                onSuggestionSelected={onSuggestionSelected}
                onAddressChange={onAddressChange}
                onDistanceChange={onDistanceChange}
                onToggleUsesAddress={onToggleUsesAddress}
                onRemoveStage={onRemoveStage}
                progress={progress}
              />
            </Card>
          </div>
        </div>
        <MessageDialog
          message={message as string}
          open={openMessage}
          setopen={setOpenMessage}
        />

        <ErrorDialog
          message={error as string}
          open={openError}
          setopen={setOpenError}
        />
      </form>
    </div>
  );
};

export default Calculator;
