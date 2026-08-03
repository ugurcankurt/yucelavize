import turkeyData from './turkey-cities.json';

export interface City {
  name: string;
  plate: string;
  counties: string[];
}

export const getCities = () => {
  return turkeyData.map(city => ({
    name: city.name,
    plate: city.plate
  })).sort((a, b) => a.plate.localeCompare(b.plate));
};

export const getDistricts = (cityName: string) => {
  const city = turkeyData.find(c => c.name.toLowerCase() === cityName.toLowerCase());
  return city ? city.counties.sort((a, b) => a.localeCompare(b, 'tr-TR')) : [];
};

export const getCityByPlate = (plate: string) => {
  return turkeyData.find(c => c.plate === plate);
};
