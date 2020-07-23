import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {WorkWithFirebaseIconsService} from '../shared/work-with-firebase-icons.service';
import {Icon} from '../shared/interfaces';
import {FilterNavBarService} from '../shared/filter-nav-bar.service';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {Observable, of} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatSidenav} from '@angular/material/sidenav';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  reason = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 1000;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  obs: Observable<any>;
  dataSource: MatTableDataSource<Icon>;
  filter = [];
  icons: Icon[];
  buferIcons: Icon[];
  tabs = [];
  activeTabs = 'all';
  selectAll = null;
  selectedCash = [];
  selectOpt = new FormControl();
  select = 'title';
  opened: boolean;
  side = 'side';

  constructor(
    private firebaseIconService: WorkWithFirebaseIconsService,
    private filterLeftBar: FilterNavBarService,
    private changeDetectorRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver) {

  }

// ФИЛЬТР ПО ПОИСКУ
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.buferIcons = this.icons.filter(icon => icon.title.toLowerCase().includes(filterValue.trim().toLowerCase()));
    this.pagination(this.buferIcons);
  }

  ngOnInit() {
    this.firebaseIconService.getAll().subscribe((icons) => {
      this.icons = icons;
      this.buferIcons = [...icons];
      this.pagination(this.buferIcons);
    });
    this.breakpointObserver.observe(['(max-width: 1024px)']).subscribe(value => {
       if (value.matches) {
         this.opened = false;
       } else {
         this.opened = true;
       }
     });
  }
  // PAGINATOR
  pagination(data) {
      this.changeDetectorRef.detectChanges();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
  }
// ФИЛЬТР LEFT NAVBAR

  getSelectedFilter(selected: any) {
    this.filter = this.tabs;
    this.selectedCash = selected;
    this.filter = this.filterLeftBar.filter(this.filter, selected);
    this.buferIcons = this.filter;
    this.selectAll = this.buferIcons.length;
    this.pagination(this.buferIcons);
  }

  logChange(index) {
    // ПОЛУЧАЕМ ТЕКУЩИЙ ТАБ
    const tabsName = ['all', 'para', 'mater', 'imena', 'spas'];
    this.activeTabs = tabsName[index];
    if (this.activeTabs !== 'all') {
      this.tabs = this.icons.filter(icon => icon.categories === this.activeTabs);
    } else {
      this.tabs = this.icons;
    }
    // ПРИМЕНЯЕМ ФИЛЬТР ПО ТАБАМ ЕСЛИ ОН ИМЕЕТСЯ
    this.buferIcons = this.tabs;
    if (this.filter.length) {
      const arr = [];
      for (const icon of this.tabs) {
        this.filter.forEach(el => {
          if (el.id === icon.id) {
            arr.push(el);
          }
        });
      }
      this.buferIcons = arr;
    }
    this.getSelectedFilter(this.selectedCash);
    this.pagination(this.buferIcons);
  }
  // СОРТИРОВКА ПО ИМЕНИ / ЦЕНЕ / НАЛИЧИЮ
  selectSort() {
    if (this.buferIcons.length <= 1) {
      return this.buferIcons;
    } // array with only one item
    if (this.selectOpt.value === 'title') {
      this.buferIcons.sort((a, b) => {
        const titleA = a.title.toLowerCase().split(' ').filter(v => v !== 'пара' && v !== 'икона').join('');
        const titleB = b.title.toLowerCase().split(' ').filter(v => v !== 'пара' && v !== 'икона').join('');
        if (titleA > titleB) {
          return 1;
        }
        if (titleA < titleB) {
          return -1;
        }
        return 0;
      });
    }
    if (this.selectOpt.value === 'priceUp') {
      this.buferIcons.sort((a, b) => +a.price - +b.price);
    }
    if (this.selectOpt.value === 'priceDown') {
      this.buferIcons.sort((a, b) => +a.price - +b.price).reverse();
    }
    if (this.selectOpt.value === 'available') {
      this.buferIcons.sort((a, b) => +a.available - +b.available).reverse();
    }
    this.pagination(this.buferIcons);
  }

   // SIDENAV TOGGLE
  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
    this.side = 'side';
  }

  open() {
    this.sidenav.open();
    this.side = 'over';
  }
}
