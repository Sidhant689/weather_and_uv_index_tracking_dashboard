import { useState } from 'react'
import WheatherDashBoard from './components/wheather/WeatherDashBoard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
      <WheatherDashBoard />
    </div>
  );
}

export default App
