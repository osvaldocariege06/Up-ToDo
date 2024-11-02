import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC5fgu9bDw8LxcXGmY0HxR6mGi-b_wicy0',
  authDomain: 'uptodo-7fd15.firebaseapp.com',
  projectId: 'uptodo-7fd15',
  storageBucket: 'uptodo-7fd15.firebasestorage.app',
  messagingSenderId: '311540569217',
  appId: '1:311540569217:web:1314fa8c1ec3a87bc6e980',
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Configura a persistência
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

export { auth, db, app }
