import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout'
import { StepProvider } from './contexts/stepContext'

function App() {
    return (
        <StepProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <DefaultLayout>
                                <Home />
                            </DefaultLayout>
                        }
                    />
                </Routes>
            </Router>
        </StepProvider>
    )
}

export default App
