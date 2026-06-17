/**
 * App.jsx — Root component. Router is handled by routes/index.jsx.
 * App itself is kept thin — just re-exports the router.
 */
import AppRouter from 'routes/index';

export default function App() {
  return <AppRouter />;
}
