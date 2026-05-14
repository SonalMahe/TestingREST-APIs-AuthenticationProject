import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '../firebase/firebase.init.js';

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
export const getToken = async () => {
  const user = auth.currentUser;
  return user ? user.getIdToken() : null;
};
