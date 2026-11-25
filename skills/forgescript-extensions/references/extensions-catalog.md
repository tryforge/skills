# BotForge Extensions Catalog

> **Note:** This catalog is a snapshot and may be incomplete or outdated as new extensions are published. When recommending, installing, or checking extension details, fetch the live list via the BotForge MCP `extensions` tool (with `name` omitted) or `https://api.botforge.org/v1/extensions` / `https://docs.botforge.org/packages`.

## Official TryForge Extensions

| Extension | Package ID | npm Package | Purpose | Notes / Intents |
| :--- | :--- | :--- | :--- | :--- |
| **ForgeDB** | `forgedb` | `@tryforge/forge.db` | Database support for SQLite, MongoDB, MySQL, and PostgreSQL | Supports `SQLite` out of the box |
| **ForgeCanvas** | `forgecanvas` | `@tryforge/forge.canvas` | Custom images, welcome cards, leaderboards, GIFs, and charts | No extra Discord intents |
| **ForgeMusic** | `forgemusic` | `@tryforge/forge.music` | Standard music player extension for ForgeScript bots | Requires `GuildVoiceStates` |
| **ForgeLinked** | `forgelinked` | `@tryforge/forge.linked` | Lavalink audio client integration for high-performance music bots | Requires `GuildVoiceStates` |
| **ForgeGiveaways** | `forgegiveaways` | `@tryforge/forge.giveaways` | Automated Discord giveaways | Works with standard guild/message/interaction intents |
| **ForgeTopGG** | `forgetopgg` | `@tryforge/forge.topgg` | Auto-post bot stats to Top.gg and handle vote webhooks | Exposes webhook vote events |
| **ForgeMinecraft** | `forgeminecraft` | `@tryforge/forge.minecraft` | Real-time Java and Bedrock Minecraft server management & status | No extra Discord intents |

## Community Extensions

| Extension | Package ID | npm Package | Purpose |
| :--- | :--- | :--- | :--- |
| **QuorielDB** | `quorieldb` | `@quoriel/db` | High-performance LMDB database interface |
| **ForgeColor** | `forgecolor` | `forge.color` | Gradients, palettes, blending, and contrast utilities |
| **ForgeRegex** | `forgeregex` | `forgeregex` | Advanced regular expression functions |
| **ForgeIndia** | `forgeindia` | `forgeindia` | Hinglish aliases for ForgeScript functions |

Always query `extensions` or `search` via the BotForge MCP (or visit `https://docs.botforge.org/packages`) for current function signatures and version-specific details.
