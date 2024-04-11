import React, { useState } from "react";
import { project } from "../lib/Transport.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import Calculator, { defaultFormData, FormData } from "./calculator.tsx";
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

interface Props {
  project: project;
}

const ProjectOverview: React.FC<Props> = ({ project }) => {
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([]);
  const [formData, setFormData] = useState<FormData>(defaultFormData());
  const [titleProject, setTitleProject] = useState(project.title);
  const [descriptionProject, setDescriptionProject] = useState(
    project.description
  );

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

  return (
    /* create a project page */
    <div className=" flex flex-col justify-center items-center ">
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
          <img src={tree} alt="IBM Logo" className="h-40" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Emissions in total:{" "}
              {project.emissions ? project.emissions.totalKg : 0}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Transport Form</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead className="text-right">
                  Amount of co2 in kg
                </TableHead>
              </TableRow>
            </TableHeader>
            {project.emissions ? (
              project.emissions.stages.map((emision) => (
                <>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        {emision.transportMethod}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">{emision.kg}</TableCell>
                    </TableRow>
                  </TableBody>
                </>
              ))
            ) : (
              <TableBody>
                <TableRow>no calculations</TableRow>
              </TableBody>
            )}
          </Table>
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
          <Button className="w-full">Calcultor getting updated</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectOverview;
