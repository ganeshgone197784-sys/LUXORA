import BrandIntro from '@/components/BrandIntro';
import Collections from '@/components/Collections';
import Drawers from '@/components/Drawers';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Newsletter from '@/components/Newsletter';
import ProductGrid from '@/components/ProductGrid';
import StoreProvider from '@/components/StoreProvider';
import Toast from '@/components/Toast';

export default function Home() {
  return (
    <StoreProvider>
      <BrandIntro />
      <Navbar />
      <main id="top">
        <Hero />
        <Collections />
        <ProductGrid />
        <section className="story">
          <div className="wrap">
            <div className="eyebrow">Our Story</div>
            <h2>Modern luxury, quietly confident</h2>
            <p>LUXORA is a contemporary fashion house for men and women, built around clean silhouettes, considered details and timeless style.</p>
            <p>Every piece is designed to move effortlessly from day to evening, and to be worn season after season.</p>
          </div>
        </section>
        <Newsletter />
      </main>
      <Footer />
      <Drawers />
      <Toast />
    </StoreProvider>
  );
}
