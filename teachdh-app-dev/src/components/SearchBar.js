import React from 'react';

const SearchBar = (props) => {
  const {
    pattern,
    setPattern
  } = props;
  const handlePattern = ev => setPattern(ev.target.value);
  return (<input type="text" value={pattern} onChange={handlePattern} />);
}

export default SearchBar;
