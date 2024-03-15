import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './ui/accordion'

import { Card, CardContent } from "app/components/ui/card"

const ProjectOverview = () => {
    return (
        <>
            <div className="mx-30 my-6 flex flex-col items-center"> 
                <h2 className="text-2xl font-bold mb-4">Information about project</h2> 
                <div className="grid grid-cols-3 gap-4 content-center mx-auto justify-end">
                    <div className="p-1">
                        <Card className="w-96">
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <Accordion type="single" collapsible className="w-full">
                                    <div>
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="text-lg">1: Truck</AccordionTrigger>
                                            <AccordionContent className="text-lg">
                                                Destination: <b>Astana (KZ)</b> to <b>Aktau (KZ)</b>
                                            </AccordionContent>
                                            <AccordionContent className="text-lg">
                                                <b>Destination length:</b> 2700 km
                                            </AccordionContent>
                                            <AccordionContent className="text-lg">
                                                <b>CO2 emission estimation:</b> 15
                                            </AccordionContent>
                                        </AccordionItem>
                                    </div>
                                    <div>
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger className="text-lg">2: Cargo Ship</AccordionTrigger>
                                            <AccordionContent className="text-lg">
                                                Destination: <b>Aktau (KZ)</b> to <b>Baku (AZ)</b>
                                            </AccordionContent>
                                            <AccordionContent className="text-lg">
                                                <b>Destination length:</b> 380 km
                                            </AccordionContent>
                                            <AccordionContent className="text-lg">
                                                <b>CO2 emission estimation:</b> 7
                                            </AccordionContent>
                                        </AccordionItem>
                                    </div>
                                    <div>
                                        <AccordionItem value="item-3">
                                            <AccordionTrigger className="text-lg">3: Truck</AccordionTrigger>
                                            <AccordionContent className="text-lg">
                                                Destination: <b>Baku (AZ)</b> to <b>Tblisi (GE)</b>
                                            </AccordionContent>
                                            <AccordionContent className="text-lg">
                                                <b>Destination length:</b> 450 km
                                            </AccordionContent>
                                            <AccordionContent className="text-lg">
                                                <b>CO2 emission estimation:</b> 17
                                            </AccordionContent>
                                        </AccordionItem>
                                    </div>
                                    <div>
                                        <AccordionItem value="item-4">
                                            <AccordionTrigger className="text-lg font-bold"><b>Project summaries</b></AccordionTrigger>
                                            <AccordionContent className="text-lg">
                                                <b>Total destination:</b> 3.530 km
                                            </AccordionContent>
                                            <AccordionContent className="text-lg">
                                                <b>Total CO2 emission estimation:</b> 39
                                            </AccordionContent>
                                        </AccordionItem>
                                    </div>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectOverview;
