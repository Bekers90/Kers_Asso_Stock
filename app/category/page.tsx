"use client"
"use strict"
import Wrapper from "../components/wrapper"
import ProtectedRoute from "../components/ProtectedRoute"
import { useState, useEffect } from "react"  
import CategoryModal from "../components/CategoryModal"
import { useUser } from "@clerk/nextjs"
import { createCategory, readCategories, updateCategory, deleteCategory } from "@/lib/actions"
import { toast } from "react-toastify"
import EmptyState from "../components/EmptyState"
import type { Category } from "@/app/generated/prisma/client"
import { Trash2, Pencil } from "lucide-react"



const page = () => {
  const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [loading, setLoading] = useState(false);
   const [editMode, setEditMode] = useState(false);
   const [editcategoryId, setEditCategoryId] = useState<string | null> (null) ;
   const [categories, setCategories] = useState<Category[]>([]);


   // récupérer l'email de l'utilisateur 
   const {user , isLoaded} = useUser()
   const email = user?.primaryEmailAddress?.emailAddress as string


   const loadCategories = async () => {
    if(email){
      const data = await readCategories(email)
      if(data)
      setCategories(data)
    }
   }

   useEffect(() => {
      loadCategories()
    }, [email])

  

   const openCreateModal = () => {
    setName("")
    setDescription("")
    setEditMode(false)
    const modal = document.getElementById("categoryModal") as HTMLDialogElement
    modal?.showModal()
    }

    const closeModal = () => {
      setName("")
      setDescription("")
      const modal = document.getElementById("categoryModal") as HTMLDialogElement
      modal?.close()
    }

    const handlecreateCategory = async () => {
      if(!isLoaded) return
      setLoading(true)
      if(email){
        await createCategory(name, email, description)
        
      }
      await loadCategories()
      setLoading(false)
      closeModal()
      toast.success("Catégorie créée avec succès")
    }

     const handleUpdateCategory = async () => {
      if(!editcategoryId) return
      setLoading(true)
      if(email){
        await updateCategory(editcategoryId, email, name, description)
        
      }
      await loadCategories()
      setLoading(false)
      closeModal()
      toast.success("Catégorie modifiée avec succès")
    }

    const openEditModal = (category : Category) => {
      setName(category.name)
      setDescription(category.description || "")
      setEditMode(true)
      setEditCategoryId(category.id)
      const modal = document.getElementById("categoryModal") as HTMLDialogElement
      modal?.showModal()
    }

    const handleDeleteCategory = async (categoryId : string) => {
     const confirmDelete = confirm('��tes-vous s��r de vouloir supprimer cette catégorie ?')
     if(!confirmDelete) return;
     await deleteCategory(categoryId, email)
     await loadCategories()
     toast.success("Catégorie supprimée avec succès")
    }

  return (
    <ProtectedRoute>
    <Wrapper>
      <div>
        <div className=" mb-4">
          <button 
          className="btn btn-primary"
          onClick={openCreateModal}
          >
            ajouter une catégorie
          </button>
        </div>
       
        {
          categories.length > 0 ? (
            <div>
            {
              categories.map((category) => (
                <div key={category.id} className="mb-4 p-5 border-2 border-base-100 flex justify-between items-center">
                  <div>
                    <strong className="text-lg ">{category.name}</strong>
                    <div className="text-sm">{category.description}</div>
                  </div>
                  <div className="flex gap-2">
                      <button 
                      className="btn btn-sm" 
                      onClick={() => openEditModal(category)}
                      >
                       <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                      className="btn btn-error" 
                      onClick={() => handleDeleteCategory(category.id)}
                      >
                       <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </div>
              ))
            }
            </div>
          ):(
              
                  <EmptyState 
                  IconComponent="Group"
                  message="Aucune catégorie trouvée" 
                  />
               
          )
        }

      </div>
      <CategoryModal
        name={name}
        description={description}
        loading={loading}
        onClose={closeModal}
        onChangeName={setName}
        onChangeDescription={setDescription}
        onSubmit={editMode? handleUpdateCategory : handlecreateCategory}
        editMode={editMode}
      />
    </Wrapper>
    </ProtectedRoute>
  )
}

export default page