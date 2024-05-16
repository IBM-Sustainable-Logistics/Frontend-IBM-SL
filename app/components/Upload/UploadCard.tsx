import React, { useState } from "react";
import { Button } from "../ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";
import readXlsxFile from "read-excel-file";
import { Label } from "../ui/label.tsx";
import { Switch } from "../ui/switch.tsx";
import * as d3 from "d3";
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

export const isValidFileSize = (method: File): boolean => {
  if (method.size <= 1048576) {
    return true
  } else {
    return false;
  }
}

const UploadCard: React.FC<Props> = ({ setChainData, chain }) => {
  const [_stages, setStage] = useState<Stage[]>([]);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [onHover, setOnHover] = useState(false);

  const [isDistanceMode, setIsDistanceMode] = useState(false);

  // metadata for the chosen file
  var [file, setFile] = useState<File | null>(null);
  const dataMap = new Map();

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

      // File size limit is 15MB
      if (isValidFileSize(file)) {
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

      const newStages: Stage[] = [];

      // Iterate over each data in csv and save to a local map
      for (const entry in jsonObj) {
        if (Object.prototype.hasOwnProperty.call(jsonObj, entry)) {
          dataMap.set(entry, jsonObj[entry]);
          console.log("Received key: ", entry, ", value:", jsonObj[entry])
        }
      }


      for (let i = 1; i < dataMap.size; i++) {

        var from;
        var to;
        var getDistance;

        try {
          from = {
            city: dataMap.get("Origin city ").toString(),
            country: dataMap.get("Origin country ").toString(),
            exists: true,
          };

          to = {
            city: dataMap.get("Destination city ").toString(),
            country: dataMap.get("Destination country ").toString(),
            exists: true,
          };
          console.log(i + " -> " + from.city, ", ", from.country, ", ", to.city, ", ", to.country)
        } catch (error) {
          getDistance = dataMap.get("Distance") as number;
          console.log(i + " -> " + "Distance: ", getDistance)
        }

        const stage = isDistanceMode
          ? {
            usesAddress: false,
            transportMethod: "truck",
            distance: getDistance,
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
          };

        newStages.push(stage as Stage);
      }

      setStage((oldStages: Stage[]): Stage[] => [...oldStages, ...newStages]);

      console.log("newStages: " + newStages);

      setChainData((oldChain: Chain): Chain => {
        return {
          ...oldChain,
          routes: [
            {
              name: "Route " + (oldChain.routes.length - 1 + 1),
              stages: newStages,
              key: Math.random(),
              emission: undefined,
            },
          ],
        };
      });
    };

    filereader.readAsText(file);
  }

  /**
   * Read the Excel-file uploaded by the user.
   * @param file the file, of type xls, to be read.
   */
  async function ReadExcel(file: File) {
    const rows = await readXlsxFile(file);
    console.log(rows.length);

    const newStages: Stage[] = [];

    for (let i = 1; i < rows.length; i++) {
      var from;
      var to;
      var getDistance;
      try {
        from = {
          city: rows[i][0].toString(),
          country: rows[i][1].toString(),
          exists: true,
        };

        to = {
          city: rows[i][2].toString(),
          country: rows[i][3].toString(),
          exists: true,
        };

        console.log(from.city, ", ", from.country, ", ", to.city, ", ", to.country)
      } catch (error) {
        getDistance = rows[i][0] as number;
        console.log(i + " -> " + "Distance: ", getDistance)
      }
      const stage = isDistanceMode
        ? {
          usesAddress: false,
          transportMethod: "truck",
          distance: getDistance,
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
        };

      newStages.push(stage as Stage);
    }

    setStage((oldStages: Stage[]): Stage[] => [...oldStages, ...newStages]);

    console.log("newStages: " + newStages);

    setChainData((oldChain: Chain): Chain => {
      return {
        ...oldChain,
        routes: [
          {
            name: "Route " + (oldChain.routes.length - 1 + 1),
            stages: newStages,
            key: Math.random(),
            emission: undefined,
          },
        ],
      };
    });
  }

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
    <div
      className=" flex items-center justify-center "
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
          <CardTitle>
            <h1>Upload your file here</h1>
          </CardTitle>
          <CardDescription>
            You can drag and drop your file here. Alternatively, you can click
            the 'Choose file' button below:
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
                <input type="file" id="fileInput" style={{ display: "none" }} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between gap-1">
          <div className="flex gap-4">
            <Button
              variant="ibm_green"
              onClick={readUploadedFile}
              disabled={!hasUploaded}
            >
              Upload
            </Button>
            {hasUploaded && (
              <Button variant="destructive" onClick={deleteUpload}>
                Cancel
              </Button>
            )}
            {hasUploaded && (
              <Button variant="ibm_green" disabled>
                Choose file
              </Button>
            )}
            {!hasUploaded && (
              <Button variant="ibm_green" onClick={handleUploadClick}>
                Choose file
              </Button>
            )}
          </div>
          <div className=" flex flex-col">
            <Label htmlFor="use-distance">Use distance?</Label>

            <Switch
              id="use-distance"
              checked={isDistanceMode}
              onCheckedChange={setIsDistanceMode}
            />
          </div>
        </CardFooter>
        <div className=" flex flex-start ml-5 mb-4">
          <a href="/template" className=" text-blue-500 text-sm">
            Which files are supported?
          </a>
        </div>
      </Card>
    </div>
  );
};

export default UploadCard;
