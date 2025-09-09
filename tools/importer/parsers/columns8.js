/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nav list containing anchor links
  let navList = null;
  const uls = element.querySelectorAll('ul');
  for (const ul of uls) {
    if (ul.querySelector('a.anchor-link')) {
      navList = ul;
      break;
    }
  }
  if (!navList) return;

  // Extract all <li> elements (each is a link)
  const items = Array.from(navList.children).filter(li => li.tagName === 'LI');
  if (!items.length) return;

  // Split into two columns as visually shown (half and half)
  const mid = Math.ceil(items.length / 2);
  const col1 = document.createElement('ul');
  const col2 = document.createElement('ul');
  items.slice(0, mid).forEach(li => col1.appendChild(li.cloneNode(true)));
  items.slice(mid).forEach(li => col2.appendChild(li.cloneNode(true)));

  // Build the table rows
  const headerRow = ['Columns (columns8)'];
  const contentRow = [col1, col2];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
