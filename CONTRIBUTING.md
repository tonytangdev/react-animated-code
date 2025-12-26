# Contributing to React Animated Code

Thank you for your interest in contributing to React Animated Code! We welcome contributions from the community.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-animated-code.git
   cd react-animated-code
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/tonytangdev/react-animated-code.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. The build outputs to `dist/` directory

### Development Commands

```bash
# Build the library
npm run build

# Build and watch for changes
npm run build -- --watch

# Type check
npx tsc --noEmit
```

## Project Structure

```
react-animated-code/
├── lib/                      # Source code
│   ├── AnimatedCode.tsx      # Main component
│   └── index.ts              # Public exports
├── dist/                     # Built output (generated)
├── node_modules/             # Dependencies
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Build configuration
├── README.md                 # User documentation
└── CONTRIBUTING.md           # This file
```

### Key Files

- **`lib/AnimatedCode.tsx`** - The main component implementation
  - Multi-code navigation logic
  - Highlighter initialization and caching
  - Auto-play functionality
  - Navigation controls and callbacks

- **`lib/index.ts`** - Public API exports
  - Component and type exports

- **`vite.config.ts`** - Build configuration
  - Library bundling
  - TypeScript declaration generation

## Development Workflow

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes in the `lib/` directory

3. Build and test your changes:
   ```bash
   npm run build
   ```

4. Commit your changes (see [Commit Messages](#commit-messages))

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

### Staying Up to Date

Keep your fork synchronized with upstream:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Code Standards

### TypeScript

- Use TypeScript for all code
- Avoid `any` types - use proper type definitions
- Export public types for library consumers
- Document complex type definitions with comments

### React Best Practices

- Use functional components with hooks
- Use `useCallback` for event handlers to prevent unnecessary re-renders
- Use `useMemo` for expensive computations
- Use `useEffect` with proper dependency arrays

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add trailing commas in multi-line objects/arrays
- Use arrow functions for callbacks
- Prefer `const` over `let`

### Naming Conventions

- **Components**: PascalCase (e.g., `AnimatedCode`)
- **Functions/Variables**: camelCase (e.g., `handleNext`, `currentIndex`)
- **Types/Interfaces**: PascalCase (e.g., `AnimatedCodeProps`, `CodeItem`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for React constants

### Comments

- Use JSDoc comments for public APIs
- Add inline comments for complex logic
- Explain **why**, not **what** (code should be self-documenting)

Example:
```typescript
/**
 * Normalizes code input to CodeItem[] format.
 * Accepts both string arrays and objects with filenames.
 */
const normalizedCodes = useMemo(() => {
  return code.map(item =>
    typeof item === 'string' ? { code: item } : item
  );
}, [code]);
```

## Testing

### Manual Testing

Since this is a visual component, manual testing is crucial:

1. Create a test HTML file or use a local project
2. Import and use the component with various prop combinations
3. Test all navigation features:
   - Next/Previous buttons
   - Auto-play functionality
   - Callbacks (onNext, onPrev, onChange)
   - Initial index
   - Show/hide controls and filename

4. Test edge cases:
   - Empty array
   - Single item array
   - Large code snippets
   - Rapid navigation
   - Theme/language switching

### Testing Checklist

Before submitting a PR, verify:

- [ ] Component builds without errors
- [ ] TypeScript types are correct
- [ ] Navigation buttons work correctly
- [ ] Auto-play starts, pauses, and loops properly
- [ ] Callbacks fire at the right times
- [ ] Filename display works with and without showFilename
- [ ] Controls can be hidden with showControls={false}
- [ ] Multiple instances work on the same page
- [ ] No console errors or warnings
- [ ] Performance is acceptable (no lag during animations)

## Submitting Changes

### Commit Messages

Use clear, descriptive commit messages following this format:

```
<type>: <subject>

<optional body>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

**Examples:**
```
feat: add keyboard navigation support

Add support for arrow keys to navigate between code snippets.
Left arrow = previous, right arrow = next.

Closes #123
```

```
fix: prevent auto-play from continuing after manual navigation

Auto-play now properly pauses when user clicks prev/next buttons.
```

```
docs: update README with auto-play examples
```

### Pull Request Process

1. **Update documentation** if you're adding/changing features
   - Update README.md with new props or usage examples
   - Update type definitions if needed

2. **Create a Pull Request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to related issues (if applicable)
   - Screenshots/GIFs for visual changes (highly recommended)

3. **PR Description Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   Describe how you tested your changes

   ## Screenshots (if applicable)
   Add screenshots or GIFs showing the change

   ## Checklist
   - [ ] Code builds without errors
   - [ ] Types are correct
   - [ ] Documentation updated
   - [ ] Manually tested
   ```

4. **Code Review**: Be responsive to feedback
   - Address reviewer comments
   - Make requested changes
   - Re-request review after updates

5. **Merge**: Once approved, a maintainer will merge your PR

## Reporting Bugs

Found a bug? Please [open an issue](https://github.com/tonytangdev/react-animated-code/issues) with:

1. **Clear title** - Describe the issue concisely
2. **Description** - What happened vs. what you expected
3. **Reproduction steps** - How to reproduce the bug
4. **Environment**:
   - React version
   - Browser and version
   - OS
5. **Code example** - Minimal reproduction code
6. **Screenshots** - If applicable

**Example:**
```markdown
## Bug: Auto-play doesn't stop at the end when loop is false

**Expected**: Auto-play should stop at the last code snippet when `autoPlayLoop={false}`
**Actual**: Auto-play continues and wraps to the first snippet

**Steps to reproduce**:
1. Create AnimatedCode with autoPlay={true} and autoPlayLoop={false}
2. Wait for auto-play to reach the last snippet
3. Observe it wraps to the beginning

**Environment**:
- React 19.2.0
- Chrome 120
- macOS 14.0

**Code**:
```tsx
<AnimatedCode
  code={['step 1', 'step 2', 'step 3']}
  autoPlay
  autoPlayLoop={false}
/>
```
```

## Feature Requests

Have an idea? [Open an issue](https://github.com/tonytangdev/react-animated-code/issues) with:

1. **Clear title** - What feature you want
2. **Problem statement** - What problem does this solve?
3. **Proposed solution** - How should it work?
4. **Alternatives** - Other approaches you considered
5. **Use cases** - Real-world examples of when this would be useful

## Development Tips

### Performance Considerations

- **Highlighter caching** - Reuse highlighter instances across components
- **Memoization** - Use `useMemo` and `useCallback` appropriately
- **Avoid unnecessary re-renders** - Check dependency arrays in hooks
- **Code splitting** - Consider lazy loading for large language grammars

### Common Pitfalls

1. **Forgetting to clean up intervals** - Always return cleanup functions from useEffect
2. **Stale closures** - Ensure useCallback dependencies are correct
3. **Missing null checks** - Handle empty arrays and undefined values
4. **Type errors** - Run TypeScript checks before committing

### Debugging Tips

1. **Enable source maps** - Use browser dev tools for debugging
2. **Console.log judiciously** - Track state changes during development
3. **React DevTools** - Inspect component state and props
4. **Check Shiki documentation** - For highlighter-related issues

## Questions?

- **General questions**: Open a [Discussion](https://github.com/tonytangdev/react-animated-code/discussions)
- **Bug reports**: Open an [Issue](https://github.com/tonytangdev/react-animated-code/issues)
- **Security issues**: Email security@yourdomain.com (don't open public issues)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

### In Summary

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism gracefully
- Focus on what's best for the community

## Recognition

Contributors are recognized in our [GitHub contributors page](https://github.com/tonytangdev/react-animated-code/graphs/contributors). Significant contributions may be highlighted in release notes.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to React Animated Code!** 🎉

Your efforts help make this library better for everyone.
