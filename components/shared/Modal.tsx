import React from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // FIX: Hooks must be called at the top level of the component, before any conditional returns.
  const { i18n } = useTranslation();
  
  if (!isOpen) return null;

  const isRtl = i18n.dir() === 'rtl';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-textPrimary">{title}</h2>
          <button onClick={onClose} className={`text-textSecondary hover:text-textPrimary text-2xl font-bold ${isRtl ? 'ml-auto' : 'mr-auto'}`}>&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
