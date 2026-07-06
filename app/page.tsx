'use client'
import Wrapper from './components/wrapper'
import ProtectedRoute from "./components/ProtectedRoute"
import { useUser } from "@clerk/nextjs"
import ProductOverview from './components/ProductOverview'
import CategoryChart from './components/CategoryChart'
import RecentTransaction from './components/RecentTransaction'
import StockSommaryTable from './components/StockSommaryTable'




export default function Home() {

  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress as string



  return (
   <ProtectedRoute>
      <Wrapper> 
      
          <div className='flex flex-col md:flex-row'> 
             <div className='md:w-2/3'>
                 <ProductOverview email={email} />
                 <CategoryChart email={email} />
                 <RecentTransaction email = {email} />
             </div>
             <div className='md:ml-4 md:mt-0 mt-4 w-1/3'>
                 <StockSommaryTable email = {email} />
             </div>
          </div>
      </Wrapper>
   </ProtectedRoute> 
  );
}  