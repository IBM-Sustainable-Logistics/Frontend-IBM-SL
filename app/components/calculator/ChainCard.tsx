import React from "react";
import { Label } from "../ui/label.tsx";
import { Button } from "../../components/ui/button.tsx";
import * as C from "./Calculator.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";

type Props = {
  projectName: string | undefined;
  chain: C.Chain;
  onSelectRoute: (routeIndex: number) => () => void;
  onAddRoute: () => void;
};

export default ({ projectName, chain, onSelectRoute, onAddRoute }: Props) => {
  return (
    <>
      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Name: {projectName}
      </Label>
      <br />
      <div className="flex flex-col gap-6">
        {chain.routes.map((route, routeIndex) => (
          <Card onClick={onSelectRoute(routeIndex)} key={route.key}>
            <CardHeader>
              <CardTitle> {route.name}</CardTitle>
              {route.emission !== undefined && (
                <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Emission: {route.emission} kg
                </Label>
              )}
            </CardHeader>
            <CardContent>
              <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Stages: {route.stages.length}
              </Label>
            </CardContent>
          </Card>
        ))}
        {chain.emission !== undefined && (
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Total estimated emission: {chain.emission} kg
          </Label>
        )}
        <Button
          className="w-full"
          variant={"ibm_blue"}
          type="button"
          onClick={onAddRoute}
        >
          Add Route
        </Button>
      </div>
    </>
  );
};
