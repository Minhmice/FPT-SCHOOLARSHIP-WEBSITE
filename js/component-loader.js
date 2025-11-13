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

      // Load CSS
      const cssResponse = await fetch(`components/${componentName}/${componentName}.css`);
      if (cssResponse.ok) {
        const css = await cssResponse.text();
        this.injectCSS(`${componentName}-styles`, css);
      }

      return html;
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
      return '';
    }
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
      'finder',
      'catalog',
      'compare',
      'financial-aid',
      'faq',
      'contact',
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

