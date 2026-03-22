const cardDatabase = {
    'Sheldon Skags': {
        faction: 'Northern Realms' , 
        type: 'combat' , 
        power: 4 ,
        ability: 'none' , 
        abilityDescription: '',
        flavourText: '',
        musterGroup: null,
        maxCopies: 1 , 
        isHero: false
    },

   'Keira Metz': {
        faction: 'Northern Realms' , 
        type: 'range' , 
        power: 5 ,
        ability: 'none' , 
        abilityDescription: '',
        flavourText: '',
        musterGroup: null ,
        maxCopies: 1 , 
        isHero: false ,
    },

    'Scorch': {
        faction: 'Neutral' , 
        type: 'special' , 
        power: 0 ,
        ability: 'Scorch' , 
        abilityDescription: '',
        flavourText: '',
        musterGroup: null , 
        maxCopies: 2 , 
        isHero: false ,
    },

    'Crone: Whispess': {
        faction: 'Monsters' , 
        type: 'combat' , 
        power: 6 ,
        ability: 'Muster' , 
        abilityDescription: '',
        flavourText: '',
        musterGroup: 'Crone' , 
        maxCopies: 1 , 
        isHero: false ,
    },

    'Crone: Brewess': {
        faction: 'Monsters' , 
        type: 'combat' , 
        power: 6 ,
        ability: 'Muster' , 
        abilityDescription: '',
        flavourText: '',
        musterGroup: 'Crone' , 
        maxCopies: 1 , 
        isHero: false ,
    },

    'Crone: Weavess': {
        faction: 'Monsters' , 
        type: 'combat' , 
        power: 6 ,
        ability: 'Muster' , 
        abilityDescription: '',
        flavourText: '',
        musterGroup: 'Crone' , 
        maxCopies: 1 , 
        isHero: false ,
    },

    'Geralt of Rivia': {
        faction: 'Neutral' , 
        type: 'combat' , 
        power: 15 ,
        ability: 'Muster' , 
        abilityDescription: '',
        flavourText: '',
        musterGroup: 'Roach' , 
        maxCopies: 1 , 
        isHero: true ,
    },

    'Ciri': {
        faction: 'Neutral' , 
        type: 'combat' , 
        power: 15 ,
        ability: 'Muster' , 
        abilityDescription: '',
        flavourText: '',
        musterGroup: 'Roach' , 
        maxCopies: 1 , 
        isHero: true ,
    },

    'Roach': {
        faction: 'Neutral' , 
        type: 'combat' , 
        power: 3 ,
        ability: 'Muster' , 
        abilityDescription: '',
        flavourText: '',
        musterGroup: 'Roach' , 
        maxCopies: 1 , 
        isHero: false ,
    },

}   //cardDatabase ends here

const leaderDatabase = {
    'Foltest: King of Temeria': {
        faction: 'Northern Realms' ,
        ability: 'ClearWeather' ,
        abilityInfo: 'Remove all Weather effects from the board.' ,
        used: false , 
    }
}   //leadersDatabase ends here