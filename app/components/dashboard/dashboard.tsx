import React, { useEffect, useState } from "react";
import { Button } from "../ui/button.tsx";
import { ProjectCard } from "../ui/ProjectCard.tsx";
import { Input } from "../ui/input.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination.tsx";
import { CalculatorInstance, project } from "../../lib/Transport.ts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog.tsx";
import Calculator, { FormData } from "../calculator.tsx";
import { useFetcher } from "@remix-run/react";
import { PlusIcon } from "../../lib/Icons.tsx";

interface DashboardProps {
  Projects: project[];
  UserId: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  Projects,
  UserId,
}: DashboardProps) => {
  const initialFormState: FormData = {
    stages: [
      {
        usesAddress: true,
        transportMethod: "truck",
        from: { city: "", country: "" },
        to: { city: "", country: "" },
        id: Math.random(),
      },
    ],
    emissions: undefined,
  };

  // State to keep track of the number of Calculator components
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([]);

  const [formData, setFormData] = useState<FormData>(initialFormState);

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
      calc: JSON.stringify(formData),
    };
    fetcher.submit(project, { method: "POST", action: "/api/project" });
  };

  return (
    <>
      <h1 className="text-3xl font-bold my-2 text-center">My Projects</h1>
      <div className="flex flex-col mx-10">
        <div className="w-full flex flex-row justify-between my-10">
          <Input
            type="text"
            placeholder="Search for a project"
            className="w-full"
          />
          <Dialog>
            <DialogTrigger>
              <Button
                variant="outline"
                className="flex items-center justify-between"
              >
                <span className="mr-2">Create a project</span>
                <PlusIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="h-2/3 overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create a project</DialogTitle>
                <DialogDescription>
                  <div
                    className="flex flex-col gap-4"
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
                    {calculators.map((calculator: CalculatorInstance) => (
                      <div key={calculator.id} className=" w-full">
                        <Calculator
                          isCreateProject={true}
                          formData={formData}
                          setFormData={setFormData}
                        />
                        <Button
                          variant="destructive"
                          onClick={() => deleteCalculator(calculator.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button className="w-full" onClick={addCalculator}>
                      Add transport method
                    </Button>
                    <Button
                      className="border-black border rounded"
                      variant="default"
                      onClick={handleCreateProject}
                    >
                      Create
                    </Button>
                    <Button
                      className="border-black border rounded"
                      variant="destructive"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 justify-self-stretch max-w-full gap-4">
          {Projects.map((p, index) => {
            return (
              <ProjectCard
                key={index}
                id={p.id}
                title={p.title}
                description={p.description}
                emissions={p.emissions}
              />
            );
          })}
        </div>

        <div className="my-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
