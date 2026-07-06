import React from 'react'
import { ToastContainer } from 'react-toastify'
import Navbar from './Navbar'


type props = {
    children : React.ReactNode;
}

const wrapper = ({children} : props) => {


  return (
    <div>
      <Navbar />
      <ToastContainer
      position='top-right'
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
       />
        <div className='px-5 md:px-[10%] mt-8 mb-10'>
            { children }
        </div>
    </div>
  )
}

export default wrapper