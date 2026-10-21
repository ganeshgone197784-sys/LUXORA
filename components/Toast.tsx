'use client';
import { useStore } from './StoreProvider';

export default function Toast() {
  const { toast, toastOn } = useStore();
  return <div id="toast" className={toastOn ? 'show' : ''} role="status">{toast}</div>;
}
