import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

// CKEditor 5 core
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

class InsertImageC extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('insertImage', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true
      });

      view.on('execute', () => {
        const container = document.querySelector('#local-editor');

        if (!container) {
          console.warn('Container #local-editor not found.');
          return;
        }

        // Modal Component
        const ImageModal = ({ onSelect, onClose }) => {
          return (
            <div
              style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
              }}
            >
              <div
                style={{
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  minWidth: '300px',
                  textAlign: 'center'
                }}
              >
                <h3>Select Image</h3>
                <button
                  onClick={() =>
                    onSelect({
                      media: ['https://via.placeholder.com/300x200.png']
                    })
                  }
                >
                  Insert Placeholder Image
                </button>
                <br />
                <button onClick={onClose} style={{ marginTop: '10px' }}>
                  Cancel
                </button>
              </div>
            </div>
          );
        };

        // Cleanup modal
        function toggleModalInsertImage() {
          ReactDOM.unmountComponentAtNode(container);
        }

        // Insert selected image(s)
        function handleGetSelectMedia(payload) {
          if (payload && payload.media) {
            _.each(payload.media, imageUrl => {
              editor.model.change(writer => {
                const imageElement = writer.createElement('image', { src: imageUrl });
                editor.model.insertContent(imageElement, editor.model.document.selection);
              });
            });

            toggleModalInsertImage();
          }
        }

        // Render modal
        ReactDOM.render(
          <ImageModal
            onSelect={handleGetSelectMedia}
            onClose={toggleModalInsertImage}
          />,
          container
        );
      });

      return view;
    });
  }
}

export default InsertImageC;
