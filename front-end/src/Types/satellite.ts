export type fetchedTLEs = {
  name: string;
  id: string;
  line1: string;
  line2: string;
  lastUpdated: Date;
};

export type Satellite = {
  name: string;
  id: string;
  line1: string;
  line2: string;
  lastUpdated: Date;
  key: string;
  visible: boolean;
  loaded: boolean;
};

export type Location = {
  location: {
    height: number;
    degreesLat: number;
    degreesLong: number;
    velocity: number;
  };
  loaded: boolean;
};

export type SatelliteInfo = {
  name: string;
  id: string;
  line1: string;
  line2: string;
  lastUpdated: Date;
  key: string;
  visible: boolean;
  loaded: boolean;
  location: {
    height: number;
    degreesLat: number;
    degreesLong: number;
    velocity: number;
  };
};

export type APIResponse = {
  success: boolean;
  satellites: fetchedTLEs[] | null;
  message: string;
};
