'use client';

import { Country } from '../type';
import { formatNumber } from '../utils/helper';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import NavBar from '../components/navBar';

import styles from '../styles/styles.module.scss';

import { FaArrowLeftLong } from "react-icons/fa6";

export default function CountryPage ({searchParams, }: {
  searchParams: {
    nationName: string;
  }
}) {
  const [currCountry, setCurrCountry] = useState<string>(searchParams.nationName);
  const [country, setCountry] = useState<Country | undefined>(undefined);

  // helper functions
  const removeDuplicate = (arr: string[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };

  const url = `https://restcountries.com/v3.1/name/${currCountry}?fullText=true`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  };

  const dataFetch = async () => {
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
      
      let borderCountries: string[] = [];
      if (countryRawData.borders) {
        for (const bc of countryRawData.borders) {
          const response = await fetch(`https://restcountries.com/v3.1/alpha/${bc}`);
          const data = await response.json();
          const countryName = data[0].name.common;
          borderCountries.push(countryName);
        }
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
        borderCountries: borderCountries,
        cca2: countryRawData.cca2,
      };

      setCountry(newCountry);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    dataFetch();
  }, []);

  useEffect(() => {
    dataFetch();
  }, [currCountry]);
  

  return (
    <div className={`${styles.bodyDetailPage}`}>
      <NavBar />
      <div className={`${styles.detailPageContainer}`}>

        <Link
          href={`/rest-countries-api/`}
          className={`${styles.returnButton}`}
        >
          <FaArrowLeftLong />
          <span>Back</span>
        </Link>

        <div className={`${styles.twoColContainer}`}>
          <div className={`${styles.left}`}>
            <img
              src={`https://flagcdn.com/${country?.cca2.toLowerCase()}.svg`}
              alt={`${country?.nationName}`}>
            </img>
          </div>
          <div className={`${styles.right}`}>
            <p className={`${styles.title}`}>{country?.nationName}</p>
            <div className={`${styles.propertyContainer}`}>
              <div>
                <p><span className={`${styles.property}`}>Native Name:</span> {country?.nativeName.join(', ')}</p>
                <p><span className={`${styles.property}`}>Population:</span> {formatNumber(country?.population)}</p>
                <p><span className={`${styles.property}`}>Region:</span> {country?.region}</p>
                <p><span className={`${styles.property}`}>Sub Region:</span> {country?.subRegion}</p>
                <p><span className={`${styles.property}`}>Capital:</span> {country?.capitalCity.join(', ')}</p>
              </div>
              <div>
                <p><span className={`${styles.property}`}>Top Level Domain:</span> {country?.tld.join(', ')}</p>
                <p><span className={`${styles.property}`}>Currencies:</span> {country?.currencies.join(', ')}</p>
                <p><span className={`${styles.property}`}>Languages:</span> {country?.languages.join(', ')}</p>
              </div>
            </div>
            <div className={`${styles.clickableTagsContainer}`}>
              <span className={`${styles.property}`}>Border Countries:</span>
              {
                country?.borderCountries.length === 0 ? ' none' :
                <ul className={`${styles.clickableTags}`}>
                  {country?.borderCountries.map((bc, index) => (
                  <Link
                    key={index}
                    className={`${styles.clickableTag}`}
                    href={{
                      pathname: `/rest-countries-api/countryPage`,
                      query: {nationName: bc,}
                    }}
                    onClick={() => {setCurrCountry(bc)}}
                  >{bc}
                  </Link>
                  ))}
                </ul>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};