// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'estbm-frontend';
// }

import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { NotificationComponent } from "../app/shared/components/notification/notification.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  template: `
    <router-outlet></router-outlet>
    <app-notification></app-notification>
  `,
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "EST Béni Mellal - Gestion des Stages"
}
