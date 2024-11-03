import AsyncStorage from '@react-native-async-storage/async-storage'
import { app } from '../config/firebaseConfig'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
  deleteUser as deleteCurrentUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  type User,
  updateProfile,
} from 'firebase/auth'
import { collection, getDocs, getFirestore } from 'firebase/firestore'

export type signUpProps = {
  username: string
  email: string
  password: string
}

export type signInProps = {
  email: string
  password: string
}

export const fetchAuthenticatedUser = async (): Promise<User | null> => {
  try {
    const auth = getAuth(app)
    const user = auth.currentUser

    if (user) return user

    const userToken = await AsyncStorage.getItem('userToken')
    if (userToken) return user

    return null
  } catch (error) {
    console.error('Failed to fetch user authenticated', error)
    throw new Error(String(error))
  }
}

export const signUp = async (data: signUpProps) => {
  try {
    const auth = getAuth(app)
    const response = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    await updateProfile(response.user, {
      displayName: data.username,
    })

    await AsyncStorage.setItem('userToken', response.user.uid)

    return response.user
  } catch (error) {
    throw new Error(String(error))
  }
}

export const signIn = async (data: signInProps) => {
  try {
    const auth = getAuth(app)
    const response = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    await AsyncStorage.setItem('userToken', response.user.uid)

    return response
  } catch (error) {
    throw new Error(String(error))
  }
}

export const getImagesFromFirestore = async () => {
  const db = getFirestore(app)
  const imagesCollection = collection(db, 'images')
  const snapshot = await getDocs(imagesCollection)
  const images = snapshot.docs.map(doc => doc.data())

  return images
}

export const updateUser = async (user: User) => {
  try {
    const auth = getAuth(app)
    const response = await updateCurrentUser(auth, user)

    return response
  } catch (error) {
    throw new Error(String(error))
  }
}

export const deleteUser = async (user: User) => {
  try {
    const response = await deleteCurrentUser(user)

    return response
  } catch (error) {
    throw new Error(String(error))
  }
}

export const logout = async () => {
  const auth = getAuth(app)
  try {
    await signOut(auth)

    await AsyncStorage.removeItem('userToken')
  } catch (error) {
    throw new Error(String(error))
  }
}

export const updateUserName = async (newName: string) => {
  try {
    const auth = getAuth()
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: newName,
      })
    } else {
      throw new Error('User not authenticated')
    }
  } catch (error) {
    console.error('Failed to update username:', error)
    throw error
  }
}

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user || !user.email) {
      throw new Error('User not authenticated')
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword)
    await reauthenticateWithCredential(user, credential)

    await updatePassword(user, newPassword)
    console.log('Password update successful')
  } catch (error) {
    console.error('Failed to update password')
    throw new Error(String(error))
  }
}
