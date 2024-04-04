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

const ProjectCard = ({
  id,
  title,
  description,
  emissions,
}: {
  id: string;
  title: string;
  description: string | null;
  emissions: number | null;
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
        <p>Estimation amount: {emissions} kg</p>
      </CardContent>
      <CardFooter className="flex justify-estimationbetween">
        <Dialog>
          <DialogTrigger>
            <Button variant="destructive">
              <svg
                className="w-6 h-6 text-white-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.6 2.6A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4c0-.5.2-1 .6-1.4ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                  clip-rule="evenodd"
                />
              </svg>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                <h2 className="text-lg">Description</h2>
                <p>{description}</p>
              </DialogDescription>
            </DialogHeader>
            {/* Content for the dialog's form will go here */}
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {/* We need to replace this with the transportation method */}
                  Transport Type 1
                </AccordionTrigger>
                <AccordionContent>{emissions} kg</AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* You can add inputs and state handling as needed */}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export { ProjectCard };
