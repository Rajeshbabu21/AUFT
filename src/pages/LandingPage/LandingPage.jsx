import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import "./landingpage.css"
import Footer from '../../components/Footer/Footer'

const LandingPage = () => {
  return (
    <div>
      <Navbar />

      <div className='img-cont'>
        <img src='/images/banner.jpg' alt='' />
      </div>

      <div className='mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8'>
       {/* <h1>WHAT'S A-LIGUE ? </h1> */}
        <div className='relative isolate overflow-hidden px-6 pt-16 bg-gree  sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-30 lg:px-24 lg:pt-0'>
          <div className='mx-auto max-w-lg text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left'>
            <h2 className=' font-semibold tracking-tight heading  sm:text-4xl'>
              WHAT'S AUFT ?
            </h2>
            <p className='mt-6 text-lg/8 text-pretty text-gray-900'>
              Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
              Malesuada adipiscing sagittis vel nulla. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Earum hic officia reprehenderit
              tenetur ducimus. Maxime omnis deserunt id suscipit voluptatem
              asperiores at impedit qui delectus ut a ipsa quaerat, officia ex
              rerum consequuntur temporibus placeat eius iure repellat corporis
              natus illum. Doloribus consectetur voluptate veritatis nesciunt
              nam sapiente non neque?
            </p>
          </div>
          <div className='relative mt-16 h-30 lg:mt-8'>
            <img
              alt='App screenshot'
              src='https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png'
              width={400}
              height={400}
              className='absolute top-45 left-0  max-w-none rounded-md bg-white/5 ring-1 ring-white/10'
            />
          </div>
        </div>
      </div>

      {/* second */}

      <div className='mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8'>
        <div className='relative isolate overflow-hidden px-6 pt-16   sm:rounded-3xl sm:px-16 md:pt-24 lg:flex flex-row-reverse lg:gap-x-0 lg:px-24 lg:pt-0'>
          <div className=' mt-16 h-30 lg:mt-8'>
            <img
              alt='App screenshot'
              src='https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png'
              width={400}
              height={400}
              className='absolute top-55 left-15  max-w-none rounded-md bg-white/5 ring-1 ring-white/10'
            />
          </div>
          <div className='mx-auto max-w-lg text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left'>
            <h2 className=' font-semibold tracking-tight heading  sm:text-4xl'>
              WHAT'S AUFT ?
            </h2>
            <p className='mt-6 text-lg/8 text-pretty text-gray-900'>
              Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
              Malesuada adipiscing sagittis vel nulla. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Earum hic officia reprehenderit
              tenetur ducimus. Maxime omnis deserunt id suscipit voluptatem
              asperiores at impedit qui delectus ut a ipsa quaerat, officia ex
              rerum consequuntur temporibus placeat eius iure repellat corporis
              natus illum. Doloribus consectetur voluptate veritatis nesciunt
              nam sapiente non neque?
            </p>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  )
}

export default LandingPage