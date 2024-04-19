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
import Calculator, * as C from "./calculator.tsx";
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
import { useRevalidator } from "@remix-run/react";

interface Props {
  project: project;
}

const ProjectOverview: React.FC<Props> = ({ project }) => {
  const initialFormState: C.Chain = project.chain as C.Chain;

  const [calculators, setCalculators] = useState<CalculatorInstance[]>([]);
  const [chain, setChain] = useState<C.Chain>(initialFormState);
  const [titleProject, setTitleProject] = useState(project.title);
  const [message, setMessage] = useState("");
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
    console.log(chain, project.chain);
    if (
      chain.emission != project.chain.emission ||
      chain.routes.length != project.chain.routes.length
    ) {
      const project_ = {
        projId: project.id,
        title: titleProject,
        descriptionProject: descriptionProject as string,
        calc: JSON.stringify(chain),
      };
      fetcher.submit(project_, { method: "PATCH", action: "/api/project" });

      setMessage("Project updated");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
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
          {project.routes.map((route) => (
            <>
              <Table>
                <TableCaption>
                  Emissions in total: {project.emissions} for route {route.name}
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

                <TableBody>
                  {route.stages.map((stage: Stage, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {getTransportMethodLabel(stage.transportMethod)}
                      </TableCell>

                      {stage.usesAddress ? (
                        <>
                          <TableCell></TableCell>
                          <TableCell>{stage.from.city}</TableCell>
                          <TableCell>{stage.to.city}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{stage.distance}</TableCell>
                        </>
                      )}
                      <TableCell className="text-right">
                        {stage.emission ? route.emission : 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataVisualization stages={route.stages} />
            </>
          ))}

          {calculators.map((calculator: CalculatorInstance) => (
            <div key={calculator.id} className=" w-full">
              <Calculator
                isCreateProject={true}
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
            {message != "" && (
              <div className="bg-green-200 p-3 mb-3 rounded-md text-green-800">
                {message}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectOverview;
