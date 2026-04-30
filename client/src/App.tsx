import { Routes, Route } from "react-router";
import Layout from "./components/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import SectionPage from "./pages/SectionPage.tsx";
import SlidesPage from "./pages/SlidesPage.tsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/slides" element={<SlidesPage />} />
        <Route path="/slides/:filename" element={<SlidesPage />} />
        <Route path="/:section" element={<SectionPage />} />
        <Route path="/:section/:id" element={<SectionPage />} />
      </Routes>
    </Layout>
  );
}
