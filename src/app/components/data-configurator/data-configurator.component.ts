import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    OnInit,
    Output
} from "@angular/core";
import {
    BacklogixConfiguration
} from "../../models/backlogix-configuration.model";
import {FormsModule} from "@angular/forms";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";

@Component({
    standalone: true,
    selector: 'data-configurator',
    templateUrl: './data-configurator.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        NgbCollapse
    ],
    styleUrls: ['./data-configurator.component.css']
})

export class DataConfiguratorComponent implements OnInit {

    @Output()
    configSubmittedEvent = new EventEmitter<BacklogixConfiguration>();

    configCollapsed = false;

    ngOnInit(): void {

    }

    dataSubmit($event: any) {
        let configuration = new BacklogixConfiguration(
            $event.target.notionApiKey.value,
            $event.target.notionDocumentId.value,
            $event.target.steamUserId.value,
            $event.target.steamApiKey.value);
        this.configCollapsed = true;
        this.configSubmittedEvent.emit(configuration)
    }
}
