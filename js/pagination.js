class Pagination {
  constructor(containerElement, totalPages, currentPage, onPageChange) {
    this.containerElement = containerElement;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.onPageChange = onPageChange;
    this.createElements();
  }

  render() {
    this.firstPageButton.disabled = this.currentPage === 1;
    this.previousPageButton.disabled = this.currentPage === 1;
    this.currentPageIndicator.textContent = `Pág. ${this.currentPage} de ${this.totalPages}`;
    this.nextPageButton.disabled = this.currentPage === this.totalPages;
    this.lastPageButton.disabled = this.currentPage === this.totalPages;
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.render();
      this.onPageChange(this.currentPage);
    }
  }

  createButton(text, title, clickHandler) {
    this.button = document.createElement('button');
    this.button.innerHTML = text;
    this.button.title = title;
    this.button.addEventListener('click', clickHandler);
    return this.button;
  }

  createElements() {
    this.firstPageButton = this.createButton(
      '<svg width="0" class="icon"><use href="/icons/sprite-outline.svg#firstPage"></use></svg>',
      'Primeira',
      () => this.goToPage(1)
    );
    this.previousPageButton = this.createButton(
      '<svg width="0" class="icon"><use href="/icons/sprite-outline.svg#previousPage"></use></svg>',
      'Anterior',
      () => this.goToPage(this.currentPage - 1)
    );
    this.currentPageIndicator = document.createElement('span');
    this.nextPageButton = this.createButton(
      '<svg width="0" class="icon"><use href="/icons/sprite-outline.svg#nextPage"></use></svg>',
      'Próxima',
      () => this.goToPage(this.currentPage + 1)
    );
    this.lastPageButton = this.createButton(
      '<svg width="0" class="icon"><use href="/icons/sprite-outline.svg#lastPage"></use></svg>',
      'Última',
      () => this.goToPage(this.totalPages)
    );

    this.containerElement.innerHTML = '';
    this.containerElement.appendChild(this.firstPageButton);
    this.containerElement.appendChild(this.previousPageButton);
    this.containerElement.appendChild(this.currentPageIndicator);
    this.containerElement.appendChild(this.nextPageButton);
    this.containerElement.appendChild(this.lastPageButton);
  }
}

export default Pagination;
