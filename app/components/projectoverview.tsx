import React from "react";
import { project } from "../lib/Transport.ts";

interface Props {
  project: project;
}

const ProjectOverview: React.FC<Props> = ({ project }) => {
  return (
    /* create a project page */
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>{project.emissions.totalKg ? project.emissions.totalKg : null}</p>
    </div>
  );
};

export default ProjectOverview;
