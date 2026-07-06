'use client'
import React from 'react'
import Wrapper from '../components/wrapper'
import ProtectedRoute from "../components/ProtectedRoute"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Product } from '@/Types'
import { readProducts, deleteProduct } from '@/lib/actions'
import EmptyState from '../components/EmptyState'
import ProductImage from '../components/ProductImage'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from "react-toastify"

const page = () => {

    const {user} = useUser()
   const email = user?.primaryEmailAddress?.emailAddress as string

    const [products, setProducts] = useState<Product[]>([])
    
  const fetchProducts = async () => {
    try {
      if(email){
        const products = await readProducts(email)
        console.log(products)
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

  const handleDeleteProduct = async (product : Product) => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce produit ?") 
    if(confirmDelete) {
      try {
       if(product.imageUrl){
        const resDelete = await fetch("api/upload", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({path: product.imageUrl})
        })
        const dataDelete = await resDelete.json()
        if(!dataDelete.success){
           throw new Error("Erreur lors de la suppression de l'image")
         }else{
          if(email){
            await deleteProduct(product.id, email)
            toast.success("Produit supprimé avec succès") 
            fetchProducts()
           }
         }
          
      }
      
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
     }
    
  }


  return (
    <ProtectedRoute>
        <Wrapper>
            <div className='overflow-x-auto'>
              {products.length === 0 ? (
                <div>
                  <EmptyState 
                  message='Aucun produit disponible'
                  IconComponent='PackageSearch'
                  />
                  
                 </div>
                ): (  
                  <table className='table'>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Nom</th>
                        <th>Prix</th>
                        <th>Description</th>
                        <th>Catégorie</th>
                        <th>Quantité</th>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={product.id}>
                          <td>{index + 1}</td>
                          <td>{product.name}</td>
                          <td>{product.price}</td>
                          <td>{product.description}</td>
                          <td>{product.categoryName}</td>
                          <td>{product.quantity}</td>
                          <td>
                             <ProductImage 
                            src={product.imageUrl}
                             alt="preview"
                             heightClass="h-6"
                             widthClass="w-6"
                             />
                          </td>
                          <td className='flex gap-2 flex-col '>
                            <Link 
                            className='btn btn-xs btn-primary ml-2 w-fit'
                            href={`/update-product/${product.id}`}
                            >
                               Modifier
                            </Link>
                            <button 
                            onClick = {() => handleDeleteProduct(product)}
                            className='btn btn-sm btn-error ml-2'>
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    
                  </table>
                )
              }

            </div>
        </Wrapper>
    </ProtectedRoute>
  )
}

export default page