/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab rows from a nav.primary-navigation
  function getTabRows(nav) {
    const rows = [];
    // Get all top-level menu items (li)
    const menuItems = nav.querySelectorAll(':scope > div > ul > li.primary-navigation__level-item');
    menuItems.forEach((li) => {
      // 1st cell: Tab title (the visible text in the top-level <a>)
      let tabTitle = '';
      const mainLink = li.querySelector(':scope > a.primary-navigation__item, :scope > a.link-event:not(.primary-navigation__see-children)');
      if (mainLink) {
        tabTitle = mainLink.textContent.trim();
      } else {
        // fallback: first <a> child
        const fallbackLink = li.querySelector(':scope > a');
        if (fallbackLink) tabTitle = fallbackLink.textContent.trim();
      }
      // 2nd cell: Tab Heading (from submenu section title, if any)
      let tabHeading = '';
      const submenu = li.querySelector(':scope > div.primary-navigation__submenu-wrap');
      if (submenu) {
        const headingSpan = submenu.querySelector('.primary-navigation__section-title');
        if (headingSpan) {
          tabHeading = headingSpan.textContent.trim();
        }
      }
      // 3rd cell: Tab Image (from submenu promo img, if any)
      let tabImage = '';
      if (submenu) {
        const promoImg = submenu.querySelector('.primary-navigation__promo img');
        if (promoImg) {
          tabImage = promoImg;
        }
      }
      // 4th cell: Tab Content (submenu list of links and descriptions, if any)
      let tabContent = '';
      if (submenu) {
        // Get the <ul> of submenu items, skip the section-title li
        const ul = submenu.querySelector('ul.primary-navigation__level--level2');
        if (ul) {
          // Clone the ul and remove the section-title li
          const ulClone = ul.cloneNode(true);
          const sectionTitleLi = ulClone.querySelector('.primary-navigation__level-item--section-title');
          if (sectionTitleLi) sectionTitleLi.remove();
          // If the ul has any li left, use it as content
          if (ulClone.children.length > 0) {
            tabContent = ulClone;
          }
        }
      }
      // Only add rows for tabs that have a title
      if (tabTitle) {
        // Only include as many cells as needed (no unnecessary empty columns)
        const row = [tabTitle];
        if (tabHeading || tabImage || tabContent) {
          row.push(tabHeading || '');
          if (tabImage || tabContent) {
            row.push(tabImage || '');
            if (tabContent) {
              row.push(tabContent);
            }
          }
        }
        rows.push(row);
      }
    });
    return rows;
  }

  const headerRow = ['Tabs'];
  const tabRows = getTabRows(element);
  const cells = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
