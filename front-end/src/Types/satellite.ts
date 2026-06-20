export type Satellite = {
  location: {
    height: number;
    degreesLat: number;
    degreesLong: number;
    velocity: number;
  } | null;
  name: string;
  id: string;
  path: number[][][];
};
