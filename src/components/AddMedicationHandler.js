import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Global handler for "Add Medication" button
 * Listens to events from BottomNav and redirects to Dashboard
 */
const AddMedicationHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpenAddMedication = (event) => {
      console.log('🌐 [Global] Received openAddMedication event:', event.detail);
      
      const method = event.detail?.method || 'search';
      
      // Navigate to dashboard with state
      navigate('/dashboard', { 
        state: { 
          openModal: true,
          method: method 
        },
        replace: false
      });
    };

    console.log('🔗 [Global] Adding global openAddMedication listener');
    window.addEventListener('openAddMedication', handleOpenAddMedication);

    return () => {
      console.log('🔗 [Global] Removing global openAddMedication listener');
      window.removeEventListener('openAddMedication', handleOpenAddMedication);
    };
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default AddMedicationHandler;
