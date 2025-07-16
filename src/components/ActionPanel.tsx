import React, { useState } from 'react';
import { Send, Users, CheckCircle, XCircle, Mail, Phone, Calendar, Eye, MessageSquare } from 'lucide-react';

interface ActionPanelProps {
  selectedCount: number;
  rejectedCount: number;
  totalProcessed: number;
  onSendNotifications: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ 
  selectedCount, 
  rejectedCount, 
  totalProcessed,
  onSendNotifications 
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState(
    `Bonjour,

Nous vous remercions pour votre candidature et l'intérêt que vous portez à notre entreprise.

Après avoir examiné attentivement votre profil, nous regrettons de vous informer que nous ne pourrons pas donner suite à votre candidature pour ce poste.

Cette décision ne remet nullement en cause vos compétences et qualifications. Nous vous encourageons à postuler pour d'autres opportunités qui pourraient correspondre davantage à votre profil.

Nous vous souhaitons plein succès dans vos recherches.

Cordialement,
L'équipe de recrutement`
  );

  const handleSendNotifications = () => {
    onSendNotifications();
    setIsConfirmOpen(false);
  };

  const handleContactSelected = (action: string) => {
    // Simuler les actions pour les candidats sélectionnés
    switch (action) {
      case 'call':
        alert(`Préparation des appels pour ${selectedCount} candidat${selectedCount > 1 ? 's' : ''} sélectionné${selectedCount > 1 ? 's' : ''}.\n\nListe des numéros générée avec succès !`);
        break;
      case 'email':
        alert(`Ouverture du client email pour contacter ${selectedCount} candidat${selectedCount > 1 ? 's' : ''} sélectionné${selectedCount > 1 ? 's' : ''}.\n\nEmails préparés avec succès !`);
        break;
      case 'meeting':
        alert(`Préparation des invitations de meeting pour ${selectedCount} candidat${selectedCount > 1 ? 's' : ''} sélectionné${selectedCount > 1 ? 's' : ''}.\n\nLiens de calendrier générés !`);
        break;
      case 'cv':
        alert(`Ouverture des CV des ${selectedCount} candidat${selectedCount > 1 ? 's' : ''} sélectionné${selectedCount > 1 ? 's' : ''}.\n\nFichiers PDF préparés pour consultation !`);
        break;
    }
    setIsActionsOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions de recrutement</h2>
      
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Total traités</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{totalProcessed}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">Retenus</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{selectedCount}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-900">Non retenus</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{rejectedCount}</p>
        </div>
      </div>

      {/* Actions pour les candidats sélectionnés */}
      {selectedCount > 0 && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">
            Actions pour les candidats retenus ({selectedCount})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleContactSelected('call')}
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Phone className="h-4 w-4" />
              <span>Appeler</span>
            </button>
            <button
              onClick={() => handleContactSelected('email')}
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => handleContactSelected('meeting')}
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Calendar className="h-4 w-4" />
              <span>Meeting</span>
            </button>
            <button
              onClick={() => handleContactSelected('cv')}
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <Eye className="h-4 w-4" />
              <span>Voir CV</span>
            </button>
          </div>
        </div>
      )}

      {/* Envoi des notifications de refus */}
      {rejectedCount > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Send className="h-5 w-5" />
            <span>Envoyer les notifications de refus ({rejectedCount})</span>
          </button>
          
          <p className="text-sm text-gray-500 mt-2 text-center">
            Les candidats non retenus recevront automatiquement un email de notification
          </p>
        </div>
      )}

      {/* Modal de confirmation pour les notifications de refus */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmer l'envoi des notifications
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Vous êtes sur le point d'envoyer des emails de refus à {rejectedCount} candidat{rejectedCount > 1 ? 's' : ''}.
                Cette action est irréversible.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle d'email
                </label>
                <textarea
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  rows={12}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendNotifications}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Envoyer les notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;