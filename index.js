const readline = require("readline");
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require("discord.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ✅ ถาม Token ตอนรัน
rl.question("กรุณาใส่ TOKEN ของบอท: ", (token) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  // แก้เป็น ID ของช่อง log ที่ต้องการ
  const logChannelId = "1417445694419239014";

  client.once("ready", () => {
    console.log(`🤖 บอทออนไลน์แล้ว: ${client.user.tag}`);
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // ✅ คำสั่งล็อค
    if (command === "!lockvc") {
      if (!message.member.voice.channel) {
        return message.reply("❌ กรุณาเข้าห้องเสียงก่อนใช้คำสั่งนี้!");
      }

      const channel = message.member.voice.channel;

      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        Connect: false, // 🚫 เข้าไม่ได้
        ViewChannel: true, // 👀 ยังเห็นห้อง
      });

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🔒 ห้องถูกล็อคแล้ว")
        .setDescription(`ห้อง **${channel.name}** ถูกล็อค ไม่สามารถเข้าร่วมได้`)
        .setTimestamp();

      await message.reply({ embeds: [embed] });
      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) logChannel.send({ embeds: [embed] });
    }

    // ✅ คำสั่งปลดล็อค
    if (command === "!unlockvc") {
      if (!message.member.voice.channel) {
        return message.reply("❌ กรุณาเข้าห้องเสียงก่อนใช้คำสั่งนี้!");
      }

      const channel = message.member.voice.channel;

      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        Connect: true, // ✅ เข้าได้
        ViewChannel: true, // 👀 เห็นห้อง
      });

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🔓 ห้องถูกปลดล็อคแล้ว")
        .setDescription(`ห้อง **${channel.name}** สามารถเข้าร่วมได้แล้ว`)
        .setTimestamp();

      await message.reply({ embeds: [embed] });
      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) logChannel.send({ embeds: [embed] });
    }
  });

  // 🔑 ล็อกอินด้วย token ที่พิมพ์ใน console
  client.login(token).catch((err) => {
    console.error("❌ TOKEN ไม่ถูกต้อง:", err.message);
  });

  rl.close();
});
