// api for ip geo info https://ip-api.com/docs/api:json
// api for timezone UTC offset https://worldtimeapi.org/pages/examples
// map by https://react-leaflet.js.org/
// ref https://medium.com/@tomisinabiodun/displaying-a-leaflet-map-in-nextjs-85f86fccc10c

'use client';
import { useEffect, useMemo, useState } from 'react';
import styles from './styles/styles.module.scss';
import dynamic from 'next/dynamic';
const axios = require('axios');



export default function Page() {
  const [currIP, setCurrIP] = useState<string | undefined>(undefined);
  const [userInput, setUserInput] = useState('');
  const [pos, setPos] = useState([0,0]); // for <Map/>, [lon, lat]
  const [geoInfo, setGeoInfo] = useState({
    ip: '',
    city: '',
    region: '',
    zip: '',
    timezoneCity: '',
    UTCOffset: '',
    isp: '',
    lon: '',
    lat: '',
  });
  const [geoInfoProcessed, setGeoInfoProcessed] = useState<any>({
    'ip address': '',
    'location': '',
    'timezone': '',
    'isp': '',
  });

  // const Map = dynamic(() => import('./components/map'), {
  //   ssr: false,
  // });

  const mapUpdate = () => {
    const Map = dynamic(() => import('./components/map'), {
      ssr: false,
    });
    return Map;
  }

  const Map = useMemo(() => mapUpdate(), [pos]);

  const updateData = async(url: string) => {

    try {
      if (!currIP) { return; }
      const resGeo = await axios.get(url);
      console.log(resGeo.data);
      if (resGeo.data.status === 'fail') {
        console.log('invalid IP address!');
        return; 
      }
      const resUTC = await axios.get(`http://worldtimeapi.org/api/timezone/${resGeo.data.timezone}`);
      const newInfo = {
        ip: resGeo.data.query,
        city: resGeo.data.city,
        region: resGeo.data.region,
        zip: resGeo.data.zip,
        timezoneCity: resGeo.data.timezone,
        UTCOffset: resUTC.data.utc_offset,
        isp: resGeo.data.isp,
        lon: resGeo.data.lon,
        lat: resGeo.data.lat,
      };
      setGeoInfo(newInfo);
      setPos([Number(resGeo.data.lat), Number(resGeo.data.lon)])
      setGeoInfoProcessed({
        'ip address': resGeo.data.query,
        'location': `${resGeo.data.city}, ${resGeo.data.region} ${resGeo.data.zip}`,
        'timezone': `UTC ${resGeo.data.UTCOffset}`,
        'isp': resGeo.data.isp,
      });
      
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // init
    const loadCurrIP = async() => {
      try {
        const res = await axios.get('https://api.ipify.org?format=json');
        setCurrIP(res.data.ip);
        // await setCurrIP('192.212.174.101');
      } catch (err) {
        console.error(err);
      }
    }

    loadCurrIP();
  }, []);

  useEffect(() => {
    try {
      let url = `http://ip-api.com/json/${currIP}`;
      updateData(url);
    } catch (err) {
      console.error(err);
    }
  }, [currIP])


  // useEffect(() => {
  //   //https://medium.com/@jihdeh/using-the-spread-operator-to-ensure-re-rendering-in-react-components-7696f6dade9a#:~:text=The%20spread%20operator%20is%20used,re%2Drender%20of%20the%20component.
    
  //   console.log('called! geoInfo effect');
  //   // console.log(JSON.stringify(geoInfo));
  // }, [geoInfo]);

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      setCurrIP(userInput);
    }
  }

  return (
    <div className={styles.bodyContainer}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />
      
      {/* flex layout for main components (larger z-index) */}
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>IP Address Tracker</h1>
        <div className={styles.inputContainer}>
          <input
            className={styles.inputbox}
            type="text"
            placeholder={'Search for any IP address or domain'}
            value={userInput}
            onKeyDown={handleKeyDown}
            onChange={(e) => setUserInput(e.target.value)} />
          <div
            className={styles.button}
            onClick={()=>{setCurrIP(userInput)}}
          >
          </div>
        </div>
        {/* another 4-col flex container for info display, map with array here */}
        <div className={styles.infoContainer}>
        {Object.keys(geoInfoProcessed).map((key) =>
          <div className={styles.singleInfoCard} key={key}>
            <p className={styles.subtitle}>{key.toUpperCase()}</p>
            <p className={styles.detail}>{geoInfoProcessed[key]}</p>
          </div>
        )}
          {/* <p>hehe {geoInfoProcessed['ip address']}</p>
          <p>mmm {geoInfoProcessed['location']}</p> */}
        </div>
      </div>


      {/* bg flex display */}
      <div className={styles.backgroundContainer}>
        <div className={styles.top}></div>
        <Map pos={pos} />
      </div>
    </div>
  );
}