import AsyncStorage from '@react-native-async-storage/async-storage'
import { app } from '../config/firebaseConfig'
// import auth from '@react-native-firebase/auth'
// import firestore from '@react-native-firebase/firestore'

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
import { useAuth, useUser } from '@clerk/clerk-expo'

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

// export const loginWithGoogle = async () => {
//   try {
//     const { getToken } = useAuth()
//     const { user } = useUser() // Use `useUser` para acessar as informações do usuário autenticado
//     const token = await getToken()

//     if (!user) {
//       throw new Error('Usuário não autenticado no Clerk.')
//     }

//     // Usar o token para autenticar no Firebase
//     const firebaseCredential = auth.GoogleAuthProvider.credential(token)
//     const firebaseUserCredential =
//       await auth().signInWithCredential(firebaseCredential)

//     // Armazenar as informações do usuário no Firestore (opcional)
//     await firestore()
//       .collection('users')
//       .doc(user.id)
//       .set({
//         name: user.fullName || 'Nome não disponível',
//         email: user.emailAddresses[0]?.emailAddress || 'Email não disponível',
//         createdAt: new Date(),
//       })

//     return {
//       success: true,
//       user: firebaseUserCredential.user,
//     }
//   } catch (error) {
//     console.error('Erro ao fazer login com Google:', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Erro desconhecido',
//     }
//   }
// }

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

    // Reautenticar o usuário
    const credential = EmailAuthProvider.credential(user.email, oldPassword)
    await reauthenticateWithCredential(user, credential)

    // Atualizar a senha
    await updatePassword(user, newPassword)
    console.log('Password update successful')
  } catch (error) {
    console.error('Failed to update password')
    throw new Error(String(error))
  }
}
