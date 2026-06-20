import { Observable } from 'rxjs';

import { Auth, User, onAuthStateChanged } from 'firebase/auth';

export function authUser(auth: Auth): Observable<User | null> {
  return new Observable<User | null>((subscriber) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => subscriber.next(currentUser),
      (error) => subscriber.error(error),
    );
    return () => unsubscribe();
  });
}
