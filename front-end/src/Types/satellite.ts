export type fetchedTLEs = {
  name: string;
  id: string;
  line1: string;
  line2: string;
};

export type Satellite = {
  name: string;
  id: string;
  line1: string;
  line2: string;
  key: string;
  visible: boolean;
  loaded: boolean;
};

export type SatelliteInfo = {
  name: string;
  id: string;
  line1: string;
  line2: string;
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

export type PostSatelliteResponse = {
  success: boolean;
  satellite: fetchedTLEs[];
  message: string;
};
