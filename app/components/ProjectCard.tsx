import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card.tsx";
import { Button } from "./ui/button.tsx";

const ProjectCard = (
    { title, description, estimation }: { title: string; description: string; estimation: number }
) => {
    return (
        <Card className="max-w-80 min-h-32 bg-white shadow-md rounded-lg p-4">
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
            <CardFooter>
                <Button variant="destructive">
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
                <Button variant="light">
                    Edit
                    <svg
                        className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m10.8 17.8-6.4 2.1 2.1-6.4m4.3 4.3L19 9a3 3 0 0 0-4-4l-8.4 8.6m4.3 4.3-4.3-4.3m2.1 2.1L15 9.1m-2.1-2 4.2 4.2"
                        />
                    </svg>
                </Button>
            </CardFooter>
        </Card>
    );
};

export { ProjectCard };
