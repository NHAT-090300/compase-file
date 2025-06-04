"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ModalContent = {
  title?: string;
  description?: string;
  body?: ReactNode;
  footer?: ReactNode;
};

type ModalContextType = {
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useGlobalModal = () => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useGlobalModal must be used within ModalProvider");
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({});

  const openModal = (content: ModalContent) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent({});
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            {modalContent.title && (
              <DialogTitle>{modalContent.title}</DialogTitle>
            )}
            {modalContent.description && (
              <DialogDescription>{modalContent.description}</DialogDescription>
            )}
          </DialogHeader>
          {modalContent.body && <div className="py-2">{modalContent.body}</div>}
          {modalContent.footer && (
            <div className="pt-4">{modalContent.footer}</div>
          )}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};
