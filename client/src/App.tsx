import { Routes, Route } from "react-router";
import Layout from "./components/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import PracticePage from "./pages/PracticePage.tsx";
import SlidesPage from "./pages/SlidesPage.tsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/:id" element={<PracticePage />} />
        <Route path="/slides" element={<SlidesPage />} />
        <Route path="/slides/:filename" element={<SlidesPage />} />
      </Routes>
    </Layout>
  );
}
