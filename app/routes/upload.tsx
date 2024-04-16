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

import { useEffect, useState } from "react";
import Calculator, { FormData } from "app/components/calculator";
import * as d3 from 'd3';

const UploadFile = () => {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [onHover, setOnHover] = useState(false);

  // metadata for the chosen file
  const [fileIsSent, setIsSent] = useState(false);
  var [file, setFile] = useState<File | null>(null);
  const dataMap = new Map();
  const [formData, setFormData] = useState<FormData>({
    stages: [
      {
        usesAddress: true,
        transportMethod: "truck",
        from: {
          city: dataMap.get("Origin city"),
          country: dataMap.get("Origin country"),
        },
        to: {
          city: dataMap.get("Destination city"),
          country: dataMap.get("Destination country"),
        },
        key: Math.random(),
      },
    ],
    emissions: undefined,
  });

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
              file.name.endsWith(".csv") || file.name.endsWith(".xls")
            ) {
              console.log(`… file[${i}].name = ${file.name}`);
              setHasUploaded(true);
            } else {
              console.log(`file rejected: ${file.name}`);
              alert("Not in a valid .csv/.xls format!");
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
            !file.name.toLowerCase().endsWith(".xls")
          ) {
            console.log(`file rejected: ${file.name}`);
            alert("Not in a valid .csv/.xls format!");
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
    console.log("rEadUploadedFile()");
    if (file != null) {
      console.log("File size: " + file.size);

      // File size limit is 15MB
      if (file.size <= 1048576) {
        console.log(file);

        setIsSent(true);
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
    console.log(file);
    setFile(null);
    setHasUploaded(false);

    if (document.getElementById("fileInput") as HTMLInputElement) {
      (document.getElementById("fileInput") as HTMLInputElement).value = "";
    }

    console.log(file);
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
    console.log("ReadCSV()");
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
          console.log(jsonObj);
          console.log(entry + " -> " + jsonObj[entry]);
          console.log("dataMap: " + entry + " -> " + dataMap.get(entry));
        }
      }

      await updateFormState();

    };

    filereader.readAsText(file);
  }

  useEffect(() => {
    console.log("Updated dataMap:", dataMap);
  }, [dataMap]);

  /**
   * TODO: implement this function.
   */
  function ReadExcel(file: File) {
    const filereader = new FileReader();
  }

  /**
   * Read the user-provided file, of type .csv and .xls
   */
  async function readFile(): Promise<void> {
    console.log("readFile()");
    if (file) {
      if (file.name.endsWith(".csv")) {
        await ReadCSV(file);
      }
      else if (file.name.endsWith(".xls")) {
        ReadExcel(file);
      }
    } else {
      deleteUpload();
      console.error("Unsupported file extension!");
    }
  }

  async function updateFormState() {
    console.log("updateFormState()");
    var newFormState: FormData;
    newFormState = {
      stages: [
        {
          usesAddress: true,
          transportMethod: "truck",
          from: {
            city: dataMap.get("Origin city"),
            country: dataMap.get("Origin country"),
          },
          to: {
            city: dataMap.get("Destination city"),
            country: dataMap.get("Destination country"),
          },
          key: Math.random(),
        },
      ],
      emissions: undefined,
    };
    setFormData(newFormState);
    console.log("The new form state (1): " + dataMap.get("Origin city"));
    console.log("The new form state (2): " + dataMap.get("Origin country"));
    console.log("The new form state (3): " + dataMap.get("Destination city"));
    console.log("The new form state (4): " + dataMap.get("Destination country"));
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
              className="w-[350px]"
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
              </CardFooter>
            </Card>
          </div>
        )}
      {fileIsSent &&
        (
          <div className=" min-h-screen flex items-center justify-center">
            <Calculator
              isCreateProject={false}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        )}
    </div>
  );
};

export default UploadFile;
