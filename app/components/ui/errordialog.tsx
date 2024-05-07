import React from "react";
import { Dialog, DialogClose, DialogContent } from "./dialog.tsx";
import { Button } from "./button.tsx";

interface ErrorDialog {
  message: string;
  open: boolean;
  setopen?: (open: boolean) => void;
}

export const ErrorDialog: React.FC<ErrorDialog> = ({
  message,
  open,
  setopen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent>
        <p className="text-red-500">{message}</p>
        <DialogClose>
          <Button variant={"destructive"}>Dismiss</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
