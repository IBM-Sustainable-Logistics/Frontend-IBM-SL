import React, { useState } from "react";
import { Stage, getTransportMethodLabel, project } from "../lib/Transport.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import Calculator, {
  defaultFormData,
  FormData,
  loadFormData,
} from "./calculator.tsx";
import { CalculatorInstance, emissions } from "./../lib/Transport.ts";
import { useFetcher } from "@remix-run/react";
import { Button } from "./ui/button.tsx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.tsx";
import tree from "../assets/tree.svg";
import DataVisualization from "./DataVisualization.tsx";

interface Props {
  project: project;
}

const ProjectOverview: React.FC<Props> = ({ project }) => {
  const initialFormState: FormData = loadFormData(
    project.stages as Stage[],
    project.emissions as emissions
  );

  const [calculators, setCalculators] = useState<CalculatorInstance[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [titleProject, setTitleProject] = useState(project.title);
  const [descriptionProject, setDescriptionProject] = useState(
    project.description
  );

  const fetcher = useFetcher();

  const addCalculator = () => {
    const newCalculator = {
      id: Date.now(), // Using the current timestamp as a unique ID
    };

    console.log();

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
    const project_ = {
      projId: project.id,
      title: titleProject,
      descriptionProject: descriptionProject as string,
      calc: JSON.stringify(formData),
    };
    fetcher.submit(project_, { method: "PATCH", action: "/api/project" });
  };

  return (
    /* create a project page */
    <div className="flex flex-col justify-center items-center p-2 sm:p-10">
      <Card className="w-full sm:w-auto">
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
          <img src={tree} alt="IBM Logo" className="h-40" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Emissions in total:{" "}
              {project.emissions ? project.emissions?.totalKg : 0}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Transport Form</TableHead>
                <TableHead>Distance KM</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="text-right">
                  Amount of co2 in kg
                </TableHead>
              </TableRow>
            </TableHeader>
            {project.emissions ? (
              <>
                <TableBody>
                  {project.stages.map((stage, index) => (
                    <>
                      <TableRow>
                        <TableCell>
                          {project.emissions
                            ? getTransportMethodLabel(
                                project.emissions.stages[index]
                                  .transportMethod as
                                  | "truck"
                                  | "etruck"
                                  | "cargoship"
                                  | "aircraft"
                                  | "train"
                              )
                            : ""}
                        </TableCell>
                        <TableCell>
                          {stage.usesAddress ? "" : stage.distance}
                        </TableCell>
                        <TableCell>
                          {stage.usesAddress
                            ? stage.from.city + " " + stage.from.country
                            : ""}
                        </TableCell>
                        <TableCell>
                          {stage.usesAddress
                            ? stage.to.city + " " + stage.to.country
                            : ""}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {project.emissions
                            ? project.emissions.stages[index].kg
                            : ""}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </>
            ) : (
              <TableBody>
                <TableRow>no calculations</TableRow>
              </TableBody>
            )}
          </Table>
          <DataVisualization project={project} />

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
        </CardContent>
        <CardFooter>
          <div className=" flex gap-4 flex-col w-full">
            <Button onClick={addCalculator} className="w-full">
              {calculators.length === 0
                ? "Update calculator "
                : "Add another calculator"}
            </Button>
            <Button
              className="border-black border rounded"
              variant="ibm_blue"
              onClick={handleUpdateProject}
            >
              update
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectOverview;
