import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatTableDataSource} from '@angular/material/table';
import {Icon} from '../../shared/interfaces';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {WorkWithFirebaseIconsService} from '../../shared/work-with-firebase-icons.service';
import {MatAccordion} from '@angular/material/expansion';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss']
})
export class QuestionsPageComponent implements OnInit, AfterViewInit {
  myGroup: FormGroup;
  @Input() disabled: boolean;
  // tslint:disable-next-line:no-output-native
  @Output() change: EventEmitter<MatSlideToggleChange>;
  displayedColumns: string[] = ['img', 'code', 'title', 'questions', 'date'];
  dataSource: MatTableDataSource<Icon>;
  icons: Icon[] = [];
  questionsLength = 0;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 1000;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private firebaseIcons: WorkWithFirebaseIconsService) { }

  ngOnInit() {
    this.myGroup = new FormGroup({
      answer: new FormControl('', [Validators.required])
    });
    this.firebaseIcons.getAll()
      .subscribe((icons) => {
      icons.forEach(v => {
        if (v.questions) {
          if (v.questions.length) {
            this.icons.push(v);
            this.questionsLength = this.questionsLength + v.questions.length;
          }
        }
      } );
      this.dataSource = new MatTableDataSource(this.icons);
      this.dataSource.paginator = this.paginator;
      console.log(this.icons, this.questionsLength);
    });
    this.disabled = true;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // COMMENTS

  remove(id: string, index: any) {
    const delComment = this.icons.filter(value => value.id === id);
    delComment[0].questions.splice(index, 1);
    console.log(delComment, index, id);
    this.firebaseIcons.patch(id, {questions: delComment[0].questions})
      .subscribe(() => {
        this.icons.map(el => {
          if (el.id === id) {
            el.questions = delComment[0].questions;
          }
        });
      });
    this.dataSource = new MatTableDataSource(this.icons);
  }

  readly(id: any, i: number) {
    const read = this.icons.filter(value => value.id === id);
    if (read[0].questions[i].read === true) {
      read[0].questions.map(val => val.read = false);
      console.log(read[0].questions);
      this.firebaseIcons.patch(id, {questions: read[0].questions})
        .subscribe(() => {
          this.icons.map(el => {
            if (el.id === id) {
              el.questions = read[0].questions;
            }
          });
        });
      this.dataSource = new MatTableDataSource(this.icons);
    }

  }

  toAnswer(id: string, i: any) {
    if (this.myGroup.invalid) {
      return;
    }
    const currentElem = this.icons.filter(value => value.id === id);
    currentElem[0].questions[i].question.push({
      actor: 'admin',
      q: this.myGroup.value.answer,
      date: new Date()
    });
    this.firebaseIcons.patch(id, {questions: currentElem[0].questions})
        .subscribe(() => {
          this.icons.map(el => {
            if (el.id === id) {
              el.questions = currentElem[0].questions;
            }
          });
          this.myGroup.reset();
          this.disabled = true;
        });
    this.dataSource = new MatTableDataSource(this.icons);
    }
}
