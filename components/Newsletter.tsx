'use client';
import { useState, type FormEvent } from 'react';
import { useStore } from './StoreProvider';

export default function Newsletter() {
  const { notify } = useStore();
  const [email, setEmail] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); setEmail(''); notify('Thank you — demo signup only'); };
  return (
    <section>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="eyebrow">Newsletter</div>
        <h2>Join the LUXORA list</h2>
        <p>First access to new arrivals and private edits.</p>
        <form className="nl" onSubmit={submit}>
          <input type="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn p">SUBSCRIBE</button>
        </form>
        <p className="note">Demo only — emails are not stored or sent anywhere.</p>
      </div>
    </section>
  );
}
