import React from 'react'
import { useState, useEffect } from 'react'
import { ChartData } from '@/Types'
import EmptyState from './EmptyState'
import { getProductCategoryDistribution } from '@/lib/actions'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts'


const CategoryChart = ({email} : {email:string}) => {

    const [data, setData] = useState<ChartData[]>([])

     const COLORS = {
            default: "#9e9d9d"
        }

    const fetchStats = async () => {
            try {
                if(email){
                    const data = await getProductCategoryDistribution(email)
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
            fetchStats()
        }, [email])

         const renderChart = (widthOverride?: string) => (
                <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={data}
                    margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    }}
                    barCategoryGap={widthOverride ? 0 : "10"}
                >
                    <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={
                        {
                        fontSize: 15,
                        fill: "#b6b8bf",
                        fontWeight: "bold"
                        }
                    }
                    />
                    <YAxis hide />
                    <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    // barSize={200}
                    >

                    <LabelList
                        fill="#010c33"
                        dataKey="value"
                        position="insideRight"
                        style={{ fontSize: "20px", fontWeight: 'bold' }}
                    />
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.default} cursor="default" />
                    ))}

                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            )

            if(data.length == 0){
                return (
                    <div className='w-full border-2 border-base-200 mt-4 p-4 rounded-3xl'>
                        <h2 className='text-xl font-bold mb-4'>
                             5 catégories avec le plus de produits 
                        </h2>
                            <EmptyState 
                               message = 'Aucune categorie pour le moment'
                               IconComponent = 'Group'
                            />
                       
                    </div>
                )
            }

  return (
    <div>
        <div className='w-full border-2 border-base-200 mt-4 p-4 rounded-3xl'>
            <h2 className='text-xl font-bold mb-4' >
                 5 catégories avec le plus de produits
            </h2>
            <div>
                {renderChart()}
            </div>
        </div>
    </div>
  )
}

export default CategoryChart