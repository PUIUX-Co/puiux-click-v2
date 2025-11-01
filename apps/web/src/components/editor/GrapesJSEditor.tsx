'use client';

import { useEffect, useRef, useState } from 'react';
import type { Site } from '@/lib/api/sites';
import toast from 'react-hot-toast';

import 'grapesjs/dist/css/grapes.min.css';
import '@/styles/grapesjs-custom.css';

interface GrapesJSEditorProps {
  site: Site;
  onSave: (pages: any) => void;
}

export default function GrapesJSEditor({ site, onSave }: GrapesJSEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    if (!editorRef.current || editor) return;

    import('grapesjs').then(({ default: grapesjs }) => {
      import('grapesjs-preset-webpage').then(({ default: gjsPresetWebpage }) => {
        const editorInstance = grapesjs.init({
          container: '#gjs',
          height: '100%',
          width: 'auto',
          fromElement: false,
          storageManager: false,

          // Canvas config
          canvas: {
            styles: [
              'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap',
            ],
          },

          // Plugins
          plugins: [gjsPresetWebpage],
          pluginsOpts: {
            'gjs-preset-webpage': {
              modalImportTitle: 'استيراد',
              modalImportLabel: 'الصق الكود',
              blocksBasicOpts: { flexGrid: true },
            },
          },

          // Block Manager
          blockManager: {
            appendTo: '#blocks',
          },

          // Style Manager
          styleManager: {
            appendTo: '#styles',
            sectors: [
              {
                name: 'الأبعاد',
                open: true,
                buildProps: ['width', 'height', 'padding', 'margin'],
              },
              {
                name: 'النص',
                open: false,
                buildProps: ['font-family', 'font-size', 'color', 'text-align'],
              },
              {
                name: 'التصميم',
                open: false,
                buildProps: ['background', 'border', 'border-radius', 'box-shadow'],
              },
            ],
          },

          // Layer Manager
          layerManager: {
            appendTo: '#layers',
          },

          // Device Manager
          deviceManager: {
            devices: [
              { id: 'desktop', name: 'Desktop', width: '' },
              { id: 'tablet', name: 'Tablet', width: '768px' },
              { id: 'mobile', name: 'Mobile', width: '375px' },
            ],
          },
        });

        // Load site data
        if (site.pages) {
          try {
            const pagesData = site.pages as any;
            if (pagesData.pages && Array.isArray(pagesData.pages)) {
              editorInstance.loadProjectData(pagesData);
            }
          } catch (error) {
            console.error('Failed to load:', error);
          }
        }

        // Auto-save
        editorInstance.on('storage:store', () => {
          const data = editorInstance.getProjectData();
          onSave(data);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const data = editorInstance.getProjectData();
            onSave(data);
            toast.success('تم الحفظ!');
          }
        });

        setEditor(editorInstance);
        toast.success('المحرر جاهز!');
      });
    });

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  return (
    <div className="editor-container">
      {/* Top Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-section">
          <button className="toolbar-btn" onClick={() => editor?.runCommand('core:undo')} title="تراجع">
            ↶
          </button>
          <button className="toolbar-btn" onClick={() => editor?.runCommand('core:redo')} title="إعادة">
            ↷
          </button>
        </div>

        <div className="toolbar-section">
          <button className="toolbar-btn" onClick={() => editor?.setDevice('desktop')} title="ديسكتوب">
            🖥️
          </button>
          <button className="toolbar-btn" onClick={() => editor?.setDevice('tablet')} title="تابلت">
            📱
          </button>
          <button className="toolbar-btn" onClick={() => editor?.setDevice('mobile')} title="موبايل">
            📱
          </button>
        </div>

        <div className="toolbar-section">
          <button className="toolbar-btn" onClick={() => editor?.runCommand('preview')} title="معاينة">
            👁️
          </button>
          <button className="toolbar-btn" onClick={() => {
            const data = editor?.getProjectData();
            onSave(data);
            toast.success('تم الحفظ!');
          }} title="حفظ">
            💾
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="editor-main">
        {/* Left Panel */}
        <div className="editor-panel editor-panel-left">
          <div className="panel-header">البلوكات</div>
          <div id="blocks" className="panel-content"></div>
        </div>

        {/* Canvas */}
        <div className="editor-canvas">
          <div ref={editorRef} id="gjs"></div>
        </div>

        {/* Right Panel */}
        <div className="editor-panel editor-panel-right">
          <div className="panel-tabs">
            <button className="panel-tab active" onClick={() => {
              document.getElementById('styles')!.style.display = 'block';
              document.getElementById('layers')!.style.display = 'none';
            }}>التصميم</button>
            <button className="panel-tab" onClick={() => {
              document.getElementById('styles')!.style.display = 'none';
              document.getElementById('layers')!.style.display = 'block';
            }}>الطبقات</button>
          </div>
          <div id="styles" className="panel-content"></div>
          <div id="layers" className="panel-content" style={{ display: 'none' }}></div>
        </div>
      </div>
    </div>
  );
}
