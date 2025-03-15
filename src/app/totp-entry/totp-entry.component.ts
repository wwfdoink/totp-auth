import { Component, OnInit, computed, input, signal, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TOTP } from 'totp-generator';
import { interval, map } from 'rxjs';
import { TOTPEntry } from '../types';
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';
import { ElectronService } from '../services/electron.service';
import { NotifierService } from '../services/notifier.service';

@Component({
	selector: 'app-totp-entry',
	imports: [ProgressCircleComponent],
	templateUrl: './totp-entry.component.html',
})
export class TotpEntryComponent implements OnInit {
	readonly entry = input.required<TOTPEntry>();

	readonly electronService = inject(ElectronService);
	readonly notifierService = inject(NotifierService);

	readonly code = signal<string | null>(null);
	readonly formattedCode = computed(() => {
		const code = this.code();
		const regex = new RegExp(`.{1,${Math.floor(this.entry().digits / 2)}}`, 'g');
		return code ? code.match(regex)?.join(' ') : '';
	});
	readonly expires = signal<number>(0);
	readonly expiresIn = computed(() => {
		const expires = this.expires();
		return expires < 1 ? 0 : Math.floor((expires - this.dateNow()) / 1000);
	});
	private readonly dateNow = toSignal(interval(1000).pipe(map(() => Date.now())), { initialValue: Date.now() });

	constructor() {
		effect(() => {
			if (this.dateNow() >= this.expires()) {
				this.generateCode();
			}
		});
	}

	ngOnInit(): void {
		this.generateCode();
	}

	generateCode(): void {
		const data = TOTP.generate(this.entry().secret, {
			digits: this.entry().digits,
			period: this.entry().period,
			algorithm: this.entry().algorithm,
		});
		this.code.set(data.otp);
		this.expires.set(data.expires);
	}

	copyToClipboard($event: Event): void {
		$event.preventDefault();

		const copyCode = this.code();
		if (navigator.clipboard && copyCode) {
			navigator.clipboard.writeText(copyCode);
			this.notifierService.notify({
				type: 'success',
				message: 'Code copied to clipboard!',
			});
		}
	}

	async removeTotpEntry($event: Event) {
		$event.preventDefault();

		if (!confirm('Are you sure to delete?')) {
			return;
		}

		try {
			await this.electronService.removeTotpEntry(this.entry().id);
			this.notifierService.notify({
				type: 'success',
				message: 'TOTP entry deleted successfully!',
			});
		} catch (error) {
			this.notifierService.notify({
				type: 'error',
				message: 'Failed to delete TOTP entry!',
			});
		}
	}
}
