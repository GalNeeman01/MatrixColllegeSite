import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, RouterOutlet, MatProgressBarModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  private router = inject(Router);
  
  public isPageLoaded = false;

  public ngOnInit() : void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isPageLoaded = true;
    })
  }
}
