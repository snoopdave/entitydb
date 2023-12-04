import { LitElement, html, css, customElement, property } from 'lit-element';
import {Entity} from "./graphql-client";
import './styles.css'

@customElement('entities-list')
class EntitiesList extends LitElement {
    @property({ type: Array }) entities: Entity[] = [];

    static get styles() {
        return [css`
          /* Entities list styling */

          .entities-list {
            background-color: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }

          .entities-list p,
          .entities-list span,
          .entities-list div {
            margin-bottom: 10px;
            line-height: 1.5;
          }

          .entities-list div {
            color: #666;
            font-size: 0.9em;
          }

          .entity {
            /* Gradient Background */
            background: linear-gradient(to right, #fff, #9393eb); /* Example gradient colors */

            /* Thin, Rounded Borders */
            border: 1px solid #2193b0; /* Thin border with a color that matches the gradient */
            border-radius: 10px; /* Rounded corners */

            /* Additional styles for aesthetics */
            padding: 10px;
            margin: 10px 0;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: adds a subtle shadow */
            color: white; /* Adjust text color for better readability on gradient background */
          }

        `];
    }

    renderEntity(entity: any) {
        return html`
      <div class="entity">
        <p>${entity.fullText}</p>
        ${entity.link ? html`<a href="${entity.link}" target="_blank">Link</a>` : ''}
        <span>${entity.type}</span>
        <div class="entity-time">Posted on: ${new Date(entity.entityTimestamp).toLocaleDateString()}</div>
      </div>
    `;
    }

    render() {
        return html`
            <div class="entities-list">
                ${this.entities.map(entity => this.renderEntity(entity))}
            </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'entities-list': EntitiesList;
    }
}
