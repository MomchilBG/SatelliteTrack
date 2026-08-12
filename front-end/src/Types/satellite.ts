export type fetchedTLEs = {
  name: string;
  id: string;
  line1: string;
  line2: string;
  ORBIT_POINTS: number;
  PERIOD_BETWEEN_POINTS: number;
};

export type Satellite = {
  name: string;
  id: string;
  line1: string;
  line2: string;
  ORBIT_POINTS: number;
  PERIOD_BETWEEN_POINTS: number;
  key: string;
  visible: boolean;
  loaded: boolean;
};

export type SatelliteInfo = {
  name: string;
  id: string;
  line1: string;
  line2: string;
  ORBIT_POINTS: number;
  PERIOD_BETWEEN_POINTS: number;
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
