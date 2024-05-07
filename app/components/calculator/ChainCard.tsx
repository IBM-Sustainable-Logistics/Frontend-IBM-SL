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
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel.tsx";
import { AspectRatio } from "../ui/aspect-ratio.tsx";
import truck from "../../assets/truck.jpg";
import UploadPopUp from "../Upload/UploadPopUp.tsx";

type Props = {
  projectName: string | undefined;
  chain: C.Chain;
  setChain: () => void;
  onSelectRoute: (routeIndex: number) => () => void;
  onAddRoute: () => void;
};

export default ({
  projectName,
  chain,
  onSelectRoute,
  onAddRoute,
  setChain,
}: Props) => {
  return (
    <>
      <Label className="text-lg font text-gray-900 dark:text-gray-100">
        Name: {projectName}
      </Label>
      <br />
      <div className="flex flex-col gap-6">
        <Carousel orientation="vertical">
          <CarouselContent className="h-[200px] md:h-[500px] md:w-[300px]">
            {chain.routes.map((route, routeIndex) => (
              <CarouselItem key={route.key} className="pt-1 basis-1/4 mt-4">
                <Card
                  onClick={onSelectRoute(routeIndex)}
                  className="backdrop-blur-md "
                >
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
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

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
        <UploadPopUp setChainData={setChain} chain={chain} />
      </div>
    </>
  );
};
