import { redirect } from "@remix-run/deno";
import { Button } from "app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "app/components/ui/card"
import { Label } from "app/components/ui/label"

import { useState } from "react";
import ReadFilePage from "./upload.any";
import { redirect } from "@remix-run/deno";
import Calculator from "app/components/calculator";

const UploadFile = () => {

  const [hasUploaded, setHasUploaded] = useState(false);
  const [onHover, setOnHover] = useState(false);

  // metadata for the chosen file
  const [fileIsSent, setIsSent] = useState(false);
  var [fileName, setFileName] = useState<string | null>(null);
  var [file, setFile] = useState<File | null>(null);
  const [getContent, setContent] = useState<string>("");

  /**
   * Code template taken from: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop 
   */
  function dropHandler(ev: React.DragEvent<HTMLDivElement>): void {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          file = item.getAsFile();
          if (file) {
            if (file.name.endsWith(".csv") || file.name.endsWith(".xls") || file.name.endsWith(".txt")) {
              setFileName(file.name);
              console.log(`… file[${i}].name = ${file.name}`);
              setHasUploaded(true);
            } else {
              console.log(`file rejected: ${file.name}`)
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

          if (!filename.toLowerCase().endsWith(".csv") && !filename.toLowerCase().endsWith(".xls") && !filename.toLowerCase().endsWith(".txt")) {

            console.log(`file rejected: ${file.name}`)
            alert("Not in a valid .csv/.xls format!");
            setHasUploaded(false);
            fileInput.value = "";
          } else {
            readGivenFile();
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

    fileReader.onload = (event) => {
      if (event.target && event.target.result) {
        const getContentAsString = event.target.result as string;
        setContent(getContentAsString);
      }
    };
    if (file != null) {
      fileReader.readAsText(file);
      setIsSent(true);
    }
  }

  /**
   * Equivalent to garbage collecting
  */
  function deleteUpload(): void {
    setFile(null);
    setFileName(null);
    setHasUploaded(false);
  }

  function dragOverHandler(ev: React.DragEvent<HTMLDivElement>): void {
    console.log("File(s) in drop zone");

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
      return new Promise<void>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
          if (event.target && event.target.result) {
            setContent(event.target.result as string);
            setIsSent(true);
            console.log("File contents:", getContent);
            resolve();
          } else {
            alert("Unable to read file! Please try again.");
            reject(new Error("Failed to read file contents"));
          }
        };

        fileReader.onerror = function (_event) {
          reject(new Error("Error reading file: " + fileReader.error));
        };
        fileReader.readAsText(file as Blob);
      }).then(async () => {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error! Got response: " + response.status);
        } else {
          navigateToReadFilePage();
        }
      }).catch((error) => {
        console.error("Error:", error);
      });

    } else {
      throw new Error("Unable to read file!");
    }

  }

  return (
    <div>
      {!fileIsSent &&
        <div className=' min-h-screen flex items-center justify-center' id="drop_zone" onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragHoverEnd}>
          <Card
            className="w-[350px]"
            style={{
              backgroundColor: onHover ? "lightgray" : "white",
            }}
          >
            <CardHeader>
              <CardTitle>Upload your file here</CardTitle>
              <CardDescription>You can drag and drop your file here. Alternatively, you can click the 'Choose file' button below: </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    {(fileName === null || !hasUploaded) ? (
                      <Label htmlFor="name">File name:</Label>
                    ) : (
                      <Label htmlFor="name">File name: {fileName}</Label>
                    )}
                    <input type="file" id="fileInput" style={{ display: "none" }} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!hasUploaded &&
                <Button variant="ibm_green" disabled>Upload</Button>}
              {hasUploaded &&
                <Button variant="ibm_green" onClick={readFile}>Upload</Button>}
              {hasUploaded &&
                <Button variant="destructive" onClick={deleteUpload}>Cancel</Button>}
              {hasUploaded &&
                <Button variant="ibm_blue" disabled>Choose file</Button>}
              {!hasUploaded &&
                <Button variant="ibm_blue" onClick={handleUploadClick}>Choose file</Button>}
            </CardFooter>
          </Card>
        </div>
      }
      {fileIsSent &&
        <div className=' min-h-screen flex items-center justify-center'>
          <Calculator isCreateProject={false} getContent={getContent}/>
        </div>
      }
    </div>
  );

};
export default UploadFile;