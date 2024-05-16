import React from "react";
import { Label } from "../ui/label.tsx";
import { Button } from "../../components/ui/button.tsx";
import * as C from "./Calculator.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import UploadPopUp from "../Upload/UploadPopUp.tsx";
import CreateProject from "../dashboard/dialogs/createproject.tsx";

type Props = {
  isProject: boolean;
  userId: string | undefined;
  chain: C.Chain;
  selectedRoute: number;
  setChain: React.Dispatch<React.SetStateAction<C.Chain>>;
  onSelectRoute: (routeIndex: number) => () => void;
  onAddRoute: () => void;
};

export default ({
  isProject,
  userId,
  chain,
  selectedRoute,
  onSelectRoute,
  onAddRoute,
  setChain,
}: Props) => {
  return (
    <>
      <Label className="text-lg font text-gray-900 dark:text-gray-100">
        Logistics Chain
      </Label>
      <div className="flex flex-col gap-6 lg:w-[300px]">
        <div className="h-[300px] lg:h-[550px] overflow-auto">
          {chain.routes.map((route, routeIndex) => (
            <div key={route.key} className="pt-1 basis-1/4 mt-4">
              <Card
                onClick={onSelectRoute(routeIndex)}
                className={"backdrop-blur-md mx-[3px]" +
                  (routeIndex === selectedRoute
                    ? " outline outline-offset-0 outline-blue-500"
                    : " outline-none")}
              >
                <CardHeader>
                  <CardTitle>
                    <h1>{route.name}</h1>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {route.emission !== undefined && (
                    <>
                      <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Emission: {route.emission} kg
                      </Label>
                      <br />
                    </>
                  )}
                  <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Stages: {route.stages.length}
                  </Label>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        {chain.emission !== undefined && (
          <Label className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Total estimated emission: {chain.emission} kg
          </Label>
        )}
        <Button
          className="w-full"
          variant={"ibm_green"}
          type="button"
          onClick={onAddRoute}
        >
          Add Route
        </Button>
        {!isProject && (
          <>
            <p className="text-sm w-full">
              Need help gettings started? Check out our &nbsp;
              <a
                className="text-blue-500 underline"
                href="/guide"
              >
                How to Guide
              </a>
              .
            </p>
            {userId !== undefined && (
              <CreateProject
                className="w-full"
                UserId={userId}
                chain={chain}
                type="button"
              />
            )}
          </>
        )}
        <UploadPopUp setChainData={setChain} chain={chain} />
      </div>
    </>
  );
};
