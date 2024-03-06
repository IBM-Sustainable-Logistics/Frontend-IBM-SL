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
    <>
      <h1 className='text-3xl font-bold mb-4 text-center'>My Projects</h1>
      <div className='flex flex-wrap gap-4 justify-center max-w-4/5'>
        <ProjectCard
          title='Project x'
          description='Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'
          estimation={10.0}
        />
        <ProjectCard
          title='Project x'
          description='Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'
          estimation={10.0}
        />
        <ProjectCard
          title='Project x'
          description='Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'
          estimation={10.0}
        />
        <ProjectCard
          title='Project x'
          description='Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'
          estimation={10.0}
        />
        <ProjectCard
          title='Project x'
          description='Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'
          estimation={10.0}
        />
        <ProjectCard
          title='Project x'
          description='Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'
          estimation={10.0}
        />
      </div>
    </>
  );
};

export default Dashboard;
