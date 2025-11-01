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
      fromElement: false,

      // Storage
      storageManager: false,

      // Plugins
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        'gjs-preset-webpage': {
          modalImportTitle: 'استيراد الكود',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">الصق كود HTML/CSS</div>',
          modalImportContent: (editor: any) => editor.getHtml() + '<style>' + editor.getCss() + '</style>',
          filestackOpts: null,
          aviaryOpts: false,
          blocksBasicOpts: {
            blocks: [],
            flexGrid: true,
          },
          customStyleManager: [],
        },
      },

      // Canvas
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css',
          'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap',
        ],
        scripts: [],
      },

      // Block Manager
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [],
      },

      // Style Manager
      styleManager: {
        appendTo: '.styles-container',
        sectors: [
          {
            name: 'الأبعاد',
            open: true,
            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
            properties: [
              { property: 'margin', type: 'composite' },
              { property: 'padding', type: 'composite' },
              { property: 'width', type: 'integer', units: ['px', '%', 'vw', 'auto'] },
              { property: 'height', type: 'integer', units: ['px', '%', 'vh', 'auto'] },
            ],
          },
          {
            name: 'التصميم',
            open: true,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align'],
            properties: [
              {
                property: 'font-family',
                type: 'select',
                options: [
                  { value: 'Cairo, sans-serif', name: 'Cairo' },
                  { value: 'Arial, sans-serif', name: 'Arial' },
                  { value: 'Georgia, serif', name: 'Georgia' },
                  { value: 'Courier New, monospace', name: 'Courier' },
                ],
              },
              { property: 'font-size', type: 'integer', units: ['px', 'em', 'rem'] },
              { property: 'font-weight', type: 'select', options: [
                { value: '300', name: 'خفيف' },
                { value: '400', name: 'عادي' },
                { value: '600', name: 'متوسط' },
                { value: '700', name: 'عريض' },
              ]},
              { property: 'color', type: 'color' },
              { property: 'text-align', type: 'radio', options: [
                { value: 'right', name: 'يمين', title: 'يمين' },
                { value: 'center', name: 'وسط', title: 'وسط' },
                { property: 'left', name: 'يسار', title: 'يسار' },
              ]},
            ],
          },
          {
            name: 'الخلفية',
            open: false,
            buildProps: ['background-color', 'background', 'background-image', 'background-size', 'background-position'],
          },
          {
            name: 'الحدود',
            open: false,
            buildProps: ['border-radius', 'border', 'box-shadow'],
          },
          {
            name: 'المرونة',
            open: false,
            buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'gap'],
          },
        ],
      },

      // Layer Manager
      layerManager: {
        appendTo: '.layers-container',
      },

      // Traits Manager
      traitManager: {
        appendTo: '.traits-container',
      },

      // Selector Manager
      selectorManager: {
        appendTo: '.selectors-container',
      },

      // Panels
      panels: {
        defaults: [],
      },

      // Device Manager
      deviceManager: {
        devices: [
          { id: 'desktop', name: 'ديسكتوب', width: '' },
          { id: 'tablet', name: 'تابلت', width: '768px', widthMedia: '768px' },
          { id: 'mobile', name: 'موبايل', width: '375px', widthMedia: '480px' },
        ],
      },
    });

    // Add custom blocks with professional icons
    addCustomBlocks(editorInstance);

    // Add custom panels
    addCustomPanels(editorInstance);

    // Add custom commands
    addCustomCommands(editorInstance);

    // Add keyboard shortcuts
    addKeyboardShortcuts(editorInstance);

    // Load site data
    if (site.pages && typeof site.pages === 'object') {
      try {
        const pagesData = site.pages as any;
        if (pagesData.pages && Array.isArray(pagesData.pages)) {
          editorInstance.loadProjectData(pagesData);
        }
      } catch (error) {
        console.error('Failed to load site pages:', error);
      }
    }

    // Save on change
    editorInstance.on('storage:store', () => {
      const pages = editorInstance.getProjectData();
      onSave(pages);
    });

    // Make editor globally accessible
    (window as any).grapesEditorInstance = editorInstance;

    setEditor(editorInstance);
    setIsReady(true);

    toast.success('محرر PUIUX Click جاهز! 🎨', {
      icon: '✨',
      duration: 3000,
      style: {
        borderRadius: '12px',
        background: '#10b981',
        color: '#fff',
        fontFamily: 'Cairo, sans-serif',
      },
    });
  };

  const addCustomBlocks = (editor: any) => {
    const blockManager = editor.BlockManager;

    // Section Block
    blockManager.add('section', {
      label: 'قسم',
      category: 'Layout',
      content: `
        <section style="padding: 80px 20px; background: #f8fafc; min-height: 400px;">
          <div style="max-width: 1200px; margin: 0 auto;">
            <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem; text-align: center; font-family: Cairo, sans-serif;">عنوان القسم</h2>
            <p style="text-align: center; color: #64748b; font-size: 1.1rem; font-family: Cairo, sans-serif;">أضف محتوى هنا</p>
          </div>
        </section>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
      </svg>`,
      attributes: { class: 'gjs-block-section' },
    });

    // Hero Block
    blockManager.add('hero', {
      label: 'بطل',
      category: 'Layout',
      content: `
        <section style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; padding: 2rem; text-align: center; color: white;">
          <div style="max-width: 800px;">
            <h1 style="font-size: 4rem; font-weight: 800; margin-bottom: 1.5rem; font-family: Cairo, sans-serif;">عنوان رئيسي قوي</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.95; font-family: Cairo, sans-serif;">وصف جذاب لموقعك يلفت انتباه الزائر</p>
            <a href="#" style="display: inline-block; background: white; color: #667eea; padding: 1.2rem 3rem; border-radius: 50px; font-weight: bold; font-size: 1.2rem; text-decoration: none; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: transform 0.3s; font-family: Cairo, sans-serif;">ابدأ الآن</a>
          </div>
        </section>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
      </svg>`,
      attributes: { class: 'gjs-block-hero' },
    });

    // Grid 2 Columns
    blockManager.add('grid-2', {
      label: 'عمودين',
      category: 'Layout',
      content: `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; padding: 2rem;">
          <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; font-family: Cairo, sans-serif;">عنوان</h3>
            <p style="color: #64748b; font-family: Cairo, sans-serif;">محتوى العمود الأول</p>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; font-family: Cairo, sans-serif;">عنوان</h3>
            <p style="color: #64748b; font-family: Cairo, sans-serif;">محتوى العمود الثاني</p>
          </div>
        </div>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="18" rx="1"/>
        <rect x="14" y="3" width="7" height="18" rx="1"/>
      </svg>`,
      attributes: { class: 'gjs-block-grid' },
    });

    // Grid 3 Columns
    blockManager.add('grid-3', {
      label: 'ثلاثة أعمدة',
      category: 'Layout',
      content: `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; padding: 2rem;">
          <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center;">
            <div style="width: 60px; height: 60px; background: #667eea; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.8rem;">✨</div>
            <h3 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 0.5rem; font-family: Cairo, sans-serif;">ميزة 1</h3>
            <p style="color: #64748b; font-family: Cairo, sans-serif;">وصف الميزة</p>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center;">
            <div style="width: 60px; height: 60px; background: #764ba2; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.8rem;">⚡</div>
            <h3 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 0.5rem; font-family: Cairo, sans-serif;">ميزة 2</h3>
            <p style="color: #64748b; font-family: Cairo, sans-serif;">وصف الميزة</p>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center;">
            <div style="width: 60px; height: 60px; background: #f093fb; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.8rem;">🎯</div>
            <h3 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 0.5rem; font-family: Cairo, sans-serif;">ميزة 3</h3>
            <p style="color: #64748b; font-family: Cairo, sans-serif;">وصف الميزة</p>
          </div>
        </div>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="3" width="5" height="18" rx="1"/>
        <rect x="9.5" y="3" width="5" height="18" rx="1"/>
        <rect x="17" y="3" width="5" height="18" rx="1"/>
      </svg>`,
      attributes: { class: 'gjs-block-grid' },
    });

    // Card Block
    blockManager.add('card', {
      label: 'بطاقة',
      category: 'Components',
      content: `
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s; max-width: 400px;">
          <div style="width: 100%; height: 250px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
          <div style="padding: 2rem;">
            <h3 style="font-size: 1.8rem; font-weight: bold; margin-bottom: 1rem; font-family: Cairo, sans-serif;">عنوان البطاقة</h3>
            <p style="color: #64748b; line-height: 1.7; margin-bottom: 1.5rem; font-family: Cairo, sans-serif;">وصف البطاقة يوضح المحتوى والفائدة من هذا العنصر</p>
            <a href="#" style="color: #667eea; font-weight: bold; text-decoration: none; font-family: Cairo, sans-serif;">اقرأ المزيد ←</a>
          </div>
        </div>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <line x1="4" y1="10" x2="20" y2="10"/>
      </svg>`,
      attributes: { class: 'gjs-block-card' },
    });

    // Button Block
    blockManager.add('button', {
      label: 'زر',
      category: 'Components',
      content: `
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2.5rem; border-radius: 50px; font-weight: bold; font-size: 1.1rem; text-decoration: none; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s; font-family: Cairo, sans-serif;">اضغط هنا</a>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="8" width="18" height="8" rx="4"/>
      </svg>`,
      attributes: { class: 'gjs-block-button' },
    });

    // Text Block
    blockManager.add('text', {
      label: 'نص',
      category: 'Basic',
      content: `<p style="font-size: 1rem; line-height: 1.8; color: #475569; font-family: Cairo, sans-serif;">أضف نصك هنا. يمكنك تنسيقه كما تريد.</p>`,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 7h16M4 12h16M4 17h10"/>
      </svg>`,
      attributes: { class: 'gjs-block-text' },
    });

    // Heading Block
    blockManager.add('heading', {
      label: 'عنوان',
      category: 'Basic',
      content: `<h2 style="font-size: 2.5rem; font-weight: bold; color: #1e293b; margin-bottom: 1rem; font-family: Cairo, sans-serif;">عنوان رئيسي</h2>`,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 6h16M4 12h16M4 18h7"/>
        <circle cx="18" cy="18" r="2"/>
      </svg>`,
      attributes: { class: 'gjs-block-heading' },
    });

    // Image Block
    blockManager.add('image', {
      label: 'صورة',
      category: 'Media',
      content: `
        <div style="text-align: center; padding: 2rem;">
          <img src="https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop" alt="صورة" style="width: 100%; max-width: 600px; height: auto; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" />
        </div>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>`,
      attributes: { class: 'gjs-block-image' },
    });

    // Video Block
    blockManager.add('video', {
      label: 'فيديو',
      category: 'Media',
      content: `
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
        </div>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>`,
      attributes: { class: 'gjs-block-video' },
    });

    // Contact Form Block
    blockManager.add('contact-form', {
      label: 'نموذج اتصال',
      category: 'Forms',
      content: `
        <form style="max-width: 600px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #1e293b; font-family: Cairo, sans-serif;">الاسم</label>
            <input type="text" placeholder="أدخل اسمك" style="width: 100%; padding: 0.8rem 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; font-family: Cairo, sans-serif;" />
          </div>
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #1e293b; font-family: Cairo, sans-serif;">البريد الإلكتروني</label>
            <input type="email" placeholder="email@example.com" style="width: 100%; padding: 0.8rem 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; font-family: Cairo, sans-serif;" />
          </div>
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #1e293b; font-family: Cairo, sans-serif;">الرسالة</label>
            <textarea rows="5" placeholder="اكتب رسالتك هنا..." style="width: 100%; padding: 0.8rem 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; resize: vertical; transition: border-color 0.3s; font-family: Cairo, sans-serif;"></textarea>
          </div>
          <button type="submit" style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem; border: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: transform 0.2s; font-family: Cairo, sans-serif;">إرسال</button>
        </form>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>`,
      attributes: { class: 'gjs-block-form' },
    });

    // Footer Block
    blockManager.add('footer', {
      label: 'تذييل',
      category: 'Layout',
      content: `
        <footer style="background: #1e293b; color: white; padding: 4rem 2rem 2rem; margin-top: 4rem;">
          <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem;">
            <div>
              <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; font-family: Cairo, sans-serif;">عن الشركة</h3>
              <p style="color: #94a3b8; line-height: 1.7; font-family: Cairo, sans-serif;">نحن نقدم أفضل الخدمات والمنتجات لعملائنا الكرام.</p>
            </div>
            <div>
              <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; font-family: Cairo, sans-serif;">روابط سريعة</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 0.7rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s; font-family: Cairo, sans-serif;">الرئيسية</a></li>
                <li style="margin-bottom: 0.7rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s; font-family: Cairo, sans-serif;">من نحن</a></li>
                <li style="margin-bottom: 0.7rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s; font-family: Cairo, sans-serif;">خدماتنا</a></li>
                <li style="margin-bottom: 0.7rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s; font-family: Cairo, sans-serif;">اتصل بنا</a></li>
              </ul>
            </div>
            <div>
              <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; font-family: Cairo, sans-serif;">تواصل معنا</h3>
              <p style="color: #94a3b8; margin-bottom: 0.7rem; font-family: Cairo, sans-serif;">📧 info@example.com</p>
              <p style="color: #94a3b8; margin-bottom: 0.7rem; font-family: Cairo, sans-serif;">📱 +966 50 123 4567</p>
              <p style="color: #94a3b8; font-family: Cairo, sans-serif;">📍 الرياض، المملكة العربية السعودية</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #334155;">
            <p style="color: #94a3b8; font-family: Cairo, sans-serif;">© 2024 جميع الحقوق محفوظة</p>
          </div>
        </footer>
      `,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="15" x2="21" y2="15"/>
      </svg>`,
      attributes: { class: 'gjs-block-footer' },
    });
  };

  const addCustomPanels = (editor: any) => {
    const panelManager = editor.Panels;

    // Remove default panels
    panelManager.removePanel('devices-c');
    panelManager.removePanel('options');

    // Top bar - left side (actions)
    panelManager.addPanel({
      id: 'panel-top-left',
      el: '.panel__top-left',
    });

    panelManager.addButton('panel-top-left', [
      {
        id: 'undo',
        className: 'gjs-pn-btn icon-undo',
        command: 'core:undo',
        attributes: { title: 'تراجع (Ctrl+Z)' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6M21 17a9 9 0 00-9-9 9 9 0 00-9 9"/></svg>`,
      },
      {
        id: 'redo',
        className: 'gjs-pn-btn icon-redo',
        command: 'core:redo',
        attributes: { title: 'إعادة (Ctrl+Y)' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6M3 17a9 9 0 019-9 9 9 0 019 9"/></svg>`,
      },
      {
        id: 'clear-canvas',
        className: 'gjs-pn-btn icon-clear',
        command: 'core:canvas-clear',
        attributes: { title: 'مسح الكل' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`,
      },
    ]);

    // Top bar - center (devices)
    panelManager.addPanel({
      id: 'panel-top-center',
      el: '.panel__top-center',
    });

    panelManager.addButton('panel-top-center', [
      {
        id: 'device-desktop',
        className: 'gjs-pn-btn icon-device active',
        command: 'set-device-desktop',
        attributes: { title: 'ديسكتوب' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
        active: true,
      },
      {
        id: 'device-tablet',
        className: 'gjs-pn-btn icon-device',
        command: 'set-device-tablet',
        attributes: { title: 'تابلت' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>`,
      },
      {
        id: 'device-mobile',
        className: 'gjs-pn-btn icon-device',
        command: 'set-device-mobile',
        attributes: { title: 'موبايل' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>`,
      },
    ]);

    // Top bar - right side (view options)
    panelManager.addPanel({
      id: 'panel-top-right',
      el: '.panel__top-right',
    });

    panelManager.addButton('panel-top-right', [
      {
        id: 'visibility',
        className: 'gjs-pn-btn icon-visibility active',
        command: 'sw-visibility',
        attributes: { title: 'عرض/إخفاء الحدود' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        active: true,
      },
      {
        id: 'preview',
        className: 'gjs-pn-btn icon-preview',
        command: 'preview',
        attributes: { title: 'معاينة' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`,
      },
      {
        id: 'fullscreen',
        className: 'gjs-pn-btn icon-fullscreen',
        command: 'fullscreen',
        attributes: { title: 'ملء الشاشة' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>`,
      },
      {
        id: 'export',
        className: 'gjs-pn-btn icon-export',
        command: 'export-template',
        attributes: { title: 'تصدير الكود' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>`,
      },
    ]);

    // Left sidebar tabs
    panelManager.addPanel({
      id: 'panel-left-tabs',
      el: '.panel__left-tabs',
    });

    panelManager.addButton('panel-left-tabs', [
      {
        id: 'show-blocks',
        className: 'gjs-pn-btn tab-btn active',
        command: 'show-blocks',
        attributes: { title: 'البلوكات' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg><span>البلوكات</span>`,
        active: true,
      },
    ]);

    // Right sidebar tabs
    panelManager.addPanel({
      id: 'panel-right-tabs',
      el: '.panel__right-tabs',
    });

    panelManager.addButton('panel-right-tabs', [
      {
        id: 'show-styles',
        className: 'gjs-pn-btn tab-btn active',
        command: 'show-styles',
        attributes: { title: 'التصميم' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span>التصميم</span>`,
        active: true,
      },
      {
        id: 'show-layers',
        className: 'gjs-pn-btn tab-btn',
        command: 'show-layers',
        attributes: { title: 'الطبقات' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg><span>الطبقات</span>`,
      },
      {
        id: 'show-traits',
        className: 'gjs-pn-btn tab-btn',
        command: 'show-traits',
        attributes: { title: 'الخصائص' },
        label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg><span>الخصائص</span>`,
      },
    ]);
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
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; margin: 0; padding: 0; }
    ${css}
  </style>
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

        toast.success('تم تصدير الكود بنجاح! 📦');
      },
    });

    // Show/hide panels commands
    editor.Commands.add('show-blocks', {
      run: (editor: any) => {
        document.querySelector('.blocks-container')?.classList.add('active');
        document.querySelector('.layers-container')?.classList.remove('active');
        document.querySelector('.styles-container')?.classList.remove('active');
        document.querySelector('.traits-container')?.classList.remove('active');
      },
    });

    editor.Commands.add('show-layers', {
      run: (editor: any) => {
        document.querySelector('.blocks-container')?.classList.remove('active');
        document.querySelector('.layers-container')?.classList.add('active');
        document.querySelector('.styles-container')?.classList.remove('active');
        document.querySelector('.traits-container')?.classList.remove('active');
      },
    });

    editor.Commands.add('show-styles', {
      run: (editor: any) => {
        document.querySelector('.blocks-container')?.classList.remove('active');
        document.querySelector('.layers-container')?.classList.remove('active');
        document.querySelector('.styles-container')?.classList.add('active');
        document.querySelector('.traits-container')?.classList.remove('active');
      },
    });

    editor.Commands.add('show-traits', {
      run: (editor: any) => {
        document.querySelector('.blocks-container')?.classList.remove('active');
        document.querySelector('.layers-container')?.classList.remove('active');
        document.querySelector('.styles-container')?.classList.remove('active');
        document.querySelector('.traits-container')?.classList.add('active');
      },
    });

    // Set device commands
    editor.Commands.add('set-device-desktop', {
      run: (editor: any) => editor.setDevice('desktop'),
    });

    editor.Commands.add('set-device-tablet', {
      run: (editor: any) => editor.setDevice('tablet'),
    });

    editor.Commands.add('set-device-mobile', {
      run: (editor: any) => editor.setDevice('mobile'),
    });
  };

  const addKeyboardShortcuts = (editor: any) => {
    // Listen to keyboard events
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const pages = editor.getProjectData();
        onSave(pages);
        toast.success('تم الحفظ! 💾');
      }

      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        editor.runCommand('core:undo');
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y = Redo
      if ((e.ctrlKey || e.metaKey) && ((e.shiftKey && e.key === 'z') || e.key === 'y')) {
        e.preventDefault();
        editor.runCommand('core:redo');
      }

      // Delete/Backspace = Delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && editor.getSelected()) {
        e.preventDefault();
        editor.runCommand('core:component-delete');
      }
    });
  };

  return (
    <div className="grapesjs-editor-wrapper">
      {/* Top Bar */}
      <div className="editor-topbar">
        <div className="panel__top-left" />
        <div className="panel__top-center" />
        <div className="panel__top-right" />
      </div>

      {/* Main Editor Area */}
      <div className="editor-main">
        {/* Left Sidebar */}
        <div className="editor-sidebar editor-sidebar-left">
          <div className="panel__left-tabs" />
          <div className="blocks-container active" />
        </div>

        {/* Canvas */}
        <div className="editor-canvas">
          <div ref={editorRef} id="gjs" />
        </div>

        {/* Right Sidebar */}
        <div className="editor-sidebar editor-sidebar-right">
          <div className="panel__right-tabs" />
          <div className="styles-container active" />
          <div className="layers-container" />
          <div className="traits-container" />
          <div className="selectors-container" />
        </div>
      </div>
    </div>
  );
}
