import { Character } from "../models/character";
import { Guild } from "../models/guild";
import { createHttpClient } from "./http-client";
import { AxiosInstance } from "axios";

export class ApiRequest {
    public forGuild(guild: Guild) {
        return new GuildRequest(guild);
    }

    public withToken(token: string) {
        return new TokenRequest(token);
    }
}

export class TokenRequest {
    constructor(private token: string) {
    }

    public getGuildId(): Promise<string> {
        return createHttpClient(this.token).get("/guild/GetGuilds").then((result) => {
            return result.data[0].id;
        })
    }
}

export class GuildRequest {

    private httpClient: AxiosInstance;

    constructor(private guild: Guild) {
        this.httpClient = createHttpClient(guild.apiToken);
    }

    public getCharacters(): Promise<Character[]> {
        if (this.guild.isPublic) {
            return this.getPublicCharacters();
        }
        return this.getPrivateCharacters();
    }

    private getPrivateCharacters(): Promise<Character[]> {
        return this.httpClient.get(`/guild/GetCharacters/${this.guild.id}`).then((content) => {
            return content.data;
        })
    }

    private getPublicCharacters(): Promise<Character[]> {
        return this.httpClient.get(`/guild/GetFromReadonlyToken/${this.guild.id}`).then((content) => {
            return content.data.characters;
        })
    }
}
