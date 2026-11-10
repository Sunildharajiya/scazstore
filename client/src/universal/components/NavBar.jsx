import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import Logo from "../../assets/images/scazstore-logo.png";

const Nav = ({ isLoggedIn = false, notificationCount = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "Groceries", link: "/groceries" },
    { name: "Vegetables", link: "/vegetables" },
    { name: "Daily Needs", link: "/daily-needs" },
    { name: "Offers", link: "/offers" },
  ];

  // Outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setSearchOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Auto focus
  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    console.log("Searching:", search.trim());

    // Connect search API here
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* MAIN NAVBAR */}
        <div className="h-[72px] flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 shrink-0">

  <img
    src={Logo}
    alt="ScazStore Logo"
    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-green-500"
  />

  <div>
    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-green-950">
      Scaz<span className="text-green-500">Store</span>
    </h1>

    <p className="text-[8px] sm:text-[9px] font-bold tracking-[1.5px] text-gray-500">
      SHOP SMART. LIVE BETTER.
    </p>
  </div>

</Link>


          {/* DESKTOP SEARCH */}
          <div
  ref={searchRef}
  className="hidden md:flex items-center justify-end flex-1"
>
  <div
    className={`transition-all duration-300 ease-in-out ${
      searchOpen ? "w-full max-w-lg" : "w-11"
    }`}
  >

              {searchOpen ? (

                <form
                  onSubmit={handleSearch}
                  className="flex items-center w-full bg-gray-50 border border-green-300 rounded-full px-5 py-3 shadow-sm focus-within:ring-4 focus-within:ring-green-100 focus-within:border-green-500 transition"
                >

                  <SearchIcon />

                  <input
                    ref={inputRef}
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search groceries, vegetables, daily needs..."
                    className="flex-1 min-w-0 bg-transparent outline-none px-3 text-sm text-gray-800 placeholder:text-gray-400"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="text-gray-400 hover:text-gray-700 mr-2"
                    >
                      ✕
                    </button>
                  )}

                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
                  >
                    Search
                  </button>

                </form>

              ) : (

                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-11 h-11 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center transition"
                  aria-label="Open search"
                >
                  <SearchIcon />
                </button>

              )}

            </div>

          </div>


          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* MOBILE SEARCH BUTTON */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-50 transition"
              aria-label="Toggle search"
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>


            {/* NOTIFICATIONS */}
            {isLoggedIn && (
              <Link
                to="/notifications"
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-50 transition"
                aria-label="Notifications"
              >
                <BellIcon />

                {notificationCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </Link>
            )}


            {/* ACCOUNT */}
            <Link
              to={isLoggedIn ? "/account" : "/login"}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 hover:bg-green-100 text-green-800 transition"
              aria-label="Account"
            >
              <UserIcon />
            </Link>


            {/* MENU */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-50 text-green-900 transition"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

          </div>

        </div>


        {/* MOBILE SEARCH INPUT */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            searchOpen
              ? "max-h-24 opacity-100 pb-3"
              : "max-h-0 opacity-0"
          }`}
        >

          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-green-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100"
          >

            <SearchIcon />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full min-w-0 bg-transparent outline-none px-3 text-sm"
            />

            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>

          </form>

        </div>


        {/* MENU DROPDOWN */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            menuOpen
              ? "max-h-[450px] opacity-100 pb-4"
              : "max-h-0 opacity-0"
          }`}
        >

          <div className="border-t border-gray-100 pt-3">

            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">
              Explore ScazStore
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1">

              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                >
                  {item.name}
                </Link>
              ))}

            </div>

            {isLoggedIn && (
              <Link
                to="/notifications"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 mt-2 text-sm font-semibold text-gray-700 hover:bg-green-50 rounded-xl"
              >
                My Notifications
              </Link>
            )}

            <div className="mt-3 px-3 text-xs text-gray-400">
              Freshness at your fingertips. 🥬
            </div>

          </div>

        </div>

      </div>

    </header>
  );
};


// SVG ICONS

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-5 h-5 text-gray-700 shrink-0"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);


const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-5 h-5 text-gray-700"
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M10 21h4" />
  </svg>
);


const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-5 h-5"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M5 21a7 7 0 0 1 14 0" />
  </svg>
);


const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-6 h-6"
  >
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);


const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-6 h-6"
  >
    <path d="m18 6-12 12M6 6l12 12" />
  </svg>
);


export default Nav;