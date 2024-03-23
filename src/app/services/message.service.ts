import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private message: Subject<any> = new Subject<any>();
  message$: Observable<any> = this.message.asObservable();

  constructor() { }

  postMessage(type: string, message: any): void {
    const messageBody = {
      type: type,
      body: message
    };
    this.message.next(messageBody);
  }
}
