import { useFetcher } from "@remix-run/react";
import { redirect } from "@remix-run/deno";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog.tsx";
import { Button } from "../../ui/button.tsx";
import { PlusIcon } from "../../../lib/Icons.tsx";
import { Input } from "../../ui/input.tsx";
import { Chain } from "../../calculator/Calculator.tsx";

interface Props {
  UserId: string;
  chain: Chain;
  className?: string;
}

const CreateProject: React.FC<Props> = (
  { UserId, chain, className, ...props }: Props,
) => {
  const [titleProject, setTitleProject] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("");
  const fetcher = useFetcher();

  const handleCreateProject = () => {
    // after calculating the emissions, we can submit the form
    const project = {
      title: titleProject,
      descriptionProject: descriptionProject,
      userId: UserId,
      calc: JSON.stringify(chain),
    };
    fetcher.submit(project, { method: "POST", action: "/api/project" });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="outline"
          className={"flex items-center justify-between " + className}
          {...props}
        >
          <span className="mr-2">Create a project</span>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-2/3 overflow-y-auto max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a project</DialogTitle>
          <DialogDescription>
            <div
              className="flex flex-col gap-4 max-w-md md:max-w-xl"
              style={{ maxHeight: "90vh" }}
            >
              <Input
                type="text"
                placeholder="Title"
                className="w-full"
                onChange={(e) => setTitleProject(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Description"
                className="w-full"
                onChange={(e) => setDescriptionProject(e.target.value)}
              />
              <DialogClose asChild>
                <Button
                  className="border-black border rounded"
                  variant="default"
                  onClick={handleCreateProject}
                >
                  Create
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  className="border-black border rounded"
                  variant="destructive"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
