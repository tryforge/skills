---
name: botforge-mcp
description: Use the BotForge MCP server (https://mcp.botforge.org/) effectively when writing or debugging ForgeScript code. Use whenever the botforge MCP tools are available to search docs, validate syntax, format code, or inspect Discord metadata.
license: MIT
metadata:
  author: botforge
  version: "1.0"
---

# Using the BotForge MCP

When the `botforge` MCP server is connected, prefer its tools over guessing any ForgeScript function, extension signature, or Discord constant.

## Tool Selection Guide

| Task | Tool | Notes |
| :--- | :--- | :--- |
| Find a `$function`, event, enum, or guide | `search` | Filter with `package_name` and `resource` (`functions`, `events`, `enums`) |
| Browse an extension's API | `extensions` | Pass `name` (e.g. `"forgescript"`, `"forgedb"`) and `resource` |
| Read full guide markdown | `guides` | Use `slug` or `search` with `include_content: true` |
| Inspect `@tryforge/forgescript` internals | `forgescript` | Check installed version, `list` `.d.ts` files, `read`, or `search` |
| Check ForgeScript syntax | `validate` | Set `strict: true` to catch unknown functions and argument mismatches |
| Format ForgeScript or mixed JS/TS | `format` | Set `wrapInCodeBlock: true` when returning fenced snippets |
| Look up intents, permissions, events, scopes | `discord` | Use `resource: "calculate"` for bitfield encoding/decoding |
| Triage a user support question | `support` | Combines validation, referenced function lookups, and relevant guides |

## Mandatory Final Check

Before returning non-trivial ForgeScript code:
1. Run `validate` with `strict: true` (and `package` if targeting a specific extension).
2. Fix any reported diagnostics.
3. Run `format` if formatting or cleaning up multi-line snippets.
