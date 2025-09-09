/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main container
  const container = element;

  // Get the hero image (picture or img)
  let imageEl = null;
  const imageContainer = Array.from(container.querySelectorAll(':scope > div')).find(div => div.classList.contains('HeroImageAndIntro__heroImage'));
  if (imageContainer) {
    // Prefer <picture>, fallback to <img>
    imageEl = imageContainer.querySelector('picture') || imageContainer.querySelector('img');
  }

  // Get the heading (h1)
  let headingEl = null;
  const headingContainer = container.querySelector('.HeroImageAndIntro__intro-heading');
  if (headingContainer) {
    headingEl = headingContainer.querySelector('h1');
  }

  // Get the description (p)
  let descEl = null;
  const descContainer = container.querySelector('.HeroImageAndIntro__intro-description');
  if (descContainer) {
    descEl = descContainer.querySelector('p');
  }

  // Compose table rows
  const headerRow = ['Hero (hero9)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [
    [
      headingEl ? headingEl : '',
      descEl ? descEl : ''
    ].filter(Boolean)
  ];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
