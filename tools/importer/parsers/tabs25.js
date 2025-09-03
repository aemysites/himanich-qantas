/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab info from a menuitem with submenu
  function extractTabInfo(menuItem) {
    // Tab Title
    let tabTitle = '';
    // Use only valid selectors
    const tabLink = menuItem.querySelector('a.primary-navigation__item') || menuItem.querySelector('a.link-event');
    if (tabLink) {
      tabTitle = tabLink.textContent.trim();
    } else {
      // fallback: first <a> direct child
      const firstLink = menuItem.querySelector('a');
      if (firstLink) tabTitle = firstLink.textContent.trim();
    }

    // Submenu
    const submenu = menuItem.querySelector('div.primary-navigation__submenu-wrap');
    let tabHeading = '';
    let tabImage = null;
    let tabContent = null;
    if (submenu) {
      // Tab Heading
      const headingSpan = submenu.querySelector('.primary-navigation__section-title');
      if (headingSpan) {
        tabHeading = headingSpan.textContent.trim();
      }
      // Tab Image
      const promoImg = submenu.querySelector('.primary-navigation__promo img');
      if (promoImg) {
        tabImage = promoImg;
      }
      // Tab Content: Compose all tab panels as a list
      const level2 = submenu.querySelector('ul.primary-navigation__level--level2');
      if (level2) {
        // Each li is a tab panel
        const panels = [];
        level2.querySelectorAll('li:not(.primary-navigation__level-item--section-title)').forEach(li => {
          // Title
          const panelTitleLink = li.querySelector('a.primary-navigation__item') || li.querySelector('a.link-event');
          let panelTitle = '';
          if (panelTitleLink) {
            panelTitle = panelTitleLink.textContent.trim();
          }
          // Description
          const descDiv = li.querySelector('.primary-navigation__description');
          let descContent = null;
          if (descDiv) {
            descContent = descDiv;
          }
          // Compose panel
          const panelFrag = document.createElement('div');
          if (panelTitle) {
            const h4 = document.createElement('h4');
            h4.textContent = panelTitle;
            panelFrag.appendChild(h4);
          }
          if (descContent) {
            panelFrag.appendChild(descContent);
          }
          panels.push(panelFrag);
        });
        if (panels.length) {
          tabContent = panels;
        }
      }
    }
    return [tabTitle, tabHeading || '', tabImage, tabContent];
  }

  // Find all top-level menuitems (tabs)
  const menuItems = Array.from(element.querySelectorAll('div > ul.primary-navigation__level > li'));
  // Only include those with submenu (tabs)
  const tabMenuItems = menuItems.filter(li => li.querySelector('div.primary-navigation__submenu-wrap'));

  // Compose rows
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];
  tabMenuItems.forEach(menuItem => {
    const [tabTitle, tabHeading, tabImage, tabContent] = extractTabInfo(menuItem);
    // Defensive: always 4 columns
    rows.push([
      tabTitle || '',
      tabHeading || '',
      tabImage || '',
      tabContent || ''
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
