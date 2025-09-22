const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
require("dotenv").config();
require("./server"); // เรียก server.js

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const logChannelId = process.env.LOG_CHANNEL_ID; // อ่านจาก Secrets

// กำหนดชื่อ role ที่สามารถใช้คำสั่งได้
const allowedRoleName = "หลวงปู่เค็ม"; // <-- เปลี่ยนเป็น role ที่คุณต้องการ

client.once("ready", () => {
  console.log(`🤖 บอทออนไลน์แล้ว: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (!message.member.voice.channel) return;

  const channel = message.member.voice.channel;

  // ตรวจสอบว่าผู้ใช้มี role ที่อนุญาต
  const hasRole = message.member.roles.cache.some(
    (role) => role.name === allowedRoleName
  );
  if (!hasRole) {
    return message.reply(`❌ คุณไม่มีสิทธิ์ใช้คำสั่งนี้! ต้องมี role: **${allowedRoleName}**`);
  }

  // คำสั่งล็อค
  if (command === "!lockvc") {
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      Connect: false,
      ViewChannel: true,
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

  // คำสั่งปลดล็อค
  if (command === "!unlockvc") {
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      Connect: true,
      ViewChannel: true,
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

// ล็อกอินด้วย Token จาก Secrets
client.login(process.env.TOKEN).catch((err) => {
  console.error("❌ TOKEN ไม่ถูกต้อง:", err.message);
});
