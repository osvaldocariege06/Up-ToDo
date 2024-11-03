import { create } from 'zustand'
import type { CategoryProps } from '../types/CategoryProps'
import { createCategory, fetchCategories } from '../services/categoryServices'
import { router } from 'expo-router'

interface CategoryState {
  categories: CategoryProps[]
  loading: boolean
  loadCategories: () => Promise<void>
  addCategory: (category: Omit<CategoryProps, 'id'>) => Promise<void>
}

export const useCategoryStore = create<CategoryState>(set => ({
  categories: [],
  loading: false,

  loadCategories: async () => {
    set({ loading: true })
    try {
      const categories = await fetchCategories()
      set({ categories })
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    } finally {
      set({ loading: false })
    }
  },

  addCategory: async category => {
    set({ loading: true })
    try {
      const newCategory = await createCategory(category)
      console.log('Add Category zus', newCategory)
      set(state => ({
        categories: [...state.categories, newCategory],
      }))
      router.push('/(pages)/(tabs)/')
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error)
    } finally {
      set({ loading: false })
    }
  },
}))
