# [nextTick for React](https://suhaotian.github.io/use-next-tick/) &middot; [![Size](https://deno.bundlejs.com/badge?q=use-next-tick&treeshake=[{default}]&config={%22esbuild%22:{%22external%22:[%22react%22,%22react-dom%22,%22react/jsx-runtime%22]}})](https://bundlejs.com/?q=use-next-tick&treeshake=%5B%7Bdefault%7D%5D&config=%7B%22esbuild%22:%7B%22external%22:%5B%22react%22,%22react-dom%22,%22react/jsx-runtime%22%5D%7D%7D) [![npm version](https://img.shields.io/npm/v/use-next-tick.svg?style=flat)](https://www.npmjs.com/package/use-next-tick) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/suhaotian/use-next-tick/pulls) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/suhaotian/use-next-tick/blob/main/LICENSE) [![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/use-next-tick) ![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)

**use-next-tick** is a React hook that runs a callback in `useLayoutEffect` after the next render, similar to Vue’s `nextTick`.


## Installation

```bash
npm install use-next-tick
```

## Quick Start

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
      // DOM is already updated here
      console.log(ref.current?.textContent); // "1"
    });
  };

  return <span ref={ref}>{count}</span>;
}
```

### API

```ts
function useNextTick(): (cb: () => void | Promise<void>) => void;
```

## Development

This project use bun.

```sh
bun install && bun run build
```

## Reporting Issues

Found an issue? Please feel free to [create issue](https://github.com/suhaotian/use-next-tick/issues/new)

## Support

If you find this project helpful, consider [buying me a coffee](https://github.com/suhaotian/use-next-tick/stargazers).

## Projects You May Also Be Interested In

- [xior](https://github.com/suhaotian/xior) - Tiny fetch library with plugins support and axios-like API
- [tsdk](https://github.com/tsdk-monorepo/tsdk) - Type-safe API development CLI tool for TypeScript projects
- [broad-infinite-list](https://github.com/suhaotian/broad-infinite-list) - ⚡ High performance and Bidirectional infinite scrolling list component for React and Vue3
