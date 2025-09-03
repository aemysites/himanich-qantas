/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Hero (hero24)'];

  // Get the hero image (picture or img)
  let imageEl = null;
  const heroImageContainer = element.querySelector('.HeroImageAndIntro__heroImage');
  if (heroImageContainer) {
    // Prefer picture if present, else img
    imageEl = heroImageContainer.querySelector('picture') || heroImageContainer.querySelector('img');
  }

  // Get the heading (h1)
  let headingEl = null;
  const headingContainer = element.querySelector('.HeroImageAndIntro__intro-heading');
  if (headingContainer) {
    headingEl = headingContainer.querySelector('h1');
  }

  // Get the description (paragraph)
  let descEl = null;
  const descContainer = element.querySelector('.HeroImageAndIntro__intro-description');
  if (descContainer) {
    descEl = descContainer.querySelector('p');
  }

  // Second row: image only (if present)
  const imageRow = [imageEl ? imageEl : ''];

  // Third row: heading and description (if present)
  // Compose an array of elements for the cell, preserving order and spacing
  const contentArr = [];
  if (headingEl) contentArr.push(headingEl);
  if (descEl) contentArr.push(descEl);
  const contentRow = [contentArr.length ? contentArr : ''];

  // Compose table
  const tableCells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
