
import Navbar from './components/Navbar';
import Carousel from './components/Banner';
import AboutSection from './components/AboutSection';
import PortfolioSection from './components/PortfolioSection';
import Footer from './components/Footer';
import Contact from './components/Contact';


function App() {


  return (
    <div className="min-h-screen bg-gray-50 font-['Montserrat']">
      <Navbar 
      />
      
      <Carousel  />
      
      <AboutSection />
      
      <PortfolioSection  />
      <Contact/>
      <Footer />
    </div>
  );
}

export default App;