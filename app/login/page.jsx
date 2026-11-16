'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  HelpCircle,
  ArrowRight,
  Globe,
  User,
  Building,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Users
} from 'lucide-react';
import './workforce-login.css';

const CREDENTIAL_PRESETS = [
  {
    key: 'admin',
    role: 'ADMIN',
    label: 'Super Admin',
    emoji: '🛡️',
    email: 'admin@aidigital.com',
    pass: 'Ai_Digital@0701',
    target: '/admin',
    description: 'Unified Website & Workforce Control Suite'
  },
  {
    key: 'management',
    role: 'ADMIN',
    label: 'Management Admin',
    emoji: '👔',
    email: 'praveen@aidigital.com',
    pass: 'Admin@#123',
    target: '/admin?suite=workforce',
    description: 'Workforce Operations & Agency Management'
  },
  {
    key: 'ceo',
    role: 'CEO',
    label: 'CEO Nikhil',
    emoji: '👑',
    email: 'nikhil@aidigital.com',
    pass: 'AiDigitals@246',
    target: '/dashboard/ceo',
    description: 'Agency Financials & Executive Command'
  },
  {
    key: 'tl',
    role: 'TL',
    label: 'Team Lead',
    emoji: '🎯',
    email: 'tl@workforce.com',
    pass: 'tl123',
    target: '/dashboard/tl',
    description: 'Task Review, Approvals & Team Oversight'
  },
  {
    key: 'designer',
    role: 'EMPLOYEE',
    label: 'Graphic Designer',
    emoji: '🎨',
    email: 'danish@aidigital.com',
    pass: 'Danish@Ai123',
    target: '/dashboard/employee',
    description: 'Graphic Design & Creative Deliverables'
  },
  {
    key: 'video',
    role: 'EMPLOYEE',
    label: 'Video Editor',
    emoji: '🎬',
    email: 'harshit@aidigital.com',
    pass: 'Harshit@Ai456',
    target: '/dashboard/employee',
    description: 'Social Media & Video Production'
  },
  {
    key: 'developer',
    role: 'EMPLOYEE',
    label: 'Software Dev',
    emoji: '💻',
    email: 'developer@aidigital.com',
    pass: 'Prem@#123',
    target: '/dashboard/employee',
    description: 'Full Stack Engineering Workspace'
  },
  {
    key: 'sales',
    role: 'SALES',
    label: 'Sales Executive',
    emoji: '💼',
    email: 'jennifer@aidigital.com',
    pass: 'Jennifer@Ai123',
    target: '/dashboard/sales',
    description: 'Client Acquisition & Deal Pipeline'
  },
  {
    key: 'client',
    role: 'CLIENT',
    label: 'Client Portal',
    emoji: '🏢',
    email: 'client@aidigital.com',
    pass: '',
    target: '/dashboard/client',
    description: 'Apex Retail Client Deliverables & Proofs'
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(false);
  const [autoLogoutNotice, setAutoLogoutNotice] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  // Sign Up states
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Social Media Marketing');

  // Client states
  const [isClient, setIsClient] = useState(false);
  const [clientEmail, setClientEmail] = useState('');

  const [hasWelcomedNikhil, setHasWelcomedNikhil] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autoLogout')) {
        setAutoLogoutNotice(true);
      }
      const roleParam = params.get('role');
      const tabParam = params.get('tab');
      if (tabParam === 'client' || roleParam === 'client') {
        setIsClient(true);
        setClientEmail('client@aidigital.com');
        setActivePreset('client');
      } else if (roleParam === 'management') {
        applyPreset(CREDENTIAL_PRESETS.find((p) => p.key === 'management'));
      } else if (roleParam === 'admin') {
        applyPreset(CREDENTIAL_PRESETS.find((p) => p.key === 'admin'));
      } else if (roleParam === 'employee') {
        applyPreset(CREDENTIAL_PRESETS.find((p) => p.key === 'designer'));
      }
    }
  }, []);

  // Speech synthesis for CEO Nikhil
  useEffect(() => {
    const trimmedEmail = email.toLowerCase().trim();
    if (trimmedEmail === 'nikhil@aidigital.com' && !hasWelcomedNikhil) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Welcome back Nikhil Sir! Please enter your email and password.');
        const voices = window.speechSynthesis.getVoices();
        const engVoice = voices.find(
          (v) => v.lang.startsWith('en-') && (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))
        );
        if (engVoice) utterance.voice = engVoice;
        window.speechSynthesis.speak(utterance);
        setHasWelcomedNikhil(true);
      }
    } else if (trimmedEmail !== 'nikhil@aidigital.com') {
      setHasWelcomedNikhil(false);
    }
  }, [email, hasWelcomedNikhil]);

  const [currentUser, setCurrentUser] = useState(null);

  // Session check - inform user of existing session without hijack redirect
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        // Silently ignore session check errors
      } finally {
        setCheckingSession(false);
      }
    }
    checkSession();
  }, []);

  const routeUser = (user) => {
    const role = user?.role;
    let target = '/dashboard';

    if (role === 'ADMIN') {
      target = '/admin';
    } else if (role === 'CEO') {
      target = '/dashboard/ceo';
    } else if (role === 'TL') {
      target = '/dashboard/tl';
    } else if (role === 'EMPLOYEE') {
      target = '/dashboard/employee';
    } else if (role === 'SALES') {
      target = '/dashboard/sales';
    } else if (role === 'CLIENT') {
      target = '/dashboard/client';
    }

    if (typeof window !== 'undefined') {
      window.location.href = target;
    } else {
      router.push(target);
    }
  };

  const applyPreset = (preset) => {
    if (!preset) return;
    setActivePreset(preset.key);
    setError('');

    if (preset.role === 'CLIENT') {
      setIsClient(true);
      setIsSignUp(false);
      setClientEmail(preset.email);
    } else {
      setIsClient(false);
      setIsSignUp(false);
      setEmail(preset.email);
      setPassword(preset.pass);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isClient) {
      if (!clientEmail) {
        setError('Please enter your registered client email address.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/auth/client-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: clientEmail })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Client email not recognized.');
          setLoading(false);
          return;
        }
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard/client';
        } else {
          router.push('/dashboard/client');
        }
      } catch (err) {
        setError('Unable to reach server. Please check connection.');
        setLoading(false);
      }
      return;
    }

    if (isSignUp) {
      if (!name || !email || !password || !department) {
        setError('Please fill in all registration fields.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please enter both corporate email and password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Register employee
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, department })
        });

        let regData = {};
        try {
          regData = await res.json();
        } catch (e) {}

        if (!res.ok) {
          setError(regData.error || 'Registration failed.');
          setLoading(false);
          return;
        }

        // Auto login after registration
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) {
          setError('Account created, but automatic login failed. Please sign in manually.');
          setIsSignUp(false);
          setLoading(false);
          return;
        }

        const loginData = await loginRes.json();
        routeUser(loginData.user);
      } else {
        // Standard login
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        let loginData = {};
        try {
          loginData = await res.json();
        } catch (jsonErr) {
          console.error('Non-JSON response from login API:', jsonErr);
        }

        if (!res.ok) {
          setError(loginData.error || `Authentication failed (${res.status}). Verify credentials.`);
          setLoading(false);
          return;
        }

        routeUser(loginData.user);
      }
    } catch (err) {
      console.error('Login fetch exception:', err);
      setError(`Connection error: ${err.message || 'Failed to reach server'}`);
      setLoading(false);
    }
  };

  const selectedPresetObj = CREDENTIAL_PRESETS.find((p) => p.key === activePreset);

  if (checkingSession) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #06b6d4', borderTopColor: 'transparent', borderRadius: '50%', animation: 'wf-spin 0.8s linear infinite' }}></div>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>Securing WorkForce OS connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wf-login-container">
      {/* Fallback Inline Style to guarantee zero unstyled render */}
      <style dangerouslySetInnerHTML={{ __html: `
        .wf-login-container { min-height: 100vh; width: 100%; display: flex; background-color: #f8fafc; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .wf-left-panel { flex: 1.25; min-height: 100vh; position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 60px; color: #ffffff; background-image: url('/office_bg.png'); background-size: cover; background-position: center; }
        .wf-left-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(2, 6, 23, 0.88) 0%, rgba(15, 23, 42, 0.78) 100%); backdrop-filter: blur(2px); z-index: 1; }
        .wf-left-content { position: relative; z-index: 2; display: flex; flex-direction: column; height: 100%; justify-content: space-between; }
        .wf-brand-badge { display: flex; align-items: center; gap: 12px; }
        .wf-brand-icon-box { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #06b6d4, #2563eb); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 24px rgba(6, 182, 212, 0.35); color: #fff; }
        .wf-brand-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #fff; display: flex; align-items: center; gap: 10px; }
        .wf-brand-pill { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: rgba(34, 211, 238, 0.15); border: 1px solid rgba(34, 211, 238, 0.35); color: #67e8f9; font-weight: 700; text-transform: uppercase; }
        .wf-left-hero { max-width: 580px; margin: auto 0; padding: 40px 0; }
        .wf-left-headline { font-size: 44px; font-weight: 800; line-height: 1.15; margin-bottom: 20px; letter-spacing: -0.03em; background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .wf-left-subtext { font-size: 16.5px; line-height: 1.65; color: #cbd5e1; font-weight: 300; margin-bottom: 30px; }
        .wf-left-stats { display: flex; align-items: center; gap: 48px; border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 28px; }
        .wf-right-panel { flex: 1; min-height: 100vh; background-color: #ffffff; display: flex; flex-direction: column; justify-content: space-between; padding: 36px 44px; position: relative; overflow-y: auto; box-shadow: -10px 0 40px rgba(0,0,0,0.05); }
        .wf-quick-credentials-container { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 20px; }
        .wf-cred-chip { display: flex; align-items: center; gap: 8px; padding: 7px 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; cursor: pointer; transition: all 0.15s; }
        .wf-cred-chip:hover { border-color: #2563eb; background: #f0f7ff; }
        .wf-cred-chip.active { border-color: #2563eb; background: #eff6ff; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); }
        .wf-input { width: 100%; padding: 11px 14px 11px 40px; border-radius: 10px; border: 1px solid #cbd5e1; background: #fff; font-size: 14px; color: #0f172a; outline: none; }
        .wf-submit-btn { width: 100%; padding: 13px; background: #1e40af; color: #fff; font-size: 14.5px; font-weight: 700; border-radius: 10px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(30, 64, 175, 0.28); }
        .wf-submit-btn:hover { background: #1e3a8a; }
        @media (max-width: 1024px) { .wf-left-panel { display: none; } .wf-right-panel { padding: 20px; } }
      `}} />

      {/* ====================================================================
          Left Visual Panel: Authentic WorkForce OS Branding & Features
          ==================================================================== */}
      <div className="wf-left-panel">
        <div className="wf-left-overlay"></div>
        <div className="wf-left-content">
          {/* Top Brand Logo */}
          <div className="wf-brand-badge">
            <div className="wf-brand-icon-box">
              <Building2 size={24} />
            </div>
            <div>
              <div className="wf-brand-title">
                WorkForce OS <span className="wf-brand-pill">AI Digital Core</span>
              </div>
            </div>
          </div>

          {/* Center Hero Message */}
          <div className="wf-left-hero">
            <div className="wf-suite-tags">
              <span className="wf-suite-tag">👥 Workforce OS</span>
              <span className="wf-suite-tag">📊 Digital Agency CRM</span>
              <span className="wf-suite-tag">🎯 Automated Tasks</span>
              <span className="wf-suite-tag">🛡️ Unified Admin</span>
            </div>
            <h1 className="wf-left-headline">
              Empower your global team with clarity.
            </h1>
            <p className="wf-left-subtext">
              Manage payroll, schedules, task delegation, and agency client lifecycle in one unified, high-performance platform designed for the modern enterprise.
            </p>
            <a href="/" className="wf-back-website-link">
              &larr; Back to AI Digital Website
            </a>
          </div>

          {/* Bottom Statistics */}
          <div className="wf-left-stats">
            <div>
              <div className="wf-stat-label">System Uptime</div>
              <div className="wf-stat-number">99.99%</div>
            </div>
            <div>
              <div className="wf-stat-label">Enterprise Scale</div>
              <div className="wf-stat-number">10k+ Orgs</div>
            </div>
            <div>
              <div className="wf-stat-label">Offline Mock DB</div>
              <div className="wf-stat-number" style={{ color: '#34d399', fontSize: '22px' }}>
                Active &bull; 0 Latency
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          Right Form Panel: Unified Credentials & Role Routing
          ==================================================================== */}
      <div className="wf-right-panel">
        <div>
          {/* Top Header Row */}
          <div className="wf-right-header">
            <a href="/" className="wf-header-back-link">
              &larr; AI Digital Website
            </a>
            <a href="/admin" className="wf-admin-suite-btn" title="Open Unified Admin Panel">
              <ShieldCheck size={16} />
              Unified Admin Suite &rarr;
            </a>
          </div>

          {/* Mobile Brand Logo */}
          <div className="wf-mobile-brand">
            <div className="wf-brand-icon-box" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
              <Building2 size={20} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              WorkForce OS <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>by AI Digital</span>
            </span>
          </div>



          {/* Mode Tabs: Staff Login / Sign Up / Client Portal */}
          <div className="wf-mode-tabs">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setIsClient(false);
                setError('');
              }}
              className={`wf-mode-tab ${!isSignUp && !isClient ? 'active' : ''}`}
            >
              <Briefcase size={14} />
              Staff Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setIsClient(false);
                setError('');
              }}
              className={`wf-mode-tab ${isSignUp ? 'active' : ''}`}
            >
              <User size={14} />
              New Registration
            </button>
            <button
              type="button"
              onClick={() => {
                setIsClient(true);
                setIsSignUp(false);
                setError('');
              }}
              className={`wf-mode-tab ${isClient ? 'active' : ''}`}
            >
              <Building size={14} />
              Client Portal
            </button>
          </div>

          {/* Form Heading */}
          <div>
            <h2 className="wf-form-heading">
              {isClient ? 'Client Deliverable Portal' : isSignUp ? 'Register Employee Account' : 'Welcome back'}
            </h2>
            <p className="wf-form-subheading">
              {isClient
                ? 'Enter your registered email address to inspect project milestones and deliverables.'
                : isSignUp
                ? 'Self-register into the workforce directory to start your shift and receive tasks.'
                : 'Enter your corporate credentials to access your dedicated workspace.'}
            </p>
          </div>

          {/* Active Session Notice */}
          {currentUser && (
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px',
              color: '#1e40af'
            }}>
              <div>
                <strong>Active Session:</strong> {currentUser.name || currentUser.email} ({currentUser.role})
              </div>
              <button
                type="button"
                onClick={() => routeUser(currentUser)}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Go to Workspace &rarr;
              </button>
            </div>
          )}

          {/* Quick Preset Selector for Easy Testing */}
          {!isSignUp && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Demo Accounts (Click to auto-fill)</span>
                {activePreset && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePreset(null);
                      setEmail('');
                      setPassword('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {CREDENTIAL_PRESETS.map((p) => {
                  const isSelected = activePreset === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => applyPreset(p)}
                      title={`${p.label} (${p.email})`}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        border: isSelected ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? '#1e40af' : '#334155',
                        fontSize: '11.5px',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{p.emoji}</span>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Auto Logout Notice */}
          {autoLogoutNotice && (
            <div className="wf-alert-warning">
              <span style={{ fontSize: '20px' }}>⏰</span>
              <div>
                <strong>Shift Ended at 6:30 PM</strong>
                <p style={{ margin: 0, fontSize: '12px' }}>
                  You were automatically clocked out and signed out for the day.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="wf-alert-error">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', marginTop: '5px', flexShrink: 0 }}></span>
              <div>{error}</div>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="wf-form" autoComplete="off">
            {isClient ? (
              <div className="wf-field-group">
                <label className="wf-field-label">Registered Client Email</label>
                <div className="wf-input-wrapper">
                  <Mail size={16} className="wf-input-icon" />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => {
                      setClientEmail(e.target.value);
                      setActivePreset(null);
                    }}
                    placeholder="e.g. client@aidigital.com"
                    autoComplete="email"
                    required
                    className="wf-input"
                  />
                </div>
              </div>
            ) : (
              <>
                {isSignUp && (
                  <>
                    <div className="wf-field-group">
                      <label className="wf-field-label">Full Name</label>
                      <div className="wf-input-wrapper">
                        <User size={16} className="wf-input-icon" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Alex Rivera"
                          required
                          className="wf-input"
                        />
                      </div>
                    </div>

                    <div className="wf-field-group">
                      <label className="wf-field-label">Assigned Department</label>
                      <div className="wf-input-wrapper">
                        <Building size={16} className="wf-input-icon" />
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="wf-select"
                        >
                          <option value="Social Media Marketing">Social Media Marketing</option>
                          <option value="Video Editing / Content Creator">Video Editing / Content Creator</option>
                          <option value="Graphics">Graphics & UI/UX</option>
                          <option value="Software Development">Software Development</option>
                          <option value="Sales">Sales & Business Growth</option>
                          <option value="Paid Ads & PPC">Paid Ads & PPC</option>
                          <option value="HR & Operations">HR & Operations</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="wf-field-group">
                  <label className="wf-field-label">
                    {isSignUp ? 'Work Email Address' : 'Corporate Email Address'}
                  </label>
                  <div className="wf-input-wrapper">
                    <Mail size={16} className="wf-input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setActivePreset(null);
                      }}
                      placeholder="e.g. danish@aidigital.com"
                      autoComplete="off"
                      required
                      className="wf-input"
                    />
                  </div>
                </div>

                <div className="wf-field-group">
                  <div className="wf-field-label-row">
                    <label className="wf-field-label">Password</label>
                    {!isSignUp && (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Required
                      </span>
                    )}
                  </div>
                  <div className="wf-input-wrapper">
                    <Lock size={16} className="wf-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setActivePreset(null);
                      }}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      required
                      className="wf-input wf-input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="wf-eye-btn"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <label className="wf-checkbox-row">
                    <input type="checkbox" defaultChecked className="wf-checkbox" />
                    <span>Remember my session on this device</span>
                  </label>
                )}
              </>
            )}

            <button type="submit" disabled={loading} className="wf-submit-btn">
              {loading ? (
                <>
                  <div className="wf-spinner"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    {isClient
                      ? 'Access Client Deliverables'
                      : isSignUp
                      ? 'Complete Registration & Sign In'
                      : 'Continue to Workspace'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="wf-right-footer">
          <button
            type="button"
            className="wf-footer-btn"
            onClick={() => alert('English (US) language selected.')}
          >
            <Globe size={14} />
            English (US)
          </button>
          <button
            type="button"
            className="wf-footer-btn"
            onClick={() =>
              alert('Support contact: support@aidigital.biz\nPhone: +91-9096090701\nOffice: Camp, Pune')
            }
          >
            <HelpCircle size={14} />
            Help & Documentation
          </button>
          <span>&copy; 2026 AI Digital WorkForce OS</span>
        </footer>
      </div>
    </div>
  );
}
