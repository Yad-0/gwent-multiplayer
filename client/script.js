
const beginPlay = document.getElementById("beginPlay")
const normalGwent = document.getElementById("normalGwent")
const reworkGwent = document.getElementById("reworkGwent")

const p2Siege = document.getElementById("board-2c");
const p2SiegeCount = document.getElementById("board-2c-count");
const p2Range = document.getElementById("board-2b");
const p2RangeCount = document.getElementById("board-2b-count");
const p2Combat = document.getElementById("board-2a");
const p2CombatCount = document.getElementById("board-2a-count");
const p2DiscardRow = document.getElementById("player2-discard");

const p1Combat = document.getElementById("board-1a");
const p1CombatCount = document.getElementById("board-1a-count");
const p1Range = document.getElementById("board-1b");
const p1RangeCount = document.getElementById("board-1b-count");
const p1Siege = document.getElementById("board-1c");
const p1SiegeCount = document.getElementById("board-1c-count");
const p1DiscardRow = document.getElementById("player1-discard");

const p1Hand = document.getElementById("player1-hand");
const p2Hand = document.getElementById("player2-hand");

const p1CombatRow = []
const p1RangeRow = []
const p1SiegeRow = []
const p2CombatRow = []
const p2RangeRow = []
const p2SiegeRow = []

const p1Discarded = []
const p2Discarded = []
player1Turn = true;


// beginPlay.onclick = function() {

//     if (normalGwent.checked)
//         window.location = "game.html";
//     else if(reworkGwent.checked)
//         window.location = "game.html";
//     else
//         alert("Select a game mode!")

// }

function p1Card(faction, title , type , power , ability , count) {    //also creates a div element for rendering the card
    this.faction = faction;
    this.title = title;
    this.type = type;
    this.power = power;
    this.ability = ability;
    this.count = count;

    this.element = document.createElement("div"); 
    this.element.textContent = `${title} \n \n -------(${power})-------`; 
    this.element.className = "card";
    
    this.element.onclick = () => {           // now "this" is the Card object, () => makes the "this" keyword bound to the scope of the class
    
       if (player1Turn == true)
       {
            placeCard(this); 
            player1Turn = false;
       }
        else
            console.log("Not your turn!")  
        
    };

    

}

function p2Card(faction, title , type , power , ability , count) {    //also creates a div element for rendering the card
    this.faction = faction;
    this.title = title;
    this.type = type;
    this.power = power;
    this.ability = ability;
    this.count = count;

    this.element = document.createElement("div"); 
    this.element.textContent = `${title} \n \n -------(${power})-------`; 
    this.element.className = "card";
    
    this.element.onclick = () => {           // now "this" is the Card object, () => makes the "this" keyword bound to the scope of the class
        if (player1Turn == false)
       {
            placeCard(this); 
            player1Turn = true;
       } 
        else
            console.log("Not your turn!")
        
    };

    

}

function placeCard(inputCard) {    


    if (player1Turn == true)
    {
        switch(inputCard.type)                              //haven't added weather/leader cards yet
        {
            case `combat`: p1Combat.appendChild(inputCard.element);
            p1CombatRow.push(inputCard);
            break;
            case `range`: p1Range.appendChild(inputCard.element);
            p1RangeRow.push(inputCard);
            break;
            case `siege`: p1Siege.appendChild(inputCard.element);
            p1SiegeRow.push(inputCard);
            break;
            case `special` : p1DiscardRow.appendChild(inputCard.element)
            p1Discarded.push(inputCard);
            break;
        }
       
    }
    
     if (player1Turn == false)
    {
        switch(inputCard.type)                              //haven't added weather/leader cards yet
        {
            case `combat`: p2Combat.appendChild(inputCard.element);
            p2CombatRow.push(inputCard);
            break;
            case `range`: p2Range.appendChild(inputCard.element);
            p2RangeRow.push(inputCard);
            break;
            case `siege`: p2Siege.appendChild(inputCard.element);
            p2SiegeRow.push(inputCard);
            break;
            case `special` : p2DiscardRow.appendChild(inputCard.element)
            p2Discarded.push(inputCard);
            break;
        }
    }

    if(inputCard.ability == `Scorch`)
        activateScorch();
    inputCard.element.onclick = null;
    inputCard.element.className = "placedCard";
    Scores();
}

function activateScorch() {


   let max = 0;
   

   for (let i = 0 ; i < p1CombatRow.length ; i++)   //find highest power card in row
   {
        let temp = p1CombatRow[i].power;
        if (temp >= max)
        {
            max = temp;
        }
            
   }

   for (let i = 0 ; i < p2CombatRow.length ; i++)   //find highest power card in row
   {
        let temp = p2CombatRow[i].power;
        if (temp >= max)
        {
            max = temp;
        }
            
   }

    for (let i = 0 ; i < p1RangeRow.length ; i++)   //find highest power card in row
   {
        let temp = p1RangeRow[i].power;
        if (temp >= max)
        {
            max = temp;
        }
            
   }

    for (let i = 0 ; i < p2RangeRow.length ; i++)   //find highest power card in row
   {
        let temp = p2RangeRow[i].power;
        if (temp >= max)
        {
            max = temp;
        }
            
   }

    for (let i = 0 ; i < p1SiegeRow.length ; i++)   //find highest power card in row
   {
        let temp = p1SiegeRow[i].power;
        if (temp >= max)
        {
            max = temp;
        }
            
   }

     for (let i = 0 ; i < p2SiegeRow.length ; i++)   //find highest power card in row
   {
        let temp = p2SiegeRow[i].power;
        if (temp >= max)
        {
            max = temp;
        }
            
   }
   

   for (let i = 0 ; i < p1CombatRow.length ; i++)   //discard combat row card
   {
       if(max == p1CombatRow[i].power)
       {
        discard(p1CombatRow[i]);
        i--;
       }
   }

    for (let i = 0 ; i < p2CombatRow.length ; i++)  //discard combat row card
   {
       if(max == p2CombatRow[i].power)
       {
        discard(p2CombatRow[i]);
        i--;
       }
   }

    for (let i = 0 ; i < p1RangeRow.length ; i++)   //discard combat row card
   {
       if(max == p1RangeRow[i].power)
       {
        discard(p1RangeRow[i]);
        i--;
       }
   }

    for (let i = 0 ; i < p2RangeRow.length ; i++)   //discard combat row card
   {
       if(max == p2RangeRow[i].power)
       {
        discard(p2RangeRow[i]);
        i--;
       }
   }
   
   for (let i = 0 ; i < p1SiegeRow.length ; i++)   //discard combat row card
   {
       if(max == p1SiegeRow[i].power)
       {
        discard(p1SiegeRow[i]);
        i--;
       }
   }

    for (let i = 0 ; i < p2SiegeRow.length ; i++)   //discard combat row card
   {
       if(max == p2SiegeRow[i].power)
       {
        discard(p2SiegeRow[i]);
        i--;
       }
   }
   
}

function discard(inputCard) {

    if(p1CombatRow.find(card => card == inputCard) != undefined)
    {
        p1Discarded.push(inputCard)
        p1DiscardRow.appendChild(inputCard.element)
        p1CombatRow.splice(p1CombatRow.indexOf(inputCard) , 1);
    }

    if(p2CombatRow.find(card => card == inputCard) != undefined)
    {
        p2Discarded.push(inputCard)
        p2DiscardRow.appendChild(inputCard.element)
        p2CombatRow.splice(p2CombatRow.indexOf(inputCard) , 1);
    }

    if(p1RangeRow.find(card => card == inputCard) != undefined)
    {
        p1Discarded.push(inputCard)
        p1DiscardRow.appendChild(inputCard.element)
        p1RangeRow.splice(p1RangeRow.indexOf(inputCard) , 1);
    }

     if(p2RangeRow.find(card => card == inputCard) != undefined)
    {
        p2Discarded.push(inputCard)
        p2DiscardRow.appendChild(inputCard.element)
        p2RangeRow.splice(p2RangeRow.indexOf(inputCard) , 1);
    }

     if(p1SiegeRow.find(card => card == inputCard) != undefined)
    {
        p1Discarded.push(inputCard)
        p1DiscardRow.appendChild(inputCard.element)
        p1SiegeRow.splice(p1SiegeRow.indexOf(inputCard) , 1);
    }

     if(p2SiegeRow.find(card => card == inputCard) != undefined)
    {
        p2Discarded.push(inputCard)
        p2DiscardRow.appendChild(inputCard.element)
        p2SiegeRow.splice(p2SiegeRow.indexOf(inputCard) , 1);
    }

}

function Scores() {
    let p1CombatScore = 0;
    let p1RangeScore = 0;
    let p1SiegeScore = 0;
    let p2CombatScore = 0;
    let p2RangeScore = 0;
    let p2SiegeScore = 0;
    let p1Total = p1CombatScore + p1RangeScore + p1SiegeScore;
    let p2Total = p2CombatScore + p2RangeScore + p2SiegeScore;

    for(i = 0 ; i < p1CombatRow.length ; i++)
    {
       p1CombatScore += p1CombatRow[i].power;
    }

    for(i = 0 ; i < p2CombatRow.length ; i++)
    {
       p2CombatScore += p2CombatRow[i].power;
    }

    for(i = 0 ; i < p1RangeRow.length ; i++)
    {
       p1RangeScore += p1RangeRow[i].power;
    }

    for(i = 0 ; i < p2RangeRow.length ; i++)
    {
       p2RangeScore += p2RangeRow[i].power;
    }

    for(i = 0 ; i < p1SiegeRow.length ; i++)
    {
       p1SiegeScore += p1SiegeRow[i].power;
    }

    for(i = 0 ; i < p2SiegeRow.length ; i++)
    {
       p2SiegeScore += p2SiegeRow[i].power;
    }

    p1CombatCount.textContent = `Total: ${p1CombatScore}`;
    p1RangeCount.textContent = `Total: ${p1RangeScore}`;
    p1SiegeCount.textContent = `Total: ${p1SiegeScore}`;

    p2CombatCount.textContent = `Total: ${p2CombatScore}`;
    p2RangeCount.textContent = `Total: ${p2RangeScore}`;
    p2SiegeCount.textContent = `Total: ${p2SiegeScore}`;

}


window.onload = function() {
Scores();

const p1SheldonSkags1 = new p1Card(`Northern Realms` , `Sheldon Skags` , `combat` , 4 , `none` , 3);
const p1SheldonSkags2 = new p1Card(`Northern Realms` , `Sheldon Skags` , `combat` , 4 , `none` , 3);
const p1SheldonSkags3 = new p1Card(`Northern Realms` , `Sheldon Skags` , `combat` , 4 , `none` , 3);
const p2KeiraMetz = new p2Card(`Northern Realms` , `Keira Metz` , `range` , 5 , `none` , 2);
const p2KeiraMetz2 = new p2Card(`Northern Realms` , `Keira Metz` , `range` , 5 , `none` , 2);
const p1Scorch = new p1Card(`none` , `Scorch` , `special` , `` , `Scorch`, 1);
const p2Scorch = new p2Card(`none` , `Scorch` , `special` , `` , `Scorch`, 1);


p1Cards = [p1SheldonSkags1 , p1SheldonSkags2 , p1SheldonSkags3 , p1Scorch];
p2Cards = [p2KeiraMetz , p2KeiraMetz2 , p2Scorch];

for( i = 0 ; i < p1Cards.length ; i++) 
    p1Hand.appendChild(p1Cards[i].element);

for( i = 0 ; i < p2Cards.length ; i++) 
    p2Hand.appendChild(p2Cards[i].element);

}

