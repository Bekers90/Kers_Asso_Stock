import React from 'react'
import { Transaction } from '@/Types'
import { useEffect, useState } from 'react'
import { getTransactions } from '@/lib/actions'
import TransactionComponent from './TransactionComponent'
import EmptyState from './EmptyState'


const RecentTransaction  = ({email} : {email:string}) => {

    const [transactions, setTransaction] = useState<Transaction[]>([])

    const fetchData = async () => {
          try {
            if(email){
              const txs = await getTransactions(email, 10)
              if(txs){
                setTransaction(txs)
              }
              if(txs){
                setTransaction(txs)
              }
            }
            
          } catch (error) {
            console.error("Erreur lors de la récupération des produits :", error);
          }
        }
      
        useEffect(() => {
          if(email){
            fetchData()
          }
        }, [email])

  return (
    <div className='w-full border-2 border-base-100 mt-4 p-4 rounded-3xl'>
        {transactions.length == 0 ? (
                  <EmptyState 
                      message='Aucun Transaction pour le moment'
                      IconComponent='CaptionsOff'
                      />
               ):(
                   <div className="space-y-4 w-full">
                    <h2 className='text-xl font-bold ùb-4'> Les 10 dernieres transactions </h2>
                      {transactions.map((tx) =>
                          <TransactionComponent
                              key = {tx.id}
                              tx = {tx}
                          />
                      )}
                     </div>
                 )
            } 
    </div>
  )
}

export default RecentTransaction 