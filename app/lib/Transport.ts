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

export type FormData = {
  stages: (Stage)[];
  emissions:
    | {
      totalKg: number;
      stages: {
        kg: number;
        transportMethod: TransportMethod;
      }[];
    }
    | undefined;
};

export type TruckTransportMethod = typeof truckTransportMethods[number];
export type TransportMethod = typeof transportMethods[number];

export const isTruckTransportMethod = (method: TransportMethod): boolean =>
  truckTransportMethods.includes(method as TruckTransportMethod);

export const getTransportMethodLabel = (method: TransportMethod): string => {
  switch (method) {
    case "truck":
      return "Truck";
    case "etruck":
      return "Electric Truck";
    case "cargoship":
      return "Cargoship";
    case "aircraft":
      return "Aircraft";
    case "train":
      return "Train";
  }
};

export type Address = {
  city: string;
  country: string;
};

export const emptyAddress = {
  city: "",
  country: "",
} as const;

export type Estimated = {
  emission: number | undefined;
};

export type Stage =
  & ({
    usesAddress: false;
    transportMethod: TransportMethod;
    distance: number;
  } | {
    usesAddress: true;
    transportMethod: TruckTransportMethod;
    from: Address;
    to: Address;
    distance_km: number;
  })
  & {
    cargo: number;
  }
  & Estimated;

export type Route = {
  name: string;
  stages: Stage[];
} & Estimated;

export type Chain = {
  routes: Route[];
} & Estimated;

export interface project {
  created_at: string;
  description: string | null;
  chain: Chain;
  routes: Route[];
  emissions: number;
  id: string;
  title: string;
  user_id: string;
}

export interface CalculatorInstance {
  id: number;
}

export interface emissions {
  stages: {
    kg: number | null;
    transportMethod: string;
  }[];
  totalKg: number | null;
}
