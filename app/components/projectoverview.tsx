import React, { useEffect, useState } from "react";
import { Button } from "./ui/button.tsx";
import { ProjectCard } from "./ProjectCard.tsx";
import { Input } from "./ui/input.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./ui/pagination";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog.tsx";

const ProjectOverview = () => {
    return (
        <>
            <h1>Here goes the project details...</h1>
        </>
    );
};

export default ProjectOverview;
