const { configDotenv } = require("dotenv");
const { GatewayIntentBits, Client } = require('discord.js');
configDotenv()

const main = async () => {
  try {
    const res = await fetch('https://insignia.live/halo2')
    const text = await res.text()
    const arr = text.split('\n')
    const hardcoreIndex = arr.findIndex(i => i.includes('Team Hardcore'))
    const slice = arr.slice(hardcoreIndex, hardcoreIndex + 10)
    const playerCount = parseInt(slice.find(s => s.includes('Players')).trim()[0])
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    console.log({playerCount, currentTime})
    
    if (playerCount >= 4) { 
      const client = new Client({ intents: [GatewayIntentBits.Guilds] });
      client.login(process.env.DISCORD_AUTH_TOKEN);
      client.on('ready', () => {

        client.guilds.cache.map(async guild => {
          await guild.channels
          .fetch()
          .then(async channels => {

            const textChannels = channels.filter(
              channel => channel.type === 0,
            );
            const channel = textChannels.filter(textChannel =>
              textChannel.name.includes('h2'),
            );
            console.log({server: guild.name, channels: channel.map(c => c.name)})
            // if(guild.name === 'Keylords') { // if testing
            channel.map(c => c.send(`Team Hardcore has ${playerCount} players searching.`));
            // }
          })
          .catch(err => {
            console.log({err})
          });
  
        })

      });
    }
  } catch (error) {
    console.log({error})
  }
}

main()

setInterval(() => {
  main()
}, 5 * 60 * 1000);