import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.tsx";
import { Button } from "./button.tsx";
import { useFetcher, useNavigate } from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./dialog.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion.tsx";

import { TrashIcon } from "../../lib/Icons.tsx";
import { Stage, TransportListItem2 } from "../../lib/Transport.ts";
import { emissions } from "../../lib/Transport.ts";

const ProjectCard = ({
  id,
  title,
  description,
  emissions,
}: {
  id: string;
  title: string;
  description: string | null;
  emissions: emissions;
}) => {
  const fetcher = useFetcher();

  const handleDeleteProject = () => {
    const formData = {
      projId: id,
    };
    fetcher.submit(formData, { method: "DELETE", action: "/api/project" });
  };
  const navToProj = useNavigate();

  const openProject = () => {
    navToProj(`/projects/${title.replace(/\s/g, "_")}`);
  };

  return (
    <Card className="min-h-32 bg-white shadow-md rounded-lg p-4">
      <CardHeader>
        <CardTitle>
          <h1>{title}</h1>
        </CardTitle>
        <CardDescription>
          <p>{description}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Estimation amount: {emissions.totalKg} kg</p>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Dialog>
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
            <Button
              variant="outline"
              className="border-black border rounded"
              onClick={openProject}
            >
              View
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                <p>{description}</p>
              </DialogDescription>
            </DialogHeader>
            {/* Content for the dialog's form will go here */}
            <Accordion type="single" collapsible>
              {emissions.stages.map((s, index) => (
                <>
                  <AccordionItem value={"item " + index}>
                    <AccordionTrigger>
                      {/* We need to replace this with the transportation method */}
                      {"Transport type" + " " + s.transportMethod}
                    </AccordionTrigger>
                    <AccordionContent>
                      {"Emissions estimated at: " + s.kg} kg
                    </AccordionContent>
                  </AccordionItem>
                </>
              ))}
            </Accordion>
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
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export { ProjectCard };
