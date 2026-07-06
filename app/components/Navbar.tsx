"use client"
import { ListTree, X, Menu,PackagePlus, ShoppingBasket, Warehouse, Hand, HandHeart, Receipt, LayoutDashboard  } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import {UserButton, useUser} from '@clerk/nextjs';
import { checkAndAddAssociation } from '@/lib/actions';
import Stock from './Stock';

const Navbar = () => {

    const { user } = useUser();

    const pathName = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        {
            name : "Dashboard",
            href : "/",
            icon : LayoutDashboard,
        },
        {
            name : "category",
            href : "/category",
            icon : ListTree,
        },
        {
            name : "Nouveau produits",
            href : "/new_product",
            icon : PackagePlus,
        },
         {
            name : "produits",
            href : "/products",
            icon : ShoppingBasket,
        },
        {
            name : "Donner",
            href : "/give",
            icon : HandHeart,
        },
        {
            name : "Transaction",
            href : "/transaction",
            icon : Receipt,
        },
        ]
        
        useEffect(() => {
             if(user?.primaryEmailAddress?.emailAddress && user.fullName){
                checkAndAddAssociation(user.primaryEmailAddress.emailAddress, user.fullName)
             }
        }, [user])


        const renderLinks = (baseClass : string) => (
            <>
                 {navLinks.map(({href, name, icon:Icon})  => {
                    const isActive = pathName === href;
                    const activeClass = isActive ? "bg-primary text-white" : "btn-ghost";
                     return (
                        <Link
                        href={href}
                        key={href}
                        className= {`
                            ${baseClass} ${activeClass} btn btn-sm flex gap-2 items-center`}
                        >
                          <Icon className='w-4 h-4' />
                          {name}
                        </Link>
                     )
                 })}
                 <button className="btn" 
                    onClick = {() => (document.getElementById('my_modal_stock') as HTMLDialogElement).showModal()}>
                    <Warehouse className='w-4 h-4' />
                    Alimenté le stock
                </button>
            </>
        )

  return (
    <div className='border-b border-base-100 px-5 md:px-[10%] py-4 relative'>
        <div className='flex justify-between item-center'>
            <div className='flex items-center'>
                <div className='p-3'>
                  <PackagePlus className='w-6 h-6 text-primary' />
                </div>
                <span className='font-bold text-xl'>
                    Kers-Stock
                </span>
            </div>
            <button 
            className='btn w-fit sm:hidden btn-sm'
            onClick={() => setIsOpen(!isOpen)}
            >
                <Menu className='w-4 h-4' />
            </button>
            <div className='hidden space-x-2 sm:flex items-center'>
                {renderLinks('btn')}
                <UserButton />
            </div>

            <div className={`absolute top-0 w-full bg-base-100 h-screen
                ${isOpen ? 'left-0' : '-left-full'} gap-2 flex flex-col p-4 transition-all duration-300sm:hidden z-50`}>
                 <div className='flex justify-between'>
                    <UserButton />
                    <button 
                    className='btn w-fit sm:hidden btn-sm'
                    onClick={() => setIsOpen(!isOpen)}
                    >
                        <X className='w-4 h-4' />
                    </button>
                 </div>
                 {renderLinks('btn')}
            </div>
        </div>
        <Stock />
    </div>
  )
}

export default Navbar