import { Message } from "discord.js";
import { ApiRequest } from "../api/guild-bank.api";
import { Character, goldToString } from "../models/character";
import { Account } from "../models/account";


module.exports = {
    name: 'gold',
    description: 'Get gold report',
    async execute(message: Message, args) {
        const account = await Account.findByDiscordId(message.guild.id);
        let response = "```\nGold report:\n";
        let total = 0;
        const characters = await getCharacters(account);
        characters.forEach(c => {
            response += `${c.name}: ${goldToString(c.gold)}\n`;
            total += c.gold;
        });
        response += `-------------------\nTotal: ${goldToString(total)}`;
        response += "\n```"
        await message.channel.send(response);
    },
};

const getCharacters = async (account: Account): Promise<Character[]> => {
    return new ApiRequest().forAccount(account).getCharacters();
}