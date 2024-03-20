

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



  function handleUploadClick(): void {
    setHasUploaded(true);
  }

  return (
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
          <Button variant="destructive">Cancel</Button>}
        {!hasUploaded &&
          <Button variant="ibm_blue">Choose file</Button>}
      </CardFooter>
    </Card>
  );
};

export default UploadFile;
