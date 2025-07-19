import { NavLink } from "react-router-dom";
import { Button } from "../button";
import { color, motion } from "framer-motion";
import Container from "@/components/Container";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "../drawer";
import { useState } from "react";

const Navbar = () => {
  const NavLinks = () => (
    <>
      <NavLink to='/'>
        <h5>Home</h5>
      </NavLink>
      <NavLink to='/about'>
        <h5>About</h5>
      </NavLink>
      <NavLink to='/contact'>
        <h5>Contact</h5>
      </NavLink>
    </>
  );
  return (
    <header>
      <Container className=' py-1 md:py-6 bg-primary-background  flex justify-between items-center'>
        <div className='cursor-pointer'>
          <NavLink to='/'>
            <h3 className=''>
              Event <span className='logo-gradient'>360</span>
            </h3>
          </NavLink>
        </div>
        <div className='hidden md:flex gap-4 '>
          <NavLinks />
        </div>
        <div className='block md:hidden'>
          <Drawer>
            <DrawerTrigger>
              <span className='material-symbols-outlined'>menu</span>
            </DrawerTrigger>

            <DrawerContent overlay={false} className='left-[calc(100%-150px)] top-[56px] w-[150px] bg-[#0F172A] py-2'>
              <DrawerTitle className='hidden' />
              <DrawerDescription className='hidden' />
              <DrawerClose className='self-end px-2'>
                <span className='material-symbols-outlined'>close</span>
              </DrawerClose>
              <NavLinks />
            </DrawerContent>
          </Drawer>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;

{
  /* <motion.header className='h-16 fixed w-full bg-white z-[999]' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
<nav className='w-full h-full max-w-[1230px] px-[20px] mx-auto flex justify-between items-center '>
  <span className='text-3xl'>iRepair</span>
  <ul className=' space-x-5'>
 
    <NavLink to='/about'>About</NavLink>
    <Button>Login</Button>
  </ul>
</nav>
</motion.header> */
}
