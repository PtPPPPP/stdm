import Layout from '../components/layout/Layout';
import AppProviders from './providers';
import AppRouter from './router';

export default function App() {
  return (
    <AppProviders>
      <Layout>
        <AppRouter />
      </Layout>
    </AppProviders>
  );
}
