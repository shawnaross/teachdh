import React, {useState, useEffect} from 'react';
import {flatten, pipe, pluck, uniq} from 'ramda';

// 1) Grab the categories key from each object in the array
// 2) Flatten the resulting array (remove nesting)
// 3) Remove non-unique values
const getCategories = pipe(pluck('categories'), flatten, uniq);

const Categories = (props) => {
  const {
    data,
    current,
    setCurrent,
  } = props;

  // We use state to track categories so we only have to calculate it when 
  // categories changes (which should only happen at load):
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    setCategories(getCategories(data))
  }, [data])

  // Event handler for when current is changed:
  const handleCurrent = (ev) => {
    setCurrent(ev.target.innerText === current ? false : ev.target.innerText);
  }

  return (<ul>
    {categories.map((category, i) => (
      <li key={i} className={current === category ? 'active' : ''}><button onClick={handleCurrent}>{category}</button></li>
    ))}
  </ul>)
}

export default Categories;
