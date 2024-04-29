import React, { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog.tsx";
import { Button } from "../ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card.tsx";
import { Link, useFetcher } from "@remix-run/react";
import readXlsxFile from "read-excel-file";
import { Label } from "../ui/label.tsx";
import { Switch } from "../ui/switch.tsx";
import * as d3 from "d3";
import { redirect } from "@remix-run/deno";
import * as T from "../../lib/Transport.ts";

/* Termonology:
 * - Chain:
 *      Some routes grouped by the user, either in a project
 *      or in the calculator.
 *
 * - Route:
 *      A list of stages that represents a logistics route.
 *      The CO2 emission of a route can be estimated by the
 *      back-end.
 *
 * - Stage:
 *      A part of a route that has a transport method and
 *      either a distance or an origin and destination
 *      address. It can only use addresses if the transport
 *      method id a truck transport method.
 *
 * - Address:
 *      A city and optionally a country.
 *
 * - Transport method
 *      A method of transport, e.g: "truck", "train",
 *
 * - Truck transport method:
 *      A transport method that allows addresses,
 *      specifically "truck" and "etruck".
 */

/**
 * React requires that every html element in a list has a
 * unique key. This type is simply used to add a key field.
 */
type Keyed = {
  key: number;
};

type Address = T.Address & {
  exists: boolean;
};

type Stage = (
  | {
      usesAddress: false;
      transportMethod: T.TransportMethod;
      distance: number | undefined;
    }
  | {
      usesAddress: true;
      transportMethod: T.TruckTransportMethod;
      from: Address;
      to: Address;
      impossible: boolean;
    }
) &
  Keyed &
  T.Estimated;

export type Route = {
  name: string;
  stages: Stage[];
} & Keyed &
  T.Estimated;

export type Chain = {
  routes: Route[];
} & T.Estimated;

type Props = {
  chain: Chain;
  setChainData: React.Dispatch<React.SetStateAction<Chain>>;
};

const UploadCard: React.FC<Props> = ({ setChainData, chain }) => {
  const [stages, setStage] = useState<Stage[]>([]);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const [shouldSpin, setShouldSpin] = useState(false);

  const [isDistanceMode, setIsDistanceMode] = useState(false);

  // metadata for the chosen file
  const [fileIsSent, setIsSent] = useState(false);
  var [file, setFile] = useState<File | null>(null);
  const dataMap = new Map();

  const fetcher = useFetcher();

  /**
   * Code template taken from: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
   */
  function dropHandler(ev: React.DragEvent<HTMLDivElement>): void {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          file = item.getAsFile();
          setFile(file);
          if (file) {
            if (
              file.name.endsWith(".csv") ||
              file.name.endsWith(".xls") ||
              file.name.endsWith(".xlsx")
            ) {
              console.log(`… file[${i}].name = ${file.name}`);
              setHasUploaded(true);
            } else {
              console.log(`file rejected: ${file.name}`);
              alert("Not in a valid .csv/.xls/.xlsx format!");
              setHasUploaded(false);
            }
          }
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    }

    setOnHover(false);
  }

  function handleUploadClick(): void {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();

      fileInput.addEventListener("change", (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];

        if (file) {
          setFile(file);

          console.log("Chosen file: " + file.name);

          if (
            !file.name.toLowerCase().endsWith(".csv") &&
            !file.name.toLowerCase().endsWith(".xls") &&
            !file.name.endsWith(".xlsx")
          ) {
            console.log(`file rejected: ${file.name}`);
            alert("Not in a valid .csv/.xls/.xlsx format!");
            setHasUploaded(false);
            setFile(null);
            fileInput.value = "";
          } else {
            setHasUploaded(true);
          }
        }
      });
    }
  }

  /**
   * Read the content of the file using the FileReader API,
   * when the user presses the 'Upload' button.
   */
  async function readUploadedFile() {
    if (file != null) {
      console.log("File size: " + file.size);

      // File size limit is 15MB
      if (file.size <= 1048576) {
        await readFile();
      } else {
        alert("Please upload a file less than 15 MB!");
      }
    }
  }

  /**
   * Equivalent to garbage collecting
   */
  function deleteUpload(): void {
    console.log("Deleting file: " + file);
    setFile(null);
    setHasUploaded(false);

    if (document.getElementById("fileInput") as HTMLInputElement) {
      (document.getElementById("fileInput") as HTMLInputElement).value = "";
    }
  }

  function dragOverHandler(ev: React.DragEvent<HTMLDivElement>): void {
    setOnHover(true);

    ev.preventDefault();
  }

  function dragHoverEnd(ev: React.DragEvent<HTMLDivElement>): void {
    setOnHover(false);

    ev.preventDefault();
  }

  /**
   * Read the CSV-file uploaded by the user.
   * @param file the file, of type CSV, to be read.
   */
  async function ReadCSV(file: File) {
    const filereader = new FileReader();

    filereader.onload = async function (_ev) {
      const readfilecont = filereader.result as string;
      const csvData = d3.dsvFormat(";").parse(readfilecont);
      const csvDataAsJSON = JSON.stringify(csvData);

      // Structure the data into readable array
      const jsonObj = JSON.parse(csvDataAsJSON.slice(1, -1));

      // Iterate over each data in csv and save to a local map
      for (const entry in jsonObj) {
        if (Object.prototype.hasOwnProperty.call(jsonObj, entry)) {
          dataMap.set(entry, jsonObj[entry]);
        }
      }

      await updateFormState();
    };

    filereader.readAsText(file);
  }

  /**
   * Read the Excel-file uploaded by the user.
   * @param file the file, of type xls, to be read.
   */
  async function ReadExcel(file: File) {
    await readXlsxFile(file).then((rows) => {
      console.log(rows.length);

      // Iterate over each data in csv and save to a local map

      for (let i = 1; i < rows.length; i++) {
        // make from and to
        const from = {
          city: rows[i][0].toString(),
          country: rows[i][1].toString(),
          exists: true,
        };

        const to = {
          city: rows[i][2].toString(),
          country: rows[i][3].toString(),
          exists: true,
        };

        setStage((oldStages: Stage[]): Stage[] => {
          return [
            ...oldStages,
            isDistanceMode
              ? {
                  usesAddress: false,
                  transportMethod: "truck",
                  distance: rows[i][4] as number,
                  key: Math.random(),
                  emission: undefined,
                }
              : {
                  usesAddress: true,
                  transportMethod: "truck",
                  from: from,
                  to: to,
                  key: Math.random(),
                  emission: undefined,
                  impossible: false,
                },
          ];
        });
      }

      setChainData((oldChain: Chain): Chain => {
        return {
          ...oldChain,
          routes: [
            ...oldChain.routes,
            {
              name: "Route " + (oldChain.routes.length + 1),
              stages: stages,
              key: Math.random(),
              emission: undefined,
            },
          ],
        };
      });

      console.log(chain);
    });
  }

  useEffect(() => {}, [dataMap]);

  /**
   * Read the user-provided file, of type .csv and .xls
   */
  async function readFile(): Promise<void> {
    if (file) {
      if (file.name.endsWith(".csv")) {
        await ReadCSV(file);
      } else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
        await ReadExcel(file);
      }
    } else {
      deleteUpload();
      console.error("Unsupported file extension!");
    }
  }

  return (
    <div>
      {!fileIsSent && (
        <div
          className="  flex items-center justify-center"
          id="drop_zone"
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          onDragLeave={dragHoverEnd}
        >
          <Card
            className="w-[450px]"
            style={{
              backgroundColor: onHover ? "lightgray" : "white",
            }}
          >
            <CardHeader>
              <CardTitle>Upload your file here</CardTitle>
              <CardDescription>
                You can drag and drop your file here. Alternatively, you can
                click the 'Choose file' button below:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    {file?.name === null || !hasUploaded ? (
                      <Label htmlFor="name">File name:</Label>
                    ) : (
                      <Label htmlFor="name">File name: {file?.name}</Label>
                    )}
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!hasUploaded && (
                <Button variant="ibm_green" disabled>
                  Upload
                </Button>
              )}
              {hasUploaded && (
                <Button variant="ibm_green" onClick={readUploadedFile}>
                  Upload
                </Button>
              )}
              {hasUploaded && (
                <Button variant="destructive" onClick={deleteUpload}>
                  Cancel
                </Button>
              )}
              {hasUploaded && (
                <Button variant="ibm_blue" disabled>
                  Choose file
                </Button>
              )}
              {!hasUploaded && (
                <Button variant="ibm_blue" onClick={handleUploadClick}>
                  Choose file
                </Button>
              )}
              <Switch
                id="use-distance"
                checked={isDistanceMode}
                onCheckedChange={setIsDistanceMode}
              />
              <Label htmlFor="use-distance">Use distance?</Label>
            </CardFooter>
            <Link to="/template">
              <Button variant="ibm_teal">Which files are supported?</Button>
            </Link>
          </Card>
        </div>
      )}
      {fileIsSent && (
        <div
          className=" min-h-screen flex items-center justify-center"
          onLoad={redirectToProjects}
        ></div>
      )}
    </div>
  );
};

export default UploadCard;