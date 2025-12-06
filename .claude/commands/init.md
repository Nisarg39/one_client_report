---
description: "Initialize a new feature with proper structure"
allowed-tools: ["Bash", "Read", "Write", "Glob", "Grep"]
model: "sonnet"
---

Create a new feature following our project conventions and architecture.

Feature name: $1 (required)
Feature type: $2 (optional: component/api/lib/model/page)

Steps:
1. Review the project structure from CLAUDE.md
2. Determine the appropriate location based on feature type:
   - **component**: `src/components/[feature-name]/`
   - **api**: `src/app/api/[feature-name]/`
   - **lib**: `src/lib/[feature-name]/`
   - **model**: `src/models/[FeatureName].ts`
   - **page**: `src/app/[feature-name]/`
3. Create necessary files with proper TypeScript types
4. Follow these conventions:
   - File naming: kebab-case for files
   - Component naming: PascalCase
   - Use React Server Components by default
   - Include TypeScript types for all props and returns
   - Add error handling at boundaries
5. Create a basic structure:
   - Main implementation file
   - TypeScript type definitions
   - Index file for exports (if applicable)
6. Provide usage examples and next steps

Example structures:

**Component**:
```
src/components/feature-name/
├── FeatureName.tsx
├── types.ts
└── index.ts
```

**API Route**:
```
src/app/api/feature-name/
├── route.ts
└── types.ts
```

**Library**:
```
src/lib/feature-name/
├── index.ts
├── types.ts
└── utils.ts
```

After creating files, provide:
- Summary of what was created
- How to use the new feature
- Next steps for implementation
