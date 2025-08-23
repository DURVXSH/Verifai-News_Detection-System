// Import Firebase Authentication functions and types for user management
import { 
  createUserWithEmailAndPassword, // Function to create a new user with email and password
  signInWithEmailAndPassword, // Function to sign in a user with email and password
  signInWithPopup, // Function to sign in a user with a popup (e.g., Google sign-in)
  GoogleAuthProvider, // Provider for Google authentication
  signOut as firebaseSignOut, // Function to sign out the current user
  onAuthStateChanged, // Listener for authentication state changes
  User, // Type for Firebase user object
  updateProfile // Function to update user profile information (e.g., display name)
} from 'firebase/auth';
import { auth } from './firebase'; // Import the Firebase auth instance configured in firebase.js

// Sign-up function: Creates a new user with email, password, and username
export const signUp = async (email: string, password: string, username: string) => {
  try {
    // Create a new user with the provided email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's profile with the provided username as displayName
    await updateProfile(userCredential.user, {
      displayName: username
    });
    // Return the newly created user object
    return userCredential.user;
  } catch (error: any) {
    // Handle errors by throwing a new Error with the Firebase error message
    throw new Error(error.message);
  }
};

// Sign-in function: Authenticates a user with email and password
export const signIn = async (email: string, password: string) => {
  try {
    // Sign in the user with the provided email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Return the signed-in user object
    return userCredential.user;
  } catch (error: any) {
    // Handle errors by throwing a new Error with the Firebase error message
    throw new Error(error.message);
  }
};

// Google Sign-in function: Authenticates a user using Google OAuth
export const signInWithGoogle = async () => {
  try {
    // Initialize Google Auth Provider
    const provider = new GoogleAuthProvider();
    // Sign in the user with a Google popup
    const userCredential = await signInWithPopup(auth, provider);
    // Return the signed-in user object
    return userCredential.user;
  } catch (error: any) {
    // Handle errors by throwing a new Error with the Firebase error message
    throw new Error(error.message);
  }
};

// Sign-out function: Logs out the current user
export const signOut = async () => {
  try {
    // Sign out the user using Firebase auth
    await firebaseSignOut(auth);
  } catch (error: any) {
    // Handle errors by throwing a new Error with the Firebase error message
    throw new Error(error.message);
  }
};

// Auth state listener: Monitors changes in authentication state
export const onAuthChange = (callback: (user: User | null) => void) => {
  // Set up a listener for authentication state changes, calling the provided callback
  // with the current user (or null if not authenticated)
  return onAuthStateChanged(auth, callback);
};