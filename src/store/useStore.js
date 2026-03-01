import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set, get) => ({
            // Auth
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            // App state
            currentDisasters: [],
            relocationSuggestions: [],
            selectedLocation: null,
            searchHistory: [],

            // Auth actions
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setToken: (token) => set({ token }),

            login: (user, token) => {
                localStorage.setItem('token', token);
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null, token: null, isAuthenticated: false,
                    relocationSuggestions: [], selectedLocation: null
                });
            },

            setLoading: (loading) => set({ isLoading: loading }),

            updateUserProfile: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            })),

            // App actions
            setCurrentDisasters: (disasters) => set({ currentDisasters: disasters }),
            setRelocationSuggestions: (suggestions) => set({ relocationSuggestions: suggestions }),
            setSelectedLocation: (location) => set({ selectedLocation: location }),

            addToSearchHistory: (query) => set((state) => ({
                searchHistory: [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 10)
            })),

            saveLocation: (location) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    savedLocations: [...(state.user.savedLocations || []), location]
                } : null
            })),

            removeLocation: (locationId) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    savedLocations: (state.user.savedLocations || []).filter(l => l.id !== locationId)
                } : null
            })),
        }),
        {
            name: 'disaster-planner-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                searchHistory: state.searchHistory,
            }),
        }
    )
);

export default useStore;
