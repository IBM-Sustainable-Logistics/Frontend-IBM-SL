import React from "react";
import { Label } from "../ui/label.tsx";
import { Button } from "../../components/ui/button.tsx";
import * as C from "./Calculator.tsx";
import * as T from "../../lib/Transport.ts";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel.tsx";
import { Card, CardContent, CardHeader } from "../ui/card.tsx";
import { AspectRatio } from "../ui/aspect-ratio.tsx";
import truck from "../../assets/truck-green.svg";

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
      <br />
      <Button
        className="w-full"
        variant="ibm_blue"
        type="button"
        onClick={onInsertStageAfter(selectedRoute, -1)}
      >
        Add Stage
      </Button>

      <Carousel orientation="vertical">
        <CarouselContent className=" h-[500px]">
          {chain.routes[selectedRoute].stages.map((stage, stageIndex) => (
            <CarouselItem
              key={stage.key}
              className="flex flex-col gap-4 pt-1 basis-1/3  mt-4"
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
                <CardHeader>Stage {stageIndex + 1}</CardHeader>
                <CardContent>
                  <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Transport Method: {T.getTransportMethodLabel(stage.transportMethod)}
                  </Label>
                  <br />
                  {stage.cargo !== undefined && (
                    <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Cargo: {stage.cargo} t
                    </Label>
                  )}
                  <br />
                  {stage.emission !== undefined && (
                    <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Emission: {stage.emission} kg
                    </Label>
                  )}
                </CardContent>
              </Card>
              <Button
                className="w-full"
                variant="ibm_blue"
                type="button"
                onClick={onInsertStageAfter(selectedRoute, stageIndex)}
              >
                Add Stage
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <br />
      {chain.routes.length > 1 && (
        <Button
          className="w-full"
          variant="destructive"
          type="button"
          onClick={onRemoveRoute(selectedRoute)}
        >
          Remove Route
        </Button>
      )}
    </>
  );
};
