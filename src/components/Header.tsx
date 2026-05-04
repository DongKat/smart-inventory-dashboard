import { Bell, CircleUser } from 'lucide-react';

function Header() {
  return (
    <header className="border-b bg-white px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900">
          AutoResell Pro
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            <span className="font-medium">Dealership Manager</span>
            <span className="ml-1 text-slate-400">• Main Branch</span>
          </span>
          <button className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <button className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100" aria-label="User menu">
            <CircleUser className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
