import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion.tsx";
import { CalculatorInstance, emissions } from "../../../lib/Transport.ts";
import { Input } from "../../ui/input.tsx";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.tsx";
import { Button } from "../../ui/button.tsx";
import Calculator, { defaultFormData, FormData } from "../../calculator.tsx";
import { Link, useFetcher } from "@remix-run/react";
import { Label } from "../../ui/label.tsx";

interface Props {
  id: string;
  title: string;
  description: string | null;
  emissions: emissions | null;
}

export const EditProjectPopUp: React.FC<Props> = ({
  id,
  title,
  description,
}) => {
  const [titleProject, setTitleProject] = useState(title);
  const [descriptionProject, setDescriptionProject] = useState(description);

  const fetcher = useFetcher();

  const handleUpdateProject = () => {
    // after calculating the emissions, we can submit the form
    const project = {
      projId: id,
      title: titleProject,
      descriptionProject: descriptionProject as string,
    };
    fetcher.submit(project, { method: "PATCH", action: "/api/project" });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription className="flex flex-col gap-4">
          <Input
            value={titleProject || ""}
            placeholder="title"
            className="w-full"
            onChange={(e) => setTitleProject(e.target.value)}
          />
          <Input
            value={(descriptionProject as string) || ""}
            placeholder="Description"
            className="w-full"
            onChange={(e) => setDescriptionProject(e.target.value)}
          />

          <Label>To edit calculations open project</Label>
          <DialogClose asChild>
            <Link
              className="h-10 inline-flex items-center justify-center whitespace-nowrap  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#0043ce] text-primary-foreground hover:bg-[#002d9c]"
              to={id}
            >
              Open project
            </Link>
          </DialogClose>

          <DialogClose asChild>
            <Button
              className="border-black border rounded"
              variant="default"
              onClick={handleUpdateProject}
            >
              update
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
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default EditProjectPopUp;
