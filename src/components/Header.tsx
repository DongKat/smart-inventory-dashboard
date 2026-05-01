function Header() {
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Smart Inventory Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time vehicle stock management</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">Dealership Manager</p>
          <p className="text-xs text-slate-400">Demo Mode</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
