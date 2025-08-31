import './App.css'
import { useRoutes } from 'react-router-dom'
import routes from './routes/routes'
import { LoadingProvider } from './context/loadingContext'
function App() {
  let router = useRoutes(routes);

  return (
    <div className="App">
      <LoadingProvider >
        {router}
      </LoadingProvider>
    </div>
  );
}
export default App;
