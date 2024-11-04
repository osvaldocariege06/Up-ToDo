import { db } from '../config/firebaseConfig'
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import type { TaskProps } from '../types/TaskProps'

const taskCollectionRef = collection(db, 'tasks')

export const fetchTasks = async (): Promise<TaskProps[]> => {
  const snapshot = await getDocs(taskCollectionRef)
  const tasks: TaskProps[] = []

  for (const doc of snapshot.docs) {
    tasks.push({ id: doc.id, ...doc.data() } as TaskProps)
  }
  return tasks
}

export const fetchTasksByUserEmail = async (
  userEmail: string
): Promise<TaskProps[]> => {
  try {
    const q = query(taskCollectionRef, where('userEmail', '==', userEmail))
    const querySnapshot = await getDocs(q)

    const tasks: TaskProps[] = []
    for (const doc of querySnapshot.docs) {
      tasks.push({ id: doc.id, ...doc.data() } as TaskProps)
    }

    return tasks
  } catch (error) {
    console.error('Failed to fetch tasks by user email:', error)
    throw error
  }
}

export const createTask = async (task: TaskProps) => {
  const taskWithStatus = { ...task, completed: false }
  const taskCollection = collection(db, 'tasks')
  await addDoc(taskCollection, taskWithStatus)
}

export const updateTask = async (
  taskId: string,
  taskData: Partial<TaskProps>
) => {
  const taskDoc = doc(taskCollectionRef, taskId)
  await updateDoc(taskDoc, taskData)
}

export const updateTaskTitleAndDescription = async (
  taskId: string,
  title?: string,
  description?: string
) => {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    await updateDoc(taskRef, { title, description })
  } catch (error) {
    console.error('Erro ao atualizar a tarefa:', error)
    throw error
  }
}

export const deleteTask = async (taskId: string) => {
  const taskDoc = doc(taskCollectionRef, taskId)
  await deleteDoc(taskDoc)
}

export const updateTaskStatus = async (taskId: string, completed: boolean) => {
  const taskRef = doc(db, 'tasks', taskId)
  try {
    await updateDoc(taskRef, { completed })
  } catch (error) {
    console.error('Erro ao atualizar o status da tarefa:', error)
  }
}

export const updateTaskTime = async (taskId: string, newTime: string) => {
  const taskRef = doc(db, 'tasks', taskId)
  try {
    await updateDoc(taskRef, { time: newTime })
  } catch (error) {
    console.error('Erro ao atualizar horário da tarefa:', error)
    throw error
  }
}

export const filterTasksByDateRange = async (
  startDate: string | undefined,
  endDate: string | undefined
): Promise<TaskProps[]> => {
  try {
    const taskCollectionRef = collection(db, 'tasks')
    const q = query(
      taskCollectionRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    )
    const querySnapshot = await getDocs(q)

    const tasks: TaskProps[] = []
    for (const doc of querySnapshot.docs) {
      tasks.push({ id: doc.id, ...doc.data() } as TaskProps)
    }

    return tasks
  } catch (error) {
    console.error('Failed to find tasks:', error)
    throw error
  }
}

export const updateTaskPriority = async (
  taskId: string,
  newPriority: string
) => {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    await updateDoc(taskRef, { priority: newPriority })
  } catch (error) {
    console.error('Erro ao atualizar a prioridade da tarefa:', error)
    throw new Error('Erro ao atualizar a prioridade.')
  }
}
