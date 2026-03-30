import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-page">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">RUCompliant</h1>
                <p className="text-lg text-foreground">Compliance that has your back</p>
                <p className="text-sm text-muted-foreground mt-2">Platform setup in progress</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
