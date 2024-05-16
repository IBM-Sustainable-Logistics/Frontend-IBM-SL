import React, { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard.tsx";
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
import { defaultChain } from "../calculator/Calculator.tsx";

interface DashboardProps {
  Projects: project[];
  UserId: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  Projects,
  UserId,
}: DashboardProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const [filteredProjectsByUser, setFilteredProjectsByUser] = useState<
    project[]
  >([]);

  useEffect(() => {
    const filtered = Projects.filter((project) => project.user_id === UserId);
    setFilteredProjectsByUser(filtered);
  }, [Projects, UserId]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = filteredProjectsByUser.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const projectsOnPage = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold my-2 text-center">My Projects</h1>
      <div className="flex flex-col mx-10">
        <div className="w-full flex flex-row justify-between my-10">
          <Input
            type="text"
            placeholder="Search for a project"
            className="w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
          <CreateProject
            UserId={UserId}
            chain={defaultChain()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 justify-self-stretch max-w-full gap-4">
          {projectsOnPage.map((p, index) => {
            return (
              <ProjectCard
                key={index}
                id={p.id}
                title={p.title}
                description={p.description}
                routes={p.routes}
                emission={p.emissions}
                chain={p.chain}
              />
            );
          })}
        </div>

        <div className="my-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  size={"default"}
                  onClick={handlePreviousPage}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" size={"default"}>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  size={"default"}
                  onClick={handleNextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
