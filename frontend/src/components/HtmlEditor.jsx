"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import { useState as useReactState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import '../../public/admin/css/tiptap-styles.css';

// Custom Font Size Extension removed to prevent messy inline styles
const TextStyleExtended = TextStyle;

const buildSuggestedAltText = (fileName = '') => {
    const withoutExtension = String(fileName).replace(/\.[^.]+$/, '');
    return withoutExtension.replace(/[-_]+/g, ' ').trim();
};

const MenuBar = ({ editor }) => {
    // Tiptap mutates the same editor instance in place, so the toolbar won't
    // re-render on its own when the selection moves. Subscribe to selection /
    // transaction events and force a re-render so the heading dropdown and the
    // active-state buttons always reflect the node under the cursor.
    const [, forceUpdate] = useReactState(0);
    useEffect(() => {
        if (!editor) return undefined;
        const rerender = () => forceUpdate((n) => n + 1);
        editor.on('selectionUpdate', rerender);
        editor.on('transaction', rerender);
        return () => {
            editor.off('selectionUpdate', rerender);
            editor.off('transaction', rerender);
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml';

        input.onchange = async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

            if (!allowedTypes.includes(file.type)) {
                alert('File type not allowed. Please upload: JPEG, PNG, GIF, WebP, or SVG');
                return;
            }

            if (file.size > maxSize) {
                alert('File size exceeds 10MB. Please upload a smaller image.');
                return;
            }

            try {
                const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
                const token = userData.token;

                if (!token) {
                    alert('User not authenticated!');
                    return;
                }

                const formData = new FormData();
                formData.append('images', file);

                const ADMIN_API_BASE =
                    process.env.NEXT_PUBLIC_ADMIN_API_URL ||
                    process.env.NEXT_PUBLIC_API_URL ||
                    process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
                    "http://localhost:5000/";

                const buildAdminUrl = (path) => {
                    const trimmedBase = ADMIN_API_BASE.replace(/\/$/, "");
                    const trimmedPath = path.replace(/^\/+/, "");
                    if (trimmedBase.includes('/admin') && trimmedPath.startsWith('admin/')) {
                        const pathWithoutAdmin = trimmedPath.replace(/^admin\//, '');
                        return `${trimmedBase}/${pathWithoutAdmin}`;
                    }
                    return `${trimmedBase}/${trimmedPath}`;
                };

                const uploadPath = ADMIN_API_BASE.includes('/admin') ? "api/upload" : "admin/api/upload";
                const apiUrl = buildAdminUrl(uploadPath);

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    if (Array.isArray(result) && result.length > 0) {
                        const relativePath = result[0];
                        const buildImageUrl = (path) => {
                            if (!path) return '';
                            if (path.startsWith('http')) return path;
                            const base = ADMIN_API_BASE.replace(/\/$/, '');
                            const cleanBase = base.replace(/\/admin$/, '');
                            const cleanPath = path.startsWith('/') ? path : `/${path}`;
                            return `${cleanBase}${cleanPath}`;
                        };
                        const fullImageUrl = buildImageUrl(relativePath);
                        const finalAltText = buildSuggestedAltText(file.name) || 'Image';
                        editor.chain().focus().setImage({ src: fullImageUrl, alt: finalAltText }).run();
                    } else {
                        alert('No image URL returned from server');
                    }
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || `Upload failed with status ${response.status}`);
                }
            } catch (error) {
                console.error('❌ Upload error:', error);
                alert('Failed to upload image: ' + error.message);
            }
        };

        input.click();
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48, 56, 64, 72];

    return (
        <div className="tiptap-menubar">
            {/* Headings */}
            <select
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'paragraph') {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor.chain().focus().toggleHeading({ level: parseInt(value) }).run();
                    }
                }}
                className="tiptap-select"
                value={editor.isActive('heading') ? editor.getAttributes('heading').level : 'paragraph'}
            >
                <option value="paragraph">Paragraph</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
                <option value="4">Heading 4</option>
                <option value="5">Heading 5</option>
                <option value="6">Heading 6</option>
            </select>

            <div className="tiptap-divider"></div>

            {/* Text Formatting */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                type="button"
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                type="button"
                title="Italic"
            >
                <em>I</em>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'is-active' : ''}
                type="button"
                title="Underline"
            >
                <u>U</u>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
                type="button"
                title="Strikethrough"
            >
                <s>S</s>
            </button>

            <div className="tiptap-divider"></div>

            {/* Alignment */}
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                type="button"
                title="Align Left"
            >
                ⬅
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                type="button"
                title="Align Center"
            >
                ↔
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                type="button"
                title="Align Right"
            >
                ➡
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
                type="button"
                title="Justify"
            >
                ≡
            </button>

            <div className="tiptap-divider"></div>

            {/* Lists */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
                type="button"
                title="Bullet List"
            >
                • List
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
                type="button"
                title="Numbered List"
            >
                1. List
            </button>

            <div className="tiptap-divider"></div>

            {/* Insert */}
            <button
                onClick={setLink}
                className={editor.isActive('link') ? 'is-active' : ''}
                type="button"
                title="Add Link"
            >
                🔗 Link
            </button>
            <button
                onClick={addImage}
                type="button"
                title="Add Image"
            >
                🖼️ Image
            </button>
            <button
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                type="button"
                title="Insert Table"
            >
                📊 Table
            </button>

            <div className="tiptap-divider"></div>

            {/* Blockquote & Code */}
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
                type="button"
                title="Blockquote"
            >
                " Quote
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'is-active' : ''}
                type="button"
                title="Code Block"
            >
                {'<>'} Code
            </button>

            <div className="tiptap-divider"></div>

            {/* Undo/Redo */}
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                type="button"
                title="Undo"
            >
                ↶ Undo
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                type="button"
                title="Redo"
            >
                ↷ Redo
            </button>
        </div >
    );
};

/**
 * Inline alt-text bar shown just above the editor content area
 * whenever an image node is selected.
 */
const ImageAltBar = ({ editor }) => {
    const currentAlt = editor.getAttributes('image').alt || '';
    const [draft, setDraft] = useReactState(currentAlt);

    useEffect(() => {
        setDraft(editor.getAttributes('image').alt || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor.getAttributes('image').alt]);

    const applyAlt = () => {
        editor.chain().focus().updateAttributes('image', { alt: draft.trim() }).run();
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f4f4fb',
            border: '1px solid #d0d0e8',
            borderBottom: 'none',
            padding: '6px 10px',
        }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b4d7c', whiteSpace: 'nowrap' }}>
                🖼 Image Alt Text:
            </span>
            <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyAlt(); } }}
                placeholder="Describe this image for SEO…"
                style={{
                    flex: 1,
                    fontSize: '12px',
                    padding: '3px 8px',
                    border: '1px solid #c8c8e8',
                    borderRadius: '4px',
                    outline: 'none',
                    height: '26px',
                    background: '#fff',
                }}
            />
            <button
                type="button"
                onClick={applyAlt}
                style={{
                    background: '#4b4d7c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    height: '26px',
                    whiteSpace: 'nowrap',
                }}
            >
                ✓ Apply
            </button>
        </div>
    );
};

const HtmlEditor = ({ value, onChange }) => {
    const [imageSelected, setImageSelected] = useReactState(false);
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            Image.configure({
                // Images should behave like block elements so they can be centered reliably.
                inline: false,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                // Don't bake target/rel into stored HTML here — Tiptap's default
                // (`target="_blank" rel="noopener noreferrer nofollow"`) gets applied
                // to every link regardless of destination, including internal
                // akoode.com links. processHtmlLinks() sets the correct rel/target
                // per-link at render time based on whether the href is internal or
                // external, so leave both unset at authoring time.
                HTMLAttributes: {
                    target: null,
                    rel: null,
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder: 'Write your blog content here...',
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onSelectionUpdate: ({ editor }) => {
            setImageSelected(editor.isActive('image'));
        },
        editable: true,
    });

    useEffect(() => {
        if (editor && value !== undefined && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) {
        return (
            <div className="tiptap-wrapper">
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Loading editor...
                </div>
            </div>
        );
    }

    return (
        <div className="tiptap-wrapper">
            <MenuBar editor={editor} />
            {imageSelected && <ImageAltBar editor={editor} />}
            <EditorContent editor={editor} className="tiptap-editor" />
        </div>
    );
};

export default HtmlEditor;
