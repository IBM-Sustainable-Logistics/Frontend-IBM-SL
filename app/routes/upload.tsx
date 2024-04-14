import { redirect } from "@remix-run/deno";
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

import { SetStateAction, useState } from "react";
import Calculator, { FormData } from "app/components/calculator";
import * as d3 from 'd3';

const UploadFile = () => {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [onHover, setOnHover] = useState(false);

  // metadata for the chosen file
  const [fileIsSent, setIsSent] = useState(false);
  var [fileName, setFileName] = useState<string | null>(null);
  var [file, setFile] = useState<File | null>(null);
  const [getContent, setContent] = useState<string>("");
  var [fileEnd, setFileEnd] = useState<string>("");

  // If user has uploaded a file, then we want to split it up before proceeding
  var contentSplit;
  type ContentMap = { [key: string]: any };
  const contentMap: ContentMap = {};

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
              setFileName(file.name);
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

          const filename = file.name;
          setFileName(filename);
          console.log("Chosen file: " + filename);

          if (
            !filename.toLowerCase().endsWith(".csv") &&
            !filename.toLowerCase().endsWith(".xls")
          ) {
            console.log(`file rejected: ${file.name}`);
            alert("Not in a valid .csv/.xls format!");
            setHasUploaded(false);
            fileInput.value = "";
          } else {
            setHasUploaded(true);
          }
        }
      });
    }
  }

  /**
   * Read the content of the file using the FileReader API
   */
  function readGivenFile() {
    var fileReader = new FileReader();

    console.log(fileReader)

    fileReader.onload = (event) => {
      if (event.target && event.target.result) {
        const getContentAsString = event.target.result as string;
        setContent(getContentAsString);
      }
    };
    if (file != null) {
      console.log(file.size);
      // File size limit is 15MB
      if (file.size <= 1048576) {
        console.log(file)
        fileReader.readAsText(file);

        setIsSent(true);
        readFile();
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
    setFileName(null);
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
   * Read the user-provided file, of type .csv and .xls
   */
  async function readFile(): Promise<void> {
    if (file) {
      if (file.name.endsWith(".csv")) {
        ReadCSV(file);
      }
      else if (file.name.endsWith(".xls")) {
        ReadExcel(file);
      }
    } else {
      throw new Error("Unsupported file extension!");
    }
  }

  var initialFormState: FormData;
  if (getContent.length > 0) {
    initialFormState = {
      stages: [
        {
          usesAddress: true,
          transportMethod: contentMap["Transport Method"],
          from: {
            city: contentMap["Origin City"],
            country: contentMap["Origin Country"],
          },
          to: {
            city: contentMap["Destination City"],
            country: contentMap["Destination Country"],
          },
          key: Math.random(),
        },
      ],
      emissions: undefined,
    };
  } else {
    {
      initialFormState = {
        stages: [
          {
            usesAddress: true,
            transportMethod: "truck",
            from: {
              city: "",
              country: "",
            },
            to: {
              city: "",
              country: "",
            },
            key: Math.random(),
          },
        ],
        emissions: undefined,
      };
    }
  }

  const [formData, setFormData] = useState<FormData>(initialFormState);

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
                      {(fileName === null || !hasUploaded)
                        ? <Label htmlFor="name">File name:</Label>
                        : <Label htmlFor="name">File name: {fileName}</Label>}
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
                  <Button variant="ibm_green" onClick={readGivenFile}>Upload
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

function ReadCSV(file: File) {
  const filereader = new FileReader();

  filereader.onload = function (_ev) {
    const readfilecont = filereader.result as string;
    const csvData = d3.csvParse(readfilecont);
    document.write(JSON.stringify(csvData));
    console.log(csvData);
  };

  filereader.readAsText(file);
}

function ReadExcel(file: File) {
  const filereader = new FileReader();
}

export default UploadFile;
