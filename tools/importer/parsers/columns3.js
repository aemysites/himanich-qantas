/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Always use the block name for the header row
  const headerRow = ['Columns block (columns3)'];

  // Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all immediate section columns
  const sections = Array.from(row.querySelectorAll(':scope > section.footer__section'));

  // Only include sections that have actual content (heading or list)
  const columns = sections
    .map((section) => {
      const children = [];
      // Heading (if not empty)
      const h3 = section.querySelector('div > h3');
      if (h3 && h3.textContent.trim()) {
        children.push(h3);
      }
      // List (if present)
      const ul = section.querySelector('ul');
      if (ul) {
        children.push(ul);
      }
      return children.length ? children : null;
    })
    .filter((col) => col); // Remove empty columns

  // Table rows: header, then columns row
  const cells = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
