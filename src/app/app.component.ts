import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { NotifierComponent } from './notifier/notifier.component';

@Component({
	selector: 'app-root',
	imports: [HomeComponent, NotifierComponent],
	templateUrl: './app.component.html',
})
export class AppComponent {
	title = 'totp';
}
