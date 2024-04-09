import React, { useEffect, useState } from "react";
import { Button } from "../ui/button.tsx";
import { ProjectCard } from "../ui/ProjectCard.tsx";
import { Input } from "../ui/input.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination.tsx";
import { project } from "../../lib/Transport.ts";
import CreateProject from "./dialogs/createproject.tsx";

interface DashboardProps {
  Projects: project[];
  UserId: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  Projects,
  UserId,
}: DashboardProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold my-2 text-center">My Projects</h1>
      <div className="flex flex-col mx-10">
        <div className="w-full flex flex-row justify-between my-10">
          <Input
            type="text"
            placeholder="Search for a project"
            className="w-full"
          />
          <CreateProject UserId={UserId} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 justify-self-stretch max-w-full gap-4">
          {Projects.map((p, index) => {
            return (
              <ProjectCard
                key={index}
                id={p.id}
                title={p.title}
                description={p.description}
                emissions={p.emissions}
              />
            );
          })}
        </div>

        <div className="my-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
