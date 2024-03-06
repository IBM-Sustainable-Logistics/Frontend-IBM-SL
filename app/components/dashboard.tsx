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
import { ProjectCard } from "./ProjectCard.tsx";

const Dashboard = () => {
    return (
        <ProjectCard title="Project x" description="Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat." estimation={10.00}/>
    );
};

export default Dashboard;
