import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { ContactOperationType } from '../app.component';
import { MessageService } from '../services/message.service';
import { MessageType } from '../constants/message-type.constant';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface IData {
  id: string,
  name: string,
  phone: string,
  email: string,
  address: string
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  // @Input() userDetails: IData | null = null;
  // @Input() operationType: ContactOperationType = 'add';
  @Output() sidebarRefreshData = new EventEmitter<void>();
  @Output() refreshOnSave = new EventEmitter<any>();
  @Output() refreshOnUpdate = new EventEmitter<void>();
  @Output() detailsOfUpdatedContact = new EventEmitter<any>();

  data: any;
  operationType: string | null = null;
  userId: string | null = null;
  userDetails: IData | null = null;

  userForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    email: new FormControl('', [Validators.email]),
    address: new FormControl('')
  });

  constructor(
    private userData: ContactService,
    private messageService: MessageService,
    // private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // if (this.userDetails && this.operationType === 'update') {
    //   this.userForm.setValue({
    //     name: this.userDetails.name,
    //     phone: this.userDetails.phone,
    //     email: this.userDetails.email,
    //     address: this.userDetails.address,
    //   });
    // }

    this.activatedRoute.paramMap.subscribe((params) => {
      this.userId = params.get('id')
      if (this.userId) {
        this.contactService.getUser(this.userId).subscribe((item) => {
          this.userDetails = item;
          if (this.userDetails) {
            this.userForm.setValue({
              name: this.userDetails.name,
              phone: this.userDetails.phone,
              email: this.userDetails.email,
              address: this.userDetails.address
            })
          }
        })
      }
    })
    // this.data = this.dataService.data;
    // console.log(this.data);
    //   this.operationType = this.data.type;
    //   console.log(this.operationType);
    // }
  }

  createUser() {
    if (this.userId) {
      this.userData.UpdateUsers(this.userId, this.userForm.value).subscribe(() => {
        // this.refreshOnUpdate.emit();
        // this.detailsOfUpdatedContact.emit(this.userForm.value);
        this.messageService.postMessage(MessageType.ContactListRefresh, null);
        this.operationType = null;
        this.router.navigate(['details', this.userDetails!.id])
      });
    } else {
      this.userData.postUsers(this.userForm.value).subscribe((resp: any) => {
        this.messageService.postMessage(MessageType.ContactListRefresh, null);
        this.router.navigate(['details', resp.id])
        // this.sidebarRefreshData.emit();
        // this.refreshOnSave.emit(resp);
      });
    }
  }
}
