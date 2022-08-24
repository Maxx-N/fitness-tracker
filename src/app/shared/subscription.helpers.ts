import { Subscription } from 'rxjs';

export const unsubscribeIfExist = (...subscriptions: Subscription[]) => {
  for (const sub of subscriptions) {
    if (!!sub) {
      sub.unsubscribe();
    }
  }
};
