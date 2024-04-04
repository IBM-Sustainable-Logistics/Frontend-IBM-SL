
export const truckTransportMethods = [
    "truck",
    "etruck",
] as const;

export const transportMethods = [
    ...truckTransportMethods,
    "cargoship",
    "aircraft",
    "train",
] as const;

export type TruckTransportMethod = typeof truckTransportMethods[number];
export type TransportMethod = typeof transportMethods[number];

export const isTruckTransportMethod = (method: TransportMethod): boolean =>
    truckTransportMethods.includes(method as TruckTransportMethod);

export const getTransportMethodLabel = (method: TransportMethod): string => {
    switch (method) {
        case "truck":       return "Truck";
        case "etruck":      return "Electric Truck";
        case "cargoship":   return "Cargoship";
        case "aircraft":    return "Aircraft";
        case "train":       return "Train";
    }
}

export type Address = { city: string, country: string };

export type Stage = {
    usesAddress: false,
    transportMethod: TransportMethod,
    distance: number,
} | {
    usesAddress: true,
    transportMethod: TruckTransportMethod,
    from: Address,
    to: Address,
};

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

