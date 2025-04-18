import { TestBed } from '@angular/core/testing';

import { FormatDocService } from './format-doc.service';

describe('FormatDocService', () => {
  let service: FormatDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
