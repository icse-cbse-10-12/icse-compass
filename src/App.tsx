import { NavLink, Route, Routes } from "react-router-dom";
import { ArrowRight, BookOpen, Compass, FileText, GraduationCap, LibraryBig, Search, Users } from "lucide-react";

const navigation = [
  { to: "/", label: "Overview", icon: Compass, end: true },
  { to: "/materials", label: "Materials", icon: LibraryBig },
  { to: "/creators", label: "Educators", icon: Users },
  { to: "/school-papers", label: "School papers", icon: FileText }
];

function Overview() {
  return (
    <main className="page-content">
      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-dot" /> YOUR ICSE STUDY SPACE</div>
        <h1>Find your direction.<br /><em>Make every study session count.</em></h1>
        <p className="hero-copy">A focused academic workspace for discovering study materials, trusted educators and school papers — all in one place.</p>
        <NavLink className="primary-link" to="/materials">Explore the materials library <ArrowRight size={17} /></NavLink>
        <div className="hero-note"><span className="note-line" /> Built for curious, independent learners</div>
        <div className="hero-illustration" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="book-stack"><div className="book book-back" /><div className="book book-mid" /><div className="book book-front"><BookOpen size={38} strokeWidth={1.25} /></div></div>
          <div className="float-card float-card-top"><GraduationCap size={17} /><span>Learn with purpose</span></div>
          <div className="float-card float-card-bottom"><span className="mini-check">✓</span><span>One clear next step</span></div>
        </div>
      </section>

      <section className="quick-section" aria-labelledby="start-heading">
        <div className="section-heading">
          <div><p className="eyebrow">START EXPLORING</p><h2 id="start-heading">Your study essentials</h2></div>
          <span className="section-index">01 — 04</span>
        </div>
        <div className="quick-grid">
          <NavLink to="/materials" className="quick-card">
            <span className="card-icon"><LibraryBig size={20} /></span><span className="card-number">01</span>
            <h3>Materials Library</h3><p>Discover notes, worksheets and learning resources.</p><span className="card-arrow"><ArrowRight size={18} /></span>
          </NavLink>
          <NavLink to="/creators" className="quick-card">
            <span className="card-icon"><Users size={20} /></span><span className="card-number">02</span>
            <h3>Educators</h3><p>Explore learning content from educators and channels.</p><span className="card-arrow"><ArrowRight size={18} /></span>
          </NavLink>
          <NavLink to="/school-papers" className="quick-card">
            <span className="card-icon"><FileText size={20} /></span><span className="card-number">03</span>
            <h3>School Papers</h3><p>Find school-level practice and examination papers.</p><span className="card-arrow"><ArrowRight size={18} /></span>
          </NavLink>
          <div className="quick-card upcoming-card">
            <span className="card-icon"><Search size={20} /></span><span className="card-number">04</span>
            <h3>Personal workspace</h3><p>Planner, syllabus progress and revision tools are planned for a later release.</p><span className="coming-soon">COMING LATER</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function ComingSoon({ title, description }: { title: string; description: string }) {
  return <main className="page-content simple-page"><p className="eyebrow">ICSE COMPASS</p><h1>{title}</h1><p>{description}</p><p className="status-note">This section is part of the Phase 1 foundation and will be connected to verified catalogue data in the next phase.</p><NavLink className="text-link" to="/">Return to overview <ArrowRight size={16} /></NavLink></main>;
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="ICSE Compass home"><span className="brand-mark"><Compass size={22} /></span><span>ICSE <strong>Compass</strong><small>YOUR ACADEMIC WORKSPACE</small></span></NavLink>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon size={16} />{label}</NavLink>)}
        </nav>
        <span className="public-label"><span /> OPEN ACCESS</span>
      </header>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/materials" element={<ComingSoon title="Materials Library" description="A searchable home for notes, worksheets and other learning resources." />} />
        <Route path="/creators" element={<ComingSoon title="Meet the educators" description="Explore dedicated pages for educators and learning channels." />} />
        <Route path="/school-papers" element={<ComingSoon title="School papers" description="A curated space for school-level papers and practice material." />} />
        <Route path="*" element={<ComingSoon title="Page not found" description="The page you requested could not be found." />} />
      </Routes>
      <footer className="footer"><span>© {new Date().getFullYear()} ICSE Compass</span><span>Independent educational workspace · Not affiliated with CISCE</span></footer>
    </div>
  );
}