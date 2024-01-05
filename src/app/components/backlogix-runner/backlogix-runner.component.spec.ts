import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogixRunnerComponent } from './backlogix-runner.component';

describe('BacklogixRunnerComponent', () => {
  let component: BacklogixRunnerComponent;
  let fixture: ComponentFixture<BacklogixRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BacklogixRunnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BacklogixRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
