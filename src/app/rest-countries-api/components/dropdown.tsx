import { useState } from "react";

export default function Dropdown ({handleFilter}: {handleFilter:any}) {
  const [selectedOption, setSelectedOption] = useState('');
  const options = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  const handleChange = (event: any) => {
    console.log(event.target.value);
    setSelectedOption(event.target.value);
    handleFilter(event.target.value);
  };

  return (
    <form>
      <select value={selectedOption} onChange={handleChange}>
        <option value="">Filter by Region</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </form>
  );

};