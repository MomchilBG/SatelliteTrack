export type Satellite = {
  location: { height: number; degreesLat: number; degreesLong: number } | null;
  name: string;
  id: string;
  path: number[][][];
};
