# Compiler Integration Plan — Option A (Godbolt Embed)

## Overview
Integrate an online C compiler into the system-level-practice site by embedding
Godbolt (Compiler Explorer) via iframe or API. This is a post-scaffold addition
and should not block the initial project setup.

## Why Godbolt
- Purpose-built for systems/C programming
- Shows disassembly alongside program output — directly relevant to system-level coursework
- Free, no authentication required for basic use
- Supports GCC and Clang with configurable flags (e.g., -O2, -Wall, -std=c11)
- Embeddable via iframe with URL parameters for pre-loading code snippets

## Implementation Plan

### 1. Iframe Embed (MVP)
- Add a `<CompilerEmbed />` React component that renders a Godbolt iframe
- URL format: `https://godbolt.org/e#<encoded-state>`
- Pre-populate the editor with starter code relevant to the current practice resource
- Toggle panel: show/hide the compiler to avoid cluttering the practice view

### 2. Pre-loaded Code Snippets
- Each practice resource (e.g., a quiz or exercise) can optionally define a
  `starterCode` field in its metadata
- The `CompilerEmbed` component encodes this into the Godbolt URL so the editor
  opens with relevant scaffolding code

### 3. Compiler Options
- Default compiler: GCC (latest stable)
- Default flags: `-O0 -Wall -std=c11` (no optimization for clearer assembly)
- Allow per-exercise override of flags in resource metadata

### 4. UI Integration
- Placement: below or beside the practice problem, collapsible
- Trigger: "Open in Compiler" button per exercise
- Responsive: full-width on smaller screens, split-panel on desktop

## Files to Create
- `client/src/components/CompilerEmbed.tsx` — iframe wrapper component
- Update relevant exercise/practice page components to accept `starterCode` prop

## Notes
- No backend changes required — purely a frontend integration
- No API key or authentication needed for Godbolt iframe embeds
- Godbolt API (api.godbolt.org) available if programmatic compilation is needed later
