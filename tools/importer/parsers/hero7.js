/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main container
  const container = element;

  // Get the hero image (picture or img)
  let imageEl = null;
  const heroImageDiv = container.querySelector('.HeroImageAndIntro__heroImage');
  if (heroImageDiv) {
    imageEl = heroImageDiv.querySelector('picture') || heroImageDiv.querySelector('img');
  }

  // Get the heading (h1)
  let headingEl = null;
  const headingDiv = container.querySelector('.HeroImageAndIntro__intro-heading');
  if (headingDiv) {
    headingEl = headingDiv.querySelector('h1');
  }

  // Get the description (paragraph)
  let descEl = null;
  const descDiv = container.querySelector('.HeroImageAndIntro__intro-description');
  if (descDiv) {
    descEl = descDiv.querySelector('p');
  }

  // Build the table rows
  const headerRow = ['Hero (hero7)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [
    [
      headingEl ? headingEl : '',
      descEl ? descEl : ''
    ]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
