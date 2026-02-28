import { useState, useMemo } from 'react'
import agentData from './agentData.json'

const CATEGORY_ICONS = {
  AI_ML: '🧠', Agriculture: '🌾', Automotive: '🚗', Creative_Content: '🎨',
  Data_Analytics: '📊', DevOps: '⚙️', E_Commerce_Retail: '🛒', Education: '📚',
  Email_Automation: '📧', Energy: '⚡', Finance_Accounting: '💰', Gaming: '🎮',
  Government_NGO: '🏛️', HR: '👥', Healthcare: '🏥', IoT: '📡',
  Legal_Tech: '⚖️', Manufacturing: '🏭', Media: '📺', Misc: '🔮',
  Productivity: '✅', Real_Estate: '🏠', Social_Media: '📱', Travel: '✈️'
}

const formatCategory = (cat) => cat.replace(/_/g, ' ').replace(/E Commerce/, 'E-Commerce')

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(null)

  const totalAgents = useMemo(() => Object.values(agentData).flat().length, [])
  const categories = Object.keys(agentData)

  const filteredAgents = useMemo(() => {
    if (!selectedCategory) return []
    const agents = agentData[selectedCategory] || []
    if (!search) return agents
    return agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
  }, [selectedCategory, search])

  const allFiltered = useMemo(() => {
    if (!search) return null
    return Object.entries(agentData).flatMap(([cat, agents]) =>
      agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
        .map(a => ({ ...a, category: cat }))
    )
  }, [search])

  const handleCopyImport = (agent) => {
    const url = `https://raw.githubusercontent.com/TML-4PM/free-agents-via-AHC/main/${agent.category}/${agent.file}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(agent.file)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo} onClick={() => { setSelectedCategory(null); setSearch('') }}>
            <span style={styles.logoIcon}>◇</span>
            <span style={styles.logoText}>FREE AGENTS</span>
          </div>
          <a href="https://augmentedhumanity.coach" target="_blank" rel="noopener" style={styles.navLink}>
            augmentedhumanity.coach →
          </a>
        </div>
      </nav>

      {/* HERO */}
      {!selectedCategory && !search && (
        <header style={styles.hero}>
          <div style={styles.heroInner}>
            <div className="fade-up fade-up-1" style={styles.heroBadge}>
              <span style={styles.heroBadgeDot} /> OPEN SOURCE · N8N WORKFLOWS
            </div>
            <h1 className="fade-up fade-up-2" style={styles.heroTitle}>
              200+ AI Agents.<br />
              <span style={styles.heroAccent}>Completely free.</span>
            </h1>
            <p className="fade-up fade-up-3" style={styles.heroSub}>
              Production-ready n8n workflows across 24 industries.
              Browse, copy the import URL, and paste into your n8n instance.
            </p>
            <div className="fade-up fade-up-4" style={styles.statsRow}>
              <div style={styles.stat}>
                <span style={styles.statNum}>{totalAgents}</span>
                <span style={styles.statLabel}>Agents</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNum}>{categories.length}</span>
                <span style={styles.statLabel}>Categories</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNum}>n8n</span>
                <span style={styles.statLabel}>Platform</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* SEARCH */}
      <div style={styles.searchWrap}>
        <div style={styles.searchInner}>
          <input
            type="text"
            placeholder="Search agents across all categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>
          )}
        </div>
      </div>

      {/* SEARCH RESULTS */}
      {search && allFiltered && (
        <div style={styles.section}>
          <div style={styles.sectionInner}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                {allFiltered.length} result{allFiltered.length !== 1 ? 's' : ''} for "{search}"
              </h2>
              <button onClick={() => setSearch('')} style={styles.backBtn}>Clear search</button>
            </div>
            <div style={styles.agentGrid}>
              {allFiltered.map((agent, i) => (
                <AgentCard
                  key={agent.file + i}
                  agent={agent}
                  copied={copied}
                  onCopy={handleCopyImport}
                  showCategory
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES GRID */}
      {!selectedCategory && !search && (
        <div style={styles.section}>
          <div style={styles.sectionInner}>
            <h2 style={styles.sectionTitle}>Browse by industry</h2>
            <div style={styles.catGrid}>
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={styles.catCard}
                  className="fade-up"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.background = 'var(--bg-card-hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'var(--bg-card)'
                  }}
                >
                  <span style={styles.catIcon}>{CATEGORY_ICONS[cat] || '🤖'}</span>
                  <span style={styles.catName}>{formatCategory(cat)}</span>
                  <span style={styles.catCount}>{agentData[cat].length} agents</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AGENT LIST */}
      {selectedCategory && !search && (
        <div style={styles.section}>
          <div style={styles.sectionInner}>
            <div style={styles.sectionHeader}>
              <div>
                <button onClick={() => setSelectedCategory(null)} style={styles.backBtn}>
                  ← All categories
                </button>
                <h2 style={{ ...styles.sectionTitle, marginTop: 12 }}>
                  {CATEGORY_ICONS[selectedCategory]} {formatCategory(selectedCategory)}
                </h2>
                <p style={styles.sectionSub}>{filteredAgents.length} agents available</p>
              </div>
            </div>
            <div style={styles.agentGrid}>
              {filteredAgents.map((agent, i) => (
                <AgentCard
                  key={agent.file}
                  agent={agent}
                  copied={copied}
                  onCopy={handleCopyImport}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HOW TO USE */}
      {!selectedCategory && !search && (
        <div style={styles.section}>
          <div style={styles.sectionInner}>
            <h2 style={styles.sectionTitle}>How to use</h2>
            <div style={styles.stepsGrid}>
              {[
                { num: '01', title: 'Browse', desc: 'Pick a category and find an agent that fits your workflow.' },
                { num: '02', title: 'Copy', desc: 'Click "Copy Import URL" to grab the raw JSON link.' },
                { num: '03', title: 'Import', desc: 'In n8n, go to Workflows → Import from URL → paste.' },
                { num: '04', title: 'Configure', desc: 'Connect your credentials and customise triggers.' }
              ].map(step => (
                <div key={step.num} style={styles.stepCard}>
                  <span style={styles.stepNum}>{step.num}</span>
                  <h3 style={styles.stepTitle}>{step.title}</h3>
                  <p style={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerLeft}>
            <span style={styles.logoIcon}>◇</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: 2 }}>
              FREE AGENTS
            </span>
          </div>
          <div style={styles.footerLinks}>
            <a href="https://augmentedhumanity.coach" target="_blank" rel="noopener">Augmented Humanity Coach</a>
            <a href="https://github.com/TML-4PM/free-agents-via-AHC" target="_blank" rel="noopener">GitHub</a>
          </div>
          <p style={styles.footerCopy}>
            © {new Date().getFullYear()} Augmented Humanity · Built in Sydney
          </p>
        </div>
      </footer>
    </div>
  )
}

function AgentCard({ agent, copied, onCopy, showCategory }) {
  const isCopied = copied === agent.file
  const ghUrl = `https://github.com/TML-4PM/free-agents-via-AHC/blob/main/${agent.category}/${agent.file}`

  return (
    <div
      style={styles.agentCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.background = 'var(--bg-card-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--bg-card)'
      }}
    >
      <div style={styles.agentTop}>
        <h3 style={styles.agentName}>{agent.name}</h3>
        {showCategory && (
          <span style={styles.agentCatBadge}>
            {CATEGORY_ICONS[agent.category]} {formatCategory(agent.category)}
          </span>
        )}
      </div>
      <div style={styles.agentMeta}>
        <code style={styles.agentFile}>{agent.file}</code>
      </div>
      <div style={styles.agentActions}>
        <button
          onClick={() => onCopy(agent)}
          style={{
            ...styles.copyBtn,
            background: isCopied ? 'var(--accent)' : 'transparent',
            color: isCopied ? 'var(--bg-primary)' : 'var(--accent)',
          }}
        >
          {isCopied ? '✓ Copied' : 'Copy Import URL'}
        </button>
        <a href={ghUrl} target="_blank" rel="noopener" style={styles.viewBtn}>
          View JSON →
        </a>
      </div>
    </div>
  )
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
  },
  navInner: {
    maxWidth: 1200, margin: '0 auto', padding: '16px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  logoIcon: { color: 'var(--accent)', fontSize: 22, fontWeight: 700 },
  logoText: {
    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
    letterSpacing: 3, color: 'var(--text-primary)',
  },
  navLink: {
    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)',
    letterSpacing: 1,
  },
  hero: {
    padding: '80px 24px 60px',
    background: 'radial-gradient(ellipse at 30% 0%, var(--accent-dim) 0%, transparent 60%)',
  },
  heroInner: { maxWidth: 800, margin: '0 auto' },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2,
    color: 'var(--accent)', marginBottom: 24,
    padding: '6px 14px', border: '1px solid var(--accent-dim)',
    borderRadius: 20,
  },
  heroBadgeDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700,
    lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em',
  },
  heroAccent: { color: 'var(--accent)' },
  heroSub: {
    fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560,
    lineHeight: 1.7, marginBottom: 40,
  },
  statsRow: {
    display: 'flex', alignItems: 'center', gap: 32,
    padding: '24px 0', borderTop: '1px solid var(--border)',
  },
  stat: { display: 'flex', flexDirection: 'column', gap: 4 },
  statNum: {
    fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2,
    color: 'var(--text-muted)', textTransform: 'uppercase',
  },
  statDivider: { width: 1, height: 40, background: 'var(--border)' },

  searchWrap: {
    padding: '24px 24px 0',
    background: 'var(--bg-primary)',
    position: 'sticky', top: 57, zIndex: 90,
  },
  searchInner: {
    maxWidth: 1200, margin: '0 auto', position: 'relative',
  },
  searchInput: {
    width: '100%', padding: '14px 20px', paddingRight: 48,
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)', fontSize: 15,
    outline: 'none', transition: 'border-color 0.2s',
  },
  clearBtn: {
    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: 'var(--text-muted)',
    cursor: 'pointer', fontSize: 16, padding: 4,
  },

  section: { padding: '40px 24px 60px' },
  sectionInner: { maxWidth: 1200, margin: '0 auto' },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 32, flexWrap: 'wrap', gap: 16,
  },
  sectionTitle: {
    fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em',
    marginBottom: 8,
  },
  sectionSub: { color: 'var(--text-secondary)', fontSize: 14 },
  backBtn: {
    background: 'none', border: '1px solid var(--border)',
    color: 'var(--text-secondary)', padding: '8px 16px',
    borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-mono)',
    fontSize: 12, letterSpacing: 1, transition: 'all 0.2s',
  },

  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 12, marginTop: 24,
  },
  catCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    gap: 8, padding: '20px',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 10, cursor: 'pointer',
    transition: 'all 0.2s', textAlign: 'left',
    fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
  },
  catIcon: { fontSize: 28 },
  catName: { fontSize: 15, fontWeight: 600 },
  catCount: {
    fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'var(--text-muted)', letterSpacing: 1,
  },

  agentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 12,
  },
  agentCard: {
    padding: '20px',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 10, transition: 'all 0.2s',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  agentTop: { display: 'flex', flexDirection: 'column', gap: 6 },
  agentName: { fontSize: 15, fontWeight: 600, lineHeight: 1.3 },
  agentCatBadge: {
    fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
    letterSpacing: 1,
  },
  agentMeta: { flex: 1 },
  agentFile: {
    fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
    wordBreak: 'break-all',
  },
  agentActions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  copyBtn: {
    padding: '8px 14px', border: '1px solid var(--accent)',
    borderRadius: 6, cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
    letterSpacing: 1, transition: 'all 0.2s',
  },
  viewBtn: {
    padding: '8px 14px', border: '1px solid var(--border)',
    borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'var(--text-secondary)', letterSpacing: 1,
  },

  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 16, marginTop: 24,
  },
  stepCard: {
    padding: 24, background: 'var(--bg-card)',
    border: '1px solid var(--border)', borderRadius: 10,
  },
  stepNum: {
    fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700,
    color: 'var(--accent)', lineHeight: 1,
  },
  stepTitle: {
    fontSize: 18, fontWeight: 600, marginTop: 12, marginBottom: 8,
  },
  stepDesc: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 },

  footer: {
    borderTop: '1px solid var(--border)', padding: '40px 24px',
    marginTop: 40,
  },
  footerInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center',
  },
  footerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  footerLinks: {
    display: 'flex', gap: 24, fontFamily: 'var(--font-mono)', fontSize: 12,
    letterSpacing: 1,
  },
  footerCopy: {
    fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'var(--text-muted)', letterSpacing: 1,
  },
}
