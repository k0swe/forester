import { Component, OnInit } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent implements OnInit {
  theme: Theme = (localStorage.getItem('theme') as Theme) || 'system';

  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  applyTheme() {
    const html = document.documentElement;
    if (this.theme === 'system') {
      html.removeAttribute('data-theme');
      html.style.colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
    } else {
      html.setAttribute('data-theme', this.theme);
      html.style.colorScheme = this.theme;
    }
  }

  ngOnInit() {
    this.applyTheme();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.theme === 'system') this.applyTheme();
      });
  }
}
