import { Plus } from 'lucide-react';

interface FabProps {
  onClick?: () => void;
}

function Fab({ onClick }: FabProps) {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Quick add"
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}

export default Fab;
