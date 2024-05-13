import { useFetcher } from "@remix-run/react";
import React, { useState } from "react";
import { CalculatorInstance } from "../../../lib/Transport.ts";
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
import Calculator, { Chain, defaultChain } from "../../calculator/Calculator.tsx";
import { Carousel, CarouselContent, CarouselItem, CarouselPagination } from "../../ui/carousel.tsx";

interface Props {
  UserId: string;
}

const CreateProject: React.FC<Props> = ({ UserId }: { UserId: any }) => {
  const [chain, setChain] = useState<Chain>(defaultChain());
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([]);
  const [titleProject, setTitleProject] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("");
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
        <Button variant="outline" className="flex items-center justify-between">
          <span className="mr-2">Create a project</span>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-2/3 overflow-y-auto max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a project</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-4 max-w-md md:max-w-xl" style={{ maxHeight: "90vh" }}>
              <Input
                type="text"
                placeholder="Title"
                className="w-full"
                onChange={(e: any) => setTitleProject(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Description"
                className="w-full"
                onChange={(e: any) => setDescriptionProject(e.target.value)}
              />
              <Carousel orientation="horizontal">
                <CarouselContent>
                  {calculators.map((calculator: CalculatorInstance) => (
                    <CarouselItem key={calculator.id}>
                      <div className="flex flex-col justify-center items-center gap-4">
                        <Calculator
                          isProject={true}
                          projectTitle={titleProject}
                          chain={chain}
                          setChain={setChain}
                        />
                        <Button
                          variant="destructive"
                          onClick={() => deleteCalculator(calculator.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <Button className="w-full" onClick={addCalculator}>
                Add new calculator
              </Button>
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
