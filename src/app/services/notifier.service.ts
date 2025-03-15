import { Injectable } from '@angular/core';
import { interval, Subject, Subscription, take } from 'rxjs';

export type NotificationEntry = {
	message: string;
	type: 'error' | 'success';
};

@Injectable({
	providedIn: 'root',
})
export class NotifierService {
	private readonly notification = new Subject<NotificationEntry | undefined>();
	notification$ = this.notification.asObservable();
	private timerSub: Subscription | undefined = undefined;

	notify(entry: NotificationEntry) {
		if (!entry) {
			return;
		}
		this.timerSub?.unsubscribe();
		this.notification.next(entry);

		this.timerSub = interval(7000)
			.pipe(take(1))
			.subscribe(() => this.notification.next(undefined));
	}
}
