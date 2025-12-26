# React Animated Code

A beautiful React component for animating code transitions with smooth, Fireship-style animations powered by [Shiki Magic Move](https://github.com/shikijs/shiki-magic-move). Perfect for presentations, tutorials, and interactive code demonstrations.

## Features

✨ **Smooth Animations** - Beautiful transitions between code states
🎨 **Syntax Highlighting** - Powered by Shiki with 100+ themes
🎬 **Multi-Code Navigation** - Display multiple code snippets with built-in navigation
📁 **Filename Display** - VS Code-style header with filename support
▶️ **Auto-Play** - Automatically cycle through code snippets
⚡ **Fast Loading** - Optimized highlighter initialization with instant fallback
📦 **Zero Config** - Works out of the box
🔧 **TypeScript Support** - Fully typed
🎯 **Customizable** - Control duration, stagger, themes, navigation, and more

## Installation

```bash
npm install react-animated-code
```

## Quick Start

```tsx
import { AnimatedCode } from 'react-animated-code';
import 'react-animated-code/style.css';

function App() {
  const codeSteps = [
    "const greeting = 'Hello';",
    "const greeting = 'Hello World!';",
    "const greeting = 'Hello Universe!';",
  ];

  return <AnimatedCode code={codeSteps} />;
}
```

## Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `CodeInput[]` | **required** | Array of code strings or objects with `{code, filename}` |
| `lang` | `string` | `'typescript'` | Programming language for syntax highlighting |
| `theme` | `string` | `'github-dark'` | Shiki theme name |
| `className` | `string` | `''` | CSS class for container |
| `duration` | `number` | `800` | Animation duration in milliseconds |
| `stagger` | `number` | `3` | Stagger delay between animated elements |
| `lineNumbers` | `boolean` | `true` | Show line numbers |

### Navigation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showControls` | `boolean` | `true` | Show built-in prev/next navigation buttons |
| `showFilename` | `boolean` | `true` | Show filename in header bar (if provided) |
| `initialIndex` | `number` | `0` | Initial code snippet index to display |

### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onNext` | `() => void` | Called when next button is clicked |
| `onPrev` | `() => void` | Called when previous button is clicked |
| `onChange` | `(index: number) => void` | Called when the code index changes |

### Auto-Play Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoPlay` | `boolean` | `false` | Enable auto-play mode |
| `autoPlayInterval` | `number` | `3000` | Delay between auto-play transitions (ms) |
| `autoPlayLoop` | `boolean` | `true` | Loop back to start when reaching the end |

## Examples

### Basic Multi-Code Navigation

```tsx
const codeSteps = [
  "const x = 1;",
  "const x = 2;",
  "const x = 3;",
];

<AnimatedCode code={codeSteps} />
```

### With Filenames

```tsx
const steps = [
  { code: "import React from 'react';", filename: "App.tsx" },
  { code: "import React, { useState } from 'react';", filename: "App.tsx" },
  { code: "import React, { useState, useEffect } from 'react';", filename: "App.tsx" },
];

<AnimatedCode code={steps} />
```

### Auto-Play for Presentations

```tsx
<AnimatedCode
  code={steps}
  autoPlay
  autoPlayInterval={4000}
  duration={600}
/>
```

### Custom Theme and Language

```tsx
const pythonSteps = [
  "def greet():\n    print('Hello')",
  "def greet(name):\n    print(f'Hello {name}')",
];

<AnimatedCode
  code={pythonSteps}
  lang="python"
  theme="dracula"
  duration={1000}
/>
```

### External Controls (Hide Built-in Navigation)

```tsx
function CodeDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      <AnimatedCode
        code={steps}
        showControls={false}
        initialIndex={currentIndex}
        onChange={setCurrentIndex}
      />
      <div className="my-custom-controls">
        <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}>
          Previous
        </button>
        <span>{currentIndex + 1} / {steps.length}</span>
        <button onClick={() => setCurrentIndex(prev => Math.min(steps.length - 1, prev + 1))}>
          Next
        </button>
      </div>
    </>
  );
}
```

### Tutorial-Style with Callbacks

```tsx
<AnimatedCode
  code={tutorialSteps}
  onChange={(index) => {
    console.log(`Now showing step ${index + 1}`);
    // Update tutorial text, highlight UI elements, etc.
  }}
  onNext={() => console.log('User clicked next')}
  onPrev={() => console.log('User clicked previous')}
/>
```

### Without Line Numbers

```tsx
<AnimatedCode
  code={steps}
  lineNumbers={false}
/>
```

### Custom Styling

```tsx
<AnimatedCode
  code={steps}
  className="my-custom-code-block"
/>
```

### Mixed String and Object Arrays

```tsx
const mixedSteps = [
  "console.log('Step 1');",
  { code: "console.log('Step 2');", filename: "demo.js" },
  "console.log('Step 3');",
];

<AnimatedCode code={mixedSteps} />
```

## Available Themes

Popular themes include:
- `github-dark` / `github-light`
- `nord`
- `dracula`
- `monokai`
- `one-dark-pro`
- `tokyo-night`

[See all available themes →](https://shiki.style/themes)

## Supported Languages

Supports 100+ languages including:
- JavaScript, TypeScript, JSX, TSX
- Python, Java, C++, Rust, Go
- HTML, CSS, SCSS, JSON
- And many more...

[See all supported languages →](https://shiki.style/languages)

## How It Works

The component automatically:
1. **Eagerly initializes** a Shiki syntax highlighter on module import for instant rendering
2. **Normalizes input** - Accepts both string arrays and objects with filenames
3. **Manages state** - Tracks current code index and auto-play status
4. **Calculates diffs** - When navigating between code snippets, calculates the difference
5. **Animates transitions** - Uses FLIP technique for smooth morphing animations

Lines that exist in both versions **move smoothly**, new lines **fade in**, and removed lines **fade out**.

### Animation Behavior

- **Navigation**: Clicking next/prev triggers smooth code transitions
- **Auto-Play**: Automatically advances through code at specified intervals
- **Manual Override**: Auto-play pauses when user manually navigates
- **Looping**: Can loop back to the beginning or stop at the end

## Performance

### Highlighter Optimization
- **Global singleton cache** - Highlighters are cached and reused across components
- **Eager initialization** - Default highlighter loads immediately on module import
- **Instant fallback** - Shows styled code immediately while highlighter initializes in background
- **Resource reuse** - Existing highlighters can load additional themes/languages without recreation
- **Zero blocking** - Users see code immediately, animation upgrades happen seamlessly

### Best Practices
- For presentations, use `autoPlay` to create smooth, automated demonstrations
- For tutorials, use `onChange` callback to sync UI with code changes
- For better performance with many snippets, keep code strings reasonably sized
- Use `showControls={false}` and build custom navigation for advanced UX

## TypeScript Types

```typescript
import type { CodeItem, CodeInput } from 'react-animated-code';

// CodeItem: Object with code and optional filename
type CodeItem = {
  code: string;
  filename?: string;
};

// CodeInput: Either a string or a CodeItem object
type CodeInput = string | CodeItem;

// Example usage
const steps: CodeInput[] = [
  "const x = 1;",
  { code: "const x = 2;", filename: "demo.ts" },
];
```

## Browser Support

Works in all modern browsers that support ES2020.

## License

MIT

## Credits

Built with:
- [Shiki Magic Move](https://github.com/shikijs/shiki-magic-move) by Anthony Fu
- [Shiki](https://github.com/shikijs/shiki) - Beautiful syntax highlighter

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## Issues

Found a bug? Have a feature request? [Open an issue](https://github.com/yourusername/react-animated-code/issues).
