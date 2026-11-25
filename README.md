# @tryforge/skills

Agent Skills for building Discord bots with **ForgeScript**, **BotForge extensions**, and the **BotForge MCP**, following the open [Agent Skills specification](https://agentskills.io).

Compatible with Cursor, Claude Code, VS Code, Antigravity, Windsurf, Codex, and other Agent Skills clients.

## Installation

Install all skills with `npx skills`:

```bash
npx skills add tryforge/skills
```

Or install a specific skill:

```bash
npx skills add tryforge/skills --skill forgescript
```

Target a specific agent or install globally:

```bash
npx skills add tryforge/skills --skill forgescript --agent claude-code --global
```

## Included Skills

| Skill | Description |
| :--- | :--- |
| [`forgescript`](./skills/forgescript/SKILL.md) | Core ForgeScript bot authoring: `ForgeClient` setup, prefix & slash commands, events, control flow, embeds/components, and strict validation. |
| [`forgescript-extensions`](./skills/forgescript-extensions/SKILL.md) | Installing and configuring official and community BotForge extensions (`ForgeDB`, `ForgeCanvas`, `ForgeMusic`, `ForgeGiveaways`, etc.). |
| [`discord-bot-setup`](./skills/discord-bot-setup/SKILL.md) | Minimal Discord Gateway Intents, privileged intent hygiene, permission bitfields, and OAuth2 scopes. |
| [`botforge-mcp`](./skills/botforge-mcp/SKILL.md) | Using the BotForge MCP server (`https://mcp.botforge.org/`) to search docs, validate ForgeScript, format code, and calculate Discord bitfields. |

## Pairing with BotForge MCP

These skills work best alongside the [BotForge MCP server](https://docs.botforge.org/api/mcp) (`https://mcp.botforge.org/`), which gives your assistant live access to function signatures, guides, strict syntax validation, and formatting.
