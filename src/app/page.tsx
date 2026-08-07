import AgeGate from "@/components/AgeGate";
import Header from "@/components/Header";
import ScrollStoryHero from "@/components/ScrollStoryHero";
import FlavorPicker from "@/components/FlavorPicker";
import AttributeStory from "@/components/AttributeStory";
import SignatureSpotlight from "@/components/SignatureSpotlight";
import NutritionFacts from "@/components/NutritionFacts";
import BrandSection from "@/components/BrandSection";
import RelatedProducts from "@/components/RelatedProducts";
import PrerollsShowcase from "@/components/PrerollsShowcase";
import WellnessTeaser from "@/components/WellnessTeaser";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AgeGate />
      <Header />
      <main id="top" className="flex-1">
        <ScrollStoryHero />
        <FlavorPicker />
        <AttributeStory />
        <SignatureSpotlight />
        <NutritionFacts />
        <BrandSection />
        <RelatedProducts />
        <PrerollsShowcase />
        <FAQ />
        <WellnessTeaser />
      </main>
      <Footer />
    </>
  );
}
