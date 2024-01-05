import {Component, Injectable} from '@angular/core';
import {DataConfiguratorComponent} from "../data-configurator/data-configurator.component";
import {LogViewerComponent} from "../log-viewer/log-viewer.component";
import {BacklogixConfiguration} from "../../models/backlogix-configuration.model";
import {NotionService} from "../../services/notion.service";
import {HttpClientModule} from "@angular/common/http";
import {LoggerService} from "../../services/logger.service";
import {BacklogixRunnerComponent} from "../backlogix-runner/backlogix-runner.component";
import {QueryDatabaseResponse} from "@notionhq/client/build/src/api-endpoints";
import {SteamService} from "../../services/steam.service";

@Component({
    selector: 'main-page',
    standalone: true,
    imports: [
        DataConfiguratorComponent,
        LogViewerComponent,
        BacklogixRunnerComponent
    ],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.css',
    providers: [LoggerService, HttpClientModule]
})
export class MainPageComponent {

    configuration?: BacklogixConfiguration;

    constructor(private notionService: NotionService, private steamService: SteamService, private loggerService: LoggerService) {

    }

    configSubmitted(configuration: BacklogixConfiguration) {
        console.log(configuration);
        this.configuration = configuration;
        this.initNotion();
        this.initSteam();
    }

    initSteam() {
        if (this.configuration) {
            this.steamService.initSteam(this.configuration.steamApiKey, this.configuration.steamUserId)
        }
    }

    initNotion() {
        if (this.configuration) {
            this.notionService.initNotion(this.configuration.notionApiKey);
            if (this.configuration.notionDocumentId) {
                this.notionService.retrieveDatabase(this.configuration.notionDocumentId).then((response: QueryDatabaseResponse) => {
                    this.loggerService.addLog(`Database contains ${response.results.length} games`)

                });
            } else {
                //TODO create document
            }

        }
    }
}
