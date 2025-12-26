import { useState } from "react";
import { AnimatedCode } from "react-animated-code";
import "./App.css";

function App() {
  const [customControlIndex, setCustomControlIndex] = useState(0);

  const basicExample = [
    "const greeting = 'Hello';",
    "const greeting = 'Hello World!';",
    "const greeting = 'Hello Universe!';",
  ];

  const filenameExample = [
    { code: "import React from 'react';", filename: "App.tsx" },
    { code: "import React, { useState } from 'react';", filename: "App.tsx" },
    {
      code: "import React, { useState, useEffect } from 'react';",
      filename: "App.tsx",
    },
  ];

  const reactExample = [
    {
      code: `function Counter() {
  return (
    <div>
      <h1>Count: 0</h1>
    </div>
  );
}`,
      filename: "Counter.tsx",
    },
    {
      code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
    </div>
  );
}`,
      filename: "Counter.tsx",
    },
    {
      code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
      filename: "Counter.tsx",
    },
  ];

  const pythonExample = [
    {
      code: "def greet():\n    print('Hello')",
      filename: "greet.py",
    },
    {
      code: "def greet(name):\n    print(f'Hello {name}')",
      filename: "greet.py",
    },
    {
      code: "def greet(name='World'):\n    print(f'Hello {name}!')\n    return f'Hello {name}!'",
      filename: "greet.py",
    },
  ];

  const customControlSteps = [
    "function greet() {\n  console.log('Hello');\n}",
    "function greet(name) {\n  console.log(`Hello ${name}`);\n}",
    "function greet(name = 'World') {\n  console.log(`Hello ${name}!`);\n}",
    "function greet(name = 'World') {\n  const message = `Hello ${name}!`;\n  console.log(message);\n  return message;\n}",
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>React Animated Code</h1>
        <p>Beautiful code transitions with smooth, Fireship-style animations</p>
        <a
          href="https://github.com/tonytangdev/react-animated-code"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </header>

      <div className="demos">
        <section className="demo-section">
          <h2>Basic Example</h2>
          <p>Simple code transitions with built-in navigation</p>
          <AnimatedCode code={basicExample} />
        </section>

        <section className="demo-section">
          <h2>With Filenames</h2>
          <p>Display filenames in the code header</p>
          <AnimatedCode code={filenameExample} />
        </section>

        <section className="demo-section">
          <h2>React Component Evolution</h2>
          <p>Watch a React component grow step by step</p>
          <AnimatedCode code={reactExample} lang="tsx" theme="github-dark" />
        </section>

        <section className="demo-section">
          <h2>Python with Dracula Theme</h2>
          <p>Different language and custom theme</p>
          <AnimatedCode
            code={pythonExample}
            lang="python"
            theme="dracula"
            duration={1000}
          />
        </section>

        <section className="demo-section">
          <h2>Without Line Numbers</h2>
          <p>Clean code display without line numbers</p>
          <AnimatedCode code={basicExample} lineNumbers={false} />
        </section>

        <section className="demo-section">
          <h2>Nord Theme</h2>
          <p>Beautiful Nord color scheme</p>
          <AnimatedCode code={reactExample} lang="tsx" theme="nord" />
        </section>

        <section className="demo-section">
          <h2>Custom Controls</h2>
          <p>
            Build your own navigation UI using controlled mode with currentIndex
          </p>
          <div className="custom-controls">
            <button
              onClick={() =>
                setCustomControlIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={customControlIndex === 0}
            >
              ← Previous
            </button>
            <span className="step-counter">
              Step {customControlIndex + 1} of {customControlSteps.length}
            </span>
            <button
              onClick={() =>
                setCustomControlIndex((prev) =>
                  Math.min(customControlSteps.length - 1, prev + 1),
                )
              }
              disabled={customControlIndex === customControlSteps.length - 1}
            >
              Next →
            </button>
          </div>
          <AnimatedCode
            code={customControlSteps}
            showControls={false}
            currentIndex={customControlIndex}
            onChange={setCustomControlIndex}
          />
        </section>

        <section className="demo-section">
          <h2>Auto-Play Mode</h2>
          <p>Automatically cycle through code snippets</p>
          <AnimatedCode
            code={reactExample}
            lang="tsx"
            autoPlay
            autoPlayInterval={3000}
            duration={600}
          />
        </section>
      </div>

      <footer className="footer">
        <p>Built with React Animated Code</p>
        <p>Powered by Shiki Magic Move</p>
      </footer>
    </div>
  );
}

export default App;
