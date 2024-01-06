import {Component} from '@angular/core';
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";
import {NotionService} from "../../services/notion.service";
import {
    PageObjectResponse,
    RichTextItemResponse,
    TextRichTextItemResponse
} from "@notionhq/client/build/src/api-endpoints";
import {NotionGameObject, NotionGameObjectTextProperty} from "../../models/notion-game-object.model";
import {SteamService} from "../../services/steam.service";
import {SteamAppId} from "../../models/steam-app-list.model";
import {Observable, of} from "rxjs";
import {LoggerService} from "../../services/logger.service";
import {app} from "../../../../server";
import _ from "lodash";

@Component({
    selector: 'backlogix-runner',
    standalone: true,
    imports: [
        DatePipe,
        NgForOf,
        NgbCollapse,
        NgClass
    ],
    templateUrl: './backlogix-runner.component.html',
    styleUrl: './backlogix-runner.component.css',
    providers: []
})
export class BacklogixRunnerComponent {
    runnerCollapsed = false
    isRunning = false;

    //App id selection
    currentAppChoiceName?: string;
    isAppChoiceOpened = false;
    appChoices: SteamAppId[] = [];
    waitForAppChoiceResolver: any;

    constructor(private notionService: NotionService, private steamService: SteamService, private loggerService: LoggerService) {

    }

    async fillMissingData() {
        if (!this.notionService.gamesDatabase || !this.notionService.gamesDatabase.results)
            return;

        this.isRunning = true;
        await this.steamService.retrieveSteamGames()

        for (const response of this.notionService.gamesDatabase.results) {
            let gameObject: NotionGameObject = Object.assign(new NotionGameObject(), response)
            console.log(gameObject.getNotionName())
            if (!gameObject || !gameObject.properties || !gameObject.id)
                return;
            let originalProperties = structuredClone(gameObject.properties);

            //"Empty platform" or "On Steam but empty steam app id"
            if (!gameObject.Platform.getContent() || gameObject.Platform.getContent() == "Steam") {
                if (!gameObject.properties.steam_app_id || !gameObject.properties.steam_app_id.number || gameObject.properties.steam_app_id.number == 0)
                    await this.fillSteamAppId(gameObject);

                if (gameObject.properties.steam_app_id.number != 0)
                    gameObject.Platform.setContent("Steam");
            }

            if (gameObject.Platform.getContent() == "Steam") {
                await this.steamService.retrieveGameInfo(gameObject.properties.steam_app_id.number!)
            }

            //TODO check if it has 1 missing property, skip if everything is already filled

            //TODO retrieve clean name
            //TODO convert python script to ts
            if (!_.isEqual(gameObject.properties, originalProperties)) {
                await this.notionService.updatePage(gameObject.id, gameObject.properties);
                this.loggerService.addLog("Updated game " + gameObject.getNotionName());
            } else {
                //this.loggerService.addLog("No update for game " + gameObject.getNotionName());
            }

        }
        this.isRunning = false;
    }

    private async fillSteamAppId(gameObject: NotionGameObject) {
        let optionalAppId = this.steamService.getAppIdFromName(gameObject.properties?.Name.title[0].plain_text!)
        let appId;
        if (optionalAppId != null && optionalAppId.length == 1) {
            appId = optionalAppId[0];
        } else if (optionalAppId != null && optionalAppId.length > 1) {
            appId = await this.waitForAppIdChoice(gameObject, optionalAppId);
        }

        if (appId && appId.appid && gameObject.properties) {
            gameObject.properties.steam_app_id.number = appId.appid
            gameObject.Platform.setContent("Steam");
            this.loggerService.addLog(gameObject.getNotionName() + " associated with Steam game " + appId.name + " with id " + appId.appid);
        }
    }

    public chooseAppId(appChoice: SteamAppId) {
        this.isAppChoiceOpened = false;
        this.appChoices = [];
        this.currentAppChoiceName = "";
        this.waitForAppChoiceResolver(appChoice);
    }

    private waitForAppIdChoice(gameObject: NotionGameObject, appChoices: SteamAppId[]) {
        this.isAppChoiceOpened = true;
        this.appChoices = appChoices;
        this.currentAppChoiceName = gameObject.getNotionName();
        return new Promise<SteamAppId>(resolve => this.waitForAppChoiceResolver = resolve);
    }
}
