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
                  channel.map(c => c.send(`Team Hardcore has ${playerCount} players searching.`));
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

setInterval(() => {
  main()
}, 5 * 60 * 1000);