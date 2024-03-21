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

import { useState } from "react"

const UploadFile = () => {

  const [hasUploaded, setHasUploaded] = useState(false);
  const [onHover, setOnHover] = useState(false);

  // metadata for the chosen file
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

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
          const file = item.getAsFile();
          if (file) {
            if (file.name.endsWith(".csv") || file.name.endsWith(".xls")) {
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

          if (!filename.toLowerCase().endsWith(".csv") && !filename.toLowerCase().endsWith(".xls")) {

            console.log(`file rejected: ${file.name}`)
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

  function deleteUpload(): void {
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
  async function sendFile(): Promise<void> {
    if (file) {
      return new Promise<void>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
          if (event.target && event.target.result) {
            const contents = event.target.result as string;
            console.log("File contents:", contents);
            resolve();
          } else {
            reject(new Error("Failed to read file contents"));
          }
        };

        fileReader.onerror = function (event) {
          reject(new Error("Error reading file: " + fileReader.error));
        };
        fileReader.readAsText(file);
      });
    } else {
      throw new Error("Unable to read file!");
    }
  }


  return (
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
                {fileName === null ? (
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
            <Button variant="ibm_green" onClick={sendFile}>Upload</Button>}
          {hasUploaded &&
            <Button variant="destructive" onClick={deleteUpload}>Cancel</Button>}
          {hasUploaded &&
            <Button variant="ibm_blue" disabled>Choose file</Button>}
          {!hasUploaded &&
            <Button variant="ibm_blue" onClick={handleUploadClick}>Choose file</Button>}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadFile;
