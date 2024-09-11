import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  //selectedRating: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  // onRateClick(value: number) {
  //   this.selectedRating = value;
  // }

  // getBackgroundColor(value: number) {
  //   const maxGreen = 100; // Maximum value for green component (brightest green)
  //   const minGreen = 250; // Minimum value for green component (darkest green)
  //   const shadeFactor = (value - 1) / 9; // Calculate shade factor based on rating (1-10)
  //   const greenValue = Math.round(minGreen + (maxGreen - minGreen) * shadeFactor); // Calculate green component
  //   return `rgb(0, ${greenValue}, 0)`; // RGB value with varying shades of green
  // }
  
  // getNumberColor(value: number) {
  //   const shadeFactor = 1 - (value - 1) / 9; // Inverted shade factor (1 is darkest, 10 is lightest)
  //   const lightness = Math.floor(255 - (shadeFactor * 255));
  //   return `rgb(${lightness}, ${lightness}, ${lightness})`;
  // }

  // getContrastColor(value: number) {
  //   const shadeFactor = (value - 1) / 9;
  //   const isLightBackground = shadeFactor < 0.5;
  //   const contrastColor = isLightBackground ? '#000' : '#fff';
  //   return contrastColor;
  // }

  // isActive(value: number): boolean {
  //   return this.selectedRating === value;
  // }
}
