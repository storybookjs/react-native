import { OnInit } from '@angular/core';
import { DummyService } from './dummy.service';
export declare class ServiceComponent implements OnInit {
    private dummy;
    items: any;
    name: any;
    constructor(dummy: DummyService);
    ngOnInit(): Promise<void>;
}
