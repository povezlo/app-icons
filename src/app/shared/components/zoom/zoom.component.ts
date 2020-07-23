import {Component, ElementRef, HostListener, Input, Renderer2, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss']
})
export class ZoomComponent {
  // tslint:disable-next-line:no-input-rename
  @Input('img') imagen: string;
  @Input() zoom = 2;
  @Input() lenSize = 40;
  @Input() imgWidth;
  @Input() imgHeigth;
  @Input() divZoomed: ElementRef;

  posX = 0;
  posY = 0;
  cx = 1;
  cy = 1;
  yet = false;
  factorX: number;
  factorY: number;


  private mouseMovement = new Subject();

  @ViewChild('img', {static: false, read: ElementRef}) img;
  @ViewChild('len', {static: false, read: ElementRef}) lens;
  @HostListener('mousemove', ['$event'])
  mouseMove(event: any)
  {
    const result = this.moveLens(event);
    this.render.setStyle(this.divZoomed, 'background-position', result);
  }

  constructor(private render: Renderer2){}
  onLoad()
  {
    this.render.setStyle(this.divZoomed, 'background-image', 'url(\'' + this.imagen + '\')');
    // tslint:disable-next-line:max-line-length
    this.render.setStyle(this.divZoomed, 'background-size', (this.img.nativeElement.width * this.zoom) + 'px ' + (this.img.nativeElement.height * this.zoom) + 'px');
    this.render.setStyle(this.divZoomed, 'background-repeat', 'no-repeat');
    this.render.setStyle(this.divZoomed, 'transition', 'background-position .2s ease-out');
    this.factorX = this.img.nativeElement.width;
    this.factorY = this.img.nativeElement.height;

    this.yet = true;
    setTimeout(() => {
      this.factorX = this.imgWidth || this.imgHeigth ? this.factorX / this.img.nativeElement.width : 1;
      this.factorY = this.imgWidth || this.imgHeigth ? this.factorY / this.img.nativeElement.height : 1;
      const dim = (this.divZoomed as any).getBoundingClientRect();
      // tslint:disable-next-line:max-line-length
      this.cx = (dim.width - this.img.nativeElement.width * this.zoom * this.factorX) / (this.img.nativeElement.width - this.lens.nativeElement.offsetWidth);
      this.cy = (dim.height - this.img.nativeElement.height * this.zoom * this.factorY) / (this.img.nativeElement.height -
        this.lens.nativeElement.offsetHeight);
    });
  }
  moveLens(e: any)
  {
    let pos;
    let x;
    let y;
    /*prevent any other actions that may occur when moving over the image:*/
    e.preventDefault();
    /*get the cursor's x and y positions:*/
    pos = this.getCursorPos(e);
    /*calculate the position of the lens:*/
    x = pos.x - (this.lens.nativeElement.offsetWidth / 2);
    y = pos.y - (this.lens.nativeElement.offsetHeight / 2);
    /*prevent the lens from being positioned outside the image:*/
    // tslint:disable-next-line:max-line-length
    if (x > this.img.nativeElement.width - this.lens.nativeElement.offsetWidth) {x = this.img.nativeElement.width - this.lens.nativeElement.offsetWidth; }
    if (x < 0) {x = 0; }
    // tslint:disable-next-line:max-line-length
    if (y > this.img.nativeElement.height - this.lens.nativeElement.offsetHeight) {y = this.img.nativeElement.height - this.lens.nativeElement.offsetHeight; }
    if (y < 0) {y = 0; }
    /*set the position of the lens:*/
    this.posX = x;
    this.posY = y;
    /*display what the lens "sees":*/
    const result = (x * this.cx) + 'px ' + (y * this.cy) + 'px';
    return result;
  }
  getCursorPos(e) {
    // tslint:disable-next-line:one-variable-per-declaration
    let a, x = 0, y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = this.img.nativeElement.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x, y};
  }
}
