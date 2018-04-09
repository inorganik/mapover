import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../environments/environment';
import { MapLocation } from '../map-location';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShareModalComponent implements OnInit {

  mapstyleTemplate = 'maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels%7Cvisibility:off&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:geometry.fill%7Ccolor:0x00bceb&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:geometry.fill%7Ccolor:0x00bceb&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:geometry.fill%7Ccolor:0x00bceb&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e';

  mapDimension = 640;
  mapSize: string;

  constructor(
    public dialogRef: MatDialogRef<ShareModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mapSize = this.mapDimension + 'x' + this.mapDimension;
  }

  ngOnInit() {
    // console.log('dialogRef', this.dialogRef);

    const MapLocations = <MapLocation[]>this.data.MapLocations;
    const zoom = this.data.zoom;
    const map1Index = this.data.topIndex;
    const map2Index = (this.data.topIndex === 0) ? 1 : 0;
    const map1Color = this.data.colors[map1Index];
    const map2Color = this.data.colors[map2Index];
    const map1 = this.constructStaticImageUrl(MapLocations[map1Index], zoom, map1Color, this.mapSize);
    console.log('map1', map1);
    const image1 = <HTMLCanvasElement>this.appendImage(map1, 'map1Image');
    const map2 = this.constructStaticImageUrl(MapLocations[map2Index], zoom, map2Color, this.mapSize);
    console.log('map2', map2);
    const image2 = <HTMLCanvasElement>this.appendImage(map2, 'map2Image');

    image1.onload = (result) => {
      console.log('image 1 load result', result);
    };
    image2.onload = (result) => {
      console.log('image 2 load result', result);
      this.generateImage(image1, image2);
    };

    // const image1LoadedPromise = new Promise((resolve, reject) => {
    //   image1.onload = (result) => {
    //     console.log('image 1 load result', )
    //   }
    // }
    /*
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imageObj1 = new Image();
    var imageObj2 = new Image();
    imageObj1.src = "1.png"
    imageObj1.onload = function () {
      ctx.drawImage(imageObj1, 0, 0, 328, 526);
      imageObj2.src = "2.png";
      imageObj2.onload = function () {
        ctx.drawImage(imageObj2, 15, 85, 300, 300);
        var img = c.toDataURL("image/png");
        document.write('<img src="' + img + '" width="328" height="526"/>');
      }
    };
    */
  }

  constructStaticImageUrl(loc: MapLocation, zoom: number, hexColor: string, size: string): string {
    const root = 'https://maps.googleapis.com/maps/api/staticmap?';
    const color = '0x' + hexColor.substr(1, 6);
    const mapstyle = this.mapstyleTemplate.replace(/0x00bceb/g, color);
    const params = [
      'key=' + environment.googleApiKey,
      'center=' + loc.lat + ',' + loc.lng,
      'zoom=' + zoom,
      mapstyle,
      'size=' + size
    ];
    return root + params.join('&');
  }

  appendImage(src: string, id: string): HTMLElement {
    const existing = document.getElementById(id);
    if (existing) {
      existing.parentNode.removeChild(existing);
    }
    const image = new Image();
    image.src = src;
    image.id = id;
    image.crossOrigin = 'anonymous';
    image.style.position = 'absolute';
    image.style.left = (0 - this.mapDimension) + 'px';
    document.body.appendChild(image);
    return image;
  }

  generateImage(img1, img2) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', this.mapDimension + 'px');
    canvas.setAttribute('height', this.mapDimension + 'px');
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.5;
    ctx.drawImage(img1, 0, 0, this.mapDimension, this.mapDimension);
    ctx.drawImage(img2, 0, 0, this.mapDimension, this.mapDimension);
    const canvasImageUrl = canvas.toDataURL('image/png');
    const shareImage = new Image();
    shareImage.src = canvasImageUrl;
    shareImage.width = this.mapDimension;
    shareImage.height = this.mapDimension;
    document.getElementById('share-img-contain').appendChild(shareImage);
  }

}
