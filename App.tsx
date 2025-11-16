
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureSection from './components/FeatureSection';
import Showcase from './components/Showcase';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { featureData } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <div id="features" className="relative z-10 bg-gray-950/80 backdrop-blur-sm">
          {featureData.map((feature, index) => (
            <FeatureSection
              key={index}
              id={feature.id}
              title={feature.title}
              description={feature.description}
              imageUrl={feature.imageUrl}
              imageAlt={feature.imageAlt}
              reverse={index % 2 !== 0}
            />
          ))}
          <Showcase />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const FinalCTA: React.FC = () => (
  <section className="py-20 sm:py-32 text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white">
        E agora, qual app vamos criar?
      </h2>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Comece agora e transforme sua ideia em realidade em minutos!
      </p>
      <div className="mt-8">
        <a
          href="#"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Começar Agora
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </section>
);

export default App;
