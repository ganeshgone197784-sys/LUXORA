'use client';
import ProductModal from './ProductModal';
import ShoppingCart from './ShoppingCart';
import Wishlist from './Wishlist';
import { useStore } from './StoreProvider';

export default function Drawers() {
  const { drawer, modalId, closeAll } = useStore();
  return (
    <>
      <div className={`ov${drawer || modalId !== null ? ' open' : ''}`} onClick={closeAll} />
      <aside className={`dr${drawer ? ' open' : ''}`}>
        <header>
          <h3>{drawer === 'wish' ? 'Wishlist' : 'Your Bag'}</h3>
          <button onClick={closeAll} aria-label="Close" style={{ fontSize: 26 }}>×</button>
        </header>
        {drawer === 'wish' ? <Wishlist /> : <ShoppingCart />}
      </aside>
      <ProductModal />
    </>
  );
}
