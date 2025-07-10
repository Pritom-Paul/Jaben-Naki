import { useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold tracking-widest text-blue-500">
        JABEN NAKI
      </h1>
      <div className="mt-8">
        <Button
          size="lg"
          variant="destructive"
          className="shadow-lg"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </Button>
      </div>
      <p className="mt-4 text-lg text-center text-red-500">
        Click on the button to test HMR
      </p>
    </div>
  )
}

export default App

