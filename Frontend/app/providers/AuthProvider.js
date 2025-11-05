'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../lib/authService'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = authService.getCurrentUser()
                if (currentUser) {
                    setUser(currentUser.user)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
            } finally {
                setLoading(false)
            }
        }

        initAuth()
    }, [])

    const login = async (email, password) => {
        const response = await authService.login(email, password)
        setUser(response.user)
        return response
    }

    const signup = async (userData) => {
        const response = await authService.signup(userData)
        setUser(response.user)
        return response
    }

    const logout = async () => {
        await authService.logout()
        setUser(null)
    }

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}