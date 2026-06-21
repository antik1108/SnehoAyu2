import { AppRoutes } from './routes/AppRoutes.tsx';
import { ServerDownOverlay } from './components/ServerDownOverlay.tsx';

function App() {
  return (
    <>
      <AppRoutes />
      <ServerDownOverlay />
    </>
  );
}

export default App;
