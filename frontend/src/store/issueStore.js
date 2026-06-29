import { create } from 'zustand'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useIssueStore = create((set, get) => ({
  issues: [],
  selectedIssue: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    category: '',
    severity: '',
  },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  setSelectedIssue: (issue) => set({ selectedIssue: issue }),

  fetchIssues: async () => {
    set({ loading: true, error: null })
    try {
      const { filters } = get()
      const params = {}
      if (filters.status) params.status = filters.status
      if (filters.category) params.category = filters.category
      if (filters.severity) params.severity = filters.severity

      const res = await axios.get(`${API}/api/issues`, { params })
      set({ issues: res.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
      // Use mock data if backend not available
      set({ issues: getMockIssues() })
    }
  },

  createIssue: async (issueData) => {
    const res = await axios.post(`${API}/api/issues`, issueData)
    set((s) => ({ issues: [res.data, ...s.issues] }))
    return res.data
  },

  verifyIssue: async (issueId, userId = 9) => {
    try {
      const res = await axios.post(`${API}/api/issues/${issueId}/verify?user_id=${userId}`)
      set((s) => ({
        issues: s.issues.map((i) => i.id === issueId ? res.data : i),
        selectedIssue: s.selectedIssue?.id === issueId ? res.data : s.selectedIssue,
      }))
      return res.data
    } catch (err) {
      // Optimistic UI update on error
      set((s) => ({
        issues: s.issues.map((i) =>
          i.id === issueId ? { ...i, verifications: i.verifications + 1 } : i
        ),
      }))
    }
  },

  updateStatus: async (issueId, status) => {
    const res = await axios.patch(`${API}/api/issues/${issueId}/status`, { status })
    set((s) => ({
      issues: s.issues.map((i) => i.id === issueId ? res.data : i),
    }))
    return res.data
  },

  deleteIssue: async (issueId) => {
    await axios.delete(`${API}/api/issues/${issueId}`)
    set((s) => ({
      issues: s.issues.filter((i) => i.id !== issueId),
      selectedIssue: s.selectedIssue?.id === issueId ? null : s.selectedIssue,
    }))
  },

  analyzeImage: async (imageData, userText = "") => {
    const res = await axios.post(`${API}/api/analysis/image`, { image_data: imageData, user_text: userText })
    return res.data
  },
}))

function getMockIssues() {
  return [
    {
      id: 1, title: "Large pothole on SG Highway near Bopal",
      category: "Pothole", severity: "High", status: "Open",
      latitude: 23.0285, longitude: 72.5050,
      address: "SG Highway, Bopal, Ahmedabad",
      reporter_name: "Rahul Sharma", verifications: 12,
      ai_confidence: 0.94, description: "Deep pothole causing vehicle damage.",
      ai_description: "Large pothole approximately 45cm wide.",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: 2, title: "Overflowing garbage bin near Maninagar",
      category: "Garbage Overflow", severity: "Medium", status: "In Progress",
      latitude: 22.9999, longitude: 72.6067,
      address: "Maninagar Circle, Ahmedabad",
      reporter_name: "Priya Patel", verifications: 8,
      ai_confidence: 0.88, description: "Garbage bin overflowing for 3 days.",
      ai_description: "Overflowing municipal waste bin.",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: 3, title: "Broken streetlight — Navrangpura",
      category: "Damaged Streetlight", severity: "High", status: "Open",
      latitude: 23.0395, longitude: 72.5590,
      address: "Navrangpura, CG Road, Ahmedabad",
      reporter_name: "Amit Joshi", verifications: 15,
      ai_confidence: 0.91, description: "3 consecutive streetlights not working.",
      ai_description: "Three consecutive streetlights non-functional.",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: 4, title: "Water main leak — Satellite Road",
      category: "Water Leakage", severity: "High", status: "Resolved",
      latitude: 23.0195, longitude: 72.5250,
      address: "Satellite Road, Ahmedabad",
      reporter_name: "Neha Gupta", verifications: 21,
      ai_confidence: 0.96, description: "Underground water pipe burst.",
      ai_description: "Significant water main leak.",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: 5, title: "Damaged footpath — Vastrapur Lake",
      category: "Broken Footpath", severity: "Low", status: "Open",
      latitude: 23.0432, longitude: 72.5239,
      address: "Vastrapur Lake Road, Ahmedabad",
      reporter_name: "Kavya Mehta", verifications: 4,
      ai_confidence: 0.83, description: "Footpath tiles broken and raised.",
      ai_description: "Multiple displaced footpath tiles.",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: 6, title: "Blocked storm drain — Paldi",
      category: "Drainage Blocked", severity: "Medium", status: "Open",
      latitude: 23.0098, longitude: 72.5625,
      address: "Paldi, Ahmedabad",
      reporter_name: "Vikram Singh", verifications: 6,
      ai_confidence: 0.89, description: "Storm drain completely blocked.",
      ai_description: "Storm drain blocked with plastic waste.",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: 7, title: "Tree fallen across road — Thaltej",
      category: "Tree Fallen", severity: "High", status: "Resolved",
      latitude: 23.0521, longitude: 72.4971,
      address: "Thaltej, Ahmedabad",
      reporter_name: "Deepak Rao", verifications: 18,
      ai_confidence: 0.98, description: "Large tree fallen blocking road.",
      ai_description: "Large tree approximately 20 meters tall fallen.",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: 8, title: "Road damage after digging — Bodakdev",
      category: "Road Damage", severity: "Medium", status: "In Progress",
      latitude: 23.0372, longitude: 72.5155,
      address: "Bodakdev, Ahmedabad",
      reporter_name: "Anita Desai", verifications: 9,
      ai_confidence: 0.87, description: "Road not properly repaired after utility digging.",
      ai_description: "Poorly patched road surface.",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
  ]
}
