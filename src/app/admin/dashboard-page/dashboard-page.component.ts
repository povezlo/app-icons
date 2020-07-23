import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {WorkWithFirebaseIconsService} from '../../shared/work-with-firebase-icons.service';
import {Icon} from '../../shared/interfaces';
import {MatTableDataSource} from '@angular/material/table';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line:no-output-native
  @Output() change: EventEmitter<MatSlideToggleChange>;
  displayedColumns: string[] = ['img', 'code', 'title', 'price', 'available', 'edit'];
  icons: Icon[];
  dataSource: MatTableDataSource<Icon>;

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 1000;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private firebaseIcons: WorkWithFirebaseIconsService ) {}

  ngOnInit() {
    this.firebaseIcons.getAll().subscribe((icons) => {
      this.icons = icons;
      this.dataSource = new MatTableDataSource(this.icons);
      this.dataSource.paginator = this.paginator;
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  remove(id: string) {
    this.firebaseIcons.remove(id).subscribe(() => {
      this.icons = this.icons.filter(el => el.id !== id);
      this.dataSource = new MatTableDataSource(this.icons);
    });
  }

  onChange(ob: MatSlideToggleChange) {
    this.firebaseIcons.patch(ob.source.name, {available: ob.checked})
      .subscribe(() => {
        this.icons.forEach(el => {
          if (el.id === ob.source.name) {
            el.available = ob.checked;
          }
        });
      });
  }

  priceChange(event) {
    const priceInteger = event.target.value.split('.')[0].split(',').join('');
    this.firebaseIcons.patch(event.target.name, {price: priceInteger})
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.icons.forEach(el => {
          if (el.id === event.target.name) {
            el.price = priceInteger;
          }
        });
      });
  }

  titleChange(event) {
    this.firebaseIcons.patch(event.target.name, {title: event.target.value})
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.icons.forEach(el => {
          if (el.id === event.target.name) {
            el.title = event.target.value;
          }
        });
      });
  }
}
