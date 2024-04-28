import React from "react";
import { Dialog, DialogClose, DialogContent } from "./dialog.tsx";
import { Button } from "./button.tsx";

interface MessageDialogProps {
  message: string;
  open: boolean;
  setopen?: (open: boolean) => void;
}

export const MessageDialog: React.FC<MessageDialogProps> = ({
  message,
  open,
  setopen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent>
        <p className="text-gray-500">{message}</p>
        <DialogClose>
          <Button>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
