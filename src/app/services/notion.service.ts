import {HttpClient} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {LoggerService} from "./logger.service";
import {DatabaseObjectResponse, QueryDatabaseResponse} from "@notionhq/client/build/src/api-endpoints";
import {Subscription} from "rxjs";
import {NotionDatabaseResponse, NotionGameObject} from "../models/notion-game-object.model";

@Injectable({providedIn: 'root'})
export class NotionService {
    NOTION_LOCAL_API_URL = "http://127.0.0.1:3000/notionApi"

    private notionDatabaseId?: string;
    private notionApiKey?: string;
    public gamesDatabase?: NotionDatabaseResponse;

    constructor(private http: HttpClient, private loggerService: LoggerService) {
    }

    initNotion(notionApiKey: string) {
        this.notionApiKey = notionApiKey;
    }

    retrieveDatabase(databaseId: string): Promise<NotionDatabaseResponse> {
        this.notionDatabaseId = databaseId;
        let queryBody = {
            databaseId: databaseId,
            notionApiKey: this.notionApiKey
        }

        this.loggerService.addLog(`Retrieving database using Notion API...`)
        return new Promise(resolve => {
            this.http.post<NotionDatabaseResponse>(this.NOTION_LOCAL_API_URL + "/database", queryBody, {}).subscribe(data => {
                this.loggerService.addLog("Retrieved database from Notion")
                this.gamesDatabase = data;
                console.log(data);
                resolve(data);
            })
        })
    }

    //Database row == page
    updatePage(pageId: string, patchedProperties: any) {

        let queryBody = {
            notionApiKey: this.notionApiKey,
            pageId: pageId,
            patchedProperties: patchedProperties
        }
        this.loggerService.addLog(`Updating page with id ${pageId}`)
        return new Promise(resolve => {
            this.http.post<QueryDatabaseResponse>(this.NOTION_LOCAL_API_URL + "/patch", queryBody, {}).subscribe(data => {
                this.loggerService.addLog(`Updated page with id ${pageId}`)
                resolve(data);
            })
        });
    }

    getGameNames(): string[] {
        if (this.gamesDatabase) {
            return this.gamesDatabase.results!.map((databaseObject: NotionGameObject) => {
                return databaseObject.properties!.Name.title[0].plain_text;
            });
        }
        return []
    }
}
