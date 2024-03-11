import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card.tsx";
import { Button } from "./ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "./ui/dialog.tsx";

const ProjectCard = ({
    title,
    description,
    estimation,
}: {
    title: string;
    description: string;
    estimation: number;
}) => {
    const [isOpen, setOpen] = useState(false);

    const setOpenTrue = () => {
        setOpen(true);
    };

    const setOpenFalse = () => {
        setOpen(false);
    };

    return (
        <Card className="min-h-32 bg-white shadow-md rounded-lg p-4">
            <CardHeader>
                <CardTitle>
                    <h1>{title}</h1>
                </CardTitle>
                <CardDescription>
                    <p>{description}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Estimation amount: {estimation}kg</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Dialog>
                    <DialogTrigger>
                        <Button variant="destructive" >
                            <svg
                                className="w-6 h-6 text-white-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8.6 2.6A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4c0-.5.2-1 .6-1.4ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete project '{title}'?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. Are you sure you want to permanently
                                delete project '{title}' from our servers?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogClose asChild>
                            <Button className="border-black border rounded" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button className="border-black border rounded" variant="destructive">
                                Delete
                            </Button>
                        </DialogClose>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger>
                        <Button variant="light" className="border-black border rounded">
                            Edit
                            {/* SVG icon for edit functionality */}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Project</DialogTitle>
                            <DialogDescription>
                                Make changes to your project here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>

                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
};

export { ProjectCard };
