import { ProductOverviewStats } from '@/Types'
import { getProductOverviewStats } from '@/lib/actions'
import React, { useEffect, useState } from 'react'
import { Box, ShoppingCart, Tag } from 'lucide-react'



const ProductOverview = ({email}: {email : string}) => {
  
    const [stats, setStats] = useState<ProductOverviewStats | null>(null)

    const fetchStats = async () => {
        try {
            if(email){
                const result = await getProductOverviewStats(email)
                if(result){
                    setStats(result)
                }
            }
            
        } catch (error) {
            console.error(error)
        }
    }

    function formatNumber(value : number): string {
        if(value >= 1000000 ) return (value / 1000000).toFixed(1) + "M";
        if(value >= 1000 ) return (value / 1000).toFixed(1) + "K";
        return value.toString();
    }

    useEffect(() => {
       if(email)
        fetchStats()
    }, [email])
  
    return (
    <div>
        {stats ? (
            <div className='grid grid-cols-2 gap-4'>

                 <div className='border-2 p-4 border-base-200 rounded-3xl'>
                     <p className='stat-title'>Produits en stock</p>
                     <div className='flex justify-between items-center'>
                        <div className='stat-value'>
                            {stats.totalProduct}
                        </div>
                        <div className='bg-primary/25 p-3 rounded-3xl'>
                            <Box className='w-5 h-4 text-primary text-3xl'/>
                        </div>
                     </div>
                 </div>

                  <div className='border-2 p-4 border-base-200 rounded-3xl'>
                     <p className='stat-title'>Numbre de categories</p>
                     <div className='flex justify-between items-center'>
                        <div className='stat-value'>
                            {stats.totalCategories}
                        </div>
                        <div className='bg-primary/25 p-3 rounded-3xl'>
                            <Tag className='w-5 h-4 text-primary text-3xl'/>
                        </div>
                     </div>
                 </div>

                 <div className='border-2 p-4 border-base-200 rounded-3xl'>
                     <p className='stat-title'>Valeurs du stock</p>
                     <div className='flex justify-between items-center'>
                        <div className='stat-value'>
                            {formatNumber(stats.stockValue) } $
                        </div>
                        <div className='bg-primary/25 p-3 rounded-3xl'>
                            <Tag className='w-5 h-4 text-primary text-3xl'/>
                        </div>
                     </div>
                 </div>

                 <div className='border-2 p-4 border-base-200 rounded-3xl'>
                     <p className='stat-title'>Total des transaction</p>
                     <div className='flex justify-between items-center'>
                        <div className='stat-value'>
                            {stats.totalTransactions}
                        </div>
                        <div className='bg-primary/25 p-3 rounded-3xl'>
                            <ShoppingCart className='w-5 h-4 text-primary text-3xl'/>
                        </div>
                     </div>
                 </div>

            </div>
        ):(
            <div className='flex justify-center items-center w-full mt-10'>
                 <span className="loading loading-spinner loading-xl"></span>
            </div>
        )}
    </div>
  )
}

export default ProductOverview