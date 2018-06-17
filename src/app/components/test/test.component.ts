import { Component, OnInit } from '@angular/core';
import { FormBuilder , FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection , AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';


import { tap, first } from 'rxjs/operators';
import { Time } from '@angular/common';

interface User{
  email?: string;
  last_subject?: string;
  main_ability?: string;
  name?: string;
}

interface Candidate{
  name?: string;
  email?:string;
  start_time?: Date;
  finish_time?: Date;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  userCollection: AngularFirestoreCollection<User>
  user: Observable<User[]>

  candidatesCollection: AngularFirestoreCollection<Candidate>
  candidate: Observable<Candidate[]>
  actualCandidate : any
  
  myForm: FormGroup;
  emailConfirmation: FormGroup;

  validated : boolean = false;
  ready: boolean = false;
  newU:boolean = false;

  //Form State
  loading = false;
  success = false;

  //Get information from the DB
  getActiveMembers(email):Observable <Candidate[]>{
    this.candidatesCollection = this.afs.collection<Candidate>('/test_information',
     ref => {
      return ref.where('email', '==', email );
    });
    return this.candidatesCollection.valueChanges();
  }
  

  constructor(  private fb: FormBuilder , private afs: AngularFirestore ) { }
  
  ngOnInit() {

    this.emailConfirmation = this.fb.group({
      email : ['', [Validators.required, Validators.email]],
    })

  }

  async getReady(){
    this.ready = true
    let newUser = { 
      name: this.actualCandidate.name,
      email: this.actualCandidate.email,
      start_time: Date.now(),
      finish_time: Date.now() + (8*60*60*1000) ,
    }
    this.actualCandidate = newUser;
    try{
      await this.afs.collection('test_information').add(newUser);
      this.success = true 
    }
    catch(err){
      console.log(err)
    }
  }

  getCanditate(){
    let email = this.emailConfirmation.value.email;
   
    this.getActiveMembers(email).subscribe( data => {
      if(data.length > 0){
        this.actualCandidate = data[0];
        this.validated=true;
        this.ready=true;
      }
      else{
        this.userCollection = this.afs.collection('recruit_members', ref => {
          return ref.where('email', '==', email );
        });
    
        this.user = this.userCollection.valueChanges();
        this.user.subscribe(data => {
          if(data.length > 0){
            this.actualCandidate = data[0];
            this.validated = true 
          }
          else{
            alert("No existe una solicitud para ese email");
          }
        })
      }
    })

  }
  
  get email(){
    return this.emailConfirmation.get('email');
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
    this.loading = true; 
    const formValue = this.myForm.value;
    try{
      await this.afs.collection('test_information').add(formValue);
      this.success = true 
    }
    catch(err){
      console.log(err)
    }
    this.loading = false; 
  }

}
