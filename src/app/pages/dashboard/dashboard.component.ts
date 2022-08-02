import { Component, HostBinding, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { trigger, state, style, animate, transition, } from '@angular/animations';
// import { DatabaseService } from 'src/app/services/firestoreDatabase/database.service';
import { map, finalize } from "rxjs/operators";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Item } from 'src/app/interfaces/item';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
  title = "Patrika;"
  newsTitle = '';
  news = {};
  fb!: string;
  allMyPosts = [];
  selectedFile!: File;
  newsDescription = ''
  currDate = new Date()
  imageuploaded!: boolean;
  downloadURL!: Observable<string>;
  currentUser = JSON.parse(localStorage.getItem('user')!);
  i!: number;
  loadingHalt = false;
  private itemsCollection!: AngularFirestoreCollection<Item>;
  items!: Observable<Item[]>;

  ngOnInit(): void {
    // this.loadingHalt = true;
    this.itemsCollection = this.db.collection<Item>('posts', ref => ref.where('uid', '==', this.currentUser.uid));
    this.items = this.itemsCollection.valueChanges();
    if (this.items)
      console.log(this.i)
    console.log(this.items)
    // this.db.collection('posts').doc().collection(JSON.stringify(this.currDate).slice(1, 11)).get()
    // this.loadingHalt = false;
  }

  constructor(public authService: AuthService, private http: HttpClient, private db: AngularFirestore, private storage: AngularFireStorage) { }

  postNews() {
    this.loadingHalt = true;
    const postingNews = this.db.collection("posts")
    if (this.imageuploaded == true) {
      postingNews.add
        ({
          date: JSON.stringify(this.currDate).slice(1, 11),
          description: this.newsDescription,
          image: this.fb,
          title: this.newsTitle,
          uid: this.currentUser.uid,
          userName: this.currentUser.displayName,
        });
      this.loadingHalt = false;
    }
    else {
      postingNews.add
        ({
          date: JSON.stringify(this.currDate).slice(1, 11),
          description: this.newsDescription,
          title: this.newsTitle,
          userName: this.currentUser.displayName,
        })
    }
    this.newsTitle = ' ';
    this.newsDescription = ' ';
    this.imageuploaded = false;
    this.fb = " ";
  }

  getPostsNews() {
    this.loadingHalt = true;
    const searchByDate = '27 July 2022';
    this.db.collection('posts', ref => ref.where('uid', '==', this.currentUser.uid)).get().subscribe(posts => {
      posts.docs.forEach(post => {
        console.log(post.data());
      })
    });
    this.loadingHalt = false;
  }

  async onFileSelected(event: any) {
    this.loadingHalt = true;
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
              this.imageuploaded = true
            }
            console.log('fb')
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
          console.log('url')
        }
      });
    this.getPostsNews();
    this.loadingHalt = false;
  }

  //  apiUrl = 'https://appusers-725e2-default-rtdb.firebaseio.com/'

  // upload(file: any): Observable<any> {
  //   const formData = new FormData();
  //   formData.append("file", file, file.name);
  //   return this.http.post(this.apiUrl, formData)
  // }
}
