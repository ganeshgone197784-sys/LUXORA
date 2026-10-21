'use client';
import { asset } from '@/lib/asset';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function BrandIntro() {
  const [show, setShow] = useState(true);
  const [out, setOut] = useState(false);
  const done = useRef(false);
  const video = useRef<HTMLVideoElement>(null);

  const end = useCallback(() => {
    if (done.current) return;
    done.current = true;
    try { sessionStorage.setItem('lx_intro', '1'); } catch { /* ignore */ }
    setOut(true);
    document.body.classList.remove('lock');
    setTimeout(() => { setShow(false); video.current?.pause(); }, 1000);
  }, []);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem('lx_intro'); } catch { /* ignore */ }
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      done.current = true;
      setShow(false);
      return;
    }
    document.body.classList.add('lock');
    const v = video.current;
    if (v) { v.muted = true; v.play()?.catch(end); }
    const safety = setTimeout(end, 11000); // never trap the user
    return () => clearTimeout(safety);
  }, [end]);

  if (!show) return null;
  return (
    <div id="intro" className={out ? 'out' : ''}>
      <video ref={video} src={asset('/intro.mp4')} muted playsInline autoPlay preload="auto" onEnded={end} onError={end} />
      <button id="skip" onClick={end}>SKIP INTRO</button>
    </div>
  );
}
