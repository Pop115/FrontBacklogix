export class SteamAppList {
    "applist": {
        "apps": Array<SteamAppId>
    }
}

export class SteamAppId {
    appid?: number;
    name?: string
}