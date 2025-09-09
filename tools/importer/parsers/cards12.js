/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  // Find all card columns
  const columns = element.querySelectorAll(':scope > .row > .column');

  columns.forEach((col) => {
    // Find image (mandatory)
    let imgEl = null;
    const picture = col.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }

    // Find text/link (mandatory)
    let textCell = document.createElement('div');
    // Get the link (title and CTA)
    const link = col.querySelector('.links a');
    if (link) {
      // Use the link as the title (styled as heading)
      const heading = document.createElement('strong');
      heading.textContent = link.textContent;
      textCell.appendChild(heading);
      // Add a line break for spacing
      textCell.appendChild(document.createElement('br'));
      // Add the link as CTA at the bottom (clone to avoid moving original)
      const cta = link.cloneNode(true);
      textCell.appendChild(cta);
    }
    // Also include any other text content from the column (for flexibility)
    // Get all text nodes in the column that are not inside .links
    const linksDiv = col.querySelector('.links');
    const walker = document.createTreeWalker(col, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (!linksDiv || !linksDiv.contains(node)) {
          if (node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });
    let textContent = '';
    let node;
    while ((node = walker.nextNode())) {
      textContent += node.textContent.trim() + ' ';
    }
    if (textContent.trim()) {
      const desc = document.createElement('div');
      desc.textContent = textContent.trim();
      textCell.insertBefore(desc, textCell.firstChild);
    }

    // Build the row: [image, text cell]
    const row = [imgEl, textCell];
    rows.push(row);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
