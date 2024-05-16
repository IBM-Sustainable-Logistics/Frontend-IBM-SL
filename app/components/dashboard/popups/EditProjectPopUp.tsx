import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion.tsx";
import { CalculatorInstance, Chain, emissions } from "../../../lib/Transport.ts";
import { Input } from "../../ui/input.tsx";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.tsx";
import { Button } from "../../ui/button.tsx";
import * as C from "../../calculator/Calculator.tsx";
import { Link, useFetcher } from "@remix-run/react";
import { Label } from "../../ui/label.tsx";

interface Props {
  id: string;
  title: string;
  description: string | null;
  chain: Chain;
}

export const EditProjectPopUp: React.FC<Props> = ({
  id,
  title,
  description,
  chain,}
 ) => {
  const [titleProject, setTitleProject] = useState(title);
  const [descriptionProject, setDescriptionProject] = useState(description);

  const fetcher = useFetcher();

  const handleUpdateProject = () => {
    // after calculating the emissions, we can submit the form
    console.log(chain)
    const project = {
      projId: id,
      title: titleProject,
      descriptionProject: descriptionProject as string,
      calc: JSON.stringify(chain),
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
            onChange={(e: any) => setTitleProject(e.target.value)}
          />
          <Input
            value={(descriptionProject as string) || ""}
            placeholder="Description"
            className="w-full"
            onChange={(e: any) => setDescriptionProject(e.target.value)}
          />

          <DialogClose asChild>
            <Link
              className="h-10 inline-flex items-center justify-center whitespace-nowrap  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#0043ce] text-primary-foreground hover:bg-[#002d9c]"
              to={id}
            >
              Edit Calculations
            </Link>
          </DialogClose>

          <DialogClose asChild>
            <Button
              className="border-black border rounded"
              variant="default"
              onClick={handleUpdateProject}
            >
              Save Description Changes
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
