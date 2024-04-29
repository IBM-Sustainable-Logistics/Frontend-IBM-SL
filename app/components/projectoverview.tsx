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
import xlsx from "https://esm.sh/json-as-xlsx@2.5.6";
import { stagger } from "npm:framer-motion@^11.0.8";
import { Sheet } from "./ui/sheet.tsx";

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
        window.location.reload();
        setMessage("");
      }, 2000);
    }
  };

  const handleDownload = () => {
    let settings = {
      fileName: project.title, // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
      writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
      RTL: true, // Display the columns from right-to-left (the default value is false)
    };

    let data = project.chain.routes.map((route) => {
      return {
        sheet: route.name,
        columns: [
          { label: "Transport Form", value: "transport_form" },
          { label: "Distance KM", value: "distance_km" },
          { label: "From", value: "from" },
          { label: "To", value: "to" },
          { label: "Amount of co2 in kg", value: "amount_of_CO2" },
        ],
        content: route.stages.map((stage: Stage) => {
          return {
            transport_form: getTransportMethodLabel(stage.transportMethod),
            distance_km: stage.usesAddress ? "" : stage.distance,
            from: stage.usesAddress ? stage.from.city : "",
            to: stage.usesAddress ? stage.to.city : "",
            amount_of_CO2: stage.emission as number,
          };
        }),
      };
    });

    xlsx(data, settings);
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
                        {stage.emission ? stage.emission : 0}
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
            <Button onClick={handleDownload}>Download as spreadsheet</Button>
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
