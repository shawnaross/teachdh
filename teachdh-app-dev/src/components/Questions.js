import React from 'react';
import ReactMarkdown from 'react-markdown';

const Questions = (props) => {
  const {
    data,
    results,
  } = props;

  return (<section>
    {(results.length === 0 ? data : results).map((question, i) => (
      <article key={i}>
        <header>
          <h1>{question.title}</h1>
          <ul>
            {question.categories.map((category, i) => (
              <li key={i}>{category}</li>
            ))}
          </ul>
        </header>
        <main>
          <ReactMarkdown source={question.rendered_content} />
        </main>
      </article>
    ))}
  </section>);
}

export default Questions;
