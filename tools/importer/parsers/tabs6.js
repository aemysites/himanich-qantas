/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab info from submenu
  function parseTab(submenu) {
    // Find the section title
    const sectionTitleSpan = submenu.querySelector('.primary-navigation__section-title');
    let tabHeading = sectionTitleSpan ? sectionTitleSpan : null;

    // Find all tab items (excluding the section title row)
    const tabItems = Array.from(submenu.querySelectorAll('.primary-navigation__level-item'))
      .filter(li => !li.classList.contains('primary-navigation__level-item--section-title'));

    // Find promo image (if any)
    const promoDiv = submenu.querySelector('.primary-navigation__promo');
    let tabImage = null;
    if (promoDiv) {
      const img = promoDiv.querySelector('img');
      if (img) tabImage = img;
    }

    // Build each tab row
    return tabItems.map(li => {
      // Tab title is the first link text
      const link = li.querySelector('a');
      let tabTitle = link ? link : '';

      // Tab content is the description div (if present)
      const descDiv = li.querySelector('.primary-navigation__description');
      let tabContent = null;
      if (descDiv) tabContent = descDiv;

      // Compose row: always 1 cell (tab title), then only add cells for heading, image, content if present (no empty cells)
      const row = [tabTitle];
      if (tabHeading) row.push(tabHeading);
      if (tabImage) row.push(tabImage);
      if (tabContent) row.push(tabContent);
      // Remove all trailing empty cells (for any reason)
      while (row.length > 1 && (!row[row.length - 1] || (typeof row[row.length - 1] === 'string' && row[row.length - 1].trim() === ''))) {
        row.pop();
      }
      // If after removing trailing empties, only tabTitle remains and it's empty, skip this row
      if (row.length === 1 && (!row[0] || (typeof row[0] === 'string' && row[0].trim() === ''))) {
        return null;
      }
      return row;
    }).filter(Boolean);
  }

  // Find all top-level nav items with submenus
  const navList = element.querySelector('ul.primary-navigation__level--level1');
  const navItems = Array.from(navList.children);

  // Only process nav items with submenu
  const tabRows = [];
  navItems.forEach(li => {
    const submenu = li.querySelector('.primary-navigation__submenu-wrap');
    if (submenu) {
      // Parse all tabs in this submenu
      const rows = parseTab(submenu);
      tabRows.push(...rows);
    }
  });

  // Compose table: header + tab rows
  const cells = [
    ['Tabs (tabs6)'],
    ...tabRows
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
