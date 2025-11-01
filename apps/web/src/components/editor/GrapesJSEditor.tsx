'use client';

import { useEffect, useRef, useState } from 'react';
import type { Site } from '@/lib/api/sites';
import toast from 'react-hot-toast';
import Script from 'next/script';

// Import GrapesJS base CSS - CRITICAL for proper functionality
import 'grapesjs/dist/css/grapes.min.css';
import '@/styles/grapesjs-custom.css';

interface GrapesJSEditorProps {
  site: Site;
  onSave: (pages: any) => void;
}

export default function GrapesJSEditor({ site, onSave }: GrapesJSEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [currentDevice, setCurrentDevice] = useState('desktop');
  const [activeTab, setActiveTab] = useState('styles');

  useEffect(() => {
    if (!editorRef.current || editor) return;

    import('grapesjs').then(({ default: grapesjs }) => {
      import('grapesjs-preset-webpage').then(({ default: gjsPresetWebpage }) => {
        const editorInstance = grapesjs.init({
          container: '#gjs-editor',
          height: '100%',
          width: 'auto',
          fromElement: false,
          storageManager: false,

          canvas: {
            styles: [
              'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap',
            ],
          },

          plugins: [gjsPresetWebpage],
          pluginsOpts: {
            'gjs-preset-webpage': {
              modalImportTitle: 'استيراد الكود',
              modalImportLabel: 'الصق كود HTML/CSS',
              blocksBasicOpts: { flexGrid: true },
            },
          },

          blockManager: {
            appendTo: '#blocks-panel',
          },

          styleManager: {
            appendTo: '#styles-panel',
            sectors: [
              {
                name: 'الأبعاد',
                open: true,
                buildProps: ['width', 'height', 'padding', 'margin'],
              },
              {
                name: 'النصوص',
                open: false,
                buildProps: [
                  'font-family',
                  'font-size',
                  'font-weight',
                  'color',
                  'text-align',
                  'line-height',
                  'letter-spacing',
                ],
              },
              {
                name: 'الخلفية',
                open: false,
                buildProps: ['background-color', 'background', 'background-image'],
              },
              {
                name: 'الحدود',
                open: false,
                buildProps: ['border', 'border-radius', 'box-shadow'],
              },
              {
                name: 'العرض',
                open: false,
                buildProps: [
                  'display',
                  'flex-direction',
                  'justify-content',
                  'align-items',
                  'gap',
                  'position',
                  'top',
                  'right',
                  'bottom',
                  'left',
                  'z-index',
                ],
              },
            ],
          },

          layerManager: {
            appendTo: '#layers-panel',
          },

          deviceManager: {
            devices: [
              { id: 'desktop', name: 'Desktop', width: '' },
              { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '768px' },
              { id: 'mobile', name: 'Mobile', width: '375px', widthMedia: '480px' },
            ],
          },

          // Panels configuration
          panels: {
            defaults: [],
          },
        });

        // Make editor accessible globally for AI Content Generator
        (window as any).grapesEditorInstance = editorInstance;

        // Load site data
        if (site.pages) {
          try {
            const pagesData = site.pages as any;
            if (pagesData.pages && Array.isArray(pagesData.pages)) {
              editorInstance.loadProjectData(pagesData);
            }
          } catch (error) {
            console.error('Failed to load site:', error);
          }
        }

        // Auto-save on change
        editorInstance.on('update', () => {
          const data = editorInstance.getProjectData();
          onSave(data);
        });

        setEditor(editorInstance);
        toast.success('المحرر جاهز للعمل!', {
          icon: '✨',
          style: {
            fontFamily: 'Cairo, sans-serif',
          },
        });
      });
    });

    return () => {
      if (editor) {
        editor.destroy();
      }
      // Cleanup global reference
      delete (window as any).grapesEditorInstance;
    };
  }, []);

  const handleUndo = () => {
    editor?.runCommand('core:undo');
  };

  const handleRedo = () => {
    editor?.runCommand('core:redo');
  };

  const handleDeviceChange = (device: string) => {
    setCurrentDevice(device);
    editor?.setDevice(device);
  };

  const handlePreview = () => {
    editor?.runCommand('preview');
  };

  const handleSave = () => {
    const data = editor?.getProjectData();
    onSave(data);
    toast.success('تم الحفظ بنجاح!', {
      icon: '💾',
      style: {
        fontFamily: 'Cairo, sans-serif',
      },
    });
  };

  const handleClear = () => {
    if (confirm('هل أنت متأكد من حذف كل المحتوى؟')) {
      editor?.runCommand('core:canvas-clear');
    }
  };

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" />

      <div className="puiux-editor-wrapper">
        {/* Top Toolbar */}
        <div className="puiux-toolbar">
          <div className="toolbar-section toolbar-left">
            <button className="toolbar-btn" onClick={handleUndo} title="تراجع">
              <i className="fas fa-undo"></i>
            </button>
            <button className="toolbar-btn" onClick={handleRedo} title="إعادة">
              <i className="fas fa-redo"></i>
            </button>
            <button className="toolbar-btn toolbar-btn-danger" onClick={handleClear} title="مسح الكل">
              <i className="fas fa-trash"></i>
            </button>
          </div>

          <div className="toolbar-section toolbar-center">
            <div className="device-switcher">
              <button
                className={`device-btn ${currentDevice === 'desktop' ? 'active' : ''}`}
                onClick={() => handleDeviceChange('desktop')}
                title="عرض سطح المكتب"
              >
                <i className="fas fa-desktop"></i>
              </button>
              <button
                className={`device-btn ${currentDevice === 'tablet' ? 'active' : ''}`}
                onClick={() => handleDeviceChange('tablet')}
                title="عرض الجهاز اللوحي"
              >
                <i className="fas fa-tablet-alt"></i>
              </button>
              <button
                className={`device-btn ${currentDevice === 'mobile' ? 'active' : ''}`}
                onClick={() => handleDeviceChange('mobile')}
                title="عرض الهاتف"
              >
                <i className="fas fa-mobile-alt"></i>
              </button>
            </div>
          </div>

          <div className="toolbar-section toolbar-right">
            <button className="toolbar-btn" onClick={handlePreview} title="معاينة">
              <i className="fas fa-eye"></i>
            </button>
            <button className="toolbar-btn toolbar-btn-primary" onClick={handleSave} title="حفظ">
              <i className="fas fa-save"></i>
              <span>حفظ</span>
            </button>
          </div>
        </div>

        {/* Main Editor */}
        <div className="puiux-editor-main">
          {/* Left Sidebar - Blocks */}
          <div className="puiux-sidebar puiux-sidebar-left">
            <div className="puiux-sidebar-header">
              <i className="fas fa-th-large"></i>
              <span>المكونات</span>
            </div>
            <div id="blocks-panel" className="puiux-sidebar-content"></div>
          </div>

          {/* Canvas */}
          <div className="puiux-canvas-area">
            <div ref={editorRef} id="gjs-editor"></div>
          </div>

          {/* Right Sidebar - Styles & Layers */}
          <div className="puiux-sidebar puiux-sidebar-right">
            <div className="puiux-sidebar-tabs">
              <button
                className={`puiux-sidebar-tab ${activeTab === 'styles' ? 'active' : ''}`}
                onClick={() => setActiveTab('styles')}
              >
                <i className="fas fa-paint-brush"></i>
                <span>التصميم</span>
              </button>
              <button
                className={`puiux-sidebar-tab ${activeTab === 'layers' ? 'active' : ''}`}
                onClick={() => setActiveTab('layers')}
              >
                <i className="fas fa-layer-group"></i>
                <span>الطبقات</span>
              </button>
            </div>
            <div className="puiux-sidebar-content">
              <div
                id="styles-panel"
                style={{ display: activeTab === 'styles' ? 'block' : 'none' }}
              ></div>
              <div
                id="layers-panel"
                style={{ display: activeTab === 'layers' ? 'block' : 'none' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
