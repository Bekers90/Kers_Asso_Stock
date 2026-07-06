"use client"
import Wrapper from "../components/wrapper"
import ProtectedRoute from "../components/ProtectedRoute"
import { useState, useEffect } from "react"
import { FileImage } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import ProductImage from "../components/ProductImage"
import { createProduct, readCategories } from "@/lib/actions"
import { toast } from "react-toastify"
import { Category } from "@prisma/client"
import { FormDataType } from "@/Types"
import { useRouter } from "next/navigation"

const page = () => {

  const {user} = useUser()
  const email = user?.primaryEmailAddress?.emailAddress as string
  const route = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    unit: "",
    categoryId: "",
    imageUrl: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try{
        if(email){
           const data = await readCategories(email)
           if(data)
             setCategories(data)
        }

      }catch(error){
        console.error("Error lors du chargement des categories: ", error)
      }
     
    }
    fetchCategories()
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

  const handleSubmit = async () => {
    if(!file) {
      toast.error("Veuillez selectionner une image")
      return
    }
    try {
      const imageData = new FormData()
      imageData.append("file", file)
      const res = await fetch("/api/upload",{
        method: "POST",
         body: imageData
      })
      const data = await res.json()
      
      if(!data.success){
        toast.error("Erreur lors de l'upload de l'image")
      }else{
        formData.imageUrl = data.filePath
        await createProduct(formData, email)
        toast.success("Produit cree avec succes")
        route.push("/products")
      }

      
    } catch (error) {
      console.log(error)
      toast.error("Erreur lors de la creation du produit")
       }
  }


  return (
     <ProtectedRoute>
      <Wrapper>

         <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">
              creer un produit
            </h1>
            <section className="flex md:flex-row flex-col">
                <div className="space-y-4 md:w-112.5">
                  <input 
                  type="text" 
                  name = "name"
                  placeholder="nom du produit"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={handleChange}
                  />
                  <textarea 
                  name="description" 
                  placeholder="description"
                  className="textarea textarea-bordered w-full"
                  value={formData.description}
                  onChange={handleChange}
                  >
                  </textarea>

                  <input 
                  type="number" 
                  name = "price"
                  placeholder="prix"
                  className="input input-bordered w-full"
                  value={formData.price}
                  onChange={handleChange}
                  />

                  <select 
                  className="select select-bordered w-full"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  >
                    <option value="">Selectionner une categorie</option>
                    {categories.map((category) => (
                      <option 
                        key={category.id} 
                        value={category.id}
                        >
                        {category.name}
                      </option>
                    ))} 
                  </select>

                  <select 
                  className="select select-bordered w-full"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  >
                    <option value="">Selectionner l'unité</option>
                    <option value="g">Gramme</option>
                    <option value="kg">kilogramme</option>
                    <option value="l">litre</option>
                    <option value="m">Mètre</option>
                    <option value="cm">Centimètre</option>
                    <option value="h">Heure</option>
                    <option value="pcs">Pièce</option>
                  </select>

                  <input 
                  type="file" 
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handlefileChange}
                  />

                  <button onClick={handleSubmit} className="btn btn-primary">
                    {loading ? (
                      <span className="loading loading-spinner"> </span>
                    ):(
                      <span>Enregistrement en cours</span>
                    )}
                     
                  </button>
                </div>
                <div className="md:ml-4 md:w-75 mt-4 md:mt-0 border-2 border-primary flex p-5 justify-center md:h-75 items-center rounded-3xl">
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
            </section>
          </div>
          </div>
        
      </Wrapper>
    </ProtectedRoute>
  )
}

export default page