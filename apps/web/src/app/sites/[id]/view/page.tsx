'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSite } from '@/lib/api/sites';
import Head from 'next/head';

interface ViewPageProps {
  params: {
    id: string;
  };
}

export default function ViewPage({ params }: ViewPageProps) {
  const router = useRouter();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadSite();
    
    // Poll for updates every 5 seconds to refresh preview
    const interval = setInterval(() => {
      loadSite(false); // Silent refresh
    }, 5000);
    
    // Also listen for storage events (cross-tab updates)
    const handleStorageChange = () => {
      loadSite(false);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom refresh event
    const handleRefresh = () => {
      loadSite(false);
    };
    
    window.addEventListener('site:refresh', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('site:refresh', handleRefresh);
    };
  }, [params.id]);

  const loadSite = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await getSite(params.id);
      setSite(data);
      setError(false);
    } catch (error) {
      console.error('Failed to load site:', error);
      if (showLoading) {
        setError(true);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const componentToHtml = (comp: any): string => {
    if (!comp) return '';

    // If it's a string, return it directly
    if (typeof comp === 'string') return comp;

    // If component type is 'html' and has content, return the content directly
    if (comp.type === 'html' && comp.content) {
      return comp.content;
    }

    // If it has direct HTML content as string
    if (typeof comp.components === 'string') {
      return comp.components;
    }

    // If it has content as HTML string
    if (comp.content && typeof comp.content === 'string' && !Array.isArray(comp.components)) {
      // Check if content looks like HTML
      if (comp.content.trim().startsWith('<')) {
        return comp.content;
      }
    }

    // Build opening tag
    const tagName = comp.tagName || comp.type || 'div';
    
    // Skip building tag if it's a text node or special component type
    if (comp.type === 'textnode' || comp.type === 'text') {
      return comp.content || '';
    }

    let html = `<${tagName}`;

    // Add attributes
    if (comp.attributes) {
      Object.entries(comp.attributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          html += ` ${key}="${String(value).replace(/"/g, '&quot;')}"`;
        }
      });
    }

    // Add inline styles from comp.style object
    if (comp.style && typeof comp.style === 'object') {
      const styleStr = Object.entries(comp.style)
        .map(([key, value]) => {
          // Convert camelCase to kebab-case
          const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `${kebabKey}: ${value}`;
        })
        .join('; ');
      if (styleStr) {
        html += ` style="${styleStr}"`;
      }
    }

    // Add classes
    if (comp.classes && Array.isArray(comp.classes) && comp.classes.length > 0) {
      html += ` class="${comp.classes.join(' ')}"`;
    } else if (comp.className) {
      html += ` class="${comp.className}"`;
    } else if (comp.attributes?.class) {
      html += ` class="${comp.attributes.class}"`;
    }

    html += '>';

    // Add content
    if (comp.content && typeof comp.content === 'string') {
      html += comp.content;
    }

    // Add children components
    if (Array.isArray(comp.components)) {
      comp.components.forEach((child: any) => {
        html += componentToHtml(child);
      });
    }

    // Close tag
    html += `</${tagName}>`;

    return html;
  };

  const renderSite = () => {
    if (!site?.pages) {
      console.warn('No pages data found in site:', site);
      return <div className="p-8 text-center">لا يوجد محتوى</div>;
    }

    const grapesData = site.pages;
    
    // Handle both direct pages array and nested structure
    let pagesArray = grapesData.pages;
    if (!pagesArray && Array.isArray(grapesData)) {
      pagesArray = grapesData;
    }
    
    if (!pagesArray || !Array.isArray(pagesArray) || pagesArray.length === 0) {
      console.warn('No pages found in grapesData:', grapesData);
      return <div className="p-8 text-center">لا يوجد محتوى</div>;
    }

    const firstPage = pagesArray[0];
    if (!firstPage) return <div className="p-8 text-center">لا يوجد محتوى</div>;

    // Handle different page structures
    let frame = firstPage.frames?.[0];
    if (!frame && firstPage.component) {
      // If frame doesn't exist but component does, create a frame structure
      frame = { component: firstPage.component };
    }
    
    if (!frame) {
      console.warn('No frame found in first page:', firstPage);
      return <div className="p-8 text-center">لا يوجد محتوى</div>;
    }

    const component = frame.component;
    
    if (!component) {
      console.warn('No component found in frame:', frame);
      return <div className="p-8 text-center">لا يوجد محتوى</div>;
    }

    // Build HTML from component tree
    let html = '';
    if (component) {
      // Handle different component structures
      if (typeof component.components === 'string') {
        // If components is already HTML string
        html = component.components;
      } else if (Array.isArray(component.components)) {
        // If components is an array of components, process each one
        component.components.forEach((comp: any) => {
          const componentHtml = componentToHtml(comp);
          if (componentHtml) {
            html += componentHtml;
          }
        });
      } else if (component.components && typeof component.components === 'object') {
        // If components is an object, try to process it
        html += componentToHtml(component.components);
      } else if (component.content && typeof component.content === 'string') {
        // If component has direct content as HTML
        if (component.content.trim().startsWith('<')) {
          html = component.content;
        } else {
          // If it's text content, wrap it
          html = `<div>${component.content}</div>`;
        }
      } else {
        // Try to convert the component itself
        html = componentToHtml(component);
      }
    }
    
    // If no HTML generated, try to get HTML directly from wrapper
    if (!html || html.trim().length === 0) {
      // Try alternative method: get HTML from GrapesJS structure directly
      try {
        const wrapper = component;
        if (wrapper && wrapper.components) {
          if (typeof wrapper.components === 'string') {
            html = wrapper.components;
          } else if (Array.isArray(wrapper.components)) {
            wrapper.components.forEach((comp: any) => {
              html += componentToHtml(comp);
            });
          }
        }
      } catch (e) {
        console.error('Failed to extract HTML from wrapper:', e);
      }
    }
    
    // Add debug logging in development
    if (typeof window !== 'undefined') {
      console.log('=== Site Rendering Debug ===');
      console.log('Site ID:', site.id);
      console.log('Has pages:', !!site.pages);
      console.log('GrapesData:', grapesData);
      console.log('Pages array:', pagesArray);
      console.log('First page:', firstPage);
      console.log('Frame:', frame);
      console.log('Component:', component);
      console.log('Rendered HTML (first 1000 chars):', html.substring(0, 1000));
      console.log('HTML length:', html.length);
      console.log('===========================');
    }

    // Build CSS
    let css = '';

    // Add Google Fonts for Cairo
    css += `@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');\n`;
    css += `body { font-family: 'Cairo', sans-serif; direction: rtl; }\n`;

    if (grapesData.styles && Array.isArray(grapesData.styles)) {
      grapesData.styles.forEach((style: any) => {
        if (style.style) {
          css += style.style + '\n';
        }
        if (style.selectors) {
          const selector = Array.isArray(style.selectors)
            ? style.selectors.map((s: any) => typeof s === 'string' ? `.${s}` : `.${s.name}`).join(', ')
            : '';
          if (selector && style.style) {
            css += `${selector} { ${style.style} }\n`;
          }
        }
      });
    }

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xl font-bold">جاري تحميل موقعك...</p>
          <p className="mt-2 text-sm text-muted-foreground">صبراً، الموقع يتحمل</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-md text-center">
          <div className="mb-6 text-6xl">😔</div>
          <h1 className="mb-4 text-3xl font-bold">الموقع غير موجود</h1>
          <p className="mb-6 text-muted-foreground">
            عذراً، لم نتمكن من العثور على هذا الموقع
          </p>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{site.name} - PUIUX Click</title>
        <meta name="description" content={site.description || site.name} />
        <meta property="og:title" content={site.name} />
        <meta property="og:description" content={site.description || site.name} />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        {renderSite()}

        {/* PUIUX Branding Badge */}
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href="https://puiuxclick.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white/95 px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-sm transition-all hover:border-primary hover:shadow-xl"
          >
            <span>مصنوع بـ</span>
            <img
              src="https://puiux.com/wp-content/uploads/2021/09/Logo-Black-Copress.svg"
              alt="PUIUX"
              className="h-3"
            />
            <span className="font-bold">Click</span>
          </a>
        </div>
      </div>
    </>
  );
}
