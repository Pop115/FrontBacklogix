import {
    CheckboxPropertyItemObjectResponse,
    MultiSelectPropertyItemObjectResponse,
    NumberPropertyItemObjectResponse,
    RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {NotionGameObjectTextProperty} from "./notion-game-object-text.property";
import {NotionGameObjectDateProperty} from "./notion-game-object-date.property";

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
        "Release Date": NotionGameObjectDateProperty
        "Scorix": NumberPropertyItemObjectResponse
        "Tags": MultiSelectPropertyItemObjectResponse,
        "steam_app_id": NumberPropertyItemObjectResponse
    }

    constructor() {

    }

    get Platform() {
        return Object.assign(new NotionGameObjectTextProperty(), this.properties?.Platform);
    }

    get ReleaseDate() {
        return Object.assign(new NotionGameObjectDateProperty(), this.properties?.["Release Date"]);
    }

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

