/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a column
  function getImage(col) {
    const img = col.querySelector('img');
    return img || '';
  }

  // Helper to extract card text and CTA from a column
  function getTextContent(col) {
    // Find the .links container
    const linkContainer = col.querySelector('.links');
    let title = null;
    let cta = null;
    let ctaHref = null;
    if (linkContainer) {
      // The first <a> is the CTA/title
      const link = linkContainer.querySelector('a');
      if (link) {
        // Create a heading for the card title
        title = document.createElement('strong');
        title.textContent = link.textContent;
        cta = link.cloneNode(true);
        ctaHref = cta.getAttribute('href');
      }
    }
    // Compose cell content: title (strong), description (if any), and CTA (link)
    const cellContent = document.createElement('div');
    if (title) cellContent.appendChild(title);
    // Try to find description text (text nodes or elements not in .links)
    // Look for text nodes or elements in the column that are not part of .links or .responsive-image
    Array.from(col.childNodes).forEach((node) => {
      if (
        node.nodeType === Node.TEXT_NODE && node.textContent.trim() &&
        !node.parentElement?.classList?.contains('links') &&
        !node.parentElement?.classList?.contains('responsive-image')
      ) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        cellContent.appendChild(p);
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        !node.classList.contains('links') &&
        !node.classList.contains('responsive-image')
      ) {
        // If it's an element and not .links or .responsive-image, include its text
        const text = node.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          cellContent.appendChild(p);
        }
      }
    });
    if (cta) {
      cellContent.appendChild(document.createElement('br'));
      cellContent.appendChild(cta);
    }
    return cellContent.childNodes.length ? cellContent : '';
  }

  // Get all columns in the row
  const row = element.querySelector('.row');
  const columns = row ? row.querySelectorAll(':scope > .column') : [];

  // Build table rows
  const cells = [];
  // Header row
  const headerRow = ['Cards (cards5)'];
  cells.push(headerRow);

  // Each card is a row: [image, text content]
  columns.forEach((col) => {
    // Defensive: skip empty columns
    if (!col.textContent.trim()) return;
    const img = getImage(col);
    const textContent = getTextContent(col);
    // Only add if there's at least image or text
    if (img || textContent) {
      cells.push([
        img,
        textContent,
      ]);
    }
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
