class Pagination {
  constructor(containerElement, totalPages, currentPage, onPageChange) {
    this.containerElement = containerElement;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.onPageChange = onPageChange;

    this.render();
  }

  render() {
    this.containerElement.innerHTML = '';

    // Create the "First page" button
    const firstPageButton = document.createElement('button');
    firstPageButton.textContent = '|<';
    firstPageButton.disabled = this.currentPage === 1;
    firstPageButton.addEventListener('click', () => this.goToPage(1));

    // Create the "Previous page" button
    const previousPageButton = document.createElement('button');
    previousPageButton.textContent = '<<';
    previousPageButton.disabled = this.currentPage === 1;
    previousPageButton.addEventListener('click', () => this.goToPage(this.currentPage - 1));

    // Create the current page indicator
    const currentPageIndicator = document.createElement('span');
    currentPageIndicator.textContent = `Pág. ${this.currentPage} de ${this.totalPages}`;

    // Create the "Next page" button
    const nextPageButton = document.createElement('button');
    nextPageButton.textContent = '>>';
    nextPageButton.disabled = this.currentPage === this.totalPages;
    nextPageButton.addEventListener('click', () => this.goToPage(this.currentPage + 1));

    // Create the "Last page" button
    const lastPageButton = document.createElement('button');
    lastPageButton.textContent = '>|';
    lastPageButton.disabled = this.currentPage === this.totalPages;
    lastPageButton.addEventListener('click', () => this.goToPage(this.totalPages));

    // Append buttons and indicator to the container element
    this.containerElement.appendChild(firstPageButton);
    this.containerElement.appendChild(previousPageButton);
    this.containerElement.appendChild(currentPageIndicator);
    this.containerElement.appendChild(nextPageButton);
    this.containerElement.appendChild(lastPageButton);
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.render();
      this.onPageChange(this.currentPage);
    }
  }
}

export default Pagination;
