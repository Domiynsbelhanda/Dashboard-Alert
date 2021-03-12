import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  item$: Observable<any[]>;
  value;

  constructor(firestore: AngularFirestore) {
    this.item$ = firestore.collection('Alerts').valueChanges();
  }

  get Alert () {
    this.item$.forEach(
      (value) => {
        this.value = value
      }
    )
    return this.value;
  }
}
