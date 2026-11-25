---
name: discord-bot-setup
description: Configure Discord Gateway Intents, privileged intents, bot permission bitfields, and OAuth2 invite scopes accurately. Use when setting up ForgeClient intents, troubleshooting missing gateway events, or generating bot invite URLs.
license: MIT
metadata:
  author: botforge
  version: "1.0"
---

# Discord Bot Setup (Intents, Permissions & Scopes)

Use this skill to configure minimal, accurate Discord Gateway Intents, permissions, and OAuth2 scopes.

## Gateway Intents Rules

1. **Request only the intents your bot actually uses.** Over-requesting intents wastes bandwidth and can block verification.
2. **Avoid privileged intents unless required:**
   - `GuildMembers` (`2`): Required for `GuildMemberAdd`, `GuildMemberUpdate`, `GuildMemberRemove`, and `ThreadMembersUpdate` member lists.
   - `GuildPresences` (`256`): Required for `PresenceUpdate`.
   - `MessageContent` (`32768`): Required to read `content`, `embeds`, `attachments`, and `components` in guild messages (not needed for slash commands, buttons, modals, or DMs).
3. **Slash-command-only bots** typically only need `['Guilds']` (plus `GuildVoiceStates` if using voice/music).

## Calculating Intents & Permissions

Never do bitfield math by hand, and do not rely on a static list of Discord intents, permissions, scopes, or events since Discord adds new ones over time. Fetch the live lists or calculate bitfields using the BotForge MCP `discord` tool (or `https://api.botforge.org/v1/discord`):

- **List current metadata:** Call `discord` with `resource: "intents"`, `"permissions"`, `"scopes"`, or `"events"`.

- **Find required intents from events:**
  Call `discord` with `resource: "calculate"` and `events: "MessageCreate,GuildBanAdd"`.
- **Decode an intents bitfield:**
  Call `discord` with `resource: "calculate"` and `intents: "32769"`.
- **Calculate a permission integer from names:**
  Call `discord` with `resource: "calculate"` and `permission_names: "View Channel,Send Messages,Embed Links"`.
- **Decode a permission integer:**
  Call `discord` with `resource: "calculate"` and `permissions: "268435456"`.

## OAuth2 Invite Scopes

- Standard bot invite with slash commands: `bot` + `applications.commands`.
- Include only the calculated permission integer in the invite URL rather than defaulting to `Administrator` (`8`).
