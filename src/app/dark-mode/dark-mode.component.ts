import { Component, inject, OnInit, signal } from '@angular/core';
import { ElectronService } from '../services/electron.service';

@Component({
	selector: 'app-darkmode',
	imports: [],
	templateUrl: './dark-mode.component.html',
})
export class DarkModeComponent implements OnInit {
	darkMode = signal<boolean>(false);
	readonly electronService = inject(ElectronService);

	ngOnInit(): void {
		this.electronService.darkMode().then((darkModeEnabled) => {
			this.darkMode.set(darkModeEnabled);
		});
	}

	toggleDarkMode($event: Event) {
		$event.preventDefault();

		this.electronService.setDarkMode(!this.darkMode());
		this.darkMode.set(!this.darkMode());
	}
}
