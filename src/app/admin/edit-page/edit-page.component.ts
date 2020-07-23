import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {WorkWithFirebaseIconsService} from '../../shared/work-with-firebase-icons.service';
import {Icon} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {
  @Input() disabled: boolean;
  form: FormGroup;
  icons: Icon;

  constructor(
    private  firebaseIcons: WorkWithFirebaseIconsService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({files: new FormArray([])});
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.firebaseIcons.getById(params.id);
      })
    ).subscribe((res: Icon) => {
      this.icons = res;
      this.addNewFormControl(res.img);
      this.disabled = true;
    });
  }

  onSubmit() {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.firebaseIcons.patch(params.id, {img: this.icons.img});
      })
    ).subscribe((res: Icon) => {
      this.icons = res;
      this.form.reset();
      this.disabled = true;
    });
  }

  onSelectFile(event: Event, index?) {
    event.preventDefault();
    const reader = new FileReader();
    const files = (event.target as HTMLInputElement);
    if (files.files && files.value.length) {
      reader.readAsDataURL(files.files[0]);
      reader.onload = () => {
        this.icons.img[index] = reader.result;
        this.disabled = false;
      };
    }
  }

  remove(imgId: any) {
    this.icons.img.splice(imgId, 1);
    (this.form.controls.files as FormArray).removeAt(imgId);
    this.disabled = false;
  }

  onAddNewFoto(event: Event) {
    event.preventDefault();
    (this.form.controls.files as FormArray).push(new FormControl(''));
    this.onSelectFile(event, this.icons.img.length);
  }

  addNewFormControl(arr): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < arr.length; i++){
      (this.form.controls.files as FormArray).push(new FormControl(''));
    }
  }
}
