import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from './services/contact.service';
import { IContactDetail } from './models/contact-detail.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MessageService } from './services/message.service';
import { MessageType } from './constants/message-type.constant';
import { DataService } from './services/data.service';

export type ContactOperationType = 'add' | 'update';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  formActivated = false;

  title = 'Contacts';
  contacts: Array<IContactDetail> = [];
  userId: string | null = null;
  data: any;
  // activatedUserId: string | null = null;
  // operationType: ContactOperationType = 'add';
  routeSubscription: Subscription | null = null;
  ngDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private userData: ContactService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
    // this.activatedRoute.paramMap.subscribe((params) => {
    //   this.activatedUserId = params.get('id');
    //   console.log(this.activatedUserId);
    // });

    this.messageService.message$.pipe(takeUntil(this.ngDestroy)).subscribe((message) => {
      if (message.type === MessageType.ContactListRefresh) {
        this.getAllUsers();
      }
    });
  }

  ngOnDestroy(): void {
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  openForm() {
    // this.operationType = type;
    // this.dataService.data = { details: null, type: 'add' }
    // this.formActivated = true;
    // this.data = this.dataService.data;
    // console.log('add');
    this.router.navigate(['form/add']);
  }

  getAllUsers() {
    this.userData.getUsers().subscribe((items) => {
      this.contacts = items;
    });
  }

  showDetails(id: string) {
    // this.formActivated = false;
    this.userId = id;
    this.router.navigate(['details', id]);
  }

}
