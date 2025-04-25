import React from 'react';
import ThemeToggle from '../components/features/ThemeToggle';

/**
 * Layout principal de l'application avec en-tête et pied de page
 */
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-xs">
        <div className="container mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Project Starter</h1>
          <div className="flex items-center space-x-4">
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="hover:text-primary-500 transition-colors">Accueil</a></li>
                <li><a href="/about" className="hover:text-primary-500 transition-colors">À propos</a></li>
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="grow container mx-auto py-8 px-4 sm:px-6">
        {children}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto py-6 px-4 sm:px-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Project Starter. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
} 