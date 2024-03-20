

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
            if (file.name.endsWith(".csv")) {
              console.log(`… file[${i}].name = ${file.name}`);
            } else {
              console.log(`file rejected: ${file.name}`)
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

  const [hasUploaded, setHasUploaded] = useState(false);

  function handleUploadClick(): void {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
    setHasUploaded(!hasUploaded);
  }

  function deleteUpload(): void {
    setHasUploaded(false);
  }

  function dragOverHandler(ev: React.DragEvent<HTMLDivElement>): void {
    console.log("File(s) in drop zone");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  return (
    <div id="drop_zone" onDrop={dropHandler} onDragOver={dragOverHandler}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Upload your file here</CardTitle>
          <CardDescription>You can drag and drop your file here. Alternatively, you can click the 'Choose file' button below: </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">File name:</Label>
                <input type="file" id="fileInput" style={{ display: "none" }} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {hasUploaded &&
            <Button variant="ibm_green" disabled>Upload</Button>}
          {!hasUploaded &&
            <Button variant="ibm_green" onClick={handleUploadClick}>Upload</Button>}
          {hasUploaded &&
            <Button variant="destructive" onClick={deleteUpload}>Cancel</Button>}
          {!hasUploaded &&
            <Button variant="ibm_blue">Choose file</Button>}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadFile;
