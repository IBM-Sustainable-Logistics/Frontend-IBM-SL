import { Json } from "./utils/types.ts";

interface TransportMethod {
    value: string;
    label: string;
}


//TODO refactor at some point to 
type TransportListItem = {
    transport_form: string;
    distance_km: number;
} | {
    transport_form: string;
    from: string;
    to: string;
}


export type TransportListItem2 = {
    to: string,
    from: string,
    distance: number,
    transportMethod: string
}

export interface project {
    created_at: string;
    description: string | null;
    emissions: number | null;
    stages: TransportListItem2[];
    id: string;
    title: string;
    user_id: string;
}

export interface CalculatorInstance {
    id: number;
  }


const transportMethods: TransportMethod[] = [
    { value: "cargoship", label: "Cargoship" },
    { value: "aircraft", label: "Aircraft" },
    { value: "train", label: "Train" },
    { value: "truck", label: "Truck" },
    { value: "etruck", label: "Electric Truck" },
];


export { transportMethods };

export type { TransportMethod, TransportListItem  };
