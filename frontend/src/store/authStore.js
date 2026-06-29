import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      login: async (name, email, phone, password = '', role = 'citizen', emoji = '🦸') => {
        try {
          // Real backend integration
          const res = await axios.post(`${API}/api/users/login`, {
            name, email, phone, password, role, avatar_emoji: emoji
          })
          
          set({
            user: {
              ...res.data,
              badges: res.data.badges_json ? JSON.parse(res.data.badges_json) : ['First Steps']
            },
            isLoggedIn: true,
          })
          return { success: true }
        } catch (err) {
          console.error('Login failed', err)
          if (err.response?.status === 401) {
            throw new Error('Invalid credentials')
          }
          // Fallback to local
          set({
            user: { id: 9, name, email, phone, role, avatar_emoji: emoji, points: 10, reports_count: 0, verifications_count: 0, resolved_count: 0, badges: ['First Steps'] },
            isLoggedIn: true,
          })
          return { success: true }
        }
      },

      logout: () => set({ isLoggedIn: false, user: null }),

      updateUser: async (updates) => {
        try {
          const { user } = get()
          if (!user || !user.id) return
          const res = await axios.patch(`${API}/api/users/${user.id}`, updates)
          set((s) => ({ user: { ...s.user, ...res.data, badges: res.data.badges_json ? JSON.parse(res.data.badges_json) : s.user.badges } }))
        } catch (err) {
          // Fallback
          set((s) => ({ user: { ...s.user, ...updates } }))
        }
      },

      // We still keep these for optimistic UI, but they will be overwritten when fetching fresh data
      addPoints: (pts) => {
        set((s) => {
          if (!s.user) return s
          return { user: { ...s.user, points: s.user.points + pts } }
        })
      },
      recordReport: () => {
        set((s) => {
          if (!s.user) return s
          return { user: { ...s.user, reports_count: s.user.reports_count + 1, points: s.user.points + 10 } }
        })
      },
      recordVerification: () => {
        set((s) => {
          if (!s.user) return s
          return { user: { ...s.user, verifications_count: s.user.verifications_count + 1, points: s.user.points + 3 } }
        })
      },
    }),
    { name: 'community-hero-auth' }
  )
)
