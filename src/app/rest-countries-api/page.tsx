'use client';

import { Country } from './type';
import Dropdown from './components/dropdown';
import styles from './styles/styles.module.scss';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [displayContent, setDisplayContent] = useState<Country[]>([]);
  const [userInput, setUserInput] = useState<string>(""); // country

  // helper functions
  const removeDuplicate = (arr: string[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };
  // search matched countries
  const handleSearch = () => {
    let searchResult: Country[] = [];
    // check if the first few letters of each nation name matches the user input
    searchResult = countries.filter((country) => {
      const nationName = country.nationName;
      return nationName.substring(0, userInput.length).toLowerCase() === userInput.toLowerCase();
    });
    setDisplayContent((displayContent) => [...searchResult]);
  }

  const handleFilter = (keyword: string) => {
    if (keyword === 'All' || keyword === '') {
      // const temp = [...countries];
      setDisplayContent(countries);
      return;
    };
    let filteredResult = countries.filter((country) => {
      return country.region.toLowerCase() === keyword.toLowerCase();
    });
    setDisplayContent((displayContent) => [...filteredResult]);
  }

  // page init
  useEffect(() => {
    const url = 'https://restcountries.com/v3.1/all';
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
  
        for (const country of data) {
          
          // console.log(country.name.common);
          // console.log(country.population);
          // console.log(country.region);
          // console.log(country.capital);
          // console.log(country.flag);
  
          let nativeNameCommon: string[] = [];
          for (const nativeName in country.name.nativeName) {
            nativeNameCommon.push(country.name.nativeName[nativeName].common);
          }
          nativeNameCommon = removeDuplicate(nativeNameCommon);
          // console.log(nativeNameCommon);
  
          // console.log(country.subregion);
          // console.log(country.tld);
  
          let currencies: string[] = [];
          for (const currency in country.currencies) {
            currencies.push(currency);
          }
          currencies = removeDuplicate(currencies);
          // console.log(currencies);
  
          let languages: string[] = [];
          for (const lan in country.languages) {
            languages.push(country.languages[lan]);
          }
          // console.log(languages);
          // console.log(country.borders);

          const newCountry: Country = await {
            nationName: country.name.common,
            population: Number(country.population),
            region: country.region,
            capitalCity: country.capital,
            flagEmoji: country.flag,
            nativeName: nativeNameCommon,
            subRegion: country.subregion,
            tld: country.tld,
            currencies: currencies,
            languages: languages,
            borderCountries: country.borders ? country.borders : [],
          };
          setDisplayContent((displayContent) => [...displayContent, newCountry]);
          setCountries((countries) => [...countries, newCountry]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    }
    dataInit();

  }, []);


  // // fetch & init data
  // fetch(url, options)
  //   .then(res => res.json())
  //   .then(data => {
  //     // console.log('API data:', data);
  //     // data.name.common; // nation name
  //     for (const country of data) {
        
  //       // console.log(country.name.common);
  //       // console.log(country.population);
  //       // console.log(country.region);
  //       // console.log(country.capital);
  //       // console.log(country.flag);

  //       let nativeNameCommon: string[] = [];
  //       for (const nativeName in country.name.nativeName) {
  //         nativeNameCommon.push(country.name.nativeName[nativeName].common);
  //       }
  //       nativeNameCommon = removeDuplicate(nativeNameCommon);
  //       // console.log(nativeNameCommon);

  //       // console.log(country.subregion);
  //       // console.log(country.tld);

  //       let currencies: string[] = [];
  //       for (const currency in country.currencies) {
  //         currencies.push(currency);
  //       }
  //       currencies = removeDuplicate(currencies);
  //       // console.log(currencies);

  //       let languages: string[] = [];
  //       for (const lan in country.languages) {
  //         languages.push(country.languages[lan]);
  //       }
  //       // console.log(languages);
  //       // console.log(country.borders);

  //       setCountries([...countries, {
  //         nationName: country.name.common,
  //         population: Number(country.population),
  //         region: country.region,
  //         capitalCity: country.capital,
  //         flagEmoji: country.flag,
  //         nativeName: nativeNameCommon,
  //         subRegion: country.subregion,
  //         tld: country.tld,
  //         currencies: currencies,
  //         languages: languages,
  //         borderCountries: country.borders ? country.borders : [],
  //       }])
  //     }

  //     let input = 'fr'; // country input
  //     let searchResult: Country[] = [];
  //     // check if the first few letters of each nation name matches the user input
  //     searchResult = countries.filter((country) => {
  //       const nationName = country.nationName;
  //       return nationName.substring(0, input.length).toLowerCase() === input.toLowerCase();
  //     });

  //   })
  //   .catch(err => console.log('API error:', err));
  

  return (
    <div className={styles.mainContainer}>
      <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} />
      <button onClick={handleSearch}>search</button>
      <Dropdown handleFilter={handleFilter}/>
      {/* <div className={styles.bg}>on page rest countries</div> */}
      <div className={styles.nationCardContainer}>
        {displayContent.map((country, index) =>
        <Link href={{
          pathname: `/rest-countries-api/countryPage`,
          query: {nationName: country.nationName,},
        }} className={styles.nationCard} key={index}>
          <p>{country.flagEmoji}</p>
          <p>{country.nationName}</p>
          <p>Population: {country.population}</p>
          <p>Region: {country.region}</p>
          <p>Capital: {country.capitalCity}</p>
        </Link>)}
      </div>
    </div>
  );
}