import {CommonModule, NgFor} from '@angular/common';
import {Component} from '@angular/core';
import {Log} from '../../models/log.model';
import {NotionService} from '../../services/notion.service';
import {LoggerService} from "../../services/logger.service";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'log-viewer',
    standalone: true,
    imports: [CommonModule, NgFor, NgbCollapse],
    templateUrl: './log-viewer.component.html',
    styleUrl: './log-viewer.component.css'
})
export class LogViewerComponent {
    logsCollapsed = false;
    logList: Log[] = [];

    constructor(private loggerService: LoggerService) {
        this.loggerService.logs.subscribe(observedLogs => {
                this.logList = observedLogs;
            }
        );
    }
}
