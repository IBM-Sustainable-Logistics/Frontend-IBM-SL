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
  onSuggestionsRequested: G<AutoSuggest.SuggestionsFetchRequested>;
  onSuggestionsClear: AutoSuggest.OnSuggestionsClearRequested;
  onSuggestionSelected: G<AutoSuggest.OnSuggestionSelected<C.Address>>;
  onAddressChange: H<(_: React.FormEvent<HTMLElement>, __: AutoSuggest.ChangeEvent) => void>;
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
    <span className={data.isHighlighted ? "bg-blue-200 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" : "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"}> 
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
      <div className="flex flex-col flex-grow justify-between gap-4">
        <div className="flex flex-col gap-4">
          <Combobox
            options={C.transportMethodOptions}
            defaultOption={
              C.transportMethodOptions.find((option) => option.value === "truck")!
            }
            type="transportType"
            onChange={onTransportMethodChange(selectedRoute, selectedStage)}
          />
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Cargo Weight (tons):
          </Label>
          <Input
            type="number"
            id="cargo"
            name="cargo"
            className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
            placeholder="Weight"
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
                renderSuggestionsContainer={
                  ({ containerProps, children, query }) => (
                    <div {...containerProps} >
                      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <div className="overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                          {children}
                        </div>
                      </div>
                    </div>
                  )
                }
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
                renderInputComponent={inputProps => <Input {...inputProps} />}
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
                renderSuggestionsContainer={
                  ({ containerProps, children, query }) => (
                    <div {...containerProps} >
                      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <div className="overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                          {children}
                        </div>
                      </div>
                    </div>
                  )
                }
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
                renderInputComponent={inputProps => 
                  <Input {...inputProps} />}
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
                renderSuggestionsContainer={
                  ({ containerProps, children, query }) => (
                    <div {...containerProps} >
                      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <div className="overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                          {children}
                        </div>
                      </div>
                    </div>
                  )
                }
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
                renderInputComponent={inputProps => <Input {...inputProps} />}
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
                renderSuggestionsContainer={
                  ({ containerProps, children, query }) => (
                    <div {...containerProps} >
                      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <div className="overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                          {children}
                        </div>
                      </div>
                    </div>
                  )
                }
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
                renderInputComponent={inputProps => <Input {...inputProps} />}
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
        </div>
        <div className="flex flex-col gap-4">
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
          <Button
            className="px-10"
            variant="submit_button"
            type="submit"
          >
            Calculate
          </Button>
        </div>
      </div>
    </>
  );
};
