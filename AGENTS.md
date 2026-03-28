# BucketHub - AI Coding Agent Instructions

## Project Overview

BucketHub is a monorepo for managing S3 buckets and objects, built with Nx 21.4.1, React 19, and type-safe RPC communication.

**Architecture:**

- **Backend** (`apps/backend`): Hono server with oRPC for type-safe APIs, Drizzle ORM + Bun sqlite for database, S3 storage abstraction
- **Frontend** (`apps/console`): React 19 + TanStack Query consuming backend via oRPC client
- **UI Library** (`libs/ui`): Panda CSS design system with compound components (Dialog, Select, InputGroup)
- **RPC Contract** (`libs/rpc-contract`): Shared type-safe contract between frontend/backend using oRPC
- **Core** (`libs/core`): Shared TypeScript types
- **Styled System** (`libs/styled-system`): Generated Panda CSS artifacts (DO NOT EDIT - auto-generated)

## Development Workflow

### Running the Application

```bash
# Backend server (Hono on port 3000)
bun nx serve backend

# Frontend console (Vite dev server)
bun nx serve console

# UI Storybook (component library)
bun nx run ui:storybook
```

### Building

```bash
bun nx build backend
bun nx build console
bun nx build ui
```

### Key Commands

- `bun nx graph` - Visualize project dependencies
- `bun nx list` - List available plugins
- `bun install` - Install dependencies (uses Bun, not npm/yarn)

## Styling System - Panda CSS

**CRITICAL:** This project uses Panda CSS with a custom design system preset, NOT Tailwind or CSS-in-JS libraries.

### Panda CSS Architecture

- **Design System Preset:** `libs/ui/src/panda/preset/` contains tokens, semantic tokens, text styles
- **Styled Components:** Use `styled()` from `@buckethub/styled-system/jsx`
- **Token-Based:** All colors, spacing, shadows use semantic tokens (e.g., `background-input`, `border-input-focus`, `text-muted`)
- **Generated Output:** Panda generates artifacts to `libs/styled-system/dist/` - NEVER manually edit these files

### Styling Patterns

```tsx
// ✅ Correct - Use styled() wrapper
import { styled } from '@buckethub/styled-system/jsx';
export const StyledButton = styled('button', {
  base: {
    backgroundColor: 'background-button-primary', // semantic token
    borderRadius: 'lg', // token from preset
    paddingInline: '4', // spacing token
  },
  variants: {
    size: {
      md: { height: '9' },
      sm: { height: '8' },
    }
  }
});

// ✅ Use CSS prop for one-off overrides
<TextInput css={{ paddingTop: '2' }} />

// ❌ Don't use className or inline styles
<button className="btn-primary" style={{ padding: '8px' }} />
```

- Never use styled() inside component file. Define all styled components in `component-name.styled.ts` files.

### Key Semantic Tokens

- **Backgrounds:** `background-base`, `background-surface`, `background-input`, `background-button-primary/secondary`
- **Borders:** `border-input`, `border-input-focus`, `border-error`, `border-button-primary/secondary`
- **Text:** `text-base`, `text-muted`, `text-subtle`, `text-placeholder`
- **Shadows:** `xs` (subtle), `lg` (pronounced)
- **Text Styles:** `input`, `body-medium`, `body-large`, `body-small-emphasized`

To list all tokens, check libs/styled-system/dist/tokens/index.js and libs/ui/src/panda/preset/text-styles.ts

### Component State Management

Use CSS `:has()` selectors for dynamic styling based on child state:

```tsx
// Focus state when input is focused
'&:has([data-slot="input-group-control"]:focus)': {
  borderColor: 'border-input-focus',
  boxShadow: '0 0 0 3px {colors.border-input-focus/20}',
}

// Error state when input has aria-invalid
'&:has([aria-invalid="true"])': {
  borderColor: 'border-error',
}
```

## Component Patterns

### Compound Components with Object.assign

All compound components (Dialog, Select, InputGroup, Item) use `Object.assign` pattern:

```tsx
// Pattern used throughout libs/ui/src/components/
const Root: React.FunctionComponent<Props> = ({ children }) => <div>{children}</div>;
const Trigger: React.FunctionComponent<Props> = (props) => <button {...props} />;

Root.displayName = 'Dialog';
Trigger.displayName = 'Dialog.Trigger';

export const Dialog = Object.assign(Root, {
  Trigger,
  Content
  // ... other sub-components
});
```

### React 19 - No forwardRef

**IMPORTANT:** This project uses React 19 where refs are forwarded automatically through props. DO NOT use `forwardRef`:

```tsx
// ✅ React 19 pattern
interface Props {
  ref?: React.Ref<HTMLInputElement>;
}
const Input: React.FunctionComponent<Props> = ({ ref, ...props }) => {
  return <input ref={ref} {...props} />;
};

// ❌ Don't use forwardRef
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

### Base-UI Integration

UI components wrap `@base-ui/react` primitives (Select, Dialog, Tooltip) with styled wrappers:

```tsx
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledSelectTrigger = styled(SelectPrimitive.Trigger, {
  base: {
    /* Panda CSS styles */
  }
});
```

## Type-Safe RPC with oRPC

### Contract-First API Design

1. **Define contract** in `libs/rpc-contract/src/` (shared between frontend/backend):

```tsx
import { os } from '@orpc/contract';
import z from 'zod';

export const buckets = os.router({
  list: os.procedure
    .input(z.object({ limit: z.number() }))
    .output(z.array(z.object({ id: z.number(), name: z.string() })))
});
```

2. **Implement on backend** in `apps/backend/src/rpc/`:

```tsx
import { os } from './contract'; // implements contractRouter

const list = os.handler(async ({ input }) => {
  return await bucketRepository.list(input.limit);
});

export const router = os.router({
  buckets: {
    list
  }
});
```

3. **Implement custom hook** in `apps/console/src/services/{domain}/hooks/{queries|mutations}/{hook name}.ts`:

```tsx
import { useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

export function useListBuckets(connectionId: number) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.buckets.listBuckets.queryOptions({
    input: { connectionId }
  });

  return useSuspenseQuery(queryOptions);
}
```

4. **Consume in components:**

```tsx
const { data: buckets } = useListBuckets(connectionId);
```

### RPC Client Setup

Frontend RPC client (`apps/console/src/services/rpc.ts`) uses oRPC + TanStack Query for type-safe, cached queries.

## Data Slots Pattern

Components use `data-slot` attributes for CSS targeting and parent-child communication:

```tsx
// Parent targets child state
<StyledInputGroup>
  <input data-slot="input-group-control" />
</StyledInputGroup>;

// CSS in parent
export const StyledInputGroup = styled('div', {
  '&:has([data-slot="input-group-control"]:focus)': {
    borderColor: 'border-input-focus'
  }
});
```

Common slots: `input-group-control`, `input-group-addon`, `input-group-button`, `input-group-text`

## File Organization

### Component Structure

```
libs/ui/src/components/component-name/
  ├── component-name.tsx          # Component logic
  ├── component-name.styled.ts    # Panda CSS styled components
  ├── component-name.stories.tsx  # Storybook stories
  └── index.ts                    # Public exports
```

### Naming Conventions

- **Styled components:** `StyledComponentName` (e.g., `StyledButton`, `StyledInputGroup`)
- **Component exports:** Named export matching directory (e.g., `export { Dialog }`)
- **Display names:** Set for all compound components (e.g., `Root.displayName = 'Dialog'`)

## Testing & Storybook

- **Storybook:** `bun nx run ui:storybook` - Primary development environment for UI components
- **Stories:** Write comprehensive stories covering all variants, states, and edge cases
- **E2E:** Playwright tests in `apps/console-e2e`

## Common Pitfalls

1. **Don't edit `libs/styled-system/dist/`** - Auto-generated by Panda CSS
2. **Use semantic tokens, not hardcoded values** - `backgroundColor: 'background-input'` not `backgroundColor: '#f3f4f6'`
3. **Respect React 19 patterns** - No `forwardRef`, use ref as prop
4. **Follow compound component pattern** - Use `Object.assign` for multi-part components
5. **Use `:has()` for state management** - Don't add wrapper divs or additional state when CSS can handle it
6. **Component reuse** - Prefer wrapping existing components (e.g., `InputGroup.Input` wraps `TextInput`) over duplicating styles

## Key Files to Reference

- Design system preset: `libs/ui/src/panda/preset/`
- Semantic tokens: `libs/ui/src/panda/preset/semantic-tokens/colors.ts`
- All tokens: `libs/styled-system/dist/tokens/index.js` and `libs/ui/src/panda/preset/text-styles.ts`
- Component examples: `libs/ui/src/components/{dialog,select,input-group}/`
- RPC contract: `libs/rpc-contract/src/router.ts`
- Backend RPC implementation: `apps/backend/src/rpc/router.ts`

# General Guideline

- Avoid commenting code unless absolutely necessary.
- Never output summary or explanations.
- Keep text answers short and concise.
- Never do this `import * as React from 'react'`. Always use direct imports like `import { useState } from 'react'`.
- Never create additional README files.
- Never use `handle` prefix for event handler functions. Use names like `onClick`, `onSubmit`, etc.
- Never use abbreviations for variable, function, class, or any other identifier names. Always use full, descriptive names. Common ecosystem conventions like `props`, `_` for unused parameters, and library names like `oRPC` are acceptable. Single-letter abbreviations like `e` for event or `c` for connection are not.
- Always lint and format code after making changes. Use `bun lint {project name}` for linting and `bun oxfmt` for formatting.
- Never add 'Co-authored-by:' in commit messages.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->

<!-- intent-skills:start -->

# Skill mappings — when working in these areas, load the linked skill file into context.

skills:

- task: "Working with TanStack DB collections (createCollection, adapters, sync config)"
  load: "node_modules/@tanstack/db/skills/db-core/SKILL.md"
- task: "Setting up new collections with adapters (queryCollectionOptions, electricCollectionOptions, etc.)"
  load: "node_modules/@tanstack/db/skills/db-core/collection-setup/SKILL.md"
- task: "Writing live queries with the query builder (from, where, join, select, groupBy, orderBy)"
  load: "node_modules/@tanstack/db/skills/db-core/live-queries/SKILL.md"
- task: "Optimistic mutations, transactions, and paced mutations"
  load: "node_modules/@tanstack/db/skills/db-core/mutations-optimistic/SKILL.md"
- task: "Building a custom collection adapter for a new backend"
  load: "node_modules/@tanstack/db/skills/db-core/custom-adapter/SKILL.md"
- task: "Integrating TanStack DB with meta-frameworks (SSR disable, preloading collections)"
  load: "node_modules/@tanstack/db/skills/meta-framework/SKILL.md"
- task: "Using React hooks for TanStack DB (useLiveQuery, useLiveSuspenseQuery, useLiveInfiniteQuery)"
  load: "node_modules/@tanstack/react-db/skills/react-db/SKILL.md"
- task: "Setting up TanStack Devtools (framework adapter, plugins, shell config)"
  load: "node_modules/@tanstack/devtools/skills/devtools-app-setup/SKILL.md"
- task: "Building a devtools plugin panel to display event data"
  load: "node_modules/@tanstack/devtools/skills/devtools-plugin-panel/SKILL.md"
- task: "Handling devtools in production vs development (tree-shaking, conditional imports)"
  load: "node_modules/@tanstack/devtools/skills/devtools-production/SKILL.md"
- task: "Publishing a devtools plugin to the TanStack Devtools Marketplace"
  load: "node_modules/@tanstack/devtools/skills/devtools-marketplace/SKILL.md"
- task: "Creating typed EventClient for devtools communication"
  load: "node_modules/@tanstack/devtools-event-client/skills/devtools-event-client/SKILL.md"
- task: "Two-way event patterns between devtools panel and application"
  load: "node_modules/@tanstack/devtools-event-client/skills/devtools-bidirectional/SKILL.md"
- task: "Adding strategic event emissions for devtools instrumentation"
  load: "node_modules/@tanstack/devtools-event-client/skills/devtools-instrumentation/SKILL.md"
- task: "Configuring @tanstack/devtools-vite (source inspection, console piping, server event bus)"
  load: "node_modules/@tanstack/devtools-vite/skills/devtools-vite-plugin/SKILL.md"
- task: "Building Vite devtools integrations with @vitejs/devtools-kit"
  load: "node_modules/@vitejs/devtools-kit/skills/vite-devtools-kit/SKILL.md"
- task: "Vue 3 virtual scrolling with RecycleScroller, DynamicScroller"
load: "node_modules/vue-virtual-scroller/skills/vue-virtual-scroller/SKILL.md"
<!-- intent-skills:end -->
