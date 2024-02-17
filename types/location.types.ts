export interface IMapBoxLocation {
  features: IMapBoxFeature[];
  type: string;
}

export interface IMapBoxFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: IMapBoxProperties;
  text: string;
  place_name: string;
  bbox: [number, number, number, number];
  center: [number, number];
  geometry: IMapBoxGeometry;
  // context: IMapBoxContext[];
}

export interface IMapBoxProperties {
  accuracy: string;
}

export interface IMapBoxGeometry {
  type: string;
  coordinates: [number, number];
}
