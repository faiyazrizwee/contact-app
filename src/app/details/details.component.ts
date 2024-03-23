import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, viewChild } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IContactDetail } from '../models/contact-detail.model';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { MessageService } from '../services/message.service';
import { MessageType } from '../constants/message-type.constant';

interface IData {
  id: string,
  name: string,
  phone: string,
  email: string,
  address: string
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy {
  // @Input() userDetails: IData | null = null;
  // @Output() refreshOnDelete = new EventEmitter<void>();
  // @Output() appearanceOfFormOnDelete = new EventEmitter<void>();
  // @Output() appearanceOfFormOnUpdate = new EventEmitter<any>();
  // @Output() updateTrue = new EventEmitter<boolean>();

  userId: string | null = null;
  contactDetails: IContactDetail | null = null;
  routeSubscription: Subscription | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private dataService: DataService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe((params) => {
      this.userId = params.get('id');
      // console.log(this.userId);
      if (this.userId) {
        this.contactService.getUser(this.userId).subscribe((response: IContactDetail) => {
          this.contactDetails = response;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  deleteUser(id: string) {
    this.contactService.deleteUsers(id).subscribe((item) => {
      // this.refreshOnDelete.emit();
      // this.appearanceOfFormOnDelete.emit();
      this.messageService.postMessage(MessageType.ContactListRefresh, null);
      this.router.navigate(['/form/add']);

    });
  }

  updateUser() {
    // this.appearanceOfFormOnUpdate.emit();
    // this.dataService.data = { details: this.contactDetails, type: 'update' };
    this.router.navigate(['/form/edit', this.contactDetails!.id])
  }
}
