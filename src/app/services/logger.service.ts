import {Injectable, Output} from '@angular/core';
import {Log} from "../models/log.model";
import {of} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LoggerService {

    private logList: Log[] = [];
    public logs = of(this.logList)


    addLog(message : string){
        this.logList.push(new Log(message));
    }

}