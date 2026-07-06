'use client'
import ProtectedRoute from '../components/ProtectedRoute'
import Wrapper from '../components/wrapper'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Product } from '@/Types'
import { readProducts, readCategories } from '@/lib/actions'
import { toast } from 'react-toastify'
import EmptyState from '../components/EmptyState'
import { Trash2 } from 'lucide-react'
import { OrderItem } from '@/types'
import { deductStockWithTransaction } from '@/lib/actions'
import ProductComponent from '../components/ProductComponent'
import ProductImage from '../components/ProductImage'

const page = () => {

 const {user} = useUser()
const email = user?.primaryEmailAddress?.emailAddress as string

const [products, setProducts] = useState<Product[]>([])
const [order, setOrder] = useState<OrderItem[]>([])
const [searhQuery, setSearchQuery] = useState<string>("")
const [selectedProductId, setSelectedProductId] = useState<string[]>([])

const fetchProducts = async () => {
    try {
      if(email){
        const products = await readProducts(email)
        if(products){
          setProducts(products)
        }
      }
      
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  }

  useEffect(() => {
    if(email){
      fetchProducts()
    }
  }, [email])

const filtredAvailableProducts = products
          .filter((product) => 
            product.name.toLowerCase().includes(searhQuery.toLowerCase())
          )
          .filter((product) => !selectedProductId.includes(product.id))
          .slice(0, 10)

const handleAddCart = (product : Product) => {
  setOrder((prevOrder) => {
    const existingProduct = prevOrder.find((item) => item.productId === product.id)
    let updatedOrder
    if(existingProduct){
        updatedOrder = prevOrder.map((item) =>
          item.productId === product.id ? 
        {
          ...item, 
          quantity: Math.min(item.quantity + 1, product.quantity)
        } : item
      )
    }else{
      updatedOrder = [
        ...prevOrder, 
        {
          productId : product.id,
          quantity : 1,
          unit : product.unit,
          imageUrl : product.imageUrl,
          name : product.name,
          availableQuantity : product.quantity,
        }
      ]
    }

    setSelectedProductId((prevSelected) => 
      prevSelected.includes(product.id) 
        ? prevSelected 
        : [...prevSelected, product.id]
    )

    return updatedOrder
  })
}

const handleQuantityChange = (productId : string, newQuantity : number) => {
  setOrder((prevOrder) => 
    prevOrder.map((item) =>
      item.productId === productId
        ? { ...item, quantity : newQuantity }
        : item
    )
  )
}

const handleRemoveFromCcart = (productId : string) => {
  setOrder((prevOrder) => {
    const updatedOrder = prevOrder.filter((item) => item.productId !== productId)
    setSelectedProductId((prevSelectedProductId) =>
      prevSelectedProductId.filter((id) => id !== productId)
      )
      return updatedOrder
    })
}

const handleSubmit = async () => {
  try {
    if(order.length === 0){
      toast.error("Veuillez ajouter au moins un produit à la commande")
      return
    }
    const response = await deductStockWithTransaction(order, email)
    if(response?.success){
      toast.success("Don effectué avec succès")
      setOrder([])
      setSelectedProductId([])
      fetchProducts()
    }else{
      toast.error(`${response?.message}`)
    }
    
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
  }
}

  return (
    <ProtectedRoute>
        <Wrapper>
            <div className='flex md:flex-row flex-col-reverse'>
              <div className='md:w-1/3'>
                 <input 
                 type="text" 
                 className='input input-border w-full mb-4'
                 placeholder='Recherche un produit'
                 value={searhQuery}
                 onChange={((e) => setSearchQuery(e.target.value) )}
                 />
                 <div className='space-y-4'>
                  {filtredAvailableProducts.length > 0 ? (
                     filtredAvailableProducts.map((product, index) => (
                      <ProductComponent 
                      key = {index}
                      product={product} 
                      add={true}
                      handleAddCart={handleAddCart}
                      />
                     ))
                  ):(
                    <EmptyState 
                      message='Aucun produit disponible'
                      IconComponent='PackageSearch'
                      />
                  )}
                 </div>
              </div>

              <div className='md:w-2/3 p-4 md:ml-4 md:mb-0 h-fit border-2 border-base-200 rounded-3xl overflow-x-auto'>
                  {order.length > 0 ? (
                      <div>
                        <table className='table w-full scroll-auto'>
                           <thead>
                             <tr>
                              <th>Image</th>
                              <th>Nom</th>
                              <th>Quantité</th>
                              <th>Unite</th>
                              <th>Action</th>
                             </tr>
                           </thead>
                           <tbody>
                            {order.map((item) => (
                              <tr key={item.productId}>
                                <td>
                                  <ProductImage
                                    src={item.imageUrl}
                                    alt={item.name}
                                    heightClass='h-20'
                                    widthClass='h-20'
                                    
                                  />
                                </td>
                                <td>{item.name}</td>
                                <td>
                                  <input 
                                   type="number" 
                                   value={item.quantity}
                                   min ="1"
                                   max = {item.availableQuantity}
                                   className='input input-bordered w-20 mb-4'
                                   onChange = {(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                                  />
                                </td>
                                <td className='capitalize'>
                                  {item.unit}
                                </td>
                                <td>
                                  <button
                                    className='btn btn-error btn-sm'
                                    onClick={() => handleRemoveFromCcart(item.productId)}
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </button>
                                </td>
                              </tr>
                             ))}
                           </tbody>
                        </table>
                        <button 
                          onClick={handleSubmit}
                          className='btn btn-primary ùt-4 w-fit'>
                           Confirmer le don
                        </button>
                      </div>
                  ):(
                     <EmptyState 
                        message='Aucun produit dans le panier'
                        IconComponent ='HandHeart'
                      />
                  )}
              </div>

            </div>
        </Wrapper>
    </ProtectedRoute>
  )
}

export default page