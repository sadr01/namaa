
import NavMenu from './NavMenu'
import { motion, AnimatePresence } from 'framer-motion'

export default function DrawerNavMenu({ showMenu, showMenuHandler, children }) {
  return (
    <AnimatePresence>
      {showMenu && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={showMenuHandler}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
              zIndex: 800,
            }}
          />

          {/* slider menu (سمت راست) */}
          <motion.div
            key="menu-xs"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              width: "15rem",
              height: "100%",
              background: "#1b2a41",
              position: "fixed",
              top: 0,
              right: 0,
              zIndex: 900,
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
