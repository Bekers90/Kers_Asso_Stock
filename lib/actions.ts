"use server"
import { Category } from "@/app/generated/prisma/client"
import prisma from "@/lib/prisma"
import { ChartData, FormDataType, OrderItem, Product, Transaction, ProductOverviewStats , StockSummary } from "@/Types"

export async function checkAndAddAssociation(email : string, name: string){
    if(!email) return
    try{
        const existingAssociation = await prisma.association.findUnique({
            where: {
                email
            }
        })
        if(!existingAssociation && name){
            await prisma.association.create({
                data : {
                    email, name
                }
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export async function getAssociation(email: string){
    if(!email || !email.includes('@')) return console.log("Email invalide")
        const cleanEmail = email.trim().toLowerCase();
    try {
         const existingAssociation = await prisma.association.findUnique({
            where : {
                email : cleanEmail
            }
         })
          return existingAssociation;

    } catch (error){
        console.error("Erreur Prisma getAssociation:", error);
        throw new Error("Impossible de récupérer l'association");
    }
}

export async function createCategory(
            name : string,
            email : string,
            description : string
        ){
            if(!name) return
            try {
                const association = await getAssociation(email)
                if(!association){
                    throw new Error ("Aucune association trouvée")
                }
                await prisma.category.create({
                    data : {
                        name,
                        description : description || "",
                        associationId : association.id
                    }
                })

            } catch (error){
                console.error(error)
            }
}

export async function updateCategory(
        id : string,
        email : string,
        name : string,
        description? : string,
    ){
        if(!id || !email || !name){
            throw new Error("id, email de l'association et le nom de la categorie est requis pour la mise a jour.")
        } 
        
        try {
            const association = await getAssociation(email)
            if(!association){
                throw new Error ("Aucune association trouver")
            }
                await prisma.category.update({
                    where: {
                        id: id,
                        associationId : association.id
                    }, 
                    data : {
                        name,
                        description : description || "",
                    }
            })
        } catch (error) {
            console.error(error)
        }
}

export async function deleteCategory(id: string, email:string){
     if(!id || !email){
        throw new Error("id, email de l'association sont requis pour la mise a jour.")
    } 
    
    try {
        const association = await getAssociation(email)
        if(!association){
             throw new Error ("Aucune association trouver")
           }
            await prisma.category.delete({
                where: {
                    id: id,
                    associationId : association.id
                }
          })
    } catch (error) {
        console.error(error)
    }
}

export async function readCategories( email:string) : Promise<Category[] | undefined > {
     if(!email){
        throw new Error ("Email de l'association sont requis.")
    } 
    
    try {
        const association = await getAssociation(email)
        if(!association){
             throw new Error ("Aucune association trouver")
           }
           const categories = await prisma.category.findMany({
                where: {
                    associationId : association.id
                }
          })
          return categories;
    } catch (error) {
        console.error(error)
    }
}

export async function createProduct(formData: FormDataType, email : string, ){

    const { name, description, price, categoryId, quantity, unit, imageUrl } = formData
            try {
                 if(!email || !name || !price || !categoryId ) {
                        throw new Error("Email de l'association, le nom, le prix et la categorie sont requis pour la creation d'un produit.")   
                    }

                const safeImageUrl = imageUrl ? imageUrl : ""
                const safeUnit = unit ? unit : ""


                const association = await getAssociation(email)
                if(!association){
                    throw new Error ("Aucune association trouvée")
                }
                await prisma.product.create({
                    data : {
                        name,
                        description,
                        price : Number(price),
                        categoryId,
                        quantity : Number(quantity),
                        unit : safeUnit,
                        imageUrl : safeImageUrl,
                        associationId : association.id
                    }
                })

            } catch (error){
                console.error(error)
            }
}

export async function updateProduct(formData: FormDataType, email : string, ){

    const { name, description, price, id , quantity, imageUrl } = formData
            try {
                 if(!email || !name || !price || !id) {
                        throw new Error("L'Id du produit, le nom, le prix et la categorie sont requis pour la creation d'un produit.")   
                    }

                const association = await getAssociation(email)
                if(!association){
                    throw new Error ("Aucune association trouvée")
                }
                await prisma.product.update({
                    where : {
                        id : id,
                        associationId : association.id
                    },
                    data : {
                        name,
                        description,
                        price : Number(price),
                        imageUrl,
                    }
                })

            } catch (error){
                console.error(error)
            }
}

export async function deleteProduct(id: string, email : string, ){

            try {
                 if(!id) {
                        throw new Error("L'Id est requis pour la supression")   
                    }

                const association = await getAssociation(email)
                if(!association){
                    throw new Error ("Aucune association trouvée")
                }
                await prisma.product.delete({
                    where : {
                        id : id,
                        associationId : association.id
                    }
                })

            } catch (error){
                console.error(error)
            }
}

export async function readProducts(email: string): Promise<Product[] | undefined> {
     try {
        if (!email) {
            throw new Error("l'email est requis .")
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        const products = await prisma.product.findMany({
            where: {
                associationId: association.id
            },
            include: {
                category: true
            }
        })

        return products.map(product => ({
            ...product,
            categoryName: product.category?.name
        }))

    } catch (error) {
        console.error(error)
    }

}

export async function readProductById(productId: string, email : string, ): Promise<Product | undefined> {

            try {
                 if(!email) {
                        throw new Error("L'email est requis pour la supression")   
                    }

                const association = await getAssociation(email)
                if(!association){
                    throw new Error ("Aucune association trouvée")
                }
                const product =  await prisma.product.findUnique({
                    where : {
                        id : productId,
                        associationId : association.id
                    },
                    include : {
                        
                        category : true
                    }
                })
                if(!product){
                    throw new Error ("Aucun produit trouvé")
                }


            return {
                ...product,
                categoryName : product.category?.name
             }

            } catch (error){
                console.error(error)
            }
}

export async function replenishStockWithTransaction(productId: string, quantity: number, email: string){
   try {

      if(quantity <= 0){
        throw new Error("La quantité doit être supérieure à 0")
      }

      if(!email){
        throw new Error("L'email est requis pour la supression")   
      }

      const association = await getAssociation(email)
       if(!association){
        throw new Error("Aucune association trouvée")
       }

       await prisma.product.update({
        where: {
            id: productId,
            associationId: association.id
         },
         data: {
            quantity: {
                increment: quantity
            }
         }
       })

       await prisma.transaction.create({
        data: {
            productId : productId,
            quantity : quantity,
            type: "IN",
            associationId: association.id
        }
       })
    
    
   } catch (error) {
    console.error(error)
   }
}

export async function deductStockWithTransaction(orderItem : OrderItem[], email : string){

    try {
        if(!email){
            throw new Error("L'email est requis pour la supression")
        }
        const association = await getAssociation(email)
        if(!association){
            throw new Error ("Aucune association trouvée")
        }

        for (const item of orderItem) {
            const product = await prisma.product.findUnique({
                where : {id : item.productId}
            })
            if(!product){
                throw new Error ("Aucun produit trouvé")
            }
             if(item.quantity <= 0 ){
                throw new Error ("La quantité doit être supérieure à 0")
            }
            if(item.quantity > product.quantity){
                throw new Error (`le produit ${product.name} n'a pas assez de stock. demandez : ${item.quantity}, Disponible : ${product.quantity}/${product.unit} `)
            }

        }

         await prisma.$transaction(async (tx) => {

            for(const item of orderItem){
               await tx.product.update({
                    where: {
                         id : item.productId,
                         associationId : association.id
                    },
                    data : {
                        quantity : {
                            decrement : item.quantity
                        }
                    }
                })

               await tx.transaction.create({
                    data : {
                        productId : item.productId,
                        quantity : item.quantity,
                        type : "OUT",
                        associationId : association.id
                    }
                })
            }
            
         })

         return {success : true}
        
    } catch (error) {
        console.error(error)
        return {success : false, message: error}
    }
}

export async function getTransactions(email:string, limit? : number) : Promise<Transaction[]> {
   try {
      
       if(!email){
        throw new Error("L'email est requis pour la supression")
       }
       const association = await getAssociation(email)
       if(!association){
        throw new Error ("Aucune association trouvée")
       }

       const transactions = await prisma.transaction.findMany({
        where : {
            associationId : association.id
          },
          orderBy : {
            createdAt : "desc"
         },
         take : limit,
         include : {
            product : {
                include : {
                    category : true
                }
            }
         }
       })

       return transactions.map(transaction => ({
        ...transaction,
        productName : transaction.product?.name,
        categoryName : transaction.product?.category?.name,
        imageUrl : transaction.product?.imageUrl,
        unit : transaction.product?.unit,
        price : transaction.product?.price,
       }))
    
   } catch (error) {
    console.error(error)
    return []
   }
}

export async function getProductOverviewStats(email:string) : Promise<ProductOverviewStats>{
  try {
      
    if(!email){
    throw new Error("L'email est requis pour la supression")
    }
    const association = await getAssociation(email)
    if(!association){
    throw new Error ("Aucune association trouvée")
    }

    const products = await prisma.product.findMany({
        where : {
            associationId : association.id
        },
        orderBy : {
            createdAt : "desc"
        },
        include : {
            category : true,
            
        }
    })

    const transactions = await prisma.transaction.findMany(
        {
            where : {
                associationId : association.id
            }
        }
    )


    const categoriesSet = new Set(products.map(product => product.category.name))

    const totalProduct = products.length
    const totalCategories = categoriesSet.size
    const totalTransactions = transactions.length
    const stockValue = products.reduce((acc, product) => {
        return acc + product.price * product.quantity
    }, 0)

   return {
    totalProduct,
    totalCategories,
    totalTransactions,
    stockValue
   } 
  } catch (error) {
    console.error(error)
    return {
        totalProduct : 0,
        totalCategories : 0,
        totalTransactions : 0,
        stockValue : 0
    }
  }
}

export async function getProductCategoryDistribution(email:string): Promise<ChartData[]>{
    try {
      
    if(!email){
    throw new Error("L'email est requis pour la supression")
    }
    const association = await getAssociation(email)
    if(!association){
    throw new Error ("Aucune association trouvée")
    }
     
    const R = 5

    const categoriesWithproductCount = await prisma.category.findMany({
        where : {
            associationId : association.id
        },
        include : {
            products : {
                select : {
                    id: true
                }
            }   
        }
    })

    const data = categoriesWithproductCount.map(category => ({
        name : category.name,
        value : category.products.length
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, R)
  return data;
  
  } catch (error) {
    console.error(error)
        return []
  }
}

export async function getStockSommary(email:string){
    try {
      
    if(!email){
    throw new Error("L'email est requis pour la supression")
    }
    const association = await getAssociation(email)
    if(!association){
    throw new Error ("Aucune association trouvée")
    }
     
    const allProducts = await prisma.product.findMany({
        where : {
            associationId : association.id
        },
        include : {
           category : true 
        }
    })

     const inStock = allProducts.filter((p) => p.quantity > 5)
     const lowStock = allProducts.filter((p) => p.quantity <= 2 && p.quantity > 0)
     const outOfStock = allProducts.filter((p) => p.quantity == 0)
    const criticalProducts = [...lowStock, ...outOfStock]


  return {
    inStockCount : inStock.length,
    lowStockCount : lowStock.length,
    outOfStockCount : outOfStock.length,
    criticalProducts : criticalProducts.map(product => ({
        ...product,
        categoryName : product.category?.name,
    }))
  }
  
  } catch (error) {
    console.error(error)
    return {
      inStockCount : 0,
      lowStockCount : 0,
      outOfStockCount : 0,
      criticalProducts : []
    }
    
  }
}
