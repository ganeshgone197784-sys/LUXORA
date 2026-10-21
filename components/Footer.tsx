'use client';
import { asset } from '@/lib/asset';
import { useStore } from './StoreProvider';

export default function Footer() {
  const { showFilter, notify } = useStore();
  const policy = (name: string) => (
    <li className="pl" onClick={() => notify(`${name} page will be added in the next phase`)}>{name}</li>
  );
  return (
    <footer>
      <div className="wrap">
        <div className="fg">
          <div><img alt="LUXORA" src={asset('/logo.webp')} /><p>ELEGANCE BEYOND ORDINARY</p></div>
          <div><h4>SHOP</h4><ul>
            <li><a href="#shop" onClick={() => showFilter('Men')}>Men&apos;s Collection</a></li>
            <li><a href="#shop" onClick={() => showFilter('Women')}>Women&apos;s Collection</a></li>
            <li><a href="#shop" onClick={() => showFilter('New')}>New Arrivals</a></li>
          </ul></div>
          <div><h4>HELP</h4><ul>{policy('Shipping Policy')}{policy('Returns Policy')}{policy('Privacy Policy')}{policy('Terms & Conditions')}</ul></div>
          <div><h4>CONTACT</h4><ul><li>hello@luxora.example</li><li>+91 00000 00000</li><li>Instagram · Facebook · Pinterest</li></ul></div>
        </div>
        <p className="note" style={{ marginTop: 30 }}>© 2026 LUXORA. Demo storefront — sample products, not real inventory.</p>
      </div>
    </footer>
  );
}
