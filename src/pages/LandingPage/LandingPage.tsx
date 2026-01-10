import React, { useEffect, useState } from 'react'
import Navbar from "../../components/Navbar/Navbar"
import './landingpage.css'
import Footer from '../../components/Footer/Footer'


const LandingPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsLoggedIn(!!token)
  }, [])

  return (
    <div className='landing-page'>
      <Navbar />

      {/* Hero Section with Banner */}
      <div className='hero-section relative'>
        <div className='img-cont'>
          <img src='/images/banner1.jpeg' alt='Hero Banner' />
          <div className='hero-overlay'></div>
        </div>
        <div className='hero-content'>
          <h1 className='hero-title animate-fadeInUp'>
            Welcome to <span className='text-gradient'>AUFT</span>
          </h1>
          <p className='hero-subtitle animate-fadeInUp-delay'>
            Experience the future of digital innovation
          </p>
          <div className='hero-buttons animate-fadeInUp-delay-2'>
            {!isLoggedIn ? (
              <>
                <a href='/signup' className='btn-primary'>
                  Get Started
                  <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </a>
              </>
            ) : (
              <a href='/calendar' className='btn-primary'>
                Go to Dashboard
                <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </a>
            )}
            <a href='#features' className='btn-secondary'>
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id='features' className='bg-slate-900 py-12 px-4 sm:px-6 sm:py-16 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            What's <span className='text-gradient'>AUFT</span> ?
          </h2>
          <p className='text-xl text-blue-200 max-w-2xl mx-auto'>
            Discover powerful features designed to elevate your experience
          </p>
        </div>

        <div className='feature-card-wrapper'>
          <div className='feature-card bg-slate-800 border border-slate-700'>
            <div className='feature-content'>
              <div className='feature-icon'>
                <svg className='w-12 h-12 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              <h3 className='feature-title text-white'>Lightning Fast</h3>
              <p className='feature-description text-blue-200'>
                Experience blazing-fast performance with our cutting-edge technology.
                Built for speed and efficiency, AUFT delivers results in real-time,
                ensuring you stay ahead of the competition.
              </p>
              <ul className='feature-list text-blue-200'>
                <li>⚡ Real-time processing</li>
                <li>🚀 Optimized performance</li>
                <li>💡 Smart algorithms</li>
              </ul>
            </div>
            <div className='feature-image'>
              <img
                alt='Feature showcase'
                src='https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png'
                className='rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500'
              />
            </div>
          </div>
        </div>

        {/* Second Feature Section - Reversed */}
        <div className='mt-8'>
          <div className='feature-card-wrapper reverse'>
            <div className='feature-card bg-slate-800 border border-slate-700'>
              <div className='feature-image'>
                <img
                  alt='Advanced features'
                  src='https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png'
                  className='rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500'
                />
              </div>
              <div className='feature-content'>
                <div className='feature-icon bg-gradient-to-br from-purple-500 to-pink-500'>
                  <svg className='w-12 h-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                  </svg>
                </div>
                <h3 className='feature-title text-white'>Secure & Reliable</h3>
                <p className='feature-description text-blue-200'>
                  Your data security is our top priority. With enterprise-grade encryption
                  and robust security measures, you can trust AUFT to keep your information
                  safe and protected at all times.
                </p>
                <ul className='feature-list text-blue-200'>
                  <li>🔒 End-to-end encryption</li>
                  <li>🛡️ Advanced security protocols</li>
                  <li>✅ 99.9% uptime guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className='cta-section'>
        <div className='max-w-4xl mx-auto text-center px-4'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Ready to Get Started?
          </h2>
          <p className='text-xl text-white/90 mb-8'>
            Join thousands of satisfied users and transform your experience today
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            {!isLoggedIn ? (
              <>
                <a href='/signup' className='btn-cta-primary'>
                  Start Free Trial
                </a>
                <a href='/calendar' className='btn-cta-secondary'>
                  View Demo
                </a>
              </>
            ) : (
              <a href='/calendar' className='btn-cta-primary'>
                Go to Dashboard
              </a>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LandingPage
