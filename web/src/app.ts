import {LitElement, html, css, customElement, property, state} from 'lit-element';
import './search-controls';
import './pagination-controls';
import './entities-list';
import { fetchEntities, Entity } from './graphql-client';
import styles from './styles.css'

@customElement('entity-db-app')
class EntityDbApp extends LitElement {
    @state() entities: Entity[] = [];
    @state() hasNextPage= false;
    @state() hasPreviousPage= false;

    @property({ type: Number }) offset = 0;
    @property({ type: Number }) limit = 10;
    @property({ type: String }) searchTerm = '';
    @property({ type: String }) startDate = '';
    @property({ type: String }) endDate = '';

    static get styles() {
        return [css`
          /* General styling */
          body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f0f8ff;
          }

          .container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
          }

          /* Banner styling */
          .banner {
            background: linear-gradient(to right, #1a75ff, #0099cc);
            color: white;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            font-size: 2em;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `];
    }

    firstUpdated() {
        this.loadEntities();
    }

    async loadEntities() {
        try {
            console.log('Fetching entities with offset:', this.offset, 'limit:', this.limit, 'searchTerm:', this.searchTerm, 'startDate:', this.startDate, 'endDate:', this.endDate);
            const response = await fetchEntities(this.offset, this.limit + 1, this.searchTerm, this.startDate, this.endDate);
            if  (response.searchEntities.length > this.limit) {
                this.entities = response.searchEntities.slice(0, this.limit);
                this.hasNextPage = true;
            } else {
                this.hasNextPage = false;
            }
            this.hasPreviousPage = this.offset > 0;
            this.entities = response.searchEntities;
        } catch (error) {
            console.error('Error fetching entities:', error);
        }
    }

    handleSearch(searchTerm: string, startDate: string, endDate: string) {
        console.log('Search term:', searchTerm, 'Start date:', startDate, 'End date:', endDate);
        this.searchTerm = searchTerm;
        this.startDate = startDate;
        this.endDate = endDate;
        this.offset = 0;
        this.loadEntities();
    }

    handlePaginationChange(newOffset: number) {
        console.log(`Paging to new offset ${newOffset}`);
        this.offset = newOffset;
        this.loadEntities();
    }

    render() {
        return html`
          <div class="container">
              
              <h1 class="banner">EntityDB</h1>
              
              <search-controls 
                @search="${(event: CustomEvent) => this.handleSearch(event.detail.searchTerm, event.detail.startDate, event.detail.endDate)}">
              </search-controls>
              
              <pagination-controls 
                .offset="${this.offset}" 
                .limit="${this.limit}" 
                .total="${this.entities.length}"
                .hasNextPage="${this.hasNextPage}"
                .hasPreviousPage="${this.hasPreviousPage}"
                @pagination="${(event: CustomEvent) => this.handlePaginationChange(event.detail.newOffset)}">
              </pagination-controls>
              
              <entities-list .entities="${this.entities}"></entities-list>
              
              <pagination-controls 
                .offset="${this.offset}" 
                .limit="${this.limit}"
                .total="${this.entities.length}"
                .hasNextPage="${this.hasNextPage}"
                .hasPreviousPage="${this.hasPreviousPage}"
                @pagination="${(event: CustomEvent) => this.handlePaginationChange(event.detail.newOffset)}">
              </pagination-controls>
              
          </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'entity-db-app': EntityDbApp;
    }
}
