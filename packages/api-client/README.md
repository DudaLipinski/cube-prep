# `@cube-prep/api-client`

Typed API contract package for Cubby.

## Generate

```bash
bun --cwd packages/api-client generate
```

This script:

1. generates `apps/api/openapi.json` from the Hono app
2. generates TypeScript schema types into `src/generated/schema.ts`

## Usage

```ts
import { apiClient, type Portion } from "@cube-prep/api-client";

const { data } = await apiClient.GET("/portions");
```
