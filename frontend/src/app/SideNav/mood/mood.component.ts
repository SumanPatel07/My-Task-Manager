import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mood',
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.scss']
})
export class MoodComponent implements OnInit {
  today: Date = new Date();
  currentYear: number = this.today.getFullYear();
  currentMonth: number = this.today.getMonth();
  currentDate: number = this.today.getDate();
  currentDay: string = this.today.toLocaleDateString('en-US', { weekday: 'long' });
  weeks: any[] = [];
  months: string[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  selectedRating: number = 5; // Set default rating to 5 for initial load
  selectedDate: any = null;
  dateRatings: { [key: string]: number } = {}; // To store ratings for each date

  constructor() { }

  ngOnInit(): void {
    this.renderCalendar(this.currentMonth, this.currentYear);
  }

  renderCalendar(month: number, year: number): void {
    const currentDate = new Date(year, month, 1);
    const firstDay = currentDate.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInLastMonth = new Date(year, month, 0).getDate();

    let calendarDays = [];
    for (let i = firstDay; i > 0; i--) {
      calendarDays.push({ day: daysInLastMonth - i + 1, currentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ day: i, currentMonth: true });
    }

    let extraDays = 42 - calendarDays.length;
    for (let i = 1; i <= extraDays; i++) {
      calendarDays.push({ day: i, currentMonth: false });
    }

    this.weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      this.weeks.push(calendarDays.slice(i, i + 7));
    }
  }

  changeMonth(increment: number): void {
    this.currentMonth += increment;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderCalendar(this.currentMonth, this.currentYear);
  }
  changeYear(increment: number): void {
    this.currentYear += increment;
    this.renderCalendar(this.currentMonth, this.currentYear);
  }
  onSelectDate(dayObj: any): void {
    if (dayObj.currentMonth) {
      this.selectedDate = { ...dayObj, month: this.currentMonth, year: this.currentYear };
    }
  }

  onRateClick(value: number): void {
    this.selectedRating = value;
    if (this.selectedDate) {
      const key = `${this.selectedDate.year}-${this.selectedDate.month}-${this.selectedDate.day}`;
      this.dateRatings[key] = value;
    }
  }

  getBackgroundColor(value: number): string {
    const maxGreen = 100; // Maximum value for green component (brightest green)
    const minGreen = 250; // Minimum value for green component (darkest green)
    const shadeFactor = (value - 1) / 9; // Calculate shade factor based on rating (1-10)
    const greenValue = Math.round(minGreen + (maxGreen - minGreen) * shadeFactor); // Calculate green component
    return `rgb(0, ${greenValue}, 0)`; // RGB value with varying shades of green
  }

  getNumberColor(value: number): string {
    const shadeFactor = 1 - (value - 1) / 9; // Inverted shade factor (1 is darkest, 10 is lightest)
    const lightness = Math.floor(255 - (shadeFactor * 255));
    return `rgb(${lightness}, ${lightness}, ${lightness})`;
  }

  getContrastColor(value: number): string {
    const shadeFactor = (value - 1) / 9;
    const isLightBackground = shadeFactor < 0.5;
    const contrastColor = isLightBackground ? '#000' : '#fff';
    return contrastColor;
  }

  isActive(value: number): boolean {
    return this.selectedRating === value;
  }
  
  getCurrentDateBackgroundColor(): string {
    return this.getBackgroundColor(this.selectedRating);
  }

  getDateBackgroundColor(dayObj: any): string {
    const key = `${this.currentYear}-${this.currentMonth}-${dayObj.day}`;
    const rating = this.dateRatings[key];
    return rating ? this.getBackgroundColor(rating) : '';
  }

  isSelectedDate(dayObj: any): boolean {
    return this.selectedDate &&
           this.selectedDate.day === dayObj.day &&
           this.selectedDate.month === this.currentMonth &&
           this.selectedDate.year === this.currentYear;
  }
}
