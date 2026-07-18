/* =========================================================
   MARVEL CHALLENGE - Base de données des personnages Marvel
   Plus de 300 personnages répartis par catégories
   ========================================================= */

const MARVEL_DATABASE = {

  avengers: [
    "Iron Man", "Captain America", "Thor", "Hulk", "Black Widow", "Hawkeye",
    "Vision", "Scarlet Witch", "War Machine", "Falcon", "Winter Soldier",
    "Ant-Man", "Wasp", "Captain Marvel", "Black Panther", "Doctor Strange",
    "Quicksilver", "Hercule", "She-Hulk", "Moon Knight", "Luke Cage",
    "Iron Fist", "Daredevil", "Jessica Jones", "Punisher", "Spectrum",
    "Wonder Man", "Sentry", "Songbird", "Photon", "Mockingbird",
    "Union Jack", "Living Lightning", "Tigra", "Stingray"
  ],

  spiderman: [
    "Spider-Man", "Miles Morales", "Spider-Gwen", "Spider-Man 2099",
    "Spider-Woman", "Silk", "Venom", "Carnage", "Green Goblin",
    "Docteur Octopus", "Vautour", "Sandman", "Electro", "Mysterio",
    "Rhino", "Scorpion", "Kraven le Chasseur", "Lizard", "Shocker",
    "Hobgoblin", "Chameleon", "Black Cat", "Jackal", "Tombstone",
    "Prowler", "Molten Man", "Morbius", "Puma", "Speed Demon",
    "Scarlet Spider"
  ],

  xmen: [
    "Professeur X", "Cyclope", "Jean Grey", "Wolverine", "Tornade",
    "Malicia", "Diablo", "Iceberg", "Angel", "Gambit", "Jubilee",
    "Nightcrawler", "Colossus", "Kitty Pryde", "Psylocke", "Cable",
    "Bishop", "Magneto", "Mystique", "Serval", "Sabretooth", "Juggernaut",
    "Emma Frost", "Deadpool", "X-23", "Multiple Man", "Havok", "Polaris",
    "Banshee", "Sunfire", "Dazzler", "Longshot", "Forge", "Cannonball",
    "Sunspot", "Warpath", "Mirage", "Magik", "Northstar", "Domino",
    "Shatterstar"
  ],

  gardiens: [
    "Star-Lord", "Gamora", "Drax", "Rocket Raccoon", "Groot", "Mantis",
    "Nebula", "Yondu", "Adam Warlock", "Kraglin", "Cosmo", "Angela",
    "Moondragon", "Phyla-Vell", "Quasar", "Beta Ray Bill", "Vance Astro",
    "Martinex"
  ],

  fantasticfour: [
    "Mister Fantastic", "Invisible Woman", "Human Torch", "The Thing",
    "Franklin Richards", "Valeria Richards", "Docteur Fatalis", "Namor",
    "H.E.R.B.I.E.", "Uatu le Gardien", "Alicia Masters", "Puppet Master",
    "Klaw", "Diablo Fatal", "Impossible Man"
  ],

  vilains: [
    "Thanos", "Loki", "Ultron", "Crâne Rouge", "M.O.D.O.K.", "Baron Zemo",
    "Kingpin", "Kang le Conquérant", "Ronan l'Accusateur", "Hela",
    "Killmonger", "Abomination", "Absorbing Man", "Bullseye", "Taskmaster",
    "Crossbones", "Whiplash", "Justin Hammer", "Aldrich Killian",
    "Malekith", "Dormammu", "Nightmare", "Mephisto", "Annihilus",
    "Sinistre", "Stryfe", "Onslaught", "Dark Phoenix", "Sentinelle",
    "Arcade", "Purple Man", "Owl", "Hammerhead", "Grand Maître",
    "Corvus Glaive", "Proxima Midnight", "Ebony Maw", "Cull Obsidian",
    "Blastaar", "Titania", "Ghost", "Arnim Zola", "Baron Mordo",
    "Enchanteresse", "Executioner", "Grim Reaper", "Batroc", "Constrictor",
    "Boomerang", "Living Laser"
  ],

  cosmique: [
    "Silver Surfer", "Galactus", "Nova", "Eternité", "Tribunal Vivant",
    "Gladiator", "Ikaris", "Sersi", "Thena", "Makkari", "Gilgamesh",
    "Sprite", "Phastos", "Druig", "Ajak", "Kro", "Genis-Vell", "Terrax",
    "Firelord", "Air-Walker", "Stardust", "Charlie-27", "Fenris"
  ],

  secondaires: [
    "Ms. Marvel", "Hawkeye Kate Bishop", "Squirrel Girl", "Moon Girl",
    "Devil Dinosaur", "Wiccan", "Speed", "Hulkling", "Patriot", "Stature",
    "America Chavez", "Elektra", "Blade", "Ghost Rider", "Cloak", "Dagger",
    "Werewolf by Night", "Man-Thing", "Howard le Canard", "Shang-Chi",
    "White Tiger", "Silverclaw", "Darkhawk", "Sleepwalker", "U.S.Agent",
    "Hyperion", "Blue Marvel", "Justice", "Firestar", "Speedball",
    "Agent Venom", "Jackpot", "Araña", "Spider-Man Noir", "Spider-Ham",
    "Spider-Man India", "Web-Slinger", "Silver Sable", "Paladin",
    "Nick Fury", "Maria Hill", "Phil Coulson", "Sharon Carter",
    "Peggy Carter", "Yelena Belova", "Riri Williams", "Robbie Reyes",
    "Frank Castle", "Matt Murdock", "Foggy Nelson", "Karen Page",
    "Danny Rand", "Colleen Wing", "Misty Knight", "Trish Walker",
    "Malcolm Ducasse", "Heather Douglas", "Victor Alvarez", "Amadeus Cho",
    "Sam Wilson", "Doctor Voodoo", "Valkyrie", "Korg", "Miek",
    "Warlock Jeune", "Nico Minoru", "Karolina Dean", "Chase Stein",
    "Molly Hayes", "Gertrude Yorkes", "Alex Wilder", "Victor Mancha",
    "Old Lace", "Machine Man", "Darkstar", "Vindicator", "Guardian",
    "Sasquatch", "Aurora", "Shaman", "Snowbird", "Puck", "Talisman",
    "Diamondback", "Paladin le Mercenaire", "Silverclaw Junior",
    "Rage", "Darkdevil", "Anti-Venom", "Toxin", "Hybrid", "Scream",
    "Lasher", "Riot", "Phage", "Agony", "Sleeper", "Bora", "Marrow",
    "Maggott", "Chamber", "Skin", "Thunderbird", "Feral"
  ]
};

// Regroupe tous les personnages dans un seul tableau pour le mode "Tous"
MARVEL_DATABASE.all = [].concat(
  MARVEL_DATABASE.avengers,
  MARVEL_DATABASE.spiderman,
  MARVEL_DATABASE.xmen,
  MARVEL_DATABASE.gardiens,
  MARVEL_DATABASE.fantasticfour,
  MARVEL_DATABASE.vilains,
  MARVEL_DATABASE.cosmique,
  MARVEL_DATABASE.secondaires
);

// Rend la base disponible globalement pour script.js
window.MARVEL_DATABASE = MARVEL_DATABASE;
