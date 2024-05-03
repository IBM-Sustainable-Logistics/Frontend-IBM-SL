import React from "react";
import { Label } from "../ui/label.tsx";
import { Button } from "../../components/ui/button.tsx";
import * as C from "./Calculator.tsx";

type Props = {
  projectName: string | undefined;
  chain: C.Chain;
  onAddRoute: () => void;
};

export default ({ projectName, chain, onAddRoute }: Props) => {
  return (
    <>
      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {projectName}
      </Label>
      <br/>
      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Routes: {chain.routes.length}
      </Label>
      <br/>
      {chain.routes.map((route) => (
        <div key={route.key}>
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {route.name}
          </Label>
          <br/>
          {route.emission && (
            <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Emission: {route.emission} kg
            </Label>
          )}
          <br/>
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Stages: {route.stages.length}
          </Label>
        </div>
      ))}
      <br/>
      {chain.emission !== undefined && (
        <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Total estimated emission: {chain.emission} kg
        </Label>
      )}
      <br/>
      <Button
        className="w-full"
        variant={"ibm_blue"}
        type="button"
        onClick={onAddRoute}
      >
        Add Route
      </Button>
    </>
  );
};
