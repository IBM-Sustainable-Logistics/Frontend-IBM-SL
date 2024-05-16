import React from "react";
import { Label } from "../ui/label.tsx";
import { Button } from "../../components/ui/button.tsx";
import * as C from "./Calculator.tsx";
import * as T from "../../lib/Transport.ts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { AspectRatio } from "../ui/aspect-ratio.tsx";
import truck from "../../assets/truck-green.svg";
import { TrashIcon } from "../../lib/Icons.tsx";

type Props = {
  chain: C.Chain;
  selectedRoute: number;
  selectedStage: number;
  onSelectStage: (stageIndex: number) => () => void;
  onInsertStageAfter: (
    routeIndex: number,
    stageIndex: number | -1
  ) => () => void;
  onRemoveRoute: (routeIndex: number) => () => void;
};

export default ({
  chain,
  selectedRoute,
  selectedStage,
  onSelectStage,
  onInsertStageAfter,
  onRemoveRoute,
}: Props) => {
  return (
    <>
      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {chain.routes[selectedRoute].name}
      </Label>
      <div className="flex flex-col flex-grow justify-between gap-4 min-h-0">
        <div className="flex flex-col gap-4 overflow-scroll scrollbar-hide h-[500px] lg:h-auto">
          <Button
            className="w-full"
            variant="ibm_green"
            type="button"
            onClick={onInsertStageAfter(selectedRoute, -1)}
          >
            Add Stage
          </Button>
          {chain.routes[selectedRoute].stages.map((stage, stageIndex) => (
            <div
              key={stage.key}
              className="flex flex-col gap-4 basis-1/3"
            >
              <Card
                onClick={onSelectStage(stageIndex)}
                className={"mx-[3px]" +
                  (stageIndex === selectedStage
                    ? " outline outline-offset-0 outline-blue-500"
                    : " outline-none"
                  )}
              >
                <AspectRatio ratio={16 / 7}>
                  <img src={truck} />
                </AspectRatio>
                <CardHeader>
                  <CardTitle>
                    <h1>Stage {stageIndex + 1}</h1>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Transport Method: {T.getTransportMethodLabel(stage.transportMethod)}
                  </Label>
                  {stage.cargo !== undefined && (<>
                    <br />
                    <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Cargo: {stage.cargo} t
                    </Label>
                  </>)}
                  {stage.emission !== undefined && (<>
                    <br />
                    <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Emission: {stage.emission} kg
                    </Label>
                  </>)}
                </CardContent>
              </Card>
              <Button
                className="w-full"
                variant="ibm_green"
                type="button"
                onClick={onInsertStageAfter(selectedRoute, stageIndex)}
              >
                Add Stage
              </Button>
            </div>
          ))}
        </div>
        {chain.routes.length > 1 && (
          <Button
            className="w-full"
            variant="destructive"
            type="button"
            onClick={onRemoveRoute(selectedRoute)}
          >
            Remove {chain.routes[selectedRoute].name} &nbsp;
            <TrashIcon fill="white"/>
          </Button>
        )}
      </div>
    </>
  );
};
