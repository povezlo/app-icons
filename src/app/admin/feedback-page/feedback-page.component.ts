import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {WorkWithFirebaseIconsService} from '../../shared/work-with-firebase-icons.service';
import {Icon} from '../../shared/interfaces';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.scss']
})
export class FeedbackPageComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line:no-output-native
  @Output() change: EventEmitter<MatSlideToggleChange>;
  displayedColumns: string[] = ['img', 'code', 'title', 'comments', 'date'];
  dataSource: MatTableDataSource<Icon>;
  icons: Icon[] = [];
  commentsLength = 0;

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 1000;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private firebaseIcons: WorkWithFirebaseIconsService) { }

  ngOnInit() {
    this.firebaseIcons.getAll().subscribe((icons) => {
      icons.forEach(v => {
        if (v.comments) {
          if (v.comments.length) {
            this.icons.push(v);
            this.commentsLength = this.commentsLength + v.comments.length;
          }
        }
      } );
      this.dataSource = new MatTableDataSource(this.icons);
      this.dataSource.paginator = this.paginator;
    });
    console.log(this.icons);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // COMMENTS

  remove(id: string, index: any) {
    const delComment = this.icons.filter(value => value.id === id);
    delComment[0].comments.splice(index, 1);
    console.log(delComment, index, id);
    this.firebaseIcons.patch(id, {comments: delComment[0].comments})
      .subscribe(() => {
        this.icons.map(el => {
          if (el.id === id) {
            el.comments = delComment[0].comments;
          }
        });
      });
    this.dataSource = new MatTableDataSource(this.icons);
  }

  readly(id: any, i: number) {
    const read = this.icons.filter(value => value.id === id);
    if (read[0].comments[i].read === true) {
      read[0].comments.map(val => val.read = false);
      console.log(read[0].comments);
      this.firebaseIcons.patch(id, {comments: read[0].comments})
        .subscribe(() => {
          this.icons.map(el => {
            if (el.id === id) {
              el.comments = read[0].comments;
            }
          });
        });
      this.dataSource = new MatTableDataSource(this.icons);
    }

  }
}
