import React, { useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "app/components/ui/pagination";

import { Button } from "app/components/ui/button.js";
import { ProjectCard } from "app/components/ProjectCard.js";
import { Input } from "app/components/ui/input.js";
import Dashboard from "app/components/dashboard";


const ProjectsPage = () => {
    return (
        <div className="max-h-lvh">
            <Dashboard />
        </div>
    );
};

export default ProjectsPage;
