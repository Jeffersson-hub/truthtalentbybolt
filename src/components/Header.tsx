import React from 'react';
import { Users, FileText, Filter, Mail, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {onBack && (
              <>
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Accueil</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
              </>
            )}
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RecrutPro</h1>
              <p className="text-sm text-gray-500">Système de gestion des candidatures</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">CV</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">Filtres</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
              <Mail className="h-5 w-5" />
              <span className="text-sm font-medium">Notifications</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;