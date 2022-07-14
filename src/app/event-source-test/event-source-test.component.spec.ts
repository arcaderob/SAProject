import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSourceTestComponent } from './event-source-test.component';

describe('EventSourceTestComponent', () => {
  let component: EventSourceTestComponent;
  let fixture: ComponentFixture<EventSourceTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventSourceTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSourceTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
