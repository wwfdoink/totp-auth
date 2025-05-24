import { Component, inject } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { NotifierComponent } from './notifier/notifier.component';
import { UnlockService } from './services/unlock.service';
import { LockscreenComponent } from './lockscreen/lockscreen.component';

@Component({
	selector: 'app-root',
	imports: [HomeComponent, LockscreenComponent, NotifierComponent],
	templateUrl: './app.component.html',
})
export class AppComponent {
	title = 'totp';
	private readonly unlockService = inject(UnlockService);
	readonly isUnlocked = this.unlockService.isUnlocked.asReadonly();
}
