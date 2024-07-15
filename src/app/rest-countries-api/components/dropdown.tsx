import { useState } from "react";
import styles from '../styles/styles.module.scss';
import { FaAngleDown } from "react-icons/fa6";

export default function Dropdown ({handleFilter}: {handleFilter:any}) {
  const [selectedOption, setSelectedOption] = useState('Filter by Region');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const options = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  const handleChange = (target: string) => {
    setSelectedOption(target);
    handleFilter(target);
    setShowDropdown(false);
  };

  return (
    <div className={`${styles.dropdownContainer}`}>
      <div
        className={`${styles.selectedItem}`}
        onClick={() => {setShowDropdown(!showDropdown)}}
      >
        <p>{selectedOption}</p>
        <FaAngleDown />
      </div>
      
      {showDropdown ?
      <div className={`${styles.dropdown}`}
        onMouseLeave={() => {setShowDropdown(false)}}
      >
        {options.map((option, index) => (
          <span
            key={index}
            className={`${styles.span}`}
            onClick={() => {handleChange(option)}}
          >
            {option}
          </span>
        ))}
      </div> : <></>
      }
    </div>
  );

};