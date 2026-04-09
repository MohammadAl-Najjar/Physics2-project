import Header from "./components/header.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import CreatePostPage from "./pages/CreatePostPage.jsx"
import PostViewPage from "./pages/PostViewPage.jsx"
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"
import { PageProvider, usePage } from "./context/PageContext.jsx"
import { ThemeProvider } from "./context/ThemeContext.jsx"
import "./css/main.css"

function AuthGate() {
    const { userId, loading } = useAuth()
    const { activePage } = usePage()

    if (loading) {
        return null
    }
    if (userId) {
        if (activePage === "create_post") return <CreatePostPage />
        if (activePage === "view_post") return <PostViewPage />
        return <HomePage />
    }
    return <LoginPage />
}

export default function Main() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <PageProvider>
                    <Header />
                    <AuthGate />
                </PageProvider>
            </ThemeProvider>
        </AuthProvider>
    )
}