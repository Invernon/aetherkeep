import { Component, OnInit } from '@angular/core';
import { FormBuilder , FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Subscription } from "rxjs"
import { tap, first } from 'rxjs/operators';


interface User{
  email?: string;
  last_subject?: string;
  main_ability?: string;
  name?: string;
}

@Component({
  selector: 'app-recruit',
  templateUrl: './recruit.component.html',
  styleUrls: ['./recruit.component.scss']
})

export class RecruitComponent implements OnInit {

  candidatesCollection: AngularFirestoreCollection<User>
  candidate: Observable<User[]>

  myForm: FormGroup;

  //Form State
  loading = false;
  success = false;

  getUser(email):Observable <User[]>{
    this.candidatesCollection = this.afs.collection<User>('/recruit_members',
     ref => {
      return ref.where('email', '==', email );
    });
    return this.candidatesCollection.valueChanges();
  }

  constructor( private fb: FormBuilder , private afs: AngularFirestore ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      name : ['', [Validators.required, Validators.minLength(3)]],
      email : ['', [Validators.required, Validators.email]],
      main_ability : ['', [Validators.required]],
      last_subject : ['', [Validators.required]],
      university : ['', [Validators.required]],
      // agree: [false, [Validators.requiredTrue]]
    })
  }

  get email(){
    return this.myForm.get('email');
  }
  get name(){
    return this.myForm.get('name');
  }
  get main_ability(){
    return this.myForm.get('main_ability');
  }
  get agree(){
    return this.myForm.get('agree');
  }

  async submitHandler(){
    const formValue = this.myForm.value;
    let email = this.myForm.value.email;

    const subscription = this.getUser(email).subscribe( data => {
      if(data.length > 0){
        alert("Este email ya esta en uso.")
      }
      else{
        this.loading = true;
        try{
          this.afs.collection('recruit_members').add(formValue);
          this.success = true 
          subscription.unsubscribe();
        }
        catch(err){
          console.log(err)
        }
        this.loading = false; 
      }

    });

  }

}
