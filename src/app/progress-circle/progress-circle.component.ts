import { Component, computed, input } from '@angular/core';

@Component({
	selector: 'app-progress-circle',
	imports: [],
	templateUrl: './progress-circle.component.html',
	styleUrl: './progress-circle.component.css'
})
export class ProgressCircleComponent {
	readonly expiresIn = input.required<number>();
	readonly xPos = computed(() => this.expiresIn() < 10 ? '30px' : '24px');
	readonly progress = computed(() => Math.floor(this.expiresIn() / 30 * 157));
	readonly color = computed(() => this.expiresIn() < 10 ? '#e67070' : '#3bc7e3');
}
