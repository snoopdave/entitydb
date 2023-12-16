import { LitElement, html, css, customElement, property } from 'lit-element';
import './styles.css'

@customElement('pagination-controls')
class PaginationControls extends LitElement {
    @property({ type: Number }) offset = 0;
    @property({ type: Number }) limit = 10;
    @property({ type: Number }) total = 0;
    @property({ type: Boolean }) hasNextPage= false;
    @property({ type: Boolean }) hasPreviousPage= false;

    static get styles() {
        return [css`
          /* Pagination controls styling */
          .pagination-controls {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
          }

          .pagination-controls button {
            background-color: #1a75ff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s;
          }

          .pagination-controls button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }

          .pagination-controls button:hover:not(:disabled) {
            background-color: #004d99;
          }
        `];
    }

    handlePageNext() {
        const newOffset = this.offset + this.limit;
        console.log('Next - New offset:', newOffset);
        this.dispatchEvent(new CustomEvent('pagination', {
            detail: { newOffset },
            bubbles: true,
            composed: true
        }));
    }

    handlePagePrevious() {
        const newOffset = Math.max(this.offset - this.limit, 0);
        console.log('Previous - New offset:', newOffset);
        this.dispatchEvent(new CustomEvent('pagination', {
            detail: { newOffset },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
      <div class="pagination-controls">
        <button ?disabled="${!this.hasPreviousPage}" @click="${this.handlePagePrevious}">Previous</button>
        <button ?disabled="${!this.hasNextPage}" @click="${this.handlePageNext}">Next</button>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pagination-controls': PaginationControls;
    }
}
