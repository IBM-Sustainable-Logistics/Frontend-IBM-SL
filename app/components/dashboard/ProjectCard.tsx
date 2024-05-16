import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";
import { Button } from "../ui/button.tsx";
import { EditProjectPopUp } from "../dashboard/popups/EditProjectPopUp.tsx";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";

import { TrashIcon } from "../../lib/Icons.tsx";
import { Chain, Route, Stage, getTransportMethodLabel } from "../../lib/Transport.ts";
import { emissions } from "../../lib/Transport.ts";
import { routes } from "../../../remix.config.js";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";
import * as C from "../calculator/Calculator.tsx";

const ProjectCard = ({
  id,
  title,
  description,
  emission,
  routes,
  chain,
}: {
  id: string;
  title: string;
  description: string | null;
  emission: number;
  routes: Route[];
  chain: Chain;
}) => {
  const fetcher = useFetcher();

  const handleDeleteProject = () => {
    const formData = {
      projId: id,
    };
    fetcher.submit(formData, { method: "DELETE", action: "/api/project" });
  };

  const [calcChain, setCalcChain] = useState<Chain>(C.loadChain(chain));

  return (
    <Card className="min-h-32 bg-white shadow-md rounded-lg ">
      <CardHeader>
        <CardTitle>
          <h1>{title}</h1>
        </CardTitle>
        <CardDescription>
          <p>{description}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Estimation amount: {emission ? emission : 0} kg</p>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Dialog >
          <DialogTrigger>
            <Button variant="destructive">
              <TrashIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete project '{title}'?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete project '{title}' from our servers?
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button
                className="border-black border rounded"
                variant="secondary"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                className="border-black border rounded"
                variant="destructive"
                onClick={handleDeleteProject}
              >
                Delete
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-black border rounded">
              Overview
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col gap-4 max-w-md md:max-w-xl" >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                <p>{description}</p>
              </DialogDescription>
            </DialogHeader>
            {/* Content for the dialog's form will go here */}
            <Accordion type="single" collapsible>
              {routes.map((route, index) => (
                <AccordionItem key={index} value={"item " + index}>
                  <AccordionTrigger>
                    <h2>{route.name}</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                  <Table>
                            <TableCaption>
                              Emissions in total: {route.emission} for route {route.name}
                            </TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">Transport Form</TableHead>
                                <TableHead>Distance (km)</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Cargo Weight</TableHead>
                                <TableHead className="text-right">
                                  Amount of CO2 (kg)
                                </TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {route.stages.map((stage: Stage, index: number) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {getTransportMethodLabel(stage.transportMethod)}
                                  </TableCell>

                                  {stage.usesAddress ? (
                                    <>
                                      <TableCell>{stage.distance_km}</TableCell>
                                      <TableCell>{stage.from.city}</TableCell>
                                      <TableCell>{stage.to.city}</TableCell>
                                      <TableCell className="text-right">
                                        {stage.cargo}
                                      </TableCell>
                                    </>
                                  ) : (
                                    <>
                                      <TableCell>{stage.distance}</TableCell>
                                      <TableCell></TableCell>
                                      <TableCell></TableCell>
                                      <TableCell className="text-right">
                                        {stage.cargo}
                                      </TableCell>
                                    </>
                                  )}

                                  <TableCell className="text-right">
                                    {stage.emission ? stage.emission : 0}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Link to={id}>
              <Button>View Graphs</Button>
            </Link>
            {/* You can add inputs and state handling as needed */}
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-black border rounded">
              Edit
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m10.8 17.8-6.4 2.1 2.1-6.4m4.3 4.3L19 9a3 3 0 0 0-4-4l-8.4 8.6m4.3 4.3-4.3-4.3m2.1 2.1L15 9.1m-2.1-2 4.2 4.2"
                />
              </svg>
            </Button>
          </DialogTrigger>
          <EditProjectPopUp
            id={id}
            title={title}
            description={description}
            chain={chain}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export { ProjectCard };
