import {
    CheckboxPropertyItemObjectResponse, DatabaseObjectResponse,
    DatePropertyItemObjectResponse,
    MultiSelectPropertyItemObjectResponse,
    NumberPropertyItemObjectResponse,
    PageObjectResponse,
    PartialDatabaseObjectResponse,
    PartialPageObjectResponse,
    RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export class NotionGameObjectTextProperty {
    id?: string;
    rich_text?: [
        {
            "text": { "content": string }
        }
    ];
    type?: "rich_text";

    public setContent(content: string) {

        if (this.rich_text) {
            if (this.rich_text[0] != null) {
                this.rich_text[0].text.content = content;
            } else {
                this.rich_text = [{"text": {"content": content}}];
            }
        }
    }

    public getContent() {
        return this.rich_text && this.rich_text.length > 0 ? this.rich_text[0].text.content : null;
    }
}

export class NotionGameObject {
    id?: string;
    //TODO replace with custom types because notion types suck
    properties?: {
        "HowLongToBeat Complete": NumberPropertyItemObjectResponse
        "HowLongToBeat Main": NumberPropertyItemObjectResponse
        "MetaCritic Score": NumberPropertyItemObjectResponse
        "MetaCritic User Score": NumberPropertyItemObjectResponse
        "Name": { title: Array<RichTextItemResponse> }
        "Owned": CheckboxPropertyItemObjectResponse
        "Platform": NotionGameObjectTextProperty
        "Price": NumberPropertyItemObjectResponse
        "Release Date": DatePropertyItemObjectResponse
        "Scorix": NumberPropertyItemObjectResponse
        "Tags": MultiSelectPropertyItemObjectResponse,
        "steam_app_id": NumberPropertyItemObjectResponse
    }

    // constructor(pageObject: PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse) {
    //     Object.assign(this, pageObject);
    // }

    constructor() {

    }

    get Platform() {
        return Object.assign(new NotionGameObjectTextProperty(), this.properties?.Platform);
    }

    // set Platform(platform : string){
    //
    // }

    getNotionName() {
        return this.properties?.Name.title[0].plain_text;
    }

    hasHowLongToBeatData(): boolean {
        return this.properties?.
            ["HowLongToBeat Main"].number != null && this.properties["HowLongToBeat Complete"].number != null;
    }

    hasMetaCriticData(): boolean {
        return this.properties?.["MetaCritic Score"].number != null && this.properties["MetaCritic User Score"].number != null;
    }

    hasPlatformData() {
        return this.properties?.Price.number != 0;
    }

    hasMissingProperty(): string | boolean {
        console.log("Checking missing property")
        for (let key in this.properties) {
            // @ts-ignore
            if (this.properties[key] && this.properties[key].type == "number" && this.properties[key].number == null) {
                console.log(`Missing ${key} for game ${this.properties?.Name.title[0].plain_text}`)
                return key;
            }
            //TODO other types

        }

        return false;
    }
}

export class NotionDatabaseResponse {
    results?: Array<NotionGameObject>;
}