import Header from "./components/header.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"
import "./css/main.css"

function AuthGate() {
    const { userId, loading } = useAuth()
    if (loading) {
        return null
    }
    if (userId) {
        return null
    }
    return <LoginPage />
}

export default function Main() {
    return (
        <AuthProvider>
            <Header />
            <AuthGate />
        </AuthProvider>
    )
}