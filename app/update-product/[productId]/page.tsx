"use client"
import React from 'react'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import Wrapper from '@/app/components/wrapper'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { readProductById } from '@/lib/actions'
import { Product, FormDataType } from '@/Types'
import ProductImage from '@/app/components/ProductImage'
import { FileImage } from 'lucide-react'
import { updateProduct } from '@/lib/actions'
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

const page = ({params} : { params: Promise<{productId: string}> }) => {

const {user} = useUser()
const email = user?.primaryEmailAddress?.emailAddress as string
const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<FormDataType>({
    id : "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    categoryName : "",
  })

  const fetchProduct = async () => {
    try {
        const {productId} = await params
        if(email){
            const fetchedProduct = await readProductById(productId, email)
            if(fetchedProduct){
                setProduct(fetchedProduct)
                setFormData({
                    id: fetchedProduct.id,
                    name: fetchedProduct.name,
                    description: fetchedProduct.description,
                    price: fetchedProduct.price,
                    imageUrl: fetchedProduct.imageUrl,
                    categoryName: fetchedProduct.categoryName
                })
                setPreviewUrl(fetchedProduct.imageUrl)
            }
        }
        
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
    }
  }
  useEffect(() => {
      fetchProduct()
  }, [email])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handlefileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if(selectedFile){
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

const handleUpdateProduct = async (e: React.FormEvent) => {
    

    e.preventDefault();
    setLoading(true);

     try {
           let imageUrl = formData?.imageUrl // On garde l'image actuelle par défaut
             console.log("Image actuelle :", imageUrl)
            if (file) {
                const resDelete = await fetch("/api/upload", {
                    method: "DELETE",
                    body: JSON.stringify({ path: formData.imageUrl }),
                    headers: { 'Content-Type': 'application/json' }
                })
                const dataDelete = await resDelete.json()
                if (!dataDelete.success) {
                    throw new Error("Erreur lors de la suppression de l’image.")
                }

                const imageData = new FormData()
                imageData.append("file", file)
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: imageData
                })

                const data = await res.json()
                console.log(data)
                if (!data.success) {
                    throw new Error("Erreur lors de l’upload de l’image.")
                }
                console.log("Image uploadée avec succès :", data.filePath)

                formData.imageUrl = data.filePath
                console.log("Données de formadata :", formData);


                await updateProduct(formData, email)
                toast.success("Produit mis à jour avec succès !")
                router.push("/products")
            }
        } catch (error) {
        console.error("Erreur :", error);
        toast.error("Une erreur est survenue");
    } finally {
        setLoading(false);
    }
}



  return (
   <ProtectedRoute>
        <Wrapper>
            
            {product ? (
                <div className=''>
                    <h1 className='text-2xl font-bold text-center'>Modifier un produit</h1>
                    <div className='flex md:flex-row flex-col md:items-center'>
                      <form className='space-y-2' onSubmit={handleUpdateProduct}>
                        <div className='text-sm font-semibold mb-2'>Nom</div>
                            <input 
                            type="text" 
                            name = "name"
                            className="input input-bordered w-full"
                            value={formData.name}
                            onChange={handleChange}
                            />
                        <div className='text-sm font-semibold mb-2'>Description</div>
                            <textarea 
                            name="description" 
                            className="textarea textarea-bordered w-full"
                            value={formData.description}
                            onChange={handleChange}
                            >
                            </textarea>
                           
                        <div className='text-sm font-semibold mb-2'>Categorie</div>
                            <input 
                            type="text" 
                            name = "category"
                            className="input input-bordered w-full"
                            value={formData.categoryName}
                            onChange={handleChange}
                            disabled
                            />
                        <div className='text-sm font-semibold mb-2'>Image / prix</div>
                            <div className='flex'>
                            <input 
                            type="file" 
                            accept="image/*"
                            className="file-input file-input-bordered w-full"
                            onChange={handlefileChange}
                            />

                             <input 
                            type="number" 
                            name = "price"
                            placeholder="prix"
                            className="input input-bordered w-full"
                            value={formData.price}
                            onChange={handleChange}
                            />
                            </div>
                            <button 
                            type='submit'
                            className="btn btn-primary mt-3">
                              {loading ? (
                                <span className="loading loading-spinner"> </span>
                              ):(
                                <span>Mettre à jour</span>
                              )}
                            </button>

                      </form>

                      <div className='flex md:flex-col md:ml-4 mt-4 md:mt-0'>
                            <div className="md:ml-4 md:w-50  mt-4 md:mt-0 border-2 border-primary flex p-5 justify-center md:h-50 items-center rounded-3xl hidden md:flex">
                             {
                                 formData.imageUrl && formData.imageUrl !==  "" ? (
                                <div>
                                    <ProductImage 
                                    src={formData.imageUrl}
                                    alt={product?.name}
                                    heightClass="h-40"
                                    widthClass="w-40"
                                    />
                                </div>
                                ):(
                                <div className="wiggle-animation">
                                    <FileImage strokeWidth={2} className="h-10 w-10 text-primary" />
                                </div> 
                                )
                              }
                            </div>
                            <div className="md:ml-4 md:w-50 w-full flex mt-4 md:mt-0 border-2 border-primary p-5 justify-center md:h-50 items-center rounded-3xl">
                             {
                                previewUrl && previewUrl !== "" ? (
                                <div>
                                    <ProductImage 
                                    src={previewUrl}
                                    alt="preview"
                                    heightClass="h-40"
                                    widthClass="w-40"
                                    />
                                </div>
                                ):(
                                <div className="wiggle-animation">
                                    <FileImage strokeWidth={2} className="h-10 w-10 text-primary" />
                                </div> 
                                )
                              }
                            </div>
                      </div>
                      
                    </div>
                </div>
                
               
            ):(
             <div className=' flex justify-center items-center w-full pt-10'>
                <span className="loading loading-spinner loading-xl"></span>
             </div>
            )}
        </Wrapper>
    </ProtectedRoute>
  )
}

export default page