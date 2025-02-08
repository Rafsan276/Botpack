export const config = {
  name: "help",
  version: "1.0.2",
  permission: 0,
  credits: "sakibin",
  description: "Beginner's Guide",
  prefix: true,
  premium: false,
  category: "system",
  usages: "[Shows Commands]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60,
  },
};
 
export const languages = {
  en: {
    moduleInfo:
      "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by Sakibin ",
    helpList: `◖Total %1 cmd or %2 categories.`,
    guideList: `◖Use: "%1${config.name} ‹command›" to know how to use that command!\n◖Type: "%1${config.name} ‹page_number›" to show that page contents!`,
    user: "User",
    adminGroup: "Admin group",
    adminBot: "Admin bot",
  },
};
 
export const handleEvent = ({ box, event, getText }: { box: any; event: any; getText: Function }) => {
  const a = event;
  const { threadID, messageID, body } = a;
  const { commands } = global.client;
 
  if (!body || !body.startsWith("help")) return;
 
  const args = body.trim().split(/\s+/);
  if (args.length === 1 || !commands.has(args[1].toLowerCase())) return;
 
  const command = commands.get(args[1].toLowerCase());
  const prefix = global.data.threadData.get(parseInt(threadID))?.PREFIX || global.config.PREFIX;
 
  box.send(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${command.config.usages || ""}`,
      command.config.category,
      command.config.cooldowns,
      command.config.permission === 0
        ? getText("user")
        : command.config.permission === 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};
 
export const run = async ({ box, user, event, args, getText }: { box: any; user: any; event: any; args: string[]; getText: Function }) => {
  const a = event;
  const b = user;
  const { threadID, messageID } = a;
  const { commands } = global.client;
  const threadData = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadData.PREFIX || global.config.PREFIX;
  const command = commands.get((args[0] || "").toLowerCase());
 
  if (!command) {
    const cmdList = Array.from(commands.values());
    const categories = Array.from(new Set(cmdList.map((cmd) => (cmd.config.category || "unknown").toLowerCase())));
    const itemsPerPage = 4;
    const totalPages = Math.ceil(categories.length / itemsPerPage);
 
    const currentPage = Math.min(Math.max(parseInt(args[0]) || 1, 1), totalPages);
    const visibleCategories = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
 
    const msg = visibleCategories
      .map((cat, i) => {
        const cmds = cmdList.filter((cmd) => (cmd.config.category || "unknown").toLowerCase() === cat);
        return `${i + 1}•────• ${cat.charAt(0).toUpperCase() + cat.slice(1)} •────•\n⭓ ${cmds.map((cmd) => cmd.config.name).join(" ⭓")}`;
      })
      .join("\n\n");
 
    const text = `${msg}\n╭ ──────── ╮\n│ Page ${currentPage} of ${totalPages} │\n╰ ──────── ╯\n${getText(
      "helpList",
      commands.size,
      categories.length
    )}`;
 
    const botInfo = require("./../../sakibin.json");
    const finalMessage = `‣ Bot Owner: ${botInfo.BOTOWNER}\n${text}`;
 
    const sent = await b.send(finalMessage, threadID);
    setTimeout(() => box.unsend(sent.messageID), 60000);
  } else {
    box.send(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${command.config.usages || ""}`,
        command.config.category,
        command.config.cooldowns,
        command.config.permission === 0
          ? getText("user")
          : command.config.permission === 1
          ? getText("adminGroup")
          : getText("adminBot"),
        command.config.credits
      ),
      threadID,
      messageID
    );
  }
};
 
