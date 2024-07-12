'use client';

import Link from 'next/link';
import { Country } from '../type';
import { useEffect, useState } from 'react';

export default function CountryPage ({searchParams, }: {
  searchParams: {
    nationName: string;
  }
}) {
  const [country, setCountry] = useState<Country | undefined>(undefined);


  // helper functions
  const removeDuplicate = (arr: string[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };

  useEffect(() => {
    const url = `https://restcountries.com/v3.1/name/${searchParams.nationName}?fullText=true`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    const dataInit = async () => {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        const countryRawData = data[0];

        let nativeNameCommon: string[] = [];
          for (const nativeName in countryRawData.name.nativeName) {
            nativeNameCommon.push(countryRawData.name.nativeName[nativeName].common);
          }
          nativeNameCommon = removeDuplicate(nativeNameCommon);
        
        let currencies: string[] = [];
        for (const currency in countryRawData.currencies) {
          currencies.push(currency);
        }
        currencies = removeDuplicate(currencies);
      
        let languages: string[] = [];
        for (const lan in countryRawData.languages) {
          languages.push(countryRawData.languages[lan]);
        }

        const newCountry: Country = await {
          nationName: countryRawData.name.common,
          population: Number(countryRawData.population),
          region: countryRawData.region,
          capitalCity: countryRawData.capital,
          flagEmoji: countryRawData.flag,
          nativeName: nativeNameCommon,
          subRegion: countryRawData.subregion,
          tld: countryRawData.tld,
          currencies: currencies,
          languages: languages,
          borderCountries: countryRawData.borders ? countryRawData.borders : [],
        };

        setCountry(newCountry);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    dataInit();

  }, []);

  return (
    <div>
      <Link href={`/rest-countries-api/`}><button>Back</button></Link>
      <p>{country?.flagEmoji}</p>
      <p>{country?.nationName}</p>
      <p>Native Name: {country?.nativeName}</p>
      <p>Population: {country?.population}</p>
      <p>Region: {country?.region}</p>
      <p>Sub Region: {country?.subRegion}</p>
      <p>Capital: {country?.capitalCity}</p>
      <p>Top Level Domain: {country?.tld}</p>
      <p>Currencies: {country?.currencies}</p>
      <p>Languages: {country?.languages}</p>
      <p>Border Countries:</p>
      <ul>
        {country?.borderCountries.map((bc, index) => (
          <li key={index}><Link href={{
            pathname: `/rest-countries-api/`,
          }}>{bc}</Link></li>
        ))}
      </ul>
    </div>
  );
};