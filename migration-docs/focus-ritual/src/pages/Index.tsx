import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TimerProvider } from '@/contexts/TimerContext';
import BottomNav from '@/components/BottomNav';
import FocusPage from '@/pages/FocusPage';
import BankPage from '@/pages/BankPage';
import StatsPage from '@/pages/StatsPage';
import YouPage from '@/pages/YouPage';
import { Target, Archive, BarChart3, User } from 'lucide-react';

const navItems = [
  { id: 'focus', label: 'Focus', icon: <Target className="w-5 h-5" /> },
  { id: 'bank', label: 'Bank', icon: <Archive className="w-5 h-5" /> },
  { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'you', label: 'You', icon: <User className="w-5 h-5" /> },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('focus');

  const renderPage = () => {
    switch (activeTab) {
      case 'focus':
        return <FocusPage />;
      case 'bank':
        return <BankPage />;
      case 'stats':
        return <StatsPage />;
      case 'you':
        return <YouPage />;
      default:
        return <FocusPage />;
    }
  };

  return (
    <TimerProvider>
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
        <BottomNav
          items={navItems}
          activeId={activeTab}
          onSelect={setActiveTab}
        />
      </div>
    </TimerProvider>
  );
};

export default Index;
