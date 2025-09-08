/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a column
  function getImage(column) {
    // Find the first <img> inside the column
    const img = column.querySelector('img');
    return img || '';
  }

  // Helper to extract text and CTA from a column
  function getTextContent(column) {
    const cellContent = [];
    // Find the link in the .links parbase
    const linksParbase = column.querySelector('.links.parbase');
    if (linksParbase) {
      const link = linksParbase.querySelector('a');
      if (link) {
        // Title as <strong>
        const strong = document.createElement('strong');
        strong.textContent = link.textContent;
        cellContent.push(strong);
      }
    }
    // Try to extract description text if any (not just the link)
    // Look for any text nodes or elements in .links.parbase except the <a>
    if (linksParbase) {
      // Get all child nodes except the <a> and <div style="clear:both">
      Array.from(linksParbase.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text) {
            cellContent.push(document.createTextNode(text));
          }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'A' && node.tagName !== 'DIV') {
          cellContent.push(node.cloneNode(true));
        }
      });
    }
    // Add the CTA link at the end if present
    if (linksParbase) {
      const link = linksParbase.querySelector('a');
      if (link) {
        cellContent.push(document.createElement('br'));
        cellContent.push(link.cloneNode(true));
      }
    }
    return cellContent.length ? cellContent : '';
  }

  // Get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > .row > .column'));

  // Build table rows
  const rows = [];
  const headerRow = ['Cards (cards5)'];
  rows.push(headerRow);

  columns.forEach((column) => {
    // Defensive: skip empty columns
    const img = getImage(column);
    const textContent = getTextContent(column);
    if (img || textContent) {
      rows.push([
        img,
        textContent,
      ]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
