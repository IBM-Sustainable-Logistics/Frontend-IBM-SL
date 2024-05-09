import React from "react";
import { Label } from "../ui/label.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Combobox } from "../ui/combobox.tsx";
import { Input } from "../ui/input.tsx";
import AutoSuggest from "react-autosuggest";
import * as C from "./Calculator.tsx";
import * as T from "../../lib/Transport.ts";

type F<T> = (routeIndex: number, stageIndex: number) => T;
type G<T> = (
  routeIndex: number,
  stageIndex: number,
  fromOrTo: "from" | "to"
) => T;
type H<T> = (
  routeIndex: number,
  stageIndex: number,
  fromOrTo: "from" | "to",
  place: "city" | "country"
) => T;
type I<T> = (
  routeIndex: number,
  stageIndex: number,
  use: "address" | "distance"
) => T;

type Props = {
  chain: C.Chain;
  selectedRoute: number;
  selectedStage: number;
  suggestions: C.Suggestions;
  onTransportMethodChange: F<(_: string, __: T.TransportMethod) => void>;
  onCargoChanged: F<(_: React.ChangeEvent<HTMLInputElement>) => void>;
  onSuggestionsRequested: G<(_: { value: string }) => Promise<void>>;
  onSuggestionsClear: () => void;
  onSuggestionSelected: G<(_: any, __: { suggestion: C.Address }) => void>;
  onAddressChange: H<(_: React.ChangeEvent<HTMLInputElement>) => void>;
  onDistanceChange: F<(_: React.ChangeEvent<HTMLInputElement>) => void>;
  onToggleUsesAddress: I<() => void>;
  onRemoveStage: F<() => void>;
};

const renderSuggestion =
(
  suggestion: C.Address,
  data: { query: string; isHighlighted: boolean }
) => {
  return (
    <span className={data.isHighlighted ? "bg-blue-200" : ""}>
      {suggestion.city}, {suggestion.country}
    </span>
  );
};

export default ({
  chain,
  selectedRoute,
  selectedStage,
  suggestions,
  onTransportMethodChange,
  onCargoChanged,
  onSuggestionsRequested,
  onSuggestionsClear,
  onSuggestionSelected,
  onAddressChange,
  onDistanceChange,
  onToggleUsesAddress,
  onRemoveStage,
}: Props) => {
  const route = chain.routes[selectedRoute];
  const stage = route.stages[selectedStage];

  return (
    <>
      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Stage {selectedStage + 1}
      </Label>
      <Combobox
        options={C.transportMethodOptions}
        defaultOption={
          C.transportMethodOptions.find((option) => option.value === "truck")!
        }
        type="transportType"
        onChange={onTransportMethodChange(selectedRoute, selectedStage)}
      />
      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Cargo Weight (Tons):
      </Label>
      <Input
        type="number"
        id="cargo"
        name="cargo"
        className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
        value={stage.cargo}
        onChange={onCargoChanged(selectedRoute, selectedStage)}
      />
      {stage.usesAddress ? (
        <>
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Origin Address:
          </Label>
          <AutoSuggest
            suggestions={suggestions.values}
            onSuggestionsFetchRequested={onSuggestionsRequested(
              selectedRoute,
              selectedStage,
              "from"
            )}
            onSuggestionsClearRequested={onSuggestionsClear}
            onSuggestionSelected={onSuggestionSelected(
              selectedRoute,
              selectedStage,
              "from"
            )}
            getSuggestionValue={(suggestion) => suggestion.city}
            renderSuggestion={renderSuggestion}
            focusInputOnSuggestionClick={false}
            inputProps={{
              value: stage.from.city,
              type: "string",
              id: "from",
              name: "from",
              className:
                "w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" +
                (!stage.from.exists
                  ? " outline outline-offset-0 outline-red-500"
                  : " outline-none "),
              placeholder: "City",
              onChange: onAddressChange(selectedRoute, selectedStage, "from", "city"),
            }}
            id={String(stage.key) + "from city"}
          />
          <AutoSuggest
            suggestions={suggestions.values}
            onSuggestionsFetchRequested={onSuggestionsRequested(
              selectedRoute,
              selectedStage,
              "from"
            )}
            onSuggestionsClearRequested={onSuggestionsClear}
            onSuggestionSelected={onSuggestionSelected(
              selectedRoute,
              selectedStage,
              "from"
            )}
            getSuggestionValue={(suggestion) => suggestion.country}
            renderSuggestion={renderSuggestion}
            focusInputOnSuggestionClick={false}
            inputProps={{
              value: stage.from.country,
              type: "string",
              id: "from",
              name: "from",
              className:
                "w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" +
                (!stage.from.exists
                  ? " outline outline-offset-0 outline-red-500"
                  : " outline-none "),
              placeholder: "Country",
              onChange: onAddressChange(
                selectedRoute,
                selectedStage,
                "from",
                "country"
              ),
            }}
            id={String(stage.key) + "from country"}
          />
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Destination Address:
          </Label>
          <AutoSuggest
            suggestions={suggestions.values}
            onSuggestionsFetchRequested={onSuggestionsRequested(
              selectedRoute,
              selectedStage,
              "to"
            )}
            onSuggestionsClearRequested={onSuggestionsClear}
            onSuggestionSelected={onSuggestionSelected(
              selectedRoute,
              selectedStage,
              "to"
            )}
            getSuggestionValue={(suggestion) => suggestion.city}
            renderSuggestion={renderSuggestion}
            focusInputOnSuggestionClick={false}
            inputProps={{
              value: stage.to.city,
              type: "string",
              id: "to",
              name: "to",
              className:
                "w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" +
                (!stage.to.exists
                  ? " outline outline-offset-0 outline-red-500"
                  : " outline-none "),
              placeholder: "City",
              onChange: onAddressChange(selectedRoute, selectedStage, "to", "city"),
            }}
            id={String(stage.key) + "to city"}
          />
          <AutoSuggest
            suggestions={suggestions.values}
            onSuggestionsFetchRequested={onSuggestionsRequested(
              selectedRoute,
              selectedStage,
              "to"
            )}
            onSuggestionsClearRequested={onSuggestionsClear}
            onSuggestionSelected={onSuggestionSelected(
              selectedRoute,
              selectedStage,
              "to"
            )}
            getSuggestionValue={(suggestion) => suggestion.country}
            renderSuggestion={renderSuggestion}
            focusInputOnSuggestionClick={false}
            inputProps={{
              value: stage.to.country,
              type: "string",
              id: "to",
              name: "to",
              className:
                "w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" +
                (!stage.to.exists
                  ? " outline outline-offset-0 outline-red-500"
                  : " outline-none "),
              placeholder: "Country",
              onChange: onAddressChange(
                selectedRoute,
                selectedStage,
                "to",
                "country"
              ),
            }}
            id={String(stage.key) + "to country"}
          />
          {stage.impossible && (
            <Label className="text-base font-medium text-red-500 dark:text-gray-100 w-[400px]">
              Error: Could not connect these addresses
            </Label>
          )}

          {T.isTruckTransportMethod(stage.transportMethod) && (
            <Button
              className="w-full"
              variant={"secondary"}
              type="button"
              onClick={onToggleUsesAddress(selectedRoute, selectedStage, "distance")}
            >
              Use Distance?
            </Button>
          )}
        </>
      ) : (
        <>
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Distance (km):
          </Label>
          <Input
            type="number"
            id="distance"
            name="distance"
            className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
            onChange={onDistanceChange(selectedRoute, selectedStage)}
          />

          {T.isTruckTransportMethod(stage.transportMethod) && (
            <Button
              className="w-full"
              variant={"secondary"}
              type="button"
              onClick={onToggleUsesAddress(selectedRoute, selectedStage, "address")}
            >
              Use Addresses?
            </Button>
          )}
        </>
      )}
      {route.stages.length > 1 && (
        <Button
          onClick={onRemoveStage(selectedRoute, selectedStage)}
          className="w-full"
          variant={"destructive"}
          type="button"
        >
          Remove Stage
        </Button>
      )}
    </>
  );
};
