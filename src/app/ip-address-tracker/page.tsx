// api for ip geo info https://ip-api.com/docs/api:json
// api for timezone UTC offset https://worldtimeapi.org/pages/examples
// map by https://react-leaflet.js.org/
// ref https://medium.com/@tomisinabiodun/displaying-a-leaflet-map-in-nextjs-85f86fccc10c

'use client';
import { useEffect, useMemo, useState } from 'react';
import styles from './styles/styles.module.scss';
import dynamic from 'next/dynamic';
import { MdCancel } from "react-icons/md";
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
    'ip address': undefined,
    'location': undefined,
    'timezone': undefined,
    'isp': undefined,
  });
  const [showFeedback, setshowFeedback] = useState(false);

  
  const handleShowFeedback = async () => {
    setshowFeedback(true);
    setTimeout(() => {
      setshowFeedback(false);
    }, 3000);
  };

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
      // console.log(resGeo.data);
      if (resGeo.data.status === 'fail') {
        // console.log('invalid IP address!');
        handleShowFeedback();
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

  const handleSetCurrIP = async (userInput: string) => {
    try {
      let url = `http://ip-api.com/json/${userInput}`;
      const resGeo = await axios.get(url);
      if (resGeo.data.status === 'fail') {
        handleShowFeedback();
        return; 
      } else {
        setCurrIP(userInput);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      handleSetCurrIP(userInput);
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
            onClick={()=>{handleSetCurrIP(userInput)}}
          >
          </div>

          {/* feedback popup */}
          {showFeedback ? 
          <div className={styles.feedbackPopUp}>
            <div className={styles.feedbackProgressBar}></div>
            <div className={styles.feedbackProgressBarBg}></div>
            <MdCancel className={styles.feedbackIcon} /><p>Invalid IP address</p>
          </div> : <></>}
          

        </div>
        {/* another 4-col flex container for info display, map with array here */}
        <div className={styles.infoContainer}>
        {Object.keys(geoInfoProcessed).map((key) =>
          <div className={styles.singleInfoCard} key={key}>
            <p className={styles.subtitle}>{key.toUpperCase()}</p>
            {geoInfoProcessed[key] ?
            <p className={styles.detail}>{geoInfoProcessed[key]}</p> :
            <p className={styles.loadingtext}></p>}
            
          </div>
        )}
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