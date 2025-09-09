/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Find all immediate section columns
  let sections = Array.from(row.querySelectorAll(':scope > section.footer__section'));

  // Remove trailing empty columns (columns with no meaningful content)
  while (sections.length > 0) {
    const section = sections[sections.length - 1];
    // Check if section is empty (no non-empty text, no links, no lists, no headings)
    const hasContent = Array.from(section.querySelectorAll('a, li, h3, p')).some(el => el.textContent.trim().length > 0);
    if (!hasContent) {
      sections.pop();
    } else {
      break;
    }
  }

  // Header row: must match target block name exactly
  const headerRow = ['Columns block (columns3)'];

  // Second row: each cell is the content of a column (section)
  const contentRow = sections.map((section) => {
    // Gather all children except empty text nodes
    const children = Array.from(section.childNodes).filter(node => {
      return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
    });
    // If empty, return an empty div
    if (children.length === 0) {
      const emptyDiv = document.createElement('div');
      return emptyDiv;
    }
    // Return children as array (WebImporter will flatten)
    return children;
  });

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
