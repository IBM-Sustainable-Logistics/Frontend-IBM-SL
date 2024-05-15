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
import Calculator, * as C from "./calculator/Calculator.tsx";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
} from "./ui/carousel.tsx";
import { Car } from "npm:lucide-react@^0.312.0";

interface Props {
  project: project;
}

const ProjectOverview: React.FC<Props> = ({ project }) => {
  const [calcChain, setCalcChain] = useState<C.Chain>(C.loadChain(project.chain));
  const [titleProject, setTitleProject] = useState(project.title);
  const [message, setMessage] = useState("");
  const [descriptionProject, setDescriptionProject] = useState(
    project.description
  );

  const fetcher = useFetcher();

  const handleUpdateProject = () => {
    if (
      calcChain.emission != project.chain.emission ||
      calcChain.routes.length != project.chain.routes.length
    ) {
      const project_ = {
        projId: project.id,
        title: titleProject,
        descriptionProject: descriptionProject as string,
        calc: JSON.stringify(calcChain),
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
    const settings = {
      fileName: project.title, // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
      writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
    };

    const data = project.chain.routes.map((route) => {
      return {
        sheet: route.name,
        columns: [
          { label: "Transport Form", value: "transport_form" },
          { label: "Distance KM", value: "distance_km" },
          { label: "From", value: "from" },
          { label: "To", value: "to" },
          { label: "Cargo Weight", value: "cargo_weight" },
          { label: "Amount of co2 in kg", value: "amount_of_CO2" },
        ],
        content: route.stages.map((stage: Stage) => {
          return {
            transport_form: getTransportMethodLabel(stage.transportMethod),
            distance_km: stage.usesAddress ? stage.distance_km : stage.distance,
            from: stage.usesAddress ? stage.from.city : "",
            to: stage.usesAddress ? stage.to.city : "",
            cargo_weight: stage.cargo,
            amount_of_CO2: stage.emission as number,
          };
        }),
      };
    });

    xlsx(data, settings);
  };

  return (
    /* create a project page */
    <div className="flex flex-col justify-center items-center">

      <Carousel className="w-full" orientation="horizontal">
          <CarouselContent className="max-w-full">
            <CarouselItem>
              <div className="flex flex-col justify-between items-center gap-4">
                <Card className="w-full max-w-md md:max-w-2xl">
                  <CardHeader>
                    <CardTitle>
                      <h1>{project.title}</h1>
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                    <img src={tree} alt="IBM Logo" className="h-40" />
                  </CardHeader>
                  <CardContent >
                    <Carousel>
                      <CarouselContent>
                      {project.routes.map((route) => (
                        <CarouselItem>
                          <Table>
                            <TableCaption>
                              Emissions in total: {project.emissions} for route {route.name}
                            </TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">Transport Form</TableHead>
                                <TableHead>Distance (km)</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Cargo Weight</TableHead>
                                <TableHead className="text-right">
                                  Amount of CO2 (kg)
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
                                      <TableCell>{stage.distance_km}</TableCell>
                                      <TableCell>{stage.from.city}</TableCell>
                                      <TableCell>{stage.to.city}</TableCell>
                                      <TableCell className="text-right">
                                        {stage.cargo}
                                      </TableCell>
                                    </>
                                  ) : (
                                    <>
                                      <TableCell>{stage.distance}</TableCell>
                                      <TableCell></TableCell>
                                      <TableCell></TableCell>
                                      <TableCell className="text-right">
                                        {stage.cargo}
                                      </TableCell>
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
                        </CarouselItem>
                      ))}
                      </CarouselContent>
                      <CarouselPagination />
                    </Carousel>
                    
                  </CardContent>
                </Card>
                <CarouselNext>
                  Edit Chain
                </CarouselNext>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="flex flex-col justify-between items-center gap-4 h-full">
                <Calculator
                  isProject={true}
                  projectTitle={titleProject}
                  chain={calcChain}
                  setChain={setCalcChain}
                />
                <CarouselPrevious>
                  View Graphs
                </CarouselPrevious>
              </div>
            </CarouselItem>
          </CarouselContent>
      </Carousel>

      <CardFooter className="pt-4">
        <div className="flex gap-4 flex-col w-full">
          <Button onClick={handleDownload}>Download as Spreadsheet</Button>
          <Button
            className="border-black border rounded"
            variant="ibm_blue"
            onClick={handleUpdateProject}
          >
            Save Project Changes
          </Button>
          {message != "" && (
            <div className="bg-green-200 p-3 mb-3 rounded-md text-green-800">
              {message}
            </div>
          )}
        </div>
      </CardFooter>
    </div>
  );
};

export default ProjectOverview;
