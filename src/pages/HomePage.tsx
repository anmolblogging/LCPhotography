import React from 'react'
import Banner from "../components/Banner";
import PortfolioSection from "../components/PortfolioSection";

function HomePage() {
  return (
    <div>

        <Banner />
        <div className='bg-gray-50 md:py-20'></div>
      <PortfolioSection />
    </div>
  )
}

export default HomePage