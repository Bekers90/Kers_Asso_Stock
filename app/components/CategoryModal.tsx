import React from 'react'

interface props{
    name : string;
    description : string;
    loading : boolean;
    onClose : () => void;
    onChangeName : (value : string) => void;
    onChangeDescription : (value : string) => void;
    onSubmit : () => void;
    editMode? : boolean;
}

const CategoryModal : React.FC<props> = (
    {name, description, loading, onClose, onChangeName, onChangeDescription, onSubmit, editMode} : props
) => {


  return (
    
    <dialog id="categoryModal" className="modal">
    <div className="modal-box">
        <form method="dialog">
        <button 
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={onClose}
        >
            ✕
        </button>
        </form>
        <h3 className="font-bold text-lg">
            {editMode ? "Modifier la catégorie" : "Ajouter une catégorie"}
        </h3>
        <input
         type="text" 
         placeholder="Nom de la catégorie"
         className="input input-bordered w-full mt-4 mb-4"
         value={name}
         onChange={(e) => onChangeName(e.target.value)}
         />
        <input
         type="text" 
         placeholder="description"
         className="input input-bordered w-full mt-4 mb-4"
         value={description}
         onChange={(e) => onChangeDescription(e.target.value)}
         />
         <button
         className="btn btn-primary"
         onClick={onSubmit}
         >
            {loading 
                ? editMode 
                    ? "Modification..." 
                    : "Ajout...."
                : editMode ? "Modifier" : "Ajouter"
            }
         </button>
    </div>
    </dialog>

 )
}

export default CategoryModal