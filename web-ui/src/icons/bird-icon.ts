import {customElement, html, LitElement} from "lit-element";


// https://icon-sets.iconify.design/emojione/bird/
@customElement('bird-icon')
class BirdIcon extends LitElement {

    render() {
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64"><g fill="#42ade2"><path d="M59.8 24.3s1.1-6.2-3.5-3.4c0 0-.4-6.3-4.3-1.9c0 0-2.1-3.9-4.4-.3c-3.1 4.8-5.2 12.4-3.2 25l3.8-2.5c2.7-7.9 12.4-8.8 13.7-13.1c.9-3-2.1-3.8-2.1-3.8m-37.7-6.7l-9.9 3.6C14.4 9.2 28.8 10 28.8 10s-6.8 3.2-6.7 7.6"/><path d="m23.7 19.8l-10.5 1.4C18 10 31.9 13.9 31.9 13.9s-7.3 1.6-8.2 5.9"/></g><path fill="#ffd93b" d="m2 29l5.4-1.4v3.6c0-.1-3.3-.6-5.4-2.2m5.4-1.5L2 24.8c3.6-2.8 7.7-1.9 7.7-1.9z"/><path fill="#e08828" d="M33.8 53h-2.1v7.9c-.3.1-2.1-.1-2.9-.1c-1.8 0-3.3 1.3-3.3 1.3h8.3zM25 53h-2.1v7.9c-.3.1-2.1-.1-2.9-.1c-1.8 0-3.3 1.3-3.3 1.3H25z"/><path fill="#42ade2" d="M54 36.2c3.9 0-4.1 17.5-23.3 17.5c-13 0-23.9-5.2-23.9-21.5c0-10.1 6.4-18.3 19.5-15c13.3 3.5 6.5 19 27.7 19"/><path fill="#fff" d="M37.6 51.7c-15.6 0-14-12-27.9-11.2c5.1 15.8 27.9 11.2 27.9 11.2"/><path fill="#297b9d" d="M39.1 29.2c-10-9.8-20.2 6.2-7.9 12.6C43.3 48 51.6 37 51.6 37s-6.1-1.5-12.5-7.8"/><circle cx="15.1" cy="24.9" r="2.5" fill="#3e4347"/></svg>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'bird-icon': BirdIcon;
    }
}

