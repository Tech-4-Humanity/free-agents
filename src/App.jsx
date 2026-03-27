import { useState, useMemo } from 'react'

const RAW_BASE = 'https://raw.githubusercontent.com/TML-4PM/free-agents-via-AHC/main'

const PRODUCTS = [
  { key:'ai_copywriter_team', name:'AI Copywriter Team', story:'Enter a campaign brief. A full team of AI copywriters produces cold emails, VSL scripts, sales letters, and SEO content.', agents:10, stack:'OpenAI + Supabase', starter:59, monthly:24, wl:12, tokens:'700K', match:'STRONG', workflows:['AI_ML/daily_content_ideas.json','AI_ML/product_description_generator.json','Media/content_idea_brainstormer.json'], category:'Content' },
  { key:'ai_image_automation', name:'AI Image Automation', story:'Upload batch prompts. The system generates images in bulk with variation control and brand enforcement.', agents:7, stack:'FAL + Drive + Sheets', starter:39, monthly:15, wl:7, tokens:'300K', match:'STRONG', workflows:['AI_ML/image_captioning.json'], category:'Creative' },
  { key:'ai_video_analysis', name:'AI Video Analysis', story:'Upload a YouTube link or video file. The system analyses content for key moments, sentiment, and generates a structured summary with timestamps.', agents:8, stack:'Gemini + YouTube', starter:29, monthly:9, wl:5, tokens:'300K', match:'STRONG', workflows:['Creative_Content/youtube_transcript_to_blog.json','AI_ML/voice_note_transcription.json'], category:'Video' },
  { key:'automated_hiring_workflow', name:'Automated Hiring Workflow', story:'Enter a job description. The system posts, screens applicants, schedules interviews, and generates offer letters.', agents:11, stack:'LinkedIn + Gmail + ClickUp', starter:69, monthly:29, wl:14, tokens:'700K', match:'STRONG', workflows:['HR/new_job_application_parser.json','HR/notion_job_board_poster.json','AI_ML/resume_screening.json'], category:'HR' },
  { key:'automated_sales_agents', name:'Automated Sales Agents', story:'Enter a pipeline stage. The system prospects, outreaches, qualifies, closes deals, and updates CRM.', agents:14, stack:'Salesforce + Gmail + LinkedIn', starter:99, monthly:39, wl:19, tokens:'1.5M', match:'STRONG', workflows:['Email_Automation/lead_to_hubspot.json','Email_Automation/follow-up_emails.json'], category:'Sales' },
  { key:'carousel_slides_automation', name:'Carousel & Slides Automation', story:'Enter a topic. The system generates quotes, images, and assembles branded slides for LinkedIn and Instagram.', agents:9, stack:'Canva + Slides + OpenAI', starter:49, monthly:19, wl:9, tokens:'400K', match:'STRONG', workflows:['Misc/idea_to_ig_carousel.json'], category:'Content' },
  { key:'client_onboarding_system', name:'Client Onboarding System', story:'A new client fills a form. The system creates their Drive folder, ClickUp tasks, Slack channel, and sends a personalised welcome message.', agents:14, stack:'Gmail + Drive + ClickUp + Slack', starter:49, monthly:19, wl:9, tokens:'500K', match:'STRONG', workflows:['Misc/onboarding_checklist_slack.json','Misc/zoom_attendance_log.json'], category:'Ops' },
  { key:'cold_email_automation', name:'Cold Email Automation', story:'Upload a list of prospects. The system writes personalised cold emails, sends them, and tracks opens and replies.', agents:9, stack:'Gmail + Apollo + Sheets', starter:49, monthly:19, wl:9, tokens:'400K', match:'STRONG', workflows:['Email_Automation/follow-up_emails.json','Email_Automation/product_launch_email.json','Email_Automation/lead_to_hubspot.json'], category:'Sales' },
  { key:'customer_support_automation', name:'Customer Support Automation', story:'Customer submits a ticket. The system routes it, drafts a response, escalates if needed, and updates CRM.', agents:10, stack:'Zendesk + Gmail + Supabase', starter:59, monthly:24, wl:12, tokens:'600K', match:'STRONG', workflows:['AI_ML/ticket_urgency_classification.json','AI_ML/summarize_customer_emails.json','Email_Automation/auto_reply_to_faqs.json'], category:'Support' },
  { key:'email_complaint_automation', name:'Email & Complaint Automation', story:'Customer sends a complaint. The system triages, responds, escalates if needed, and logs everything automatically.', agents:9, stack:'Gmail + Zendesk + Supabase', starter:49, monthly:19, wl:9, tokens:'400K', match:'STRONG', workflows:['Email_Automation/auto_reply_to_faqs.json','AI_ML/summarize_customer_emails.json','AI_ML/customer_sentiment_analysis.json'], category:'Support' },
  { key:'error_logger_workflow', name:'Error Logger Workflow', story:'Any workflow fails. The system logs the error, sends an alert, and suggests remediation steps instantly.', agents:6, stack:'Supabase + Slack + PagerDuty', starter:29, monthly:9, wl:5, tokens:'200K', match:'STRONG', workflows:['Misc/api_monitor_auto_restart.json','DevOps/github_commit_jenkins.json'], category:'DevOps' },
  { key:'fb_ad_spy_tool', name:'FB Ad Spy Tool', story:'Paste a competitor name. The system scrapes their entire ad library, categorises every ad, rewrites copy, and delivers a performance report.', agents:12, stack:'Apify + OpenAI + Gemini + Sheets', starter:79, monthly:29, wl:14, tokens:'1M', match:'STRONG', workflows:['Data_Analytics/competitor_price_scraper.json','Media/ad_campaign_performance_alert.json','Social_Media/alert_on_instagram_competitor_story.json'], category:'Analytics' },
  { key:'image_creation_editing', name:'Image Creation & Editing', story:'Enter a prompt. The system generates and edits images to match brand style and saves variations to Drive.', agents:8, stack:'FAL + Midjourney + Sheets', starter:49, monthly:19, wl:9, tokens:'500K', match:'STRONG', workflows:['AI_ML/image_captioning.json'], category:'Creative' },
  { key:'inbox_automation', name:'Inbox Automation', story:'Connect Gmail. The system classifies emails, drafts replies, archives, and updates CRM automatically.', agents:8, stack:'Gmail + Supabase + ClickUp', starter:39, monthly:15, wl:7, tokens:'300K', match:'STRONG', workflows:['Email_Automation/auto_archive_promotions.json','Email_Automation/daily_email_digest.json','Email_Automation/auto_reply_to_faqs.json'], category:'Ops' },
  { key:'invoice_tracker', name:'Invoice Tracker', story:'Upload receipts. The system extracts data, creates invoices, sends them, and tracks payments automatically.', agents:8, stack:'Stripe + Gmail + Supabase', starter:39, monthly:15, wl:7, tokens:'200K', match:'STRONG', workflows:['Finance_Accounting/unpaid_invoice_reminder.json','Email_Automation/parse_invoice_emails.json','Finance_Accounting/stripe_to_quickbooks.json'], category:'Finance' },
  { key:'leadgen_outreach', name:'LeadGen Outreach', story:'Upload a list of companies. The system finds contacts, personalises emails, and sends them with follow-up tracking.', agents:10, stack:'Apollo + LinkedIn + Gmail', starter:59, monthly:24, wl:12, tokens:'700K', match:'STRONG', workflows:['Email_Automation/lead_to_hubspot.json','Email_Automation/follow-up_emails.json','Email_Automation/product_launch_email.json'], category:'Sales' },
  { key:'linkedin_ai_agent', name:'LinkedIn AI Agent', story:'Connect LinkedIn. The system sends connection requests, messages, creates content, and tracks leads automatically.', agents:9, stack:'LinkedIn + OpenAI + Supabase', starter:59, monthly:24, wl:12, tokens:'500K', match:'STRONG', workflows:['Social_Media/auto-post_blogs_to_linkedin_and_twitter.json','Social_Media/auto-dm_new_twitter_followers.json'], category:'Social' },
  { key:'linkedin_visual_automation', name:'LinkedIn Visual Automation', story:'Enter a post topic. The system creates a visual carousel or infographic and schedules it for LinkedIn.', agents:9, stack:'LinkedIn + Canva + Sheets', starter:49, monthly:19, wl:9, tokens:'400K', match:'STRONG', workflows:['Social_Media/auto-post_blogs_to_linkedin_and_twitter.json','Misc/idea_to_ig_carousel.json'], category:'Social' },
  { key:'marketing_ai_team', name:'Marketing AI Team', story:'Enter a campaign brief. A full AI marketing team creates content, designs, schedules, and reports.', agents:14, stack:'Full stack', starter:99, monthly:39, wl:19, tokens:'1.5M', match:'STRONG', workflows:['Media/ad_campaign_performance_alert.json','Media/content_idea_brainstormer.json','Social_Media/monthly_social_media_report.json','Email_Automation/mailchimp_campaign_tracking.json'], category:'Marketing' },
  { key:'meeting_noshow_eliminator', name:'Meeting No-show Eliminator', story:'Book a meeting. The system sends reminders, scrapes LinkedIn for context, and follows up automatically if no-show.', agents:11, stack:'Twilio + Gmail + Airtable', starter:49, monthly:19, wl:9, tokens:'400K', match:'STRONG', workflows:['Misc/interview_scheduler.json','Misc/zoom_attendance_log.json'], category:'Sales' },
  { key:'meta_ad_automation', name:'Meta Ad Automation', story:'Enter a product. The system creates ads, launches campaigns, optimises, and reports ROI — end to end.', agents:12, stack:'Meta + OpenAI + Sheets', starter:79, monthly:29, wl:14, tokens:'1M', match:'STRONG', workflows:['Media/ad_campaign_performance_alert.json','Email_Automation/mailchimp_campaign_tracking.json'], category:'Marketing' },
  { key:'real_time_insights_system', name:'Real-Time Insights System', story:'Ask about current trends. The system pulls real-time data from X, analyses it, and delivers insights with sources.', agents:9, stack:'Grok + Supabase', starter:49, monthly:19, wl:9, tokens:'600K', match:'STRONG', workflows:['Media/social_buzz_heatmap.json','Media/breaking_news_summarizer.json','Social_Media/log_twitter_mentions_in_notion.json'], category:'Analytics' },
  { key:'scraping_automation', name:'Scraping Automation', story:'Paste TikTok or Google Maps URLs. The system scrapes data, cleans it, and stores in Sheets with alerts for new leads.', agents:7, stack:'Apify + Supabase', starter:49, monthly:19, wl:9, tokens:'500K', match:'STRONG', workflows:['Data_Analytics/competitor_price_scraper.json','Social_Media/alert_on_instagram_competitor_story.json','Social_Media/youtube_comment_summarizer.json'], category:'Analytics' },
  { key:'social_media_scraper', name:'Social Media Scraper', story:'Enter competitor handles. The system scrapes posts, transcripts, and trends across platforms for analysis.', agents:7, stack:'Apify + Sheets + Supabase', starter:39, monthly:15, wl:7, tokens:'300K', match:'STRONG', workflows:['Social_Media/alert_on_instagram_competitor_story.json','Social_Media/monthly_social_media_report.json','Social_Media/youtube_comment_summarizer.json','Social_Media/log_twitter_mentions_in_notion.json'], category:'Analytics' },
  { key:'viral_linkedin_posts', name:'Viral LinkedIn Posts', story:'Enter a topic. The system researches trending angles, writes the post, creates images, and schedules it for LinkedIn.', agents:10, stack:'Perplexity + Anthropic + OpenAI + Sheets', starter:59, monthly:24, wl:12, tokens:'600K', match:'STRONG', workflows:['Social_Media/auto-post_blogs_to_linkedin_and_twitter.json','Media/content_idea_brainstormer.json','AI_ML/daily_content_ideas.json'], category:'Social' },
  { key:'viral_shorts_automation', name:'Viral Shorts Automation', story:'Enter a trending hook. The system generates Shorts, adds voiceover and captions, and posts to multiple platforms.', agents:10, stack:'TikTok + YouTube + FAL', starter:59, monthly:24, wl:12, tokens:'700K', match:'STRONG', workflows:['Social_Media/cross-post_youtube_uploads_to_facebook.json','Social_Media/auto-reply_to_tiktok_comments.json'], category:'Video' },
  { key:'viral_shorts_machine', name:'Viral Shorts Machine', story:'Enter a trending topic. The system generates 10 Shorts variations, adds voiceover and captions, and posts to TikTok, Instagram, and YouTube.', agents:12, stack:'FAL + ElevenLabs + Blotato', starter:79, monthly:29, wl:14, tokens:'800K', match:'STRONG', workflows:['Social_Media/cross-post_youtube_uploads_to_facebook.json','Social_Media/auto-reply_to_tiktok_comments.json','Social_Media/monthly_social_media_report.json'], category:'Video' },
  { key:'whatsapp_ai_agent', name:'WhatsApp AI Agent', story:'Customer messages on WhatsApp. The system responds, qualifies leads, books appointments, and escalates when needed.', agents:8, stack:'Twilio + WhatsApp + Supabase', starter:59, monthly:24, wl:12, tokens:'500K', match:'STRONG', workflows:['Healthcare/appointment_whatsapp_notify.json','Email_Automation/auto_reply_to_faqs.json'], category:'Support' },
  // PARTIAL
  { key:'agent_tracking_system', name:'Agent Tracking System', story:'See what all agents are doing in real time. The system logs every action, token usage, and error with alerts.', agents:6, stack:'Supabase + Sheets', starter:29, monthly:9, wl:5, tokens:'200K', match:'PARTIAL', workflows:['Misc/api_monitor_auto_restart.json','Misc/crm_patient_intake.json'], category:'DevOps' },
  { key:'ai_avatar_social_automation', name:'AI Avatar Social Automation', story:'Record a short video. The system creates an AI avatar, generates social videos, and posts them across platforms.', agents:11, stack:'HeyGen + FAL + TikTok', starter:79, monthly:29, wl:14, tokens:'1M', match:'PARTIAL', workflows:['Social_Media/auto-post_blogs_to_linkedin_and_twitter.json','Social_Media/cross-post_youtube_uploads_to_facebook.json'], category:'Video' },
  { key:'ai_think_agent_system', name:'AI Think Agent System', story:'Give a complex task. The system breaks it down step-by-step, uses tools, and validates the final answer.', agents:9, stack:'Perplexity + OpenAI + Supabase', starter:59, monthly:24, wl:12, tokens:'600K', match:'PARTIAL', workflows:['AI_ML/ticket_urgency_classification.json','Misc/survey_auto_analyze.json'], category:'Ops' },
  { key:'chatgpt_automation_system', name:'ChatGPT Automation System', story:'Connect ChatGPT to business apps. The system triggers actions like scheduling calls or updating spreadsheets from chat.', agents:7, stack:'OpenAI + Supabase + Sheets', starter:39, monthly:15, wl:7, tokens:'300K', match:'PARTIAL', workflows:['AI_ML/translate_form_submissions.json','Email_Automation/auto_reply_to_faqs.json'], category:'Ops' },
  { key:'chatgpt_image_workflow', name:'ChatGPT Image Workflow', story:'Describe an image concept. The system generates the image, merges with existing assets, and saves branded versions to Drive.', agents:7, stack:'OpenAI Image + Drive', starter:39, monthly:14, wl:7, tokens:'400K', match:'PARTIAL', workflows:['AI_ML/image_captioning.json'], category:'Creative' },
  { key:'claude_mcp_content', name:'Claude MCP Content Automation', story:'Enter a content brief. The system uses Claude with MCP tools to research, write, and publish across platforms.', agents:9, stack:'Claude + Drive + Ghost', starter:49, monthly:19, wl:9, tokens:'400K', match:'PARTIAL', workflows:['Media/content_idea_brainstormer.json','Media/podcast_show_notes_generator.json'], category:'Content' },
  { key:'dynamic_ai_agent_workflow', name:'Dynamic AI Agent Workflow', story:'Describe any business process. The system dynamically assembles the right agents and runs the full workflow.', agents:12, stack:'Full stack', starter:79, monthly:29, wl:14, tokens:'1M', match:'PARTIAL', workflows:['AI_ML/ticket_urgency_classification.json','AI_ML/customer_sentiment_analysis.json'], category:'Ops' },
  { key:'faceless_video_ai', name:'Faceless Video AI', story:'Enter a topic. The system creates a faceless video, adds voiceover and captions, and uploads to YouTube with SEO.', agents:11, stack:'ElevenLabs + FAL + YouTube', starter:59, monthly:24, wl:12, tokens:'800K', match:'PARTIAL', workflows:['Creative_Content/youtube_transcript_to_blog.json','Media/podcast_show_notes_generator.json'], category:'Video' },
  { key:'faceless_video_maker', name:'Faceless Video Maker', story:'Enter a topic. The system generates a script, creates images, merges into faceless video, adds captions and voiceover, and schedules upload.', agents:13, stack:'Anthropic + OpenAI + Runway + ElevenLabs', starter:89, monthly:39, wl:19, tokens:'900K', match:'PARTIAL', workflows:['Creative_Content/youtube_transcript_to_blog.json'], category:'Video' },
  { key:'google_map_scraper', name:'Google Map Scraper', story:'Enter a city and industry. The system scrapes Google Maps for leads, extracts emails and phone numbers, and cleans duplicates.', agents:6, stack:'Apify + Sheets + Supabase', starter:39, monthly:15, wl:7, tokens:'200K', match:'PARTIAL', workflows:['Data_Analytics/competitor_price_scraper.json'], category:'Analytics' },
  { key:'job_search_automation', name:'Job Search Automation', story:'Enter criteria. The system scrapes listings, tailors your resume and cover letter, and submits applications.', agents:8, stack:'LinkedIn + Indeed + Drive', starter:39, monthly:15, wl:7, tokens:'300K', match:'PARTIAL', workflows:['HR/new_job_application_parser.json','AI_ML/resume_screening.json'], category:'HR' },
  { key:'product_videography', name:'Product Videography', story:'Upload a product photo. The system generates a video with voiceover, background music, and professional transitions.', agents:10, stack:'FAL + ElevenLabs + Sheets', starter:59, monthly:24, wl:12, tokens:'800K', match:'PARTIAL', workflows:['Media/podcast_show_notes_generator.json','Creative_Content/youtube_transcript_to_blog.json'], category:'Video' },
  { key:'proposal_generator', name:'Proposal Generator', story:'Paste a client brief. The system transcribes the call recording, pulls from templates, generates a proposal PDF, and sends it.', agents:8, stack:'Drive + OpenAI + Sheets', starter:39, monthly:15, wl:7, tokens:'300K', match:'PARTIAL', workflows:['AI_ML/product_description_generator.json','AI_ML/summarize_customer_emails.json'], category:'Sales' },
  { key:'think_tool_agent', name:'Think Tool Agent', story:'Give it a complex problem. The system breaks it down, researches, and synthesises a step-by-step plan with tools.', agents:7, stack:'Perplexity + OpenAI + Supabase', starter:39, monthly:15, wl:7, tokens:'400K', match:'PARTIAL', workflows:['AI_ML/customer_sentiment_analysis.json','Misc/survey_auto_analyze.json'], category:'Ops' },
  { key:'viral_ai_videos', name:'Viral AI Videos', story:'Enter a topic and target length. The system generates a cinematic script, creates video with Veo 3, adds voiceover, and uploads to YouTube with SEO.', agents:11, stack:'FAL + Sheets', starter:59, monthly:24, wl:12, tokens:'800K', match:'PARTIAL', workflows:['Creative_Content/youtube_transcript_to_blog.json','Media/content_idea_brainstormer.json'], category:'Video' },
  { key:'voice_ai_receptionist', name:'Voice AI Receptionist', story:'Customer calls your business. The AI receptionist answers, books appointments, qualifies leads, and sends a follow-up invoice.', agents:9, stack:'Vapi + Twilio + GoHighLevel', starter:69, monthly:29, wl:14, tokens:'600K', match:'PARTIAL', workflows:['Healthcare/appointment_whatsapp_notify.json','Misc/interview_scheduler.json'], category:'Support' },
  { key:'website_extractor', name:'Website Extractor', story:'Paste a website URL. The system extracts all pages, structures the content, and saves it ready for LLM use.', agents:6, stack:'Apify + Drive + Supabase', starter:29, monthly:9, wl:5, tokens:'200K', match:'PARTIAL', workflows:['Data_Analytics/competitor_price_scraper.json','AI_ML/auto-tag_blog_posts.json'], category:'Analytics' },
]

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category))).sort()]

const CATEGORY_ICONS = {
  Analytics:'📊', Content:'✍️', Creative:'🎨', DevOps:'⚙️',
  Finance:'💰', HR:'👥', Marketing:'📣', Ops:'🔧',
  Sales:'🎯', Social:'🔗', Support:'💬', Video:'🎬', All:'⚡'
}

function toRawUrl(path) {
  return `${RAW_BASE}/${path}`
}

function WorkflowBadge({ path, idx }) {
  const [copied, setCopied] = useState(false)
  const url = toRawUrl(path)
  const label = path.split('/').pop().replace('.json','').replace(/_/g,' ')

  const copy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="workflow-badge">
      <span className="wf-label">n8n</span>
      <span className="wf-name">{label}</span>
      <div className="wf-actions">
        <a href={url} download className="wf-btn" title="Download JSON">↓</a>
        <button onClick={copy} className="wf-btn" title="Copy import URL">{copied ? '✓' : '⎘'}</button>
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`card ${product.match === 'STRONG' ? 'card-strong' : 'card-partial'}`}>
      <div className="card-header">
        <div className="card-meta">
          <span className="cat-tag">{CATEGORY_ICONS[product.category]} {product.category}</span>
          <span className={`match-tag ${product.match === 'STRONG' ? 'match-strong' : 'match-partial'}`}>
            {product.match === 'STRONG' ? '● READY' : '◐ PARTIAL'}
          </span>
        </div>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-story">{product.story}</p>
      </div>

      <div className="card-stats">
        <div className="stat"><span className="stat-val">{product.agents}</span><span className="stat-label">agents</span></div>
        <div className="stat"><span className="stat-val">{product.tokens}</span><span className="stat-label">tokens/mo</span></div>
        <div className="stat"><span className="stat-val">${product.starter}</span><span className="stat-label">once</span></div>
        <div className="stat"><span className="stat-val">${product.monthly}</span><span className="stat-label">/mo</span></div>
      </div>

      <div className="card-stack">{product.stack}</div>

      <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? '▲ Hide workflows' : `▼ ${product.workflows.length} workflow${product.workflows.length > 1 ? 's' : ''}`}
      </button>

      {expanded && (
        <div className="workflows">
          {product.workflows.map((wf, i) => <WorkflowBadge key={i} path={wf} idx={i} />)}
          <div className="wl-price">White-label: <strong>${product.wl}/mo per customer</strong></div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [category, setCategory] = useState('All')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      if (category !== 'All' && p.category !== category) return false
      if (filter === 'strong' && p.match !== 'STRONG') return false
      if (filter === 'partial' && p.match !== 'PARTIAL') return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.story.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [category, filter, search])

  const strongCount = PRODUCTS.filter(p => p.match === 'STRONG').length
  const partialCount = PRODUCTS.filter(p => p.match === 'PARTIAL').length

  return (
    <div className="app">
      <div className="grid-bg" />

      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">⚡</span>
            <div>
              <div className="logo-name">FREE AGENTS</div>
              <div className="logo-sub">by Tech 4 Humanity</div>
            </div>
          </div>
          <div className="header-stats">
            <div className="hstat"><strong>{strongCount}</strong> ready to deploy</div>
            <div className="hstat"><strong>{partialCount}</strong> partial</div>
            <div className="hstat"><strong>{PRODUCTS.length}</strong> total workflows</div>
          </div>
        </div>
        <p className="header-desc">
          Real n8n workflows. Download the JSON. Import into your n8n instance. Done.
        </p>
      </header>

      <div className="controls">
        <input
          className="search"
          placeholder="Search workflows..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-row">
          {['all','strong','partial'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'strong' ? '● Ready' : '◐ Partial'}
            </button>
          ))}
        </div>
        <div className="cat-row">
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {CATEGORY_ICONS[c] || '•'} {c}
            </button>
          ))}
        </div>
      </div>

      <div className="results-count">{filtered.length} workflow{filtered.length !== 1 ? 's' : ''}</div>

      <div className="grid">
        {filtered.map(p => <ProductCard key={p.key} product={p} />)}
      </div>

      <footer className="footer">
        <p>All workflows are n8n-compatible JSON. Import via <code>Workflows → ⋮ → Import from URL</code> in your n8n instance.</p>
        <p>White-label pricing available. Source: <a href="https://github.com/TML-4PM/free-agents-via-AHC" target="_blank" rel="noreferrer">TML-4PM/free-agents-via-AHC</a></p>
      </footer>
    </div>
  )
}
