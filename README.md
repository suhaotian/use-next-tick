# [nextTick for React](https://suhaotian.github.io/use-next-tick/) &middot; [![Size](https://deno.bundlejs.com/badge?q=use-next-tick&treeshake=[{default}]&config={%22esbuild%22:{%22external%22:[%22react%22,%22react-dom%22,%22react/jsx-runtime%22]}})](https://bundlejs.com/?q=use-next-tick&treeshake=%5B%7Bdefault%7D%5D&config=%7B%22esbuild%22:%7B%22external%22:%5B%22react%22,%22react-dom%22,%22react/jsx-runtime%22%5D%7D%7D) [![npm version](https://img.shields.io/npm/v/use-next-tick.svg?style=flat)](https://www.npmjs.com/package/use-next-tick) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/suhaotian/use-next-tick/pulls) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/suhaotian/use-next-tick/blob/main/LICENSE) [![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/use-next-tick) ![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)

A React hook for running callbacks after the DOM or native views have updated.

## Why?

Sometimes you need to read layout, measure elements, or access refs **right after** a state change—but React updates asynchronously. `useNextTick` gives you a simple way to schedule code that runs after React commits your changes.

## Install

```bash
npm install use-next-tick
```

## Usage

```tsx
"use client";
import { useState, useRef } from "react";
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
}
```

## What it does

1. You update state with `setState`
2. You call `nextTick(callback)`
3. React re-renders and commits to DOM/native
4. Your callback runs with updated refs and layout

## When to use it

✅ **Use `useNextTick` when:**

- Measuring elements after a state change
- Scrolling to newly rendered content
- Reading layout values (width, height, position)
- Focusing inputs after conditional rendering
- One-off actions triggered by specific user events

❌ **Don't use it when:**

- You want something to happen on _every_ render → use `useEffect`
- You're just responding to prop/state changes → use `useEffect` with dependencies

## Alternative without this hook

```ts
// Without useNextTick - requires separate useEffect
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount((c) => c + 1);
};

useEffect(() => {
  // Runs after EVERY count change, not just from handleClick
  console.log(ref.current?.textContent);
}, [count]);
```

With `useNextTick`, you get **imperative control**—callbacks only run when you explicitly schedule them.

## Online Demo

https://codesandbox.io/p/sandbox/react-dev-forked-jcljvj?file=%2Fsrc%2FApp.js%3A14%2C22

## Platform support

Works on both **React DOM** (web) and **React Native**. Automatically uses the right scheduling mechanism for each platform.

## Development

This project use bun.

```sh
bun install && bun run build
```

## TypeScript

```ts
function useNextTick(): (cb: () => void | Promise<void>) => void;
```

Fully typed. Callbacks can be sync or async:

```ts
nextTick(() => {
  console.log("sync callback");
});

nextTick(async () => {
  await someAsyncWork();
});
```

## Reporting Issues

Found an issue? Please feel free to [create issue](https://github.com/suhaotian/use-next-tick/issues/new)

## Support

If you find this project helpful, consider [buying me a coffee](https://github.com/suhaotian/use-next-tick/stargazers).

## Projects You May Also Be Interested In

- [xior](https://github.com/suhaotian/xior) - Tiny fetch library with plugins support and axios-like API
- [tsdk](https://github.com/tsdk-monorepo/tsdk) - Type-safe API development CLI tool for TypeScript projects
- [broad-infinite-list](https://github.com/suhaotian/broad-infinite-list) - ⚡ High performance and Bidirectional infinite scrolling list component for React and Vue3
