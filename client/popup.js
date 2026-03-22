// ═══════════════════════════════════════
// popup.js — Row overview + Card detail
// Loaded before script.js
// ═══════════════════════════════════════

// ── Element references ──
const rowPopup        = document.getElementById('row-popup');
const rowPopupTitle   = document.getElementById('row-popup-title');
const rowPopupCards   = document.getElementById('row-popup-cards');
const rowPopupClose   = document.getElementById('row-popup-close');

const cardPopup       = document.getElementById('card-popup');
const cardPopupClose  = document.getElementById('card-popup-close');

// Card detail fields
const detailArt         = document.getElementById('card-detail-art');
const detailPower       = document.getElementById('card-detail-power');
const detailHero        = document.getElementById('card-detail-hero');
const detailTitle       = document.getElementById('card-detail-title');
const detailFaction     = document.getElementById('card-detail-faction');
const detailType        = document.getElementById('card-detail-type');
const detailAbilityName = document.getElementById('card-detail-ability-name');
const detailAbilityDesc = document.getElementById('card-detail-ability-desc');
const detailFlavour     = document.getElementById('card-detail-flavour');


// ═══════════════════════════════════════
// openRowPopup(rowArray, rowName)
//
// Called from script.js when a row is
// right clicked or long pressed.
//
// rowArray — the array of card objects
//            in that row (e.g. p1CombatRow)
// rowName  — display name e.g. "P1 COMBAT"
// ═══════════════════════════════════════
function openRowPopup(rowArray, rowName) {

    // Set the popup title
    rowPopupTitle.textContent = rowName;

    // Clear any previously shown cards
    rowPopupCards.innerHTML = '';

    // If the row is empty, show a message
    if (rowArray.length === 0) {
        rowPopupCards.innerHTML = '<p style="color: var(--text-dim); font-family: Cinzel, serif; font-size: 12px;">No cards in this row.</p>';
        rowPopup.classList.add('open');
        return;
    }

    // Build a larger card element for each card in the row
    for (let i = 0; i < rowArray.length; i++) {
        const card = rowArray[i];

        // Create the popup card div
        const popupCard = document.createElement('div');
        popupCard.className = 'popup-card';

        // Power badge at the top
        const powerBadge = document.createElement('div');
        powerBadge.className = 'popup-card-power';
        powerBadge.textContent = card.power;

        // Card title below
        const titleText = document.createElement('div');
        titleText.textContent = card.title;

        popupCard.appendChild(powerBadge);
        popupCard.appendChild(titleText);

        // Clicking a card in the row popup opens the detail popup
        popupCard.onclick = function() {
            openCardDetail(card);
        };

        rowPopupCards.appendChild(popupCard);
    }

    // Show the popup
    rowPopup.classList.add('open');
}


// ═══════════════════════════════════════
// openCardDetail(card)
//
// Opens the card detail popup (Layer 2)
// on top of the row overview popup.
//
// card — the card object from the row array
// ═══════════════════════════════════════
function openCardDetail(card) {

    // Look up the full card data from the database
    // card.title is the key in cardDatabase
    const data = cardDatabase[card.title];

    // Fill in the power badge
    detailPower.textContent = card.power;

    // Hero indicator — show or hide
    if (data && data.isHero) {
        detailHero.classList.add('visible');
    } else {
        detailHero.classList.remove('visible');
    }

    // Title
    detailTitle.textContent = card.title;

    // Faction and type badges
    detailFaction.textContent = data ? data.faction : '—';
    detailType.textContent    = data ? data.type.toUpperCase() : '—';

    // Ability — name and description
    // We store the ability name on the card
    // Ability descriptions will come from cardDatabase once you add them
    if (data && data.ability && data.ability !== 'none') {
        detailAbilityName.textContent = data.ability;
        // abilityDescription will be added to cardDatabase later
        detailAbilityDesc.textContent = data.abilityDescription || '';
    } else {
        detailAbilityName.textContent = '';
        detailAbilityDesc.textContent = '';
    }

    // Flavour text — will come from cardDatabase once you add it
    detailFlavour.textContent = (data && data.flavourText) ? data.flavourText : '';

    // Show the card detail popup
    cardPopup.classList.add('open');
}


// ═══════════════════════════════════════
// CLOSING LOGIC
// ═══════════════════════════════════════

// Close row popup via button
rowPopupClose.onclick = function() {
    rowPopup.classList.remove('open');
};

// Close card detail popup via button
cardPopupClose.onclick = function() {
    cardPopup.classList.remove('open');
};

// Click outside the popup box to close
rowPopup.onclick = function(event) {
    // event.target is the element that was clicked
    // if it's the dark overlay itself (not the box), close it
    if (event.target === rowPopup) {
        rowPopup.classList.remove('open');
        cardPopup.classList.remove('open');
    }
};

cardPopup.onclick = function(event) {
    if (event.target === cardPopup) {
        cardPopup.classList.remove('open');
    }
};

// Press Escape to close whichever popup is open
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Close detail first if open, otherwise close row popup
        if (cardPopup.classList.contains('open')) {
            cardPopup.classList.remove('open');
        } else if (rowPopup.classList.contains('open')) {
            rowPopup.classList.remove('open');
        }
    }
});


// ═══════════════════════════════════════
// ATTACHING TO BOARD ROWS
//
// Called once from script.js after the
// board is set up. Attaches right click
// and long press listeners to each row wrapper.
//
// We pass in an object mapping each
// wrapper ID to its row array and label.
// ═══════════════════════════════════════
function attachRowPopups(rowMap) {

    // rowMap looks like:
    // {
    //   'row-wrapper-1a': { array: p1CombatRow, label: 'YOUR COMBAT' },
    //   'row-wrapper-1b': { array: p1RangeRow,  label: 'YOUR RANGE'  },
    //   ...
    // }

    for (const wrapperId in rowMap) {
        const wrapper = document.getElementById(wrapperId);
        if (!wrapper) continue;

        const rowInfo = rowMap[wrapperId];

        // ── Desktop: right click ──
        wrapper.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // stops the browser's own right click menu
            openRowPopup(rowInfo.array, rowInfo.label);
        });

        // ── Mobile: long press ──
        // We track when the finger goes down and measure how long it stays
        let longPressTimer = null;

        wrapper.addEventListener('touchstart', function(event) {
            longPressTimer = setTimeout(function() {
                openRowPopup(rowInfo.array, rowInfo.label);
            }, 500); // 500ms = long press threshold
        });

        // If the finger lifts or moves before 500ms, cancel the long press
        wrapper.addEventListener('touchend', function() {
            clearTimeout(longPressTimer);
        });

        wrapper.addEventListener('touchmove', function() {
            clearTimeout(longPressTimer);
        });
    }
}