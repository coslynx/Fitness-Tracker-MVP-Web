'use client'

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { ModalProps } from '@/types/common';
import { Modal } from '@/components/common';

const MyModal: React.FC<ModalProps> = ({ show, onClose, title, children }) => {
  const { setShowModal, setErrorMessage } = useStore();

  // Handle modal state
  const [showModalState, setShowModalState] = useState(false);
  useEffect(() => {
    setShowModalState(show);
  }, [show]);

  const handleClose = () => {
    onClose();
    setShowModalState(false);
  };

  return (
    <Modal show={showModalState} onClose={handleClose} title={title}>
      {children}
    </Modal>
  );
};

export default MyModal;