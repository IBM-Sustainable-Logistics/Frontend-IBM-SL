
interface TransportMethod {
    value: string;
    label: string;
}

type TransportListItem = {
    transport_form: string;
    distance_km: number;
} | {
    transport_form: string;
    from: string;
    to: string;
}

export interface project {
    created_at: string;
    description: string | null;
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
