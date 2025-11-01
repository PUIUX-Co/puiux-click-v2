'use client';

import { useEffect, useRef, useState } from 'react';
import type { Site } from '@/lib/api/sites';
import toast from 'react-hot-toast';

// GrapesJS CSS imports (will be imported in useEffect to avoid SSR issues)
import 'grapesjs/dist/css/grapes.min.css';
import '@/styles/grapesjs-custom.css';

interface GrapesJSEditorProps {
  site: Site;
  onSave: (pages: any) => void;
}

export default function GrapesJSEditor({ site, onSave }: GrapesJSEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!editorRef.current || editor) return;

    // Dynamic import to avoid SSR issues
    import('grapesjs').then(({ default: grapesjs }) => {
      import('grapesjs-preset-webpage').then(({ default: gjsPresetWebpage }) => {
        initializeEditor(grapesjs, gjsPresetWebpage);
      });
    });

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  const initializeEditor = (grapesjs: any, gjsPresetWebpage: any) => {
    if (!editorRef.current) return;

    const editorInstance = grapesjs.init({
      container: editorRef.current,
      height: '100%',
      width: 'auto',

      // Storage
      storageManager: false, // We handle storage manually via API

      // Plugins
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        'gjs-preset-webpage': {
          modalImportTitle: 'استيراد',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">الصق كود HTML/CSS</div>',
          modalImportContent: (editor: any) => editor.getHtml() + '<style>' + editor.getCss() + '</style>',
          filestackOpts: null,
          aviaryOpts: false,
          blocksBasicOpts: {
            blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
            flexGrid: true,
          },
          customStyleManager: [],
        },
      },

      // Canvas
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css',
        ],
        scripts: [],
      },

      // Panels - Customized for Arabic RTL
      panels: {
        defaults: [
          {
            id: 'basic-actions',
            el: '.panel__basic-actions',
            buttons: [
              {
                id: 'visibility',
                active: true,
                className: 'btn-toggle-borders',
                label: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>',
                command: 'sw-visibility',
                attributes: { title: 'عرض/إخفاء الحدود' },
              },
              {
                id: 'preview',
                className: 'btn-preview',
                label: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',
                command: 'preview',
                attributes: { title: 'معاينة' },
              },
              {
                id: 'fullscreen',
                className: 'btn-fullscreen',
                label: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"/></svg>',
                command: 'fullscreen',
                attributes: { title: 'وضع ملء الشاشة' },
              },
              {
                id: 'export',
                className: 'btn-export',
                label: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',
                command: 'export-template',
                attributes: { title: 'تصدير الكود' },
              },
              {
                id: 'undo',
                className: 'btn-undo',
                label: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>',
                command: 'undo',
                attributes: { title: 'تراجع (Ctrl+Z)' },
              },
              {
                id: 'redo',
                className: 'btn-redo',
                label: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',
                command: 'redo',
                attributes: { title: 'إعادة (Ctrl+Y)' },
              },
            ],
          },
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                className: 'btn-device-desktop active',
                label: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd"/></svg>',
                command: 'set-device-desktop',
                active: true,
                attributes: { title: 'ديسكتوب' },
              },
              {
                id: 'device-tablet',
                className: 'btn-device-tablet',
                label: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>',
                command: 'set-device-tablet',
                attributes: { title: 'تابلت' },
              },
              {
                id: 'device-mobile',
                className: 'btn-device-mobile',
                label: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>',
                command: 'set-device-mobile',
                attributes: { title: 'موبايل' },
              },
            ],
          },
        ],
      },

      // Device Manager - Responsive breakpoints
      deviceManager: {
        devices: [
          {
            id: 'desktop',
            name: 'ديسكتوب',
            width: '',
          },
          {
            id: 'tablet',
            name: 'تابلت',
            width: '768px',
            widthMedia: '768px',
          },
          {
            id: 'mobile',
            name: 'موبايل',
            width: '375px',
            widthMedia: '480px',
          },
        ],
      },

      // Style Manager - RTL Support
      styleManager: {
        appendTo: '.styles-container',
        sectors: [
          {
            name: 'العام',
            open: false,
            buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
          },
          {
            name: 'المرونة',
            open: false,
            buildProps: ['flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'order', 'flex-basis', 'flex-grow', 'flex-shrink', 'align-self'],
          },
          {
            name: 'الأبعاد',
            open: false,
            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
          },
          {
            name: 'التصميم',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow'],
          },
          {
            name: 'الزخرفة',
            open: false,
            buildProps: ['border-radius', 'border', 'background-color', 'background', 'box-shadow'],
          },
          {
            name: 'إضافي',
            open: false,
            buildProps: ['transition', 'perspective', 'transform'],
          },
        ],
      },

      // Layer Manager
      layerManager: {
        appendTo: '.layers-container',
      },

      // Blocks Manager
      blockManager: {
        appendTo: '.blocks-container',
      },

      // Traits Manager
      traitManager: {
        appendTo: '.traits-container',
      },

      // Selector Manager
      selectorManager: {
        appendTo: '.selectors-container',
      },
    });

    // Load site data if available
    if (site.pages && typeof site.pages === 'object') {
      try {
        // Check if it's a GrapesJS project format (has pages array)
        const pagesData = site.pages as any;

        if (pagesData.pages && Array.isArray(pagesData.pages)) {
          // New format: GrapesJS project structure
          editorInstance.loadProjectData(pagesData);
        } else if (pagesData.home || pagesData.contact) {
          // Old format: Simple pages structure - needs migration
          console.warn('Old pages format detected, using default template');
        } else {
          // Unknown format
          console.warn('Unknown pages format:', pagesData);
        }
      } catch (error) {
        console.error('Failed to load site pages:', error);
      }
    }

    // Add custom commands
    addCustomCommands(editorInstance);

    // Add keyboard shortcuts
    addKeyboardShortcuts(editorInstance);

    // Make editor globally accessible
    (window as any).grapesEditorInstance = editorInstance;

    setEditor(editorInstance);
    setIsReady(true);

    toast.success('محرر PUIUX Click جاهز! 🎨');
  };

  const addCustomCommands = (editor: any) => {
    // Export template command
    editor.Commands.add('export-template', {
      run: (editor: any) => {
        const html = editor.getHtml();
        const css = editor.getCss();
        const js = editor.getJs();

        const code = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.businessName}</title>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}</script>
</body>
</html>`;

        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${site.slug}.html`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success('تم تصدير الكود بنجاح!');
      },
    });
  };

  const addKeyboardShortcuts = (editor: any) => {
    // Ctrl+S to save
    editor.on('run:preview', () => {
      editor.on('stop:preview', () => {
        editor.refresh();
      });
    });

    // Listen to keyboard events
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const pages = editor.getProjectData();
        onSave(pages);
      }

      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        editor.runCommand('undo');
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y = Redo
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        editor.runCommand('redo');
      }

      // Ctrl/Cmd + P = Preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        editor.runCommand('preview');
      }

      // Delete/Backspace = Delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && editor.getSelected()) {
        e.preventDefault();
        editor.runCommand('core:component-delete');
      }
    });
  };

  return (
    <div className="grapesjs-editor-container h-full w-full relative">
      {/* GrapesJS Container */}
      <div ref={editorRef} id="gjs" className="h-full w-full" />
    </div>
  );
}
