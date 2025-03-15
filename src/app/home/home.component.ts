import { Component, signal, OnInit, model, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TOTPEntry } from '../types';
import { TotpEntryComponent } from '../totp-entry/totp-entry.component';
import { ElectronService } from '../services/electron.service';
import { DarkModeComponent } from '../dark-mode/dark-mode.component';
import { NotifierService } from '../services/notifier.service';

@Component({
	selector: 'app-home',
	imports: [FormsModule, TotpEntryComponent, DarkModeComponent],
	templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
	private readonly totpList = signal<TOTPEntry[]>([]);

	readonly electronService = inject(ElectronService);
	readonly notifierService = inject(NotifierService);

	readonly totpListFiltered = computed(() =>
		this.totpList().filter((entry) => {
			const text = this.searchText().toLowerCase();
			return entry.username.toLowerCase().includes(text) || entry.issuer.toLowerCase().includes(text);
		}),
	);
	readonly searchText = model<string>('');
	readonly onDbChange = toSignal(this.electronService.onDbChange);

	constructor() {
		effect(() => {
			if (this.onDbChange()) {
				this.getTotpList();
			}
		});
	}

	ngOnInit() {
		this.getTotpList();
	}

	public getTotpList = async () => {
		const totpList = await this.electronService.totpList();
		this.totpList.set(totpList);
	};

	public scanQrCode = async () => {
		const success = await this.electronService.scan();
		if (!success) {
			this.notifierService.notify({
				type: 'error',
				message: 'Failed to find a valid QR code on your clipboard!',
			});
			return;
		}
		this.getTotpList();
		this.notifierService.notify({
			type: 'success',
			message: 'TOTP entry added seccessfully!',
		});
	};
}
