import {Injectable, Output} from '@angular/core';
import {Log} from "../models/log.model";
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class LoggerService {

    private logList: Log[] = [];
    public logs = of(this.logList)

    constructor() {
        console.log("Logger service init")
    }

    addLog(message : string){
        this.logList.push(new Log(message));
    }

}