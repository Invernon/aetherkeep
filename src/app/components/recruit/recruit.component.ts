import { Component, OnInit } from '@angular/core';
import { FormBuilder , FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { tap, first } from 'rxjs/operators';

@Component({
  selector: 'app-recruit',
  templateUrl: './recruit.component.html',
  styleUrls: ['./recruit.component.scss']
})
export class RecruitComponent implements OnInit {

  myForm: FormGroup;

  //Form State
  loading = false;
  success = false;

  constructor( private fb: FormBuilder , private afs: AngularFirestore ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      name : ['', [Validators.required, Validators.minLength(3)]],
      email : ['', [Validators.required, Validators.email]],
      main_ability : ['', [Validators.required]],
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
    this.loading = true; 
    const formValue = this.myForm.value;
    try{
      await this.afs.collection('recruit_members').add(formValue);
      this.success = true 
    }
    catch(err){
      console.log(err)
    }
    this.loading = false; 
  }

}
