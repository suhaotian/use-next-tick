"use client";
import React, { useState, useRef } from "react";
import useNextTick from "use-next-tick";

import { Github, Copy, Check, Package } from "lucide-react";

const NPM_URL = "https://www.npmjs.com/package/use-next-tick";
const GITHUB_URL = "https://github.com/suhaotian/use-next-tick";

const USAGE_BASIC = `import { useState, useRef } from "react";
import useNextTick from "use-next-tick";

function MyComponent() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const nextTick = useNextTick();

  const handleClick = () => {
    setCount((c) => c + 1);
    nextTick(() => {
      console.log(ref.current?.textContent); // "1" ✓
    });
  };

  return <span ref={ref}>{count}</span>;
}`;

const WITHOUT_NEXT_TICK = `import { useState, useRef } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  // We need extra useEffect
  useEffect(() => {
    console.log(ref.current?.textContent);
  }, [count]);

  return <span ref={ref}>{count}</span>;
}`;

/* ------------------------------------------------------------------ */
/*  Shared components                                                  */
/* ------------------------------------------------------------------ */

function NavLinks({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <a
        href={NPM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-gray-700 hover:text-white">
        <Package className="h-4 w-4" />
        npm
      </a>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white">
        <Github className="h-4 w-4" />
        GitHub
      </a>
    </div>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-lg border border-gray-800 bg-gray-900">
      {label && (
        <div className="border-b border-gray-800 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {label}
          </span>
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute right-3 top-2.5 rounded-md p-1.5 text-gray-500 opacity-0 transition-all hover:bg-gray-800 hover:text-gray-300 group-hover:opacity-100"
        aria-label="Copy code">
        {copied ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export function NextTickTestComponent() {
  const [count, setCount] = useState(0);
  const [showBox, setShowBox] = useState(false);
  const [items, setItems] = useState(["A", "B", "C"]);
  const [logs, setLogs] = useState<string[]>([]);

  const counterRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const nextTick = useNextTick();

  const log = (msg: string) => setLogs((prev) => [...prev, msg]);

  const handleIncrement = () => {
    setCount((c) => c + 1);
    nextTick(() => log(`tick:${counterRef.current?.textContent}`));
  };

  const handleAsync = () => {
    setCount((c) => c + 1);
    nextTick(async () => {
      await new Promise((r) => setTimeout(r, 50));
      log("async:done");
    });
  };

  const handleToggle = () => {
    setShowBox((v) => !v);
    nextTick(() => {
      const el = document.querySelector('[data-testid="box"]');
      log(`box:${el ? "mounted" : "gone"}`);
    });
  };

  const handleReverse = () => {
    setItems((prev) => [...prev].reverse());
    nextTick(() => {
      const lis = listRef.current?.querySelectorAll("li") ?? [];
      log(
        `order:${Array.from(lis)
          .map((l) => l.textContent)
          .join(",")}`
      );
    });
  };

  const handleChain = () => {
    setCount((c) => c + 1);
    nextTick(() => {
      log(`chain:1:${counterRef.current?.textContent}`);
      setCount((c) => c + 1);
      nextTick(() => log(`chain:2:${counterRef.current?.textContent}`));
    });
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-8 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight text-indigo-400">
            use-next-tick
          </h1>
          <NavLinks />
        </div>
      </header>

      <main className="flex-1">
        {/* ---- Hero ---- */}
        <section className="border-b border-gray-800 px-8 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 inline-block rounded-full border border-indigo-800 bg-indigo-950 px-3 py-1 text-xs font-medium text-indigo-300">
              React Hook
            </div>
            <h2 className="mb-4 text-5xl font-extrabold tracking-tight text-indigo-400">
              use-next-tick
            </h2>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-400">
              A React hook for running callbacks after the DOM or native views
              have updated.
            </p>

            <h3 className="mb-4 text-3xl font-extrabold tracking-tight text-white">
              Why?
            </h3>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-400">
              Sometimes you need to read layout, measure elements, or access
              refs <strong>right after</strong> a state change—but React updates
              asynchronously.{" "}
              <code className="text-indigo-400">useNextTick</code> gives you a
              simple way to schedule code that runs after React commits your
              changes.
            </p>

            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 font-mono text-sm text-red-400">
                npm i use-next-tick
              </div>
            </div>

            <pre className="mx-auto text-xs">
              {`
const [count, setCount] = useState(0)
const nextTick = useNextTick();

const handleClick = () => {
  setCount(c => c+1);
  nextTick(() => {
    // Run code after setCount update
  })
}
          `}
            </pre>
          </div>
        </section>

        {/* Demo */}
        <section className="border-b border-gray-800 py-16 px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Online Playground
            </h3>

            <iframe
              className="w-full aspect-video"
              src="https://codesandbox.io/p/sandbox/react-dev-forked-jcljvj?file=%2Fsrc%2FApp.js"
            />
          </div>
        </section>

        {/* ---- Usage ---- */}
        <section className="border-b border-gray-800 px-8 py-16">
          <div className="mx-auto max-w-3xl space-y-8">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Usage
            </h3>

            <CodeBlock
              code={USAGE_BASIC}
              label="basic Usage — read DOM after state update"
            />

            <CodeBlock
              code={WITHOUT_NEXT_TICK}
              label="Without next tick — read DOM after state update."
            />
          </div>
        </section>

        {/* ---- Interactive Playground ---- */}
        <section className="px-8 py-16">
          <div className="mx-auto max-w-3xl space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Playground
            </h3>
            <p className="text-sm text-gray-400">
              Click the buttons to see nextTick callbacks read the committed
              DOM.
            </p>

            {/* Counter */}
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
              <p className="text-sm text-gray-400">Counter</p>
              <span
                data-testid="counter"
                ref={counterRef}
                className="font-mono text-4xl font-semibold text-white">
                {count}
              </span>
            </div>

            {/* Conditional box */}
            {showBox && (
              <div
                data-testid="box"
                className="rounded-lg border border-emerald-800 bg-emerald-950 px-4 py-3 text-emerald-300">
                visible
              </div>
            )}

            {/* List */}
            <ul ref={listRef} className="flex gap-2">
              {items.map((item, i) => (
                <li
                  key={item}
                  data-testid={`item-${i}`}
                  className="rounded-md bg-gray-800 px-4 py-2 font-mono text-sm">
                  {item}
                </li>
              ))}
            </ul>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  id: "increment",
                  label: "Increment",
                  onClick: handleIncrement,
                },
                { id: "async", label: "Async", onClick: handleAsync },
                { id: "toggle", label: "Toggle", onClick: handleToggle },
                { id: "reverse", label: "Reverse", onClick: handleReverse },
                { id: "chain", label: "Chain", onClick: handleChain },
              ].map(({ id, label, onClick }) => (
                <button
                  key={id}
                  data-testid={id}
                  onClick={onClick}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700">
                  {label}
                </button>
              ))}
            </div>

            {/* Logs */}
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-400">Logs</p>
                {logs.length > 0 && (
                  <button
                    onClick={clearLogs}
                    className="text-xs text-gray-500 transition-colors hover:text-gray-300">
                    Clear
                  </button>
                )}
              </div>
              <ul data-testid="logs" className="space-y-1">
                {logs.length === 0 && (
                  <li className="text-sm italic text-gray-600">No logs yet</li>
                )}
                {logs.map((l, i) => (
                  <li
                    key={i}
                    data-testid={`log-${i}`}
                    className="rounded bg-gray-800 px-3 py-1.5 font-mono text-sm text-amber-300">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* ---- Other Projects ---- */}
      <section className="border-t border-gray-800 px-8 py-16">
        <div className="mx-auto max-w-3xl">
          <h3 className="mb-8 text-2xl font-bold tracking-tight text-white">
            Other Projects
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                name: "xior",
                description:
                  "Lightweight HTTP request library based on fetch with plugin support and similar API to axios.",
                npm: "https://www.npmjs.com/package/xior",
                github: "https://github.com/suhaotian/xior",
                website: "https://github.com/suhaotian/xior",
              },
              {
                name: "tsdk",
                description:
                  "Type-safe API development CLI tool for TypeScript projects.",
                npm: "https://www.npmjs.com/package/tsdk",
                github: "https://github.com/tsdk-monorepo/tsdk",
                website: "https://tsdk.dev",
              },
              {
                name: "broad-infinite-list",
                description:
                  "High performance and bidirectional scrolling infinite list component for React, Vue 3 and React Native, good for large list rendering.",
                npm: "https://www.npmjs.com/package/broad-infinite-list",
                github: "https://github.com/suhaotian/broad-infinite-list",
                website: "https://suhaotian.github.io/broad-infinite-list",
              },
            ].map((project) => (
              <div
                onClick={() => window.open(project.website)}
                key={project.name}
                className="group rounded-lg border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700">
                <h4 className="mb-1.5 font-mono text-base font-semibold text-white">
                  {project.name}
                </h4>
                <p className="mb-4 text-sm leading-relaxed text-gray-400">
                  {project.description}
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={project.npm}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-red-400 transition-colors hover:text-white">
                    <Package className="h-3.5 w-3.5" />
                    npm
                  </a>
                  <a
                    href={project.github}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-white">
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-8 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <p className="text-sm text-gray-500">use-next-tick</p>
          <NavLinks />
        </div>
      </footer>
    </div>
  );
}
