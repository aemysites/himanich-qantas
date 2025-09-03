/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all immediate child sections (the columns)
  const sections = Array.from(row.querySelectorAll(':scope > section.footer__section'));

  // Only keep sections that have meaningful content (not just empty headings)
  const meaningfulSections = sections.filter((section) => {
    // Check for non-empty heading or non-empty list
    const h3 = section.querySelector('h3');
    const ul = section.querySelector('ul');
    const hasHeading = h3 && h3.textContent.trim();
    const hasList = ul && ul.children.length > 0;
    return hasHeading || hasList;
  });

  // For each meaningful section, collect its direct children (heading, list, etc)
  const columnCells = meaningfulSections.map((section) => {
    // Only include non-empty children
    const children = Array.from(section.children).filter((child) => {
      // Remove empty divs with empty h3
      if (
        child.tagName === 'DIV' &&
        child.children.length === 1 &&
        child.firstElementChild.tagName === 'H3' &&
        !child.firstElementChild.textContent.trim()
      ) {
        return false;
      }
      // Remove divs with only empty h3
      if (
        child.tagName === 'DIV' &&
        child.children.length === 1 &&
        child.firstElementChild.tagName === 'H3'
      ) {
        return !!child.firstElementChild.textContent.trim();
      }
      // Remove empty ul
      if (child.tagName === 'UL' && child.children.length === 0) {
        return false;
      }
      return true;
    });
    if (children.length === 1) return children[0];
    if (children.length === 0) return '';
    return children;
  });

  // Build the table rows
  const headerRow = ['Columns (columns3)'];
  const contentRow = columnCells;
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
