const { ForgeClient } = require('@tryforge/forgescript')

const client = new ForgeClient({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
  events: ['ready', 'messageCreate', 'interactionCreate'],
  prefixes: ['!'],
})

client.commands.load('./commands')
client.applicationCommands.load('./slash')

client.login(process.env.DISCORD_TOKEN)
