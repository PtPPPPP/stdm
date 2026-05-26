import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AthletesPage from '../pages/AthletesPage';
import AthleteDetailPage from '../pages/AthleteDetailPage';
import EventsPage from '../pages/EventsPage';
import ComparePage from '../pages/ComparePage';
import GuidePage from '../pages/GuidePage';
import DataAdminPage from '../pages/DataAdminPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/athletes" element={<AthletesPage />} />
      <Route path="/athletes/:id" element={<AthleteDetailPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/data-admin" element={<DataAdminPage />} />
    </Routes>
  );
}
