import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog.tsx";
import { Button } from "../ui/button.tsx";
import UploadCard, * as U from "./UploadCard.tsx";

type Props = {
  chain: U.Chain;
  setChainData: React.Dispatch<React.SetStateAction<U.Chain>>;
};

const UploadPopUp: React.FC<Props> = ({ setChainData, chain }) => {
  return (
    <Dialog>
      <DialogTrigger className=" mt-3">
        <Button type="button" variant={"submit_button2"}>
          Upload file
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-transparent border-0">
        {/* here i will add the upload */}
        <UploadCard setChainData={setChainData} chain={chain} />
        <DialogClose>
          <Button variant="destructive">cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPopUp;
