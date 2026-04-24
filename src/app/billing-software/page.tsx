import React from 'react'
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'

function page() {
  return (
    <div>
      <Navbar />
      {/* hero section */}
      <div className='lg:p-20 p-10'>
        <div className='flex lg:flex-row flex-col-reverse gap-20 justify-between p-5'>
          <div className='space-y-5'>
            <h1 className='lg:text-6xl text-2xl font-bold'>GST Billing Software <br className='hidden lg:block md:block' /> for Small Businesses in <br className='hidden lg:block md:block' /> India</h1>
            <p>Manage your business professionally with Vyapar, India’s<br className='hidden lg:block md:block' /> leading small business software for billing, inventory, and<br className='hidden lg:block md:block' /> accounting. Join 1.5 Cr+ satisfied SMEs in India who trust<br className='hidden lg:block md:block' /> Vyapar.</p>
            <button className='w-60 bg-blue-500 py-3 text-white rounded-lg font-semibold'>Download BissBill Now!</button>
          </div>
          <div>
            <img src="/billing-software-hero.png" alt="" />
          </div>
        </div>
        <div className='flex lg:flex-row flex-col-reverse gap-20 items-center justify-between p-5'>
          <div>
            <img src="/gst-page-1.png" alt="" height={500} width={500} />
          </div>
          <div className='space-y-5 lg:w-1/2'>
            <h1 className='lg:text-4xl text-2xl font-bold'>Create GST Bills online<br className='hidden lg:block md:block' /> and share them with<br className='hidden lg:block md:block' /> customers</h1>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur, quidem rem architecto incidunt molestias nemo culpa earum cupiditate veniam error nam repellat itaque cumque. Dolorem nam minima repellendus iste, sequi neque vero, suscipit distinctio mollitia quam adipisci est perspiciatis tenetur, quaerat ab similique exercitationem velit labore minus! Perspiciatis, iusto quae?</p>
          </div>
        </div>
        <div className='flex lg:flex-row flex-col items-center gap-20 justify-between p-5'>
          <div className='space-y-5'>
            <h1 className='lg:text-6xl text-2xl font-bold'>Manage Small Business Inventory Seamlessly</h1>
            <p>Vyapar brings the finest inventory management software with incredibly effective features. It helps improve business performance. Using the Vyapar app features like business reports, you can track your business’s sales. It will help you understand how effectively you have managed your inventory.</p>
          </div>
          <div>
            <img src="/manage-img.png" alt="" />
          </div>
        </div>
        <div className='flex lg:flex-row flex-col-reverse items-center gap-20 justify-between p-5'>
          <div className='lg:w-1/2'>
            <img src="/send-pay.png" alt="" />
          </div>
          <div className='lg:w-1/2 space-y-5'>
            <h1 className='lg:text-6xl text-2xl font-bold'>Send Payments </h1>
            <p>Vyapar makes it easy to send payments and track transactions with its user-friendly interface. Stay on top of your cash flow and maintain accurate records of all financial activities.</p>
          </div>
        </div>
        <div className='flex lg:flex-row flex-col items-center gap-20 justify-between'>
          <div className='lg:w-1/2 space-y-5'>
            <h1 className='lg:text-6xl text-2xl font-bold'>Track Your Business Performance</h1>
            <p>Vyapar provides comprehensive business analytics and reporting features to help you monitor your sales, expenses, and overall financial health. Make data-driven decisions to grow your business effectively.</p>
          </div>
          <div className='lg:w-1/2'>
            <img src="/filing-img.png" alt="" />
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  )
}

export default page