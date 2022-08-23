import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UiService {
  loadingStateChanged = new Subject<boolean>();
}
