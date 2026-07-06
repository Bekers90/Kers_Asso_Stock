import { getStockSommary } from '@/lib/actions'
import { StockSummary } from '@/Types'
import React from 'react'
import { useEffect, useState } from 'react'
import ProductImage from './ProductImage'
import EmptyState from './EmptyState'


const StockSommaryTable = ({email} : {email:string}) => {

     const [data, setData] = useState<StockSummary | null>(null)


    const fetchSummary = async () => {
                try {
                    if(email){
                        const data = await getStockSommary(email)
                        if(data){
                            setData(data)
                        }
                    }
                    
                } catch (error) {
                    console.error(error)
                }
            }


            useEffect(() => {
                if(email)
                fetchSummary()
            }, [email])



            if(!data) return (
                <div className='flex justify-center items-center w-full'>
                       <span className="loading loading-spinner loading-xl"></span>
                    </div>
            )
            
          
  return (
    <div className='w-full'>
        <ul className="steps steps-vertical border-2 border-base-100 rounded-3xl">
            <li className="step step-primary">
                <div>
                    <span className='text-sm mr-3 font-bold'> Stock Normal</span>
                    <div className='badge badge-soft badge-success'>{data.inStockCount}</div>
                </div>
            </li>
            <li className="step step-primary">
                <div>
                    <span className='text-sm mr-3 font-bold'> Stock faible </span>
                    <div className='badge badge-soft badge-warning'>{data.lowStockCount}</div>
                </div>
            </li>
            <li className="step step-primary">
                <div>
                    <span className='text-sm mr-3 font-bold'>Rupture</span>
                    <div className='badge badge-soft badge-error'>{data.outOfStockCount}</div>
                </div>
            </li>
        </ul>
        <div className="steps steps-vertical border-2 border-base-100 rounded-3xl mt-4">
             <h2 className='text-xl font mb-4'> Produits critique</h2>
             {data.criticalProducts.length > 0 ? (
                <table className='table'>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Nom</th>
                        <th>Quantité</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.criticalProducts.map((product, index) => (
                        <tr key={product.id}>
                          <td>{index + 1}</td>
                          <td>{product.name}</td>
                          <td>{product.quantity}</td>
                          <td>
                             <ProductImage 
                            src={product.imageUrl}
                             alt="preview"
                             heightClass="h-6"
                             widthClass="w-6"
                             />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    
                  </table>
             ):(
                <div>
                    <EmptyState 
                  message='Aucun produit Critique'
                  IconComponent='PackageSearch'
                  />
                </div>
             )}
        </div>
    </div>
  )
}

export default StockSommaryTable