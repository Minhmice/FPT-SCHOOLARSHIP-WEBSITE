// Component Loader - Loads HTML components and their CSS
export const componentLoader = {
  async loadComponent(componentName) {
    try {
      // Load HTML
      const htmlResponse = await fetch(`components/${componentName}/${componentName}.html`);
      if (!htmlResponse.ok) {
        throw new Error(`Failed to load ${componentName}.html`);
      }
      const html = await htmlResponse.text();

      // Load main CSS
      const cssResponse = await fetch(`components/${componentName}/${componentName}.css`);
      if (cssResponse.ok) {
        const css = await cssResponse.text();
        // Process @import statements
        const processedCss = await this.processCSSImports(css, componentName);
        this.injectCSS(`${componentName}-styles`, processedCss);
      }

      return html;
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
      return '';
    }
  },

  async processCSSImports(css, componentName) {
    // Match @import url('...') statements
    const importRegex = /@import\s+url\(['"]?([^'"]+)['"]?\);/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(css)) !== null) {
      imports.push(match[1]);
    }

    // Load all imported CSS files
    const importedCSS = await Promise.all(
      imports.map(async (importPath) => {
        // Resolve relative paths
        let resolvedPath = importPath;
        if (importPath.startsWith('./')) {
          resolvedPath = `components/${componentName}/${importPath.substring(2)}`;
        } else if (importPath.startsWith('../')) {
          resolvedPath = importPath.substring(3);
        }
        
        try {
          const response = await fetch(resolvedPath);
          if (response.ok) {
            return await response.text();
          }
        } catch (error) {
          console.warn(`Failed to load CSS import: ${resolvedPath}`, error);
        }
        return '';
      })
    );

    // Replace @import statements with actual CSS content
    let processedCss = css;
    imports.forEach((importPath, index) => {
      const importStatement = `@import url('${importPath}');`;
      processedCss = processedCss.replace(importStatement, importedCSS[index] || '');
    });

    return processedCss;
  },

  injectCSS(id, css) {
    // Check if style tag already exists
    let styleTag = document.getElementById(id);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = id;
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = css;
  },

  async loadAllComponents() {
    const components = [
      'header',
      'hero',
      'quote',
      'catalog',
      'compare',
      'faq',
      'contact',
      'testimonials',
      'footer'
    ];

    const loadPromises = components.map(async (name) => {
      const html = await this.loadComponent(name);
      return { name, html };
    });

    const loadedComponents = await Promise.all(loadPromises);
    
    // Store components for insertion
    this.components = {};
    loadedComponents.forEach(({ name, html }) => {
      this.components[name] = html;
    });

    return this.components;
  },

  insertComponent(componentName, targetSelector, position = 'beforeend') {
    const target = document.querySelector(targetSelector);
    if (!target) {
      console.error(`Target selector "${targetSelector}" not found`);
      return;
    }

    const html = this.components[componentName];
    if (!html) {
      console.error(`Component "${componentName}" not loaded`);
      return;
    }

    target.insertAdjacentHTML(position, html);
  }
};

