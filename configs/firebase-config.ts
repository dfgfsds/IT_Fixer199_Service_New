import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import axiosInstance from "./axios-middleware";
import Api from "@/api-endpoints/ApiUrls";

const firebaseConfig = {
  apiKey: "AIzaSyDqw_25E5LWFMgQKbu0tQSZteeWqgEeqjQ",
  authDomain: "it-fixer-flutter-mobile.firebaseapp.com",
  projectId: "it-fixer-flutter-mobile",
  storageBucket: "it-fixer-flutter-mobile.firebasestorage.app",
  messagingSenderId: "241815715034",
  appId: "1:241815715034:web:593b02f14a16354e1a39e3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging) return;

  try {
    // 1. Check/Request Notification Permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('⚠️ Notification permission was not granted. Current state:', permission);
      return;
    }

    const { getToken } = await import('firebase/messaging');
    const currentToken = await getToken(messaging, {
      vapidKey: 'BOtkHeLbJsy5wUDM8JYupKCRpoy4gdNAPXDs-oiXUyP4MfpJJAEUhe_eigvlNCYlc73xia3iLeN-m1QfaNi7TXA'
    });

    if (currentToken) {
      console.log('🎫 CURRENT FCM TOKEN:', currentToken);
      console.log('🔥 FCM TOKEN OBTAINED:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};
