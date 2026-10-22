'use client';
import { useState, type CSSProperties, type FormEvent } from 'react';
import MyOrders from './MyOrders';
import { useStore } from './StoreProvider';

const input: CSSProperties = {
  width: '100%', padding: 12, margin: '6px 0 14px', background: 'transparent',
  color: 'inherit', border: '1px solid var(--ln)', font: 'inherit',
};

export default function AuthModal() {
  const { authOpen, setAuthOpen, user, backendOn, signIn, signUp, signOut } = useStore();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const close = () => { setAuthOpen(false); setMsg(null); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const r = mode === 'in' ? await signIn(email.trim(), password) : await signUp(name.trim(), email.trim(), password);
    setBusy(false);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok && mode === 'in') { setPassword(''); setTimeout(close, 900); }
  };

  const fullName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name;

  return (
    <div className={`md${authOpen ? ' open' : ''}`} style={authOpen ? { background: '#000a' } : undefined}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="mc" style={{ gridTemplateColumns: '1fr', maxWidth: 420 }}>
        <button className="x" onClick={close} aria-label="Close">×</button>
        <div className="info">
          <div className="eyebrow">LUXORA Account</div>
          {!backendOn ? (
            <>
              <h2>Demo mode</h2>
              <p>The store is not connected to the database yet, so login is unavailable.</p>
            </>
          ) : user ? (
            <>
              <h2>Welcome{fullName ? `, ${fullName}` : ''}</h2>
              <p style={{ margin: '8px 0 18px' }}>Signed in as {user.email}</p>
              <button className="btn p" style={{ width: '100%' }} onClick={async () => { await signOut(); close(); }}>LOG OUT</button>
              {authOpen && <MyOrders userId={user.id} />}
            </>
          ) : (
            <form onSubmit={submit}>
              <h2>{mode === 'in' ? 'Log in' : 'Create account'}</h2>
              {mode === 'up' && (
                <>
                  <label>Full name</label>
                  <input style={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required minLength={2} />
                </>
              )}
              <label>Email</label>
              <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              <label>Password</label>
              <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'in' ? 'current-password' : 'new-password'} required minLength={8} />
              {msg && <p style={{ color: msg.ok ? 'var(--g)' : '#d9534f', marginBottom: 12, fontSize: 13 }}>{msg.text}</p>}
              <button className="btn p" style={{ width: '100%' }} disabled={busy}>{busy ? 'PLEASE WAIT…' : mode === 'in' ? 'LOG IN' : 'SIGN UP'}</button>
              <p className="note" style={{ textAlign: 'center' }}>
                {mode === 'in' ? 'New to LUXORA? ' : 'Already have an account? '}
                <a href="#" style={{ color: 'var(--g)' }} onClick={(e) => { e.preventDefault(); setMode(mode === 'in' ? 'up' : 'in'); setMsg(null); }}>
                  {mode === 'in' ? 'Create an account' : 'Log in'}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
