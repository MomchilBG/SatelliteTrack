export type Satellite = {
  name: string;
  id: string;
  line1: string;
  line2: string;
  ORBIT_POINTS: number;
  PERIOD_BETWEEN_POINTS: number;
};

export type SatelliteInfo = {
  line1: string;
  line2: string;
  name: string;
  id: string;
  ORBIT_POINTS: number;
  PERIOD_BETWEEN_POINTS: number;
  location: {
    height: number;
    degreesLat: number;
    degreesLong: number;
    velocity: number;
  };
};
