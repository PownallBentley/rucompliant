import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-brand-600 mb-4">RUCompliant</h1>
                <p className="text-lg text-gray-600">Compliance that has your back</p>
                <p className="text-sm text-gray-400 mt-2">Platform setup in progress</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
