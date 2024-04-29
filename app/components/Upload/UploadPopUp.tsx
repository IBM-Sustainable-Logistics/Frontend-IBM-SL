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
      <DialogTrigger className="w-full mt-3">
        <Button variant={"ibm_blue"}>Upload file</Button>
      </DialogTrigger>
      <DialogContent className="bg-transparent border-0">
        {/* here i will add the upload */}
        <UploadCard setChainData={setChainData} chain={chain} />
        <DialogClose>
          <Button>cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPopUp;
