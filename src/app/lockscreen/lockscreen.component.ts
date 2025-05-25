import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UnlockService } from '../services/unlock.service';
import { NotifierService } from '../services/notifier.service';

@Component({
	selector: 'app-lockscreen',
	imports: [FormsModule],
	templateUrl: './lockscreen.component.html',
})
export class LockscreenComponent {
	private readonly unlockService = inject(UnlockService);
	private readonly notifierService = inject(NotifierService);

	readonly password = model<string>('');

	public unlock = async () => {
		const success = await this.unlockService.unlock(this.password());
		if (!success) {
			this.notifierService.notify({
				type: 'error',
				message: 'Invalid password provided!',
			});
			this.password.set('');
			return;
		}
	};
}
