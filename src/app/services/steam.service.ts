import {HttpClient} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {LoggerService} from "./logger.service";
import {SteamAppId, SteamAppList} from "../models/steam-app-list.model";

@Injectable({providedIn: 'root'})
export class SteamService {
    STEAM_LOCAL_API_URL = "http://127.0.0.1:3000/steamApi"

    private steamUserId?: string;
    private steamApiKey?: string;
    private steamAppList?: SteamAppList;

    constructor(private http: HttpClient, private loggerService: LoggerService) {
    }

    initSteam(steamApiKey: string, steamUserId : string) {
        this.steamApiKey = steamApiKey;
        this.steamUserId  = steamUserId;
    }

    retrieveSteamGames(): Promise<any> {
        let queryBody = {
            steamApiKey: this.steamApiKey
        }
        this.loggerService.addLog(`Retrieving games using Steam API...`)
        return new Promise(resolve => {
            this.http.post<SteamAppList>(this.STEAM_LOCAL_API_URL + "/steamGames", queryBody, {}).subscribe(response => {
                this.loggerService.addLog("Retrieved games from Steam");
                this.steamAppList = response;
                console.log(response);
                resolve(response);
            })
        })
    }

    retrieveGameInfo(appId: number) {
        let queryBody = {
            appId: appId,
            steamUserId: this.steamUserId
        }

        this.loggerService.addLog(`Retrieving game info using Steam API...`);
        return new Promise(resolve => {
            this.http.post<SteamAppList>(this.STEAM_LOCAL_API_URL + "/gameInfo", queryBody, {}).subscribe(response => {
                this.loggerService.addLog("Retrieved game info from Steam");
                this.steamAppList = response;
                console.log(response);
                resolve(response);
            });
        });

        // tags = []
        // date = data.get("release_date", {}).get("date")
        // price = data.get("price_overview", {}).get("final_formatted")
    }

    getAppIdFromName(name: string): SteamAppId[] | null {
        console.log(`Retrieving app id for ${name}`)
        const patterns_to_exclude = ["soundtrack", "expansion", "OST", "Demo", "Playtest", "cosmetic", "pack", "dlc", "Beta", "artbook"];

        const pattern = new RegExp(".*" + name + ".*", 'i');
        const exclude_patterns = patterns_to_exclude.map(exclude => new RegExp(exclude, 'i'));


        const matches = this.steamAppList?.applist.apps.filter(app => {
            return app.name && pattern.test(app.name) && !exclude_patterns.some(exclude => exclude.test(app.name!))
        })
        console.log("matches", matches);

        if (!matches || matches.length == 0) {
            //not on steam or name on notion is not correct, do something or ignore?
        } else if (matches.length == 1) {
            return [matches[0]];
        } else {
            return matches;

        }

        return null;
    }


}
