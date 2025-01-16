import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { UserRound, LayoutDashboard, Settings } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function DockNav() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const admin = Cookies.get('admin');

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed flex inset-x-1/2 bottom-6 items-center justify-center transform -translate-x-1/2 z-50"
    >
      <nav className="flex gap-1 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
        <DockItem
          href={ admin === 'false' ? "/profile" : "/admin"}
          icon={<UserRound className="h-5 w-5" />}
          label="Profile"
          isActive={activePath === '/profile'}
          setActivePath={setActivePath}
        />
        <DockItem
          href="/"
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          isActive={activePath === '/'}
          setActivePath={setActivePath}
        />
        <DockItem
          href="/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isActive={activePath === '/settings'}
          setActivePath={setActivePath}
        />
      </nav>
    </motion.div>
  );
}

function DockItem({
  href,
  icon,
  label,
  isActive,
  setActivePath,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  setActivePath: (path: string) => void;
}) {
    const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setActivePath(href);
    navigate(href,{replace:true});
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex items-center justify-center p-3 rounded-full transition-colors cursor-pointer ${
        isActive
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="sr-only">{label}</span>
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-current"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
}
