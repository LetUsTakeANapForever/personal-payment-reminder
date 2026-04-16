import { SlashCommandBuilder }  from 'discord.js';

export const PingCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong and latentcy information'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(interaction: any) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const pingTime = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`Pong!\nBot Latency: ${pingTime}ms\nAPI Latency: ${Math.round(interaction.client.ws.ping)}ms`)
    },
};