import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Icon} from '../../shared/interfaces';
import {WorkWithFirebaseIconsService} from '../../shared/work-with-firebase-icons.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {
  form: FormGroup;
  icons: Icon[];
  images = [];
  codeIcons = [];
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(private AddToFirebaseIcons: WorkWithFirebaseIconsService) {}

  ngOnInit() {
    this.getCode();
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      height: new FormControl(null, [Validators.required]),
      width: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      code: new FormControl('', [Validators.required]),
      categories: new FormControl('', [Validators.required]),
      paints: new FormControl('масленные краски', [Validators.required]),
      pairs: new FormControl(!Validators.requiredTrue),
      available: new FormControl(!Validators.requiredTrue),
      file: new FormControl(null, [Validators.required]),
      file2: new FormControl(null),
      file3: new FormControl(null)
    });
  }

  onSelectFile(event: Event) {
    event.preventDefault();
    const reader = new FileReader();
    const files = (event.target as HTMLInputElement);
    if (files.files && files.value.length) {
      reader.readAsDataURL(files.files[0]);
      reader.onload = () => {
        this.images.push(reader.result);
      };
    }
  }
  getCode() {
    this.AddToFirebaseIcons.getAll()
      .pipe(
        map(icons => icons.map(icon => icon.code))).subscribe(icons => this.codeIcons = icons);
  }
  submit() {
    if (this.form.invalid) {
      return;
    }
    const icon: Icon = {
      code: this.form.value.code,
      title: this.form.value.title,
      height: this.form.value.height,
      width: this.form.value.width,
      img: this.images,
      price: this.form.value.price,
      categories: this.form.value.categories,
      paints: this.form.value.paints,
      pairs: this.form.value.pairs,
      available: this.form.value.available
    };
    this.AddToFirebaseIcons.create(icon).subscribe(() => {
      this.formDirective.resetForm();
      this.images = [];
      this.form.patchValue({paints: 'масленные краски'});
      this.getCode();
    });
  }

}
