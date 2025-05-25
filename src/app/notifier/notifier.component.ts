import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotifierService } from '../services/notifier.service';

@Component({
	selector: 'app-notifier',
	imports: [FormsModule, CommonModule],
	templateUrl: './notifier.component.html',
})
export class NotifierComponent {
	readonly notifierService = inject(NotifierService);
	readonly notification = toSignal(this.notifierService.notification$);

	readonly typeClass = computed(() => ({
		'bg-emerald-600': this.notification()?.type === 'success',
		'bg-red-900': this.notification()?.type === 'error',
	}));
}
