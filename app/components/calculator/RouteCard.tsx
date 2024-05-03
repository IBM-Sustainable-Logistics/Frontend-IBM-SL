import React from "react";
import { Label } from "../ui/label.tsx";
import { Button } from "../../components/ui/button.tsx";
import * as C from "./Calculator.tsx";

type Props = {
  chain: C.Chain;
  routeIndex: number;
  onSelectStage: (stageIndex: number) => () => void;
  onInsertStageAfter: (
    routeIndex: number,
    stageIndex: number | -1,
  ) => () => void;
  onRemoveRoute: (routeIndex: number) => () => void;
};

export default (
  { chain, routeIndex, onSelectStage, onInsertStageAfter, onRemoveRoute }:
    Props,
) => {
  return (
    <>
      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {chain.routes[routeIndex].name}
      </Label>
      <Button
        className="w-full"
        variant={"ibm_blue"}
        type="button"
        onClick={onInsertStageAfter(routeIndex, -1)}
      >
        Add Stage
      </Button>
      {chain.routes[routeIndex].stages.map((stage, stageIndex) => (
        <div key={stage.key}>
          <div onClick={onSelectStage(stageIndex)}>
            <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Stage {stageIndex + 1}
            </Label>
            <br />
            <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Transport Method: {stage.transportMethod}
            </Label>
            <br />
            {stage.cargo && (
              <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Cargo: {stage.cargo}
              </Label>
            )}
            <br />
            {stage.emission && (
              <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Emission: {stage.emission} kg
              </Label>
            )}
          </div>
          <Button
            className="w-full"
            variant={"ibm_blue"}
            type="button"
            onClick={onInsertStageAfter(routeIndex, stageIndex)}
          >
            Add Stage
          </Button>
        </div>
      ))}
      <Button
        className="w-full"
        variant={"ibm_blue"}
        type="button"
        onClick={onRemoveRoute(routeIndex)}
      >
        Remove Route
      </Button>
    </>
  );
};
