
 interface TransportMethod {
    value: string;
    label: string;
}

interface TransportListItem {
    transport_form: string;
    distance_km: number;
}

const transportMethods: TransportMethod[] = [
    { value: "cargoship", label: "Cargoship" },
    { value: "aircraft", label: "Aircraft" },
    { value: "train", label: "Train" },
    { value: "truck", label: "Truck" },
];


export { transportMethods };

export type { TransportMethod, TransportListItem  };