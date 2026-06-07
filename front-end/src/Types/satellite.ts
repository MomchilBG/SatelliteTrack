export type Satellite = {
  positionGeodetic: { longitude: number; latitude: number; height: number };
  degreesLat: number;
  degreesLong: number;
  name: string;
  id: string;
  updatedAt: Date;
};
