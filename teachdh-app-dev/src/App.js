import React, {useState, useEffect} from 'react';
import Fuse from 'fuse.js';
import {contains, filter, propSatisfies} from 'ramda';
import Categories from './components/Categories';
import Questions from './components/Questions';
import SearchBar from './components/SearchBar';

const filterCategory = (list, category) => filter(propSatisfies(contains(category), 'categories'), list)

const App = (props) => {
  const {
    data
  } = props;
  const fuse = new Fuse(data, {
    keys: [
      'rendered_content',
      'title',
    ]
  });
  const [current, setCurrent] = useState(false);
  const [results, setResults] = useState([]);
  const [pattern, setPattern] = useState('');
  useEffect(() => {
    setResults(fuse.search(pattern).map(x => x.item));
  }, [pattern]);
  useEffect(() => {
    if (current === false && pattern === '') {
      setResults([]);
    } else {
      setResults(filterCategory(data, current))
    }
  }, [current])

  return (<div>
    <Categories data={data} current={current} setCurrent={setCurrent} />
    <SearchBar pattern={pattern} setPattern={setPattern} />
    <Questions data={data} results={results} />
  </div>);
}

export default App;
