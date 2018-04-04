export class Location {
  place_id: string;
  description: string;
  lat: number;
  lng: number;
  isActive: boolean;
  isVisible: boolean;
}

export const allLocations: Location[] = [
  {
    description: 'San Francisco, CA, USA',
    place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
    lat: 37.7749295,
    lng: -122.41941550000001,
    isActive: false,
    isVisible: true
  },
  {
    description: 'Denver, CO, USA',
    place_id: 'ChIJzxcfI6qAa4cR1jaKJ_j0jhE',
    lat: 39.7392358,
    lng: -104.990251,
    isActive: true,
    isVisible: true
  },
  {
    description: 'Los Angeles, CA, USA',
    place_id: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
    lat: 34.0522342,
    lng: -118.2436849,
    isActive: false,
    isVisible: true
  },
  {
    description: 'Barcelona, Spain',
    place_id: 'ChIJ5TCOcRaYpBIRCmZHTz37sEQ',
    lat: 41.38506389999999,
    lng: 2.1734034999999494,
    isActive: false,
    isVisible: true
  }
];
