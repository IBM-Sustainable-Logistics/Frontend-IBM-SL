import React, { useState, useEffect } from 'react';

// Define a type for the project data
type Project = {
  id: string;
  name: string;
  description: string;
  // add any other project related fields here
};

// A single project card component
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      {/* Add more project details here */}
    </div>
  );
};

// The dashboard component
const Dashboard: React.FC = () => {
  // State to hold the list of projects
  const [projects, setProjects] = useState<Project[]>([]);

  // Effect to fetch projects data from an API or other source
  useEffect(() => {
    const fetchProjects = async () => {
      // Replace with actual API call
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  return (
    <div className="dashboard">
      <h1>Projects Dashboard</h1>
      <div className="projects-list">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

