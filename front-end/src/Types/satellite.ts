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
  key: string;
  line1: string;
  line2: string;
  ORBIT_POINTS: number;
  PERIOD_BETWEEN_POINTS: number;
  visible: boolean;
};

export type SatelliteInfo = {
  line1: string;
  line2: string;
  name: string;
  id: string;
  key: string;
  ORBIT_POINTS: number;
  PERIOD_BETWEEN_POINTS: number;
  visible: boolean;
  location: {
    height: number;
    degreesLat: number;
    degreesLong: number;
    velocity: number;
  };
};
