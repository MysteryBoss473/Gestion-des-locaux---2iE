
import { FC, useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchIcon from './icons/SearchIcon';
import SettingsIcon from './icons/SettingsIcon';
import { useAuth } from '@/hooks/useAuth';

const Navbar: FC = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et texte */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Image
              src="/images/2ie-logo.jpg"
              alt="Logo 2iE"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-white text-lg font-semibold">
              Gestion des locaux - 2iE
            </span>
          </div>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="search"
                placeholder="Rechercher une salle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-blue-500 text-white placeholder-blue-200 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:bg-blue-400"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-3 text-blue-200 hover:text-white"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Menu de paramètres */}
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-transparent hover:bg-blue-500 text-white p-2 rounded-full transition-colors duration-200"
                >
                  <SettingsIcon className="w-6 h-6" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <a
                        href="/password"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Changer le mot de passe
                      </a>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-transparent border border-white hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;