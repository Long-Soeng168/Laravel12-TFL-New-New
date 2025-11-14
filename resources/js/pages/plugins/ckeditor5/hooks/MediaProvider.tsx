import React, { createContext, useContext, useState } from 'react';

// Create a context
const MediaContext = createContext({
    handleInsertMedia: (type: 'image' | 'file', url: string, fileName?: string) => {},
});

// Create a provider component
export const MediaProvider: React.FC = ({ children }) => {
    const handleInsertMedia = (type: 'image' | 'file', url: string, fileName?: string) => {
        if (!editorRef.current) {
            console.warn('Editor not initialized');
            return;
        }

        editorRef.current.model.change((writer: any) => {
            const insertPosition = editorRef.current.model.document.selection.getFirstPosition();

            if (type === 'image') {
                const imageElement = writer.createElement('imageBlock', {
                    src: url,
                });
                editorRef.current.model.insertContent(imageElement, insertPosition);
            } else if (type === 'file' && fileName) {
                const linkText = writer.createText(fileName, {
                    linkHref: url,
                });
                editorRef.current.model.insertContent(linkText, insertPosition);
            }
        });
    };

    return (
        <MediaContext.Provider value={{ handleInsertMedia }}>
            {children}
        </MediaContext.Provider>
    );
};

// Custom hook to use media context
export const useMedia = () => useContext(MediaContext);
