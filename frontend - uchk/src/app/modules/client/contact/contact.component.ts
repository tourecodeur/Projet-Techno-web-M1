import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  myData: FormGroup;

  constructor() {
      this.myData = new FormGroup({
          prenom: new FormControl('', [Validators.required]),
          nom: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required,Validators.email]),
          message: new FormControl('', [Validators.required]),
      })
  }

  onSubmit() {
      if (this.myData.valid){
          console.log(this.myData.value);
      }
  }
}
