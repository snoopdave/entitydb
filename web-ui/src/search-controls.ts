import {LitElement, html, css, customElement, property, query, CSSResultGroup} from 'lit-element';
import './styles.css'

@customElement('search-controls')
class SearchControls extends LitElement {
    @property({ type: String }) searchTerm = '';
    @property({ type: String }) startDate = '';
    @property({ type: String }) endDate = '';

    @query('#searchTerm') searchTermInput!: HTMLInputElement;
    @query('#startDate') startDateInput!: HTMLInputElement;
    @query('#endDate') endDateInput!: HTMLInputElement;

    static get styles() {
        return [css`
          .search-controls input,
          .search-controls button {
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .search-controls button {
            background-color: #007bff;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .search-controls button:hover {
            background-color: #0056b3;
          }
        `];
    }

    firstUpdated() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 36);
        this.startDate = oneMonthAgo.toISOString().split('T')[0]; // Format to YYYY-MM-DD
        this.endDate = new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD
    }

    emitSearchEvent() {
        console.log('Search event emitted with searchTerm:', this.searchTermInput.value, 'startDate:', this.startDateInput.value, 'endDate:', this.endDateInput.value);
        this.dispatchEvent(new CustomEvent('search', {
            detail: {
                searchTerm: this.searchTermInput.value,
                startDate: this.startDateInput.value,
                endDate: this.endDateInput.value
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
      <div class="search-controls">
        <input id="searchTerm" type="text" placeholder="Search..." .value="${this.searchTerm}">
        <input id="startDate" type="date" .value="${this.startDate}">
        <input id="endDate" type="date" .value="${this.endDate}">
        <button @click="${this.emitSearchEvent}">Search</button>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'search-controls': SearchControls;
    }
}
