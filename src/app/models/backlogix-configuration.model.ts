export class BacklogixConfiguration {
    notionApiKey: string;
    notionDocumentId?: string;
    steamUserId: string;
    steamApiKey: string;


    constructor(notionApiKey: string, notionDocumentId: string, steamUserId: string, steamApiKey: string) {
        this.notionApiKey = notionApiKey;
        this.notionDocumentId = notionDocumentId;
        this.steamUserId = steamUserId;
        this.steamApiKey = steamApiKey;
    }
}