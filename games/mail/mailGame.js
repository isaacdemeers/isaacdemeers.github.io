import { saveScore } from '/games/main.js';

let emails = [];
let currentEmailIndex = 0;
let totalSpaceFreed = 0;
let score = 0;
let deletedNewsletters = new Set();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function calculateDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cardWidth = Math.min(width * 0.8, 420);
    const cardHeight = Math.min(height * 0.6, 300);
    return { cardWidth, cardHeight };
}

async function loadEmails() {
    try {
        const response = await fetch('mail.json');
        const data = await response.json();
        emails = shuffleArray(data.emails);
        updateEmailDisplay();
    } catch (error) {
        document.getElementById('email-container').innerHTML = `
            <div style="text-align: center; color: #333;">
                <h2>Loading Error</h2>
                <p>Unable to load emails. Please try again.</p>
            </div>
        `;
    }
}

function createEmailTemplate(email) {
    const { cardWidth, cardHeight } = calculateDimensions();
    const template = `
        <div class="email-card" style="width: ${cardWidth}px; height: ${cardHeight}px; background-image: url('/games/mail/assets/big3.png'); background-size: cover; background-position: center; padding: 24px;  position: relative;">
            <div style="height: 100%; overflow-y: auto;">
                <div class="email-header" style="margin-bottom: 15px;">
                    <h2 style="margin: 0; color: #333; font-size: 18px;">${email.subject}</h2>
                    <div style="color: #666; font-size: 14px; margin-top: 5px;">
                        De: ${email.sender}
                    </div>
                    <div style="color: #666; font-size: 12px;">
                        Date: ${email.date} | Taille: ${email.size}
                    </div>
                </div>
                <div class="email-content" style="border-top: 1px solid #333; padding-top: 15px;">
                    <h3 style="margin: 0 0 10px 0; color: #444; font-size: 16px;">${email.content.title}</h3>
                    <div style="font-size: 14px; color: #555; line-height: 1.4;">
                        ${email.content.body}
                    </div>
                    <div style="margin-top: 20px; text-align: center; display: none;">
                        <button style="background: #4A90E2; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">
                            ${email.content.cta}
                        </button>
                    </div>
                    ${email.isNewsletter ? `
                        <div style="margin-top: 40px; text-align: center;">
                            <button onclick="unsubscribe(${email.id})" style="background: none; border: none; color: #333; font-size: 11px; cursor: pointer; text-decoration: underline; padding: 0;">
                                ${email.unsubscribed ? 'Unsubscribed ✓' : 'Unsubscribe from newsletter'}
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    return template;
}

function unsubscribe(emailId) {
    const email = emails.find(e => e.id === emailId);
    if (email) {
        email.unsubscribed = true;
        deletedNewsletters.add(emailId);
        updateEmailDisplay();
    }
}

function initializeUI() {
    const { cardWidth, cardHeight } = calculateDimensions();

    // Création du conteneur principal
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
  
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #F37D7D;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
    `;
    document.body.appendChild(mainContainer);

    // Conteneur pour les emails
    const emailContainer = document.createElement('div');
    emailContainer.id = 'email-container';
    emailContainer.style.cssText = `
        position: relative;
        margin: 20px 0;
    `;
    mainContainer.appendChild(emailContainer);

    // Conteneur pour les boutons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 40px;
        margin-top: 20px;
    `;
    mainContainer.appendChild(buttonContainer);

    // Bouton Supprimer
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '';
    deleteButton.style.cssText = `
        width: 80px;
        height: 85px;
        border: none;
        background: #F37D7D;
        color: white;
        font-size: 24px;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.3s;
        background-image: url('/games/mail/assets/trash.png');
        background-size: cover;
        background-position: center;
    `;
    deleteButton.onmouseenter = () => deleteButton.style.transform = 'scale(1.1)';
    deleteButton.onmouseleave = () => deleteButton.style.transform = 'scale(1)';
    deleteButton.onclick = () => nextEmail('delete');
    buttonContainer.appendChild(deleteButton);

    // Bouton Conserver
    const keepButton = document.createElement('button');
    keepButton.innerHTML = '';
    keepButton.style.cssText = `
        width: 80px;
        height: 80px;
        border: none;
        background: #F37D7D;
        color: white;
        font-size: 24px;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.3s;
        background-image: url('/games/mail/assets/save.png');
        background-size: cover;
        background-position: center;
    `;
    keepButton.onmouseenter = () => keepButton.style.transform = 'scale(1.1)';
    keepButton.onmouseleave = () => keepButton.style.transform = 'scale(1)';
    keepButton.onclick = () => nextEmail('keep');
    buttonContainer.appendChild(keepButton);

    // Compteur de score et d'espace
    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    statsContainer.style.cssText = `
        position: fixed;
        width: 200px;
        height:60px;
        top: 20px;
        right: 20px;
        padding: 15px;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-image: url('/games/mail/assets/small.png');
        background-size: cover;
        background-position: center;
    `;

    const scoreCounter = document.createElement('div');
    scoreCounter.id = 'score-counter';
    scoreCounter.style.color = '#333';
    statsContainer.appendChild(scoreCounter);

    const spaceCounter = document.createElement('div');
    spaceCounter.id = 'space-counter';
    spaceCounter.style.color = '#333';
    statsContainer.appendChild(spaceCounter);

    document.body.appendChild(statsContainer);

    // Chargement des emails
    loadEmails();
}

function updateEmailDisplay() {
    const emailContainer = document.getElementById('email-container');
    const scoreCounter = document.getElementById('score-counter');
    const spaceCounter = document.getElementById('space-counter');

    if (emails.length > 0 && currentEmailIndex < emails.length) {
        const email = emails[currentEmailIndex];
        emailContainer.innerHTML = createEmailTemplate(email);
        scoreCounter.textContent = `Score: ${score} points`;
        spaceCounter.textContent = `Space freed: ${totalSpaceFreed.toFixed(1)} MB`;

        // Mise à jour des couleurs des boutons
        const deleteButton = document.querySelector('button:first-child');
        const keepButton = document.querySelector('button:last-child');

        deleteButton.style.backgroundColor = email.shouldDelete ? '#51cf66' : '#ff6b6b';
        keepButton.style.backgroundColor = email.shouldDelete ? '#ff6b6b' : '#51cf66';
    } else {
        // Ajouter les newsletters non désabonnées à la fin
        const unhandledNewsletters = emails.filter(email =>
            email.isNewsletter && !email.unsubscribed && !deletedNewsletters.has(email.id)
        );

        if (unhandledNewsletters.length > 0) {
            emails.push(...unhandledNewsletters);
            updateEmailDisplay();
        } else {
            emailContainer.innerHTML = `
                <div style="text-align: center; color: white; font-size: 24px;  padding: 20px; width: 420px; height: 300px; background-image: url('/games/mail/assets/big3.png'); background-size: cover; background-position: center; ">
                    <h2>Completed!</h2>
                    <p>Final score: ${score} points</p>
                    <p>Space freed: ${totalSpaceFreed.toFixed(1)} MB</p>
                    <p>Newsletters handled: ${deletedNewsletters.size}</p>
                </div>
            `;
            saveScore('mail');

            // Hide the choice buttons
            const buttonContainer = document.querySelector('div[style*="display: flex; gap: 40px"]');
            buttonContainer.style.display = 'none';

            // Create and add the next game link
            const nextGameLink = document.createElement('a');
            nextGameLink.innerHTML = 'Go to Desktop';
            nextGameLink.href = '/games/desktop/index.html';
            nextGameLink.style.cssText = `
                display: inline-block;
                padding: 15px 30px;
                font-size: 18px;
                background: #CE4949;
                color: white;
                border: none;
                cursor: pointer;
                margin-top: 20px;
                transition: transform 0.2s;
                text-decoration: none;
            `;
            nextGameLink.onmouseenter = () => nextGameLink.style.transform = 'scale(1.1)';
            nextGameLink.onmouseleave = () => nextGameLink.style.transform = 'scale(1)';

            emailContainer.appendChild(nextGameLink);
        }
    }
}

function nextEmail(action) {
    if (currentEmailIndex < emails.length) {
        const email = emails[currentEmailIndex];

        if (action === 'delete') {
            if (email.isNewsletter && !email.unsubscribed) {
                // Si c'est une newsletter non désabonnée, elle reviendra plus tard
                emails.push({ ...email });
            } else {
                totalSpaceFreed += parseFloat(email.size);
                if (email.shouldDelete) {
                    score += 250;
                }
                if (email.isNewsletter) {
                    deletedNewsletters.add(email.id);
                }
            }
        } else {
            if (!email.shouldDelete) {
                score += 250;
            }
            if (email.isNewsletter) {
                deletedNewsletters.add(email.id);
            }
        }

        currentEmailIndex++;
        updateEmailDisplay();
    }
}

// Gestion du redimensionnement
window.addEventListener('resize', updateEmailDisplay);

// Initialisation de l'interface
document.addEventListener('DOMContentLoaded', initializeUI);
