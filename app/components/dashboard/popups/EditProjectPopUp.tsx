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
import { useFetcher } from "@remix-run/react";
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
  emissions,
}) => {
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([]);
  const [formData, setFormData] = useState<FormData>(defaultFormData());
  const [titleProject, setTitleProject] = useState(title);
  const [descriptionProject, setDescriptionProject] = useState(description);

  const fetcher = useFetcher();

  const addCalculator = () => {
    const newCalculator = {
      id: Date.now(), // Using the current timestamp as a unique ID
    };
    setCalculators([...calculators, newCalculator]);
  };
  const deleteCalculator = (id: number) => {
    setCalculators(
      calculators.filter(
        (calculator: CalculatorInstance) => calculator.id !== id
      )
    );
  };

  const handleUpdateProject = () => {
    // after calculating the emissions, we can submit the form
    const project = {
      projId: id,
      title: titleProject,
      descriptionProject: descriptionProject as string,
      calc: JSON.stringify(formData),
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

          <Label>calculator coming soon</Label>

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
