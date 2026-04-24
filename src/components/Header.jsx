function Header() {
  return (
    <div className="rounded-[32px] bg-white px-6 py-6 shadow-sm sm:px-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Dashboard
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Welcome back — manage your exam timetables
        </p>
      </div>
    </div>
  );
}

export default Header;
