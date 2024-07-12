export interface Country {
  nationName: string;
  population: number;
  region: string;
  capitalCity: string[];
  flagEmoji: string;
  nativeName: string[];
  subRegion: string;
  tld: string[];
  currencies: string[];
  languages: string[];
  borderCountries: string[]; // in cca2, ccn3, cca3 or cioc
};