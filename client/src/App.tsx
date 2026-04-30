import { Routes, Route } from "react-router";
import Layout from "./components/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import SectionPage from "./pages/SectionPage.tsx";
import SlidesPage from "./pages/SlidesPage.tsx";
import { SECTIONS } from "./lib/sections.ts";

export default function App() {
  const sectionRoutes = SECTIONS.flatMap((s) => [
    <Route key={`${s.id}-list`} path={`/${s.id}`} element={<SectionPage />} />,
    <Route key={`${s.id}-detail`} path={`/${s.id}/:id`} element={<SectionPage />} />,
  ]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {sectionRoutes}
        <Route path="/slides" element={<SlidesPage />} />
        <Route path="/slides/:filename" element={<SlidesPage />} />
      </Routes>
    </Layout>
  );
}
