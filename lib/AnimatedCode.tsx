import { useState, useEffect, useMemo, useCallback } from 'react';
import { ShikiMagicMove } from 'shiki-magic-move/react';
import { createHighlighter, type HighlighterCore } from 'shiki';
import 'shiki-magic-move/dist/style.css';

export type CodeItem = {
  code: string;
  filename?: string;
};

export type CodeInput = string | CodeItem;

export interface AnimatedCodeProps {
  code: CodeInput[];
  lang?: string;
  theme?: string;
  className?: string;
  duration?: number;
  stagger?: number;
  lineNumbers?: boolean;

  // Navigation props
  showControls?: boolean;
  showFilename?: boolean;

  // Callbacks
  onNext?: () => void;
  onPrev?: () => void;
  onChange?: (index: number) => void;

  // Auto-play
  autoPlay?: boolean;
  autoPlayInterval?: number;
  autoPlayLoop?: boolean;

  // Initial state
  initialIndex?: number;

  // Controlled mode - when provided, component uses this instead of internal state
  currentIndex?: number;
}

// Global singleton highlighter cache
const highlighterCache = new Map<string, HighlighterCore>();
const highlighterPromises = new Map<string, Promise<HighlighterCore>>();

// Eagerly initialize default highlighter
let defaultHighlighterPromise: Promise<HighlighterCore> | null = null;

function initializeDefaultHighlighter() {
  if (!defaultHighlighterPromise) {
    defaultHighlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript', 'javascript'],
    }).then(hl => {
      highlighterCache.set('github-dark-typescript', hl);
      return hl;
    });
  }
  return defaultHighlighterPromise;
}

// Start loading immediately when module is imported
initializeDefaultHighlighter();

async function getOrCreateHighlighter(theme: string, lang: string): Promise<HighlighterCore> {
  const cacheKey = `${theme}-${lang}`;

  // Return cached highlighter if available
  if (highlighterCache.has(cacheKey)) {
    return highlighterCache.get(cacheKey)!;
  }

  // Return in-flight promise if already loading
  if (highlighterPromises.has(cacheKey)) {
    return highlighterPromises.get(cacheKey)!;
  }

  // Check if we can reuse an existing highlighter by loading additional resources
  const existingHighlighter = highlighterCache.values().next().value as HighlighterCore | undefined;
  if (existingHighlighter) {
    const promise = Promise.all([
      existingHighlighter.loadTheme(theme as any).catch(() => {}),
      existingHighlighter.loadLanguage(lang as any).catch(() => {}),
    ]).then(() => {
      highlighterCache.set(cacheKey, existingHighlighter);
      return existingHighlighter;
    });
    highlighterPromises.set(cacheKey, promise);
    return promise;
  }

  // Create new highlighter
  const promise = createHighlighter({
    themes: [theme],
    langs: [lang, 'typescript', 'javascript'],
  }).then(hl => {
    highlighterCache.set(cacheKey, hl);
    highlighterPromises.delete(cacheKey);
    return hl;
  });

  highlighterPromises.set(cacheKey, promise);
  return promise;
}

export default function AnimatedCode({
  code,
  lang = 'typescript',
  theme = 'github-dark',
  className = '',
  duration = 800,
  stagger = 3,
  lineNumbers = true,
  showControls = true,
  showFilename = true,
  onNext,
  onPrev,
  onChange,
  autoPlay = false,
  autoPlayInterval = 3000,
  autoPlayLoop = true,
  initialIndex = 0,
  currentIndex: controlledIndex,
}: AnimatedCodeProps) {
  // Normalize input to CodeItem[] array
  const normalizedCodes = useMemo(() => {
    return code.map(item =>
      typeof item === 'string' ? { code: item } : item
    );
  }, [code]);

  const totalCount = normalizedCodes.length;

  // State management - support both controlled and uncontrolled modes
  const [internalIndex, setInternalIndex] = useState(() => {
    // Clamp initialIndex to valid range
    return Math.max(0, Math.min(initialIndex, totalCount - 1));
  });
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Use controlled index if provided, otherwise use internal state
  const isControlled = controlledIndex !== undefined;
  const currentIndex = isControlled
    ? Math.max(0, Math.min(controlledIndex, totalCount - 1))
    : internalIndex;

  const currentItem = normalizedCodes[currentIndex] || normalizedCodes[0];
  const currentCode = currentItem?.code || '';
  const currentFilename = currentItem?.filename;

  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(() => {
    // Try to use cached highlighter immediately
    const cacheKey = `${theme}-${lang}`;
    return highlighterCache.get(cacheKey) || null;
  });

  // Navigation handlers
  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < totalCount) {
      if (!isControlled) {
        setInternalIndex(nextIndex);
      }
      setIsPlaying(false);
      onChange?.(nextIndex);
      onNext?.();
    }
  }, [currentIndex, totalCount, onChange, onNext, isControlled]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      if (!isControlled) {
        setInternalIndex(prevIndex);
      }
      setIsPlaying(false);
      onChange?.(prevIndex);
      onPrev?.();
    }
  }, [currentIndex, onChange, onPrev, isControlled]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Highlighter initialization
  useEffect(() => {
    let isMounted = true;

    getOrCreateHighlighter(theme, lang).then(hl => {
      if (isMounted) {
        setHighlighter(hl);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [theme, lang]);

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay || !isPlaying || totalCount <= 1) return;

    const timer = setInterval(() => {
      if (isControlled) {
        // In controlled mode, just call onChange and let parent handle it
        const next = currentIndex + 1;
        if (next >= totalCount) {
          if (autoPlayLoop) {
            onChange?.(0);
          } else {
            setIsPlaying(false);
          }
        } else {
          onChange?.(next);
        }
      } else {
        // In uncontrolled mode, manage state internally
        setInternalIndex(prev => {
          const next = prev + 1;
          if (next >= totalCount) {
            if (autoPlayLoop) {
              onChange?.(0);
              return 0;
            }
            setIsPlaying(false);
            return prev;
          }
          onChange?.(next);
          return next;
        });
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, isPlaying, totalCount, autoPlayInterval, autoPlayLoop, onChange, isControlled, currentIndex]);

  // Show header if we have filename or navigation controls
  const shouldShowHeader = (showFilename && currentFilename) || (showControls && totalCount > 1);

  // Styling
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: '#1e1e1e',
    borderBottom: '1px solid #333',
    borderRadius: '6px 6px 0 0',
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace',
    fontSize: '13px',
    color: '#ccc',
  };

  const buttonStyles: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid #555',
    color: '#ccc',
    padding: '4px 8px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '4px',
  };

  const controlsContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  // Memoize the fallback to avoid re-renders
  const fallback = useMemo(() => (
    <pre
      style={{
        padding: '1rem',
        background: '#0d1117',
        color: '#c9d1d9',
        borderRadius: shouldShowHeader ? '0 0 6px 6px' : '6px',
        overflow: 'auto',
        fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        margin: 0,
      }}
    >
      <code>{currentCode}</code>
    </pre>
  ), [currentCode, shouldShowHeader]);

  return (
    <div className={className}>
      {shouldShowHeader && (
        <div style={headerStyles}>
          {/* Filename section */}
          {showFilename && currentFilename && (
            <div className="animated-code-filename">
              {currentFilename}
            </div>
          )}

          {/* Navigation controls */}
          {showControls && totalCount > 1 && (
            <div style={controlsContainerStyles}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Previous code"
                style={{
                  ...buttonStyles,
                  opacity: currentIndex === 0 ? 0.5 : 1,
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ◀
              </button>
              <span style={{ fontSize: '12px', color: '#888' }}>
                {currentIndex + 1} / {totalCount}
              </span>
              <button
                onClick={handleNext}
                disabled={currentIndex === totalCount - 1}
                aria-label="Next code"
                style={{
                  ...buttonStyles,
                  opacity: currentIndex === totalCount - 1 ? 0.5 : 1,
                  cursor: currentIndex === totalCount - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ▶
              </button>
              {autoPlay && (
                <button
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  style={buttonStyles}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="animated-code-content">
        {!highlighter ? (
          fallback
        ) : (
          <ShikiMagicMove
            lang={lang}
            theme={theme}
            code={currentCode}
            highlighter={highlighter}
            options={{ duration, stagger, lineNumbers }}
          />
        )}
      </div>
    </div>
  );
}
