import React, { FC } from 'react'
import { icons } from 'lucide-react'

interface EmptyStateProps {
   IconComponent : keyof typeof icons,
   message : string,
}

const EmptyState: FC<EmptyStateProps> = ({ IconComponent, message }) => {
   const IconComponen = icons[IconComponent];

  return (
    <div className=' w-full h-full flex justify-center items-center flex-col'>
        <div className='wiggle-aniamtion'>
            {IconComponen && <IconComponen strokeWidth={1} className='w-30 h-30 text-primary'/>}
        </div>
        <p className='text-small'> {message} </p>
    </div>
  )
}

export default EmptyState