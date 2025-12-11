import { MapPin } from "lucide-react";
import Image from '../assets/About_image.jpg';

const About = () => {
  return (
    <div className="bg-gray-50 pb-20 py-10 mb-[-20px] md:mb-20" id="about">
      {/* Hero Section */}
      <section className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5\4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 mb-8">
              <MapPin className="w-4 h-4" />
              <span>Based in Italy</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-gray-900 mb-6 leading-tight">
              About Me
            </h1>

            <div className="w-24 h-1 bg-gray-900 mx-auto mb-12"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Text Content - 60% */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed">
                <p>
                  I&apos;m an Italian-based freelance photographer with a deep
                  hunger for travelling to new places and learning new
                  languages, constantly dancing with the inconsistency that
                  prevents me from actually learning any of them.
                </p>
                
                <p>
                  At the beginning of my photography journey landscapes were
                  my main subjects and I stuck with it for a few years. Then a
                  shift happened and people&apos;s mind and soul got me more
                  and more fascinated, which caused my lens to move toward
                  portrait and street photography—and my readings to be mainly
                  psychology and philosophy themed.
                </p>
                
                <p>
                  During middle school I was introduced to photography by my
                  father, who never gave up his life-long passion for this art
                  and tried to pass down to me part of his extensive knowledge
                  (which my teenager stubbornness promptly rejected).
                </p>
                
                <p>
                  Fast forward a few years, I am now devoted to being a
                  conscious witness of the beauty inside and outside of us and
                  hopefully make you aware of the wonders we often overlook.
                  With my ever-evolving life plans and interests, I find
                  myself consistent in my wish to provide soulful stills that
                  will accompany my clients and my loved ones through their
                  journey, as a sweet reminder to allow some blissfulness into
                  our heart.
                </p>
              </div>
            </div>

            {/* Image - 40% */}
            <div className="lg:col-span-2 order-first lg:order-last">
              <div className="relative">
                <img
                  src={Image}
                  alt="Photographer portrait"
                  className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;