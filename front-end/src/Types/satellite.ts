export type Satellite = {
  positionGeodetic:
    | { longitude: number; latitude: number; height: number }
    | string;
  degreesLat: number;
  degreesLong: number;
  name: string;
  id: string;
  updatedAt: Date;
};
