import Hero from "../../components/home/Hero";
import ProductCarousel from "../../components/products/ProductCarousel";

export default function Home() {
  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Hero */}
      <Hero />

      {/* Carrusel – ocupa el resto del espacio */}
      <div id="productos-carousel" className="flex-1 w-full">
        <ProductCarousel />
      </div>
    </div>
  );
}