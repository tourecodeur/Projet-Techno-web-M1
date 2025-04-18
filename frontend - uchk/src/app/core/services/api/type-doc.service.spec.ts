import { TestBed } from '@angular/core/testing';

import { TypeDocService } from './type-doc.service';

describe('TypeDocService', () => {
  let service: TypeDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
