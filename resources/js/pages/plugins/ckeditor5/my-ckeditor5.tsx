/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NoJgNARCB0DMcUgRgAwBYQA5MHYcFYUA2JTENWAgTjQtnyv0pM30yRzUzRxEQgCmAO0QowwJGEmSxMgLqR8AMyooOVCHKA==
 */

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    BlockToolbar,
    Bold,
    Bookmark,
    ClassicEditor,
    Code,
    CodeBlock,
    Emoji,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    FullPage,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageEditing,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUtils,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Mention,
    PageBreak,
    Paragraph,
    RemoveFormat,
    ShowBlocks,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
} from 'ckeditor5';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import usePermission from '@/hooks/use-permission';
import 'ckeditor5/ckeditor5.css';
import '../../../../css/ckeditor-custom.css';
import MyFileManager from '../file-manager/MyFileManager';

/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

export default function MyCkeditor5({ data, setData }: { data: string; setData: React.Dispatch<React.SetStateAction<string>> }) {
    const hasPermission = usePermission();

    const uniqueId = useId(); // this is supported in React 18+
    const toolbarContainerId = `ck-toolbar-container-${uniqueId}`;
    const toolbarPlaceHolderId = `ck-toolbar-placeholder-${uniqueId}`;

    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }

        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'sourceEditing',
                        'showBlocks',
                        '|',
                        'heading',
                        'style',
                        '|',
                        'fontSize',
                        'fontFamily',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        'link',
                        'insertImageViaUrl',
                        'insertTable',
                        'highlight',
                        'blockQuote',
                        'codeBlock',
                        '|',
                        'alignment',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'todoList',
                        'outdent',
                        'indent',
                    ],
                    shouldNotGroupWhenFull: true,
                },
                plugins: [
                    Alignment,
                    Autoformat,
                    AutoImage,
                    AutoLink,
                    Autosave,
                    BalloonToolbar,
                    BlockQuote,
                    BlockToolbar,
                    Bold,
                    Bookmark,
                    Code,
                    CodeBlock,
                    Essentials,
                    FindAndReplace,
                    FontBackgroundColor,
                    FontColor,
                    FontFamily,
                    FontSize,
                    FullPage,
                    GeneralHtmlSupport,
                    Heading,
                    Highlight,
                    HorizontalLine,
                    HtmlEmbed,
                    ImageBlock,
                    ImageCaption,
                    ImageEditing,
                    ImageInline,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUtils,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    PageBreak,
                    Paragraph,
                    RemoveFormat,
                    ShowBlocks,
                    SourceEditing,
                    SpecialCharacters,
                    SpecialCharactersArrows,
                    SpecialCharactersCurrency,
                    SpecialCharactersEssentials,
                    SpecialCharactersLatin,
                    SpecialCharactersMathematical,
                    SpecialCharactersText,
                    Strikethrough,
                    Style,
                    Subscript,
                    Superscript,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TextTransformation,
                    TodoList,
                    Underline,
                    Emoji,
                    Mention,
                    MediaEmbed,
                ],
                mediaEmbed: {
                    previewsInData: true, // 👈 IMPORTANT: enables embeds to render in saved data
                },
                balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
                blockToolbar: [
                    'fontSize',
                    'fontColor',
                    'fontBackgroundColor',
                    '|',
                    'bold',
                    'italic',
                    '|',
                    'link',
                    'insertTable',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'outdent',
                    'indent',
                ],
                fontFamily: {
                    supportAllValues: true,
                },
                fontSize: {
                    options: [10, 12, 14, 'default', 18, 20, 22],
                    supportAllValues: true,
                },
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph',
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1',
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2',
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3',
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4',
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5',
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6',
                        },
                    ],
                },
                htmlSupport: {
                    allow: [
                        {
                            name: /^.*$/,
                            styles: true,
                            attributes: true,
                            classes: true,
                        },
                    ],
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageTextAlternative',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:breakText',
                        '|',
                        'resizeImage',
                    ],
                },
                initialData: data,
                licenseKey: LICENSE_KEY,
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file',
                            },
                        },
                    },
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true,
                    },
                },
                menuBar: {
                    isVisible: true,
                },
                placeholder: 'Type or paste your content here!',
                style: {
                    definitions: [
                        {
                            name: 'Article category',
                            element: 'h3',
                            classes: ['category'],
                        },
                        {
                            name: 'Title',
                            element: 'h2',
                            classes: ['document-title'],
                        },
                        {
                            name: 'Subtitle',
                            element: 'h3',
                            classes: ['document-subtitle'],
                        },
                        {
                            name: 'Info box',
                            element: 'p',
                            classes: ['info-box'],
                        },
                        {
                            name: 'Side quote',
                            element: 'blockquote',
                            classes: ['side-quote'],
                        },
                        {
                            name: 'Marker',
                            element: 'span',
                            classes: ['marker'],
                        },
                        {
                            name: 'Spoiler',
                            element: 'span',
                            classes: ['spoiler'],
                        },
                        {
                            name: 'Code (dark)',
                            element: 'pre',
                            classes: ['fancy-code', 'fancy-code-dark'],
                        },
                        {
                            name: 'Code (bright)',
                            element: 'pre',
                            classes: ['fancy-code', 'fancy-code-bright'],
                        },
                    ],
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
                },
            },
        };
    }, [isLayoutReady]);

    // Handle the CKEditor toolbar and MyFileManager component
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

        // Keep CKEditor Sticky
        const toolbarContainer = document.getElementById(toolbarContainerId);
        if (toolbarContainer) {
            toolbarContainer.classList.remove('relative'); // Remove relative
            toolbarContainer.classList.add('sticky', 'top-0'); // Add sticky and top-0
        }
        // End Keep CKEditor Sticky
    };
    // console.log('EditorRef:', editorRef.current);
    // End Handle the CKEditor toolbar and MyFileManager component

    return (
        <div className="prose max-w-none rounded border border-dashed border-gray-500 p-2 shadow">
            <div id={toolbarContainerId} className="relative top-0 border bg-transparent text-sm">
                {/* Wrap MyFileManager and CKEditor toolbar together */}
                {hasPermission('file_manager view') && (
                    <div className="absolute top-0 right-0">
                        <MyFileManager toolbarContainerId={toolbarContainerId} handleInsertMedia={handleInsertMedia} />
                    </div>
                )}

                {/* <Button
                    type="button"
                    onClick={() => handleInsertMedia('image', 'https://ckeditor.com/docs/ckeditor5/latest/assets/img/game_boy.jpg')}
                >
                    add image
                </Button>
                <Button
                    type="button"
                    onClick={() => handleInsertMedia('file', 'https://ckeditor.com/docs/ckeditor5/latest/assets/img/game_boy.jpg', 'filename')}
                >
                    add file
                </Button> */}
                {/* Insert CKEditor toolbar position */}
                <div id={toolbarPlaceHolderId} className="border-none" />
            </div>
            {editorConfig && (
                <CKEditor
                    data={data}
                    onReady={(editor) => {
                        editorRef.current = editor;
                        // Move the toolbar into the sticky container
                        const toolbarElement = editor.ui.view.toolbar.element;
                        const menubar = editor.ui.view.menuBarView.element;
                        const placeholder = document.getElementById(toolbarPlaceHolderId);

                        if (placeholder && toolbarElement) {
                            // Make sure to append the toolbar after MyFileManager component
                            placeholder.appendChild(menubar);
                            placeholder.appendChild(toolbarElement);
                        }
                    }}
                    onFocus={(event, editor) => {
                        // console.log('Focus event triggered');
                        // Change the toolbar container to sticky on focus
                        const toolbarContainer = document.getElementById(toolbarContainerId);
                        if (toolbarContainer) {
                            toolbarContainer.classList.remove('relative'); // Remove relative
                            toolbarContainer.classList.add('sticky', 'top-0', 'z-[50]'); // Add sticky and top-0
                        }
                    }}
                    onBlur={(event, editor) => {
                        setTimeout(() => {
                            const isEditorFocused = editor.ui.focusTracker.isFocused;
                            // console.log('Actual isFocused after blur timeout:', isEditorFocused);

                            if (!isEditorFocused) {
                                const toolbarContainer = document.getElementById(toolbarContainerId);
                                if (toolbarContainer) {
                                    toolbarContainer.classList.remove('sticky', 'top-0', 'z-[50]');
                                    toolbarContainer.classList.add('relative');
                                }
                            }
                        }, 200); // Give it some time to update
                    }}
                    onChange={(event, editor) => {
                        setData(editor.getData());
                        // console.log('Editor Data:', data);
                    }}
                    editor={ClassicEditor}
                    config={editorConfig}
                />
            )}
        </div>
    );
}
