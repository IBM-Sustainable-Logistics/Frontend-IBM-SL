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

const Dashboard = () => {
  return (
    <>
      <h1 className='text-3xl font-bold my-2 text-center'>My Projects</h1>
      <div className='flex flex-col mx-10'>
        <div className='w-full flex flex-row justify-between my-10'>
          <Input
            type='text'
            placeholder='Search for a project'
            className='w-full'
          />
          <Dialog>
            <DialogTrigger>
              <Button variant='outline'>
                <div
                  className='flex 
            
            items-center justify-between'
                >
                  <span className='mr-2'>Create a project</span>
                  <svg
                    className='w-4 h-4 text-gray-800 dark:text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 12h14m-7 7V5'
                    />
                  </svg>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a project</DialogTitle>
                <DialogDescription>
                  <div className='flex flex-col gap-x-6'>
                    <Input type='text' placeholder='Title' className='w-full' />
                    <Input
                      type='text'
                      placeholder='Description'
                      className='w-full'
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogClose asChild>
                <Button
                  className='border-black border rounded'
                  variant='secondary'
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  className='border-black border rounded'
                  variant='primary'
                >
                  Create
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>

        <div className='grid grid-cols-3 justify-self-stretch max-w-full gap-4'>
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

        <div className='my-10'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='#' />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#'>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
