import { db } from '../config/firebaseConfig'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import type { CategoryProps } from '../types/CategoryProps'

const categoryCollectionRef = collection(db, 'categories')

export const fetchCategories = async (): Promise<CategoryProps[]> => {
  const snapshot = await getDocs(categoryCollectionRef)
  const categories: CategoryProps[] = []

  for (const doc of snapshot.docs) {
    categories.push({ id: doc.id, ...doc.data() } as CategoryProps)
  }
  return categories
}

export const createCategory = async (category: Omit<CategoryProps, 'id'>) => {
  const docRef = await addDoc(categoryCollectionRef, category)
  return { id: docRef.id, ...category }
}
