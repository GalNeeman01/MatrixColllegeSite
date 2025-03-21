import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, RouterOutlet, MatProgressBarModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  // DI's
  private router = inject(Router);
  
  // Public
  public isPageLoaded = false;

  // Methods
  // State for displaying loading progress bar
  public ngOnInit() : void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isPageLoaded = true;
    })
  }
}
