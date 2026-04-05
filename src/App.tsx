import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { startSimulation, stopSimulation } from '@/data/simulation'

export default function App() {
  useEffect(() => {
    startSimulation()
    return () => stopSimulation()
  }, [])

  return <RouterProvider router={router} />
}
