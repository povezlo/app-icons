import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Icon} from '../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {WorkWithFirebaseIconsService} from '../shared/work-with-firebase-icons.service';
import {switchMap, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {trigger, transition, useAnimation} from '@angular/animations';
import {fadeIn} from './carousel.animation';
import {OpenDialogService} from '../shared/open-dialog.service';
import {LocalStorageService} from '../shared/local-storage.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './icon-page.component.html',
  styleUrls: ['./icon-page.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [useAnimation(fadeIn, {params: { time: '1300ms' }})])
    ])
  ]
})
export class IconPageComponent implements OnInit {
  myGroup: FormGroup;
  formComments: FormGroup;
  formQuestions: FormGroup;
  @ViewChild('idSliderImg') private idSliderImg: ElementRef<HTMLElement>;
  i = 0;
  icon$: Observable<Icon>;
  commit: Icon;
  questionsTab: Icon;
  commentsLenth = 0;
  questionsLenth = 0;
  iconLength = 0;
  column: number;
  row: number;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private iconService: WorkWithFirebaseIconsService,
    private breakpointObserver: BreakpointObserver,
    private  dialog: OpenDialogService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.icon$ = this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.iconService.getById(params.id);
        }),
        tap(res => {
          this.commit = res;
          this.iconLength = res.img.length;
          this.questionsTab = res;
          if (this.commit.comments) {
            this.commentsLenth = this.commit.comments.length;
          }
          if (this.commit.questions) {
            this.questionsLenth = this.commit.questions.length;
          }
          this.getBreakPoint();
        })
        );
    this.formComments = new FormGroup({
      name: new FormControl('', [Validators.required]),
      comments: new FormControl('', [Validators.required]),
    });
    this.formQuestions = new FormGroup({
      name: new FormControl('', [Validators.required]),
      question: new FormControl('', [Validators.required]),
      email: new FormControl (null, [Validators.email]),
    });
    this.myGroup = new FormGroup({
      answer: new FormControl('', [Validators.required])
    });
  }
  // BREAKPOINT
  getBreakPoint() {
    this.breakpointObserver.observe(['(max-width: 475px)', '(max-width: 1024px)']).subscribe(value => {
      if (value.matches) {
        if (value.breakpoints['(max-width: 475px)']) {
          this.column = 1;
          if (this.iconLength === 2) {
            this.row = 3 + this.iconLength;
          } else if (this.iconLength === 1) {
            this.row = 2 + this.iconLength;
          } else {
            this.row = 3 + this.iconLength;
          }
        } else {
          this.column = 1;
          if (this.iconLength === 2) {
            this.row = 4 + this.iconLength;
          } else if (this.iconLength === 1) {
            this.row = 2 + this.iconLength;
          } else {
            this.row = 5 + this.iconLength;
          }
        }
      } else {
        this.row = 5;
        this.column = 2;
      }
    });
  }

  // СЛАЙДЕР

  step(event, length, arrows?) {
    const carouselSlider = this.idSliderImg.nativeElement.querySelectorAll('.carousel-slider-img');
    carouselSlider.forEach(value => this.renderer.removeClass(value, 'select'));
    if (event.type === 'keyup') {
      if (event.key === 'ArrowRight') {
        this.stepRight(length);
      } else  {
        this.stepLeft(length);
      }
    } else if (event.type === 'click') {
      if (arrows === 'left') {
        this.stepLeft(length);
      } else if (arrows === 'right'){
        this.stepRight(length);
      } else {
        carouselSlider.forEach((value, key) => {
          if (value === event.target) {
            this.i = key;
          }
        });
        this.renderer.addClass(event.target, 'select');
        return;
      }
    }
    this.renderer.addClass(carouselSlider[this.i], 'select');
  }

  stepLeft(length) {
    if (this.i === 0) {
      this.i = length - 1;
    } else {
      this.i--;
    }
  }

  stepRight(length) {
    if (length - 1 === this.i) {
      this.i = 0;
    } else {
      this.i++;
    }
  }

  submit() {
    let newComments = [];
    if (this.formComments.invalid) {
      return;
    }
    if (!this.commit.comments) {
      newComments.push({
        comments: this.formComments.value.comments,
        name: this.formComments.value.name,
        date: new Date(),
        read: true
      });
    } else {
      newComments = [...this.commit.comments, {
        comments: this.formComments.value.comments,
        name: this.formComments.value.name,
        date: new Date(),
        read: true
      }];
    }
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.iconService.patch(params.id, {
          comments: newComments
        });
      })
    ).subscribe((res: Icon) => {
      this.commit = res;
      this.formComments.reset();
    });
  }

  ask() {
    let newQuestions = [];
    if (this.formQuestions.invalid) {
      return;
    }
    if (!this.questionsTab.questions) {
      newQuestions.push({
        question: [{
          actor: 'user',
          q: this.formQuestions.value.question
        }],
        name: this.formQuestions.value.name,
        email: this.formQuestions.value.email,
        date: new Date()
      });
    } else {
      newQuestions = [...this.questionsTab.questions, {
        question: [{
          actor: 'user',
          q: this.formQuestions.value.question
        }],
        name: this.formQuestions.value.name,
        email: this.formQuestions.value.email,
        date: new Date()
      }];
    }
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.iconService.patch(params.id, {
          questions: newQuestions
        });
      })
    ).subscribe((res: Icon) => {
      this.questionsTab = res;
      this.formQuestions.reset();
      this.questionsLenth++;
    });
  }

  toAnswer(i: number) {
    if (this.myGroup.invalid) {
      return;
    }
    this.questionsTab.questions[i].question.push({
      actor: 'user',
      q: this.myGroup.value.answer,
      date: new Date()
    });
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.iconService.patch(params.id, {
          questions: this.questionsTab.questions
        });
      })
    ).subscribe((res: Icon) => {
      this.questionsTab = res;
      this.myGroup.reset();
      this.questionsLenth++;
    });
  }

  openOrderForm(icon) {
    this.localStorageService.storeOnLocalStorage(icon);
    this.dialog.openOrderForm(icon);
  }

  //  LOCAL STORAGE
}
