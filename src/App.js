import { useEffect, useRef } from 'react';
import './App.css';
import hljs from 'highlight.js';
function App() {
  const text = `
    ul {
      min-height: 0;
    }
    .sub {
      display: grid;
      grid-template-rows: 0fr;
      transition: 0.3s;
      overflow: hidden;
    }
    :checked ~ .sub {
      grid-template-rows: 1fr;
    }
    .txt {
      animation: color .001s .5 linear forwards;
    }
    @keyframes color {
      from {
        color: var(--c1)
      }
      to {
        color: var(--c2)
      }
    }
  `
  const lang = 'css'
  return (
    <div className="App">
      <h1>CSS highlight API</h1>
      <HighlightText text={text} lang={lang} />
    </div>
  );
}

function HighlightText({ text, lang }) {
  const codeRef = useRef(null);
  useEffect(() => {
    highlightsAction(codeRef.current)
  }, [])
  return (
    <pre ref={codeRef} className="editor" id="code" lang={lang} onInput={() => highlightsAction(codeRef.current)} >
      {text}
    </pre>
  )
}

const highlightsAction = function (pre) {
  console.log(pre)
  pre.normalize();
  const words = hljs.highlight(pre.textContent, {
    language: pre.getAttribute("lang"),
  })._emitter.rootNode.children;
  console.log(words);
  CSS.highlights.clear();
  const nodes = pre.firstChild;
  const text = nodes.textContent;
  const highlightMap = {};
  let startPos = 0;
  words
    .filter((el) => el.scope)
    .forEach((el) => {
      const str = el.children[0];
      const scope = el.scope;
      const index = text.indexOf(str, startPos);
      if (index < 0) {
        return;
      }
      const item = {
        start: index,
        scope: scope,
        end: index + str.length,
        str: str,
      };
      if (highlightMap[scope]) {
        highlightMap[scope].push(item);
      } else {
        highlightMap[scope] = [item];
      }
      startPos = index + str.length;
    });
  console.log(highlightMap);
  Object.entries(highlightMap).forEach(function ([k, v]) {
    const ranges = v.map(({ start, end }) => {
      const range = new Range();
      range.setStart(nodes, start);
      range.setEnd(nodes, end);
      return range;
    });
    if (CSS.highlights) {
      /* eslint-disable no-undef */
      const highlight = new Highlight(...ranges.flat());
      CSS.highlights.set(k, highlight);
    }
  });
};

export default App;
