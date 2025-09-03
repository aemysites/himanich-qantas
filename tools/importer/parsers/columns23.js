/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !element.querySelectorAll) return;

  // Get all immediate child sections representing columns
  const sections = Array.from(element.querySelectorAll(':scope .footer__section'));

  // Only include sections that have meaningful content (heading or list)
  const meaningfulSections = sections.filter((section) => {
    const heading = section.querySelector('div h3');
    const list = section.querySelector('ul');
    // Consider a section meaningful if it has a non-empty heading or a list
    return (heading && heading.textContent.trim()) || (list && list.children.length > 0);
  });

  const headerRow = ['Columns (columns23)'];

  // For each meaningful section, gather its content (heading + list)
  const columns = meaningfulSections.map((section) => {
    const colContent = [];
    const headingDiv = section.querySelector('div');
    if (headingDiv && headingDiv.querySelector('h3') && headingDiv.querySelector('h3').textContent.trim()) {
      colContent.push(headingDiv.querySelector('h3'));
    }
    const list = section.querySelector('ul');
    if (list && list.children.length > 0) {
      colContent.push(list);
    }
    // If only one element, just return it, else return array
    return colContent.length === 1 ? colContent[0] : colContent;
  });

  const rows = [headerRow, columns];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
