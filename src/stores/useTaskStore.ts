import { create } from 'zustand'
import type { TaskProps } from '../types/TaskProps'
import {
  fetchTasks,
  updateTask,
  createTask,
  deleteTask,
  updateTaskStatus,
  updateTaskTitleAndDescription,
  updateTaskTime,
  updateTaskPriority,
} from '../services/taskServices'

interface TaskState {
  tasks: TaskProps[]
  filteredTasks: TaskProps[]
  loading: boolean
  loadTasks: () => Promise<void>
  addTask: (task: Omit<TaskProps, 'id'>) => Promise<void>
  editTask: (taskId: string, taskData: Partial<TaskProps>) => Promise<void>
  updateTaskTitleAndDescription: (
    taskId: string,
    title: string,
    description: string
  ) => Promise<void>
  editTaskTime: (taskId: string, newTime: string) => Promise<void>
  editTaskPriority: (taskId: string, newPriority: string) => Promise<void>
  removeTask: (taskId: string) => Promise<void>
  filterTasksByTitleAndCompleted: (
    title: string,
    showCompleted?: boolean
  ) => void
  confirmTask: (id: string) => Promise<void>
  cancelTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  loading: false,

  loadTasks: async () => {
    set({ loading: true })
    try {
      const tasks = await fetchTasks()
      set({ tasks, loading: true })
    } catch (error) {
      console.error('Erro ao buscar tasks:')
    } finally {
      set({ loading: false })
    }
  },

  addTask: async task => {
    set({ loading: true })
    try {
      await createTask(task)
      set(state => ({
        tasks: [...state.tasks, { ...task, completed: false }],
      }))
    } catch (error) {
      console.error('Erro ao adicionar task:')
    } finally {
      set({ loading: false })
    }
  },

  editTask: async (taskId, taskData) => {
    set({ loading: true })
    try {
      await updateTask(taskId, taskData)
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, ...taskData } : task
        ),
      }))
    } catch (error) {
      console.error('Erro ao editar task:', error)
    } finally {
      set({ loading: false })
    }
  },

  updateTaskTitleAndDescription: async (taskId, title, description) => {
    try {
      await updateTaskTitleAndDescription(taskId, title, description)
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, title, description } : task
        ),
      }))
    } catch (error) {
      console.error('Erro ao editar tarefa:', error)
    }
  },

  editTaskTime: async (taskId, newTime) => {
    try {
      await updateTaskTime(taskId, newTime)
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, time: newTime } : task
        ),
      }))
    } catch (error) {
      console.error('Erro ao atualizar horário da tarefa:', error)
    }
  },

  editTaskPriority: async (taskId, newPriority) => {
    try {
      await updateTaskPriority(taskId, newPriority)
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, priority: newPriority } : task
        ),
      }))
    } catch (error) {
      console.error('Erro ao atualizar a prioridade:', error)
    }
  },

  removeTask: async taskId => {
    set({ loading: true })
    try {
      await deleteTask(taskId)
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId),
      }))
    } catch (error) {
      console.error('Erro ao remover task:', error)
    } finally {
      set({ loading: false })
    }
  },

  filterTasksByTitleAndCompleted: (title: string, showCompleted?: boolean) => {
    set(state => ({
      filteredTasks: state.tasks.filter(task => {
        const matchesTitle = task.title
          .toLowerCase()
          .includes(title.toLowerCase())

        const matchesCompletion =
          showCompleted === undefined || task.completed === showCompleted

        return matchesTitle && matchesCompletion
      }),
    }))
  },

  confirmTask: async id => {
    const tasks = get().tasks
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    )

    set({ tasks: updatedTasks })
    await updateTaskStatus(id, true) // Atualiza o status no Firestore
  },
  cancelTask: async id => {
    const tasks = get().tasks
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: false } : task
    )

    set({ tasks: updatedTasks })
    await updateTaskStatus(id, false) // Atualiza o status no Firestore
  },
}))
