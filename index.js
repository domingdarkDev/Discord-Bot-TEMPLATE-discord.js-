// Aquí se importan los módulos importantes para hacer funcionar al bot.
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json'); // Aquí configuramos que la variable "token" este configurada en el archivo "config.json".

// Crear una nueva instancia del cliente.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Colección para manejar los comandos
client.commands = new Collection();

// Cargar comandos
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`Comando cargado: ${command.data.name}`);
}

// Cuando el bot esté listo enviará un mensaje a la consola.
client.once('ready', () => {
    console.log(`¡Bot iniciado como ${client.user.tag}!`);
});

// Manejar interacciones de comandos slash.
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
    }
});

// Iniciar sesión con el token guardado en "config.json".
client.login(token);
