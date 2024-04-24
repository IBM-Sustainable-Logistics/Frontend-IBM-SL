import { Button } from "app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "app/components/ui/card";
import { Label } from "app/components/ui/label";
import { Switch } from "app/components/ui/switch.tsx";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "app/components/ui/hover-card"

import { useEffect, useState } from "react";
import * as C from "../components/calculator.tsx";
import * as T from "../lib/Transport.ts";
import * as spinner from 'react-spinners'

import * as d3 from 'd3';
import readXlsxFile from 'read-excel-file';

import { LoaderFunctionArgs, json, redirect } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { getProjects } from "../lib/supabase-client.ts";
import { useFetcher, useLoaderData } from "@remix-run/react";

export async function redirectToTemplateDescription() {
  return redirect("/template");
}

/**
 * Same function for checking if user has signed in,
 * taken from: projects._index.tsx.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  const projects = await getProjects();

  console.log(projects);

  if (!serverSession) {
    return redirect("/signin", { headers });
  }

  const userId = serverSession.user.id;

  return json({ success: true, projects, userId }, { headers });
};

const UploadFile = () => {
  const { projects, userId } = useLoaderData<typeof loader>();

  const [hasUploaded, setHasUploaded] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const [shouldSpin, setShouldSpin] = useState(false);

  const [isDistanceMode, setIsDistanceMode] = useState(false);

  // metadata for the chosen file
  const [fileIsSent, setIsSent] = useState(false);
  var [file, setFile] = useState<File | null>(null);
  const dataMap = new Map();
  const [chainData, setChainData] = useState<C.Chain>(C.defaultChain(
    // Use these two cities as examples for the user. Maybe change later.
    { city: "", country: "" },
    { city: "", country: "" }
  ));

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
              file.name.endsWith(".csv") || file.name.endsWith(".xls") || file.name.endsWith(".xlsx")
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

      const row1 = rows[0];
      const row2 = rows[1];

      // Iterate over each data in excel file and save to a local map
      for (let i = 0; i < row1.length; i++) {
        dataMap.set(row1.at(i), row2.at(i));
      }

    })

    await updateFormState();
  }

  useEffect(() => {
  }, [dataMap]);

  /**
   * Read the user-provided file, of type .csv and .xls
   */
  async function readFile(): Promise<void> {
    if (file) {
      if (file.name.endsWith(".csv")) {
        await ReadCSV(file);
      }
      else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
        await ReadExcel(file);
      }
    } else {
      deleteUpload();
      console.error("Unsupported file extension!");
    }
  }

  async function updateFormState() {
    let originAddress: T.Address = {
      city: dataMap.get("Origin city"),
      country: dataMap.get("Origin country")
    };

    let destinationAddress: T.Address = {
      city: dataMap.get("Destination city"),
      country: dataMap.get("Destination country")
    };

    var newChain: C.Chain = ([
      {
        "id": "Primary Route",
        "stages": [
          {
            "transport_form": "truck",
            "from": {
              "city": originAddress.city,
              "country": originAddress.country
            },
            "to": {
              "city": destinationAddress.city,
              "country": destinationAddress.country
            }
          }
        ]
      }
    ]



    )

    setChainData(newChain);

    console.log("JSON.stringify: " + JSON.stringify(newChain));

    const response = await fetch("/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChain),
    });
    if (!response.ok) {
      setIsSent(false);
      console.error(
        "Error! Got response code: " +
        response.status +
        " " +
        (await response.text()),
      );
      alert("Error uploading, please try again.");
      deleteUpload();
    } else {
      const project = {
        title: "Uploaded project",
        descriptionProject: "This project was uploaded by the user.",
        userId: userId,
        calc: JSON.stringify(newChain),
      };
      console.log(newChain)
      fetcher.submit(project, { method: "POST", action: "/api/project" });
      console.log("Status: " + response.status);
      console.log("chain:kg: " + response);
      setIsSent(true);
    }
  }

  async function redirectToProjects() {
    return redirect("/projects");
  }

  return (
    <div>
      {!fileIsSent &&
        (
          <div
            className=" min-h-screen flex items-center justify-center"
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
                      {(file?.name === null || !hasUploaded)
                        ? <Label htmlFor="name">File name:</Label>
                        : <Label htmlFor="name">File name: {file?.name}</Label>}
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
                {!hasUploaded &&
                  <Button variant="ibm_green" disabled>Upload</Button>}
                {hasUploaded &&
                  <Button variant="ibm_green" onClick={readUploadedFile}>Upload
                  </Button>}
                {hasUploaded &&
                  (
                    <Button variant="destructive" onClick={deleteUpload}>
                      Cancel
                    </Button>
                  )}
                {hasUploaded &&
                  <Button variant="ibm_blue" disabled>Choose file</Button>}
                {!hasUploaded &&
                  (
                    <Button variant="ibm_blue" onClick={handleUploadClick}>
                      Choose file
                    </Button>
                  )}
                <Switch id="use-distance" checked={isDistanceMode} onCheckedChange={setIsDistanceMode} />
                <Label htmlFor="use-distance">Use distance?</Label>
              </CardFooter>
              <HoverCard>
                <HoverCardTrigger>Which filetypes are supported?</HoverCardTrigger>
                <HoverCardContent>
                  The supported file-extensions are: <b>.csv (comma separated values)</b>, and <b>.xls/.xlsx (Excel) files</b>. For further information, click the button below: <Button variant="outline" onClick={redirectToTemplateDescription}>Templates</Button>
                </HoverCardContent>
              </HoverCard>

            </Card>
          </div>
        )}
      {fileIsSent &&
        (
          <div className=" min-h-screen flex items-center justify-center" onLoad={redirectToProjects}>
          </div>
        )}
    </div>
  );
};

export default UploadFile;
