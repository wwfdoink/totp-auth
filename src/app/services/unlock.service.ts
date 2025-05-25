import { inject, Injectable, signal } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable({
	providedIn: 'root',
})
export class UnlockService {
	readonly electronService = inject(ElectronService);
	readonly isUnlocked = signal(false);

	async unlock(password: string) {
		if (password.length < 1) {
			return false;
		}

		const isUnlocked = await this.electronService.unlock(password);
		this.isUnlocked.set(isUnlocked);
		return isUnlocked;
	}
}
