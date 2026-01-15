import React, { useEffect, useState } from 'react'
import Navbar from "../../components/Navbar/Navbar"
import './landingpage.css'
import Footer from '../../components/Footer/Footer'
import PageMeta from "../../components/common/PageMeta";



const LandingPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [mutedStates, setMutedStates] = useState<{[key: number]: boolean}>({0: true, 1: true, 2: true, 3: true})
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null)
  const carouselRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsLoggedIn(!!token)
  }, [])

  const toggleMute = (index: number) => {
    setMutedStates(prev => ({...prev, [index]: !prev[index]}))
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    let scrollAmount = 0
    const interval = setInterval(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth
      scrollAmount += 350
      
      if (scrollAmount >= maxScroll) {
        scrollAmount = 0
      }
      
      carousel.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='landing-page'>

      <PageMeta
        title="AUFT"
        description="A-Ligue Football Tournament Management System"
      />

     
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
              A - Ligue  <span className='text-gradient'>2026</span>
            </h2>
            <p className='text-xl text-blue-200 max-w-2xl mx-auto'>
              Discover powerful features designed to elevate your experience
            </p>
          </div>
          {/* feature section */}
          <div className='bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300'>

            <img
              src="/images/banner.jpg"
              alt="Feature showcase"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className='p-6 sm:p-8 md:p-10'>
              <div className='flex items-center mb-4'>
                <div className='bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl mr-4'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <h3 className='text-2xl sm:text-3xl font-bold text-white'>Predict the <span className='text-gradient'>2026</span> Season ? </h3>
              </div>
              <p className='text-blue-200 text-base sm:text-lg mb-6 leading-relaxed'>
                From opening kick-off to the final whistle, track team form and predict match outcomes across the entire season.
              </p>
            </div>
          </div>
        </div>
      </div>

      

      {/* Call to Action Section */}
      <div className='cta-section'>
        <div className='max-w-9xl mx-auto text-center px-4'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Best Movements from <span className='text-gradient'>
              A-Ligue 
              </span>
          </h2>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center p-6 rounded-xl w-full overflow-x-auto snap-x snap-mandatory' ref={carouselRef} style={{scrollBehavior: 'smooth'}}>


            {/* Video Card 2 */}
            <div 
              className='flex-shrink-0 w-full sm:w-90 bg-slate-800 border  border-slate-700  rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 snap-center'
              onMouseEnter={() => setHoveredVideo(0)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className='relative bg-black w-full h-[500px]'>
                <video
                  src='https://ik.imagekit.io/4uskfr8sji/1.mp4'
                  className='w-full h-full object-cover'
                  muted={mutedStates[0]}
                  loop
                  playsInline
                  onLoadedMetadata={(e) => e.currentTarget.volume = 0.3}
                  ref={(el) => {
                    if (el) {
                      if (hoveredVideo === 0) {
                        el.play()
                      } else {
                        el.pause()
                      }
                    }
                  }}
                />
                {hoveredVideo !== 0 && (
                  <div className='absolute inset-0 bg-cover bg-center' style={{backgroundImage: "url('/images/banner1.jpeg')"}}>
                  </div>
                )}
                <button 
                  onClick={() => toggleMute(0)}
                  className='absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10'
                >
                  {mutedStates[0] ? (
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z' clipRule='evenodd' />
                    </svg>
                  ) : (
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z' clipRule='evenodd' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div 
              className='flex-shrink-0 w-full sm:w-80 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 snap-center'
              onMouseEnter={() => setHoveredVideo(1)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className='relative bg-black w-full h-[500px]'>
                <video
                  src="https://ik.imagekit.io/4uskfr8sji/2.mp4"
                  className='w-full h-full object-cover'
                  muted={mutedStates[1]}
                  loop
                  playsInline
                  onLoadedMetadata={(e) => e.currentTarget.volume = 0.3}
                  ref={(el) => {
                    if (el) {
                      if (hoveredVideo === 1) {
                        el.play()
                      } else {
                        el.pause()
                      }
                    }
                  }}
                />
                {hoveredVideo !== 1 && (
                  <div className='absolute inset-0 bg-cover bg-center' style={{backgroundImage: "url('/images/banner1.jpeg')"}}>
                  </div>
                )}
                <button 
                  onClick={() => toggleMute(1)}
                  className='absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10'
                >
                  {mutedStates[1] ? (
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z' clipRule='evenodd' />
                    </svg>
                  ) : (
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z' clipRule='evenodd' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div 
              className='flex-shrink-0 w-full sm:w-80 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 snap-center'
              onMouseEnter={() => setHoveredVideo(2)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className='relative bg-black w-full h-[500px]'>
                <video
                  src='https://ik.imagekit.io/4uskfr8sji/3.mp4'
                  className='w-full h-full object-cover'
                  muted={mutedStates[2]}
                  loop
                  playsInline
                  onLoadedMetadata={(e) => e.currentTarget.volume = 0.3}
                  ref={(el) => {
                    if (el) {
                      if (hoveredVideo === 2) {
                        el.play()
                      } else {
                        el.pause()
                      }
                    }
                  }}
                />
                {hoveredVideo !== 2 && (
                  <div className='absolute inset-0 bg-cover bg-center' style={{backgroundImage: "url('/images/banner1.jpeg')"}}>
                  </div>
                )}
                <button 
                  onClick={() => toggleMute(2)}
                  className='absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10'
                >
                  {mutedStates[2] ? (
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z' clipRule='evenodd' />
                    </svg>
                  ) : (
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z' clipRule='evenodd' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Video Card 3 */}
            <div 
              className='flex-shrink-0 w-full sm:w-80 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 snap-center'
              onMouseEnter={() => setHoveredVideo(3)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className='relative bg-black w-full h-[500px]'>
                <video
                  src='https://ik.imagekit.io/4uskfr8sji/4.mp4'
                  className='w-full h-full object-cover'
                  muted={mutedStates[3]}
                  loop
                  playsInline
                  onLoadedMetadata={(e) => e.currentTarget.volume = 0.3}
                  ref={(el) => {
                    if (el) {
                      if (hoveredVideo === 3) {
                        el.play()
                      } else {
                        el.pause()
                      }
                    }
                  }}
                />
                {hoveredVideo !== 3 && (
                  <div className='absolute inset-0 bg-cover bg-center' style={{backgroundImage: "url('/images/banner1.jpeg')"}}>
                  </div>
                )}
                <button 
                  onClick={() => toggleMute(3)}
                  className='absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10'
                >
                  {mutedStates[3] ? (
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z' clipRule='evenodd' />
                    </svg>
                  ) : (
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z' clipRule='evenodd' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Video Card 4 */}
            
          </div>
        </div>
      </div>
<div className="cta-section flex justify-center">
  <div className="max-w-3xl w-full bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
    
    <img
      src="/images/badge.png"
      alt="Feature showcase"
      className="w-full h-20 sm:h-28 x md:h-26 object-cover hover:scale-105 transition-transform duration-500"
    />

  </div>
</div>



      <Footer />
    </div>
  )
}

export default LandingPage
