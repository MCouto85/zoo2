/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/

import { Sticker, GameLevel, Rarity, GameTheme, StoreCreditPack, Language, GameModuleType } from './types';

/**
 * Dictionary of words for exercise generation.
 */
const GAME_DICTIONARY: Record<GameTheme, Record<Language, string[]>> = {
  Zoo: {
    PT: ['Leão', 'Tigre', 'Zebra', 'Girafa', 'Macaco', 'Urso', 'Jacaré', 'Lobo', 'Águia', 'Coelho', 'Elefante', 'Panda', 'Pinguim', 'Cobra', 'Arara', 'Baleia', 'Golfinho', 'Tartaruga', 'Rinoceronte', 'Hipopótamo'],
    EN: ['Lion', 'Tiger', 'Zebra', 'Giraffe', 'Monkey', 'Bear', 'Alligator', 'Wolf', 'Eagle', 'Rabbit', 'Elephant', 'Panda', 'Penguin', 'Snake', 'Parrot', 'Whale', 'Dolphin', 'Turtle', 'Rhino', 'Hippo'],
    ES: ['León', 'Tigre', 'Cebra', 'Jirafa', 'Mono', 'Oso', 'Caimán', 'Lobo', 'Águila', 'Conejo', 'Elefante', 'Panda', 'Pingüino', 'Serpiente', 'Loro', 'Ballena', 'Delfín', 'Tortuga', 'Rinoceronte', 'Hipopótamo'],
    FR: ['Lion', 'Tigre', 'Zèbre', 'Girafe', 'Singe', 'Ours', 'Alligator', 'Loup', 'Aigle', 'Lapin', 'Éléphant', 'Panda', 'Pingouin', 'Serpent', 'Perroquet', 'Baleine', 'Dauphin', 'Tortue', 'Rhinocéros', 'Hippopotame']
  },
  Space: {
    PT: ['Lua', 'Sol', 'Marte', 'Terra', 'Cometa', 'Estrela', 'Galáxia', 'Foguete', 'Sonda', 'Planeta', 'Astronauta', 'Órbita', 'Vácuo', 'Saturno', 'Júpiter', 'Vénus', 'Cosmos', 'Eclipse', 'Meteoro', 'Nébula'],
    EN: ['Moon', 'Sun', 'Mars', 'Earth', 'Comet', 'Star', 'Galaxy', 'Rocket', 'Probe', 'Planet', 'Astronaut', 'Orbit', 'Vacuum', 'Saturn', 'Jupiter', 'Venus', 'Cosmos', 'Eclipse', 'Meteor', 'Nebula'],
    ES: ['Luna', 'Sol', 'Marte', 'Tierra', 'Cometa', 'Estrella', 'Galaxia', 'Cohete', 'Sonda', 'Planeta', 'Astronauta', 'Órbita', 'Vacío', 'Saturno', 'Júpiter', 'Venus', 'Cosmos', 'Eclipse', 'Meteoro', 'Nebulosa'],
    FR: ['Lune', 'Soleil', 'Mars', 'Terre', 'Comète', 'Étoile', 'Galaxie', 'Fusée', 'Sonde', 'Planète', 'Astronaute', 'Orbite', 'Vide', 'Saturne', 'Jupiter', 'Vénus', 'Cosmos', 'Éclipse', 'Météore', 'Nébuleuse']
  },
  Ocean: {
    PT: ['Peixe', 'Tubarão', 'Baleia', 'Polvo', 'Lula', 'Medusa', 'Coral', 'Concha', 'Alga', 'Barco', 'Submarino', 'Onda', 'Maré', 'Abismo', 'Recife', 'Anémona', 'Delfim', 'Raia', 'Estrela', 'Caranguejo'],
    EN: ['Fish', 'Shark', 'Whale', 'Octopus', 'Squid', 'Jellyfish', 'Coral', 'Shell', 'Seaweed', 'Boat', 'Submarine', 'Wave', 'Tide', 'Abyss', 'Reef', 'Anemone', 'Dolphin', 'Ray', 'Starfish', 'Crab'],
    ES: ['Pez', 'Tiburón', 'Ballena', 'Pulpo', 'Calamar', 'Medusa', 'Coral', 'Concha', 'Alga', 'Barco', 'Submarino', 'Ola', 'Marea', 'Abismo', 'Arrecife', 'Anémona', 'Delfín', 'Raya', 'Estrella', 'Cangrejo'],
    FR: ['Poisson', 'Requin', 'Baleine', 'Poulpe', 'Calmar', 'Méduse', 'Corail', 'Coquille', 'Algue', 'Bateau', 'Sous-marin', 'Vague', 'Marée', 'Abysse', 'Récif', 'Anémone', 'Dauphin', 'Raie', 'Étoile', 'Crabe']
  },
  History: {
    PT: ['Rei', 'Rainha', 'Castelo', 'Espada', 'Escudo', 'Cavaleiro', 'Pirâmide', 'Faraó', 'Templo', 'Grécia', 'Roma', 'Egito', 'Múmia', 'Coroa', 'Escravo', 'Guerreiro', 'Batalha', 'Império', 'Mapa', 'Tesouro'],
    EN: ['King', 'Queen', 'Castle', 'Sword', 'Shield', 'Knight', 'Pyramid', 'Pharaoh', 'Temple', 'Greece', 'Rome', 'Egypt', 'Mummy', 'Crown', 'Slave', 'Warrior', 'Battle', 'Empire', 'Map', 'Treasure'],
    ES: ['Rey', 'Reina', 'Castillo', 'Espada', 'Escudo', 'Caballero', 'Pirámide', 'Faraón', 'Templo', 'Grecia', 'Roma', 'Egipto', 'Momia', 'Corona', 'Esclavo', 'Guerrero', 'Batalla', 'Imperio', 'Mapa', 'Tesoro'],
    FR: ['Roi', 'Reine', 'Château', 'Épée', 'Bouclier', 'Chevalier', 'Pyramide', 'Pharaon', 'Temple', 'Grèce', 'Rome', 'Égypte', 'Momie', 'Couronne', 'Esclave', 'Guerrier', 'Bataille', 'Empire', 'Carte', 'Trésor']
  },
  Home: {
    PT: ['Mesa', 'Cadeira', 'Cama', 'Sofá', 'Janela', 'Porta', 'Cozinha', 'Quarto', 'Sala', 'Jardim', 'Lâmpada', 'Tapete', 'Espelho', 'Relógio', 'Quadro', 'Fogão', 'Prato', 'Garfo', 'Faca', 'Copos'],
    EN: ['Table', 'Chair', 'Bed', 'Sofa', 'Window', 'Door', 'Kitchen', 'Bedroom', 'LivingRoom', 'Garden', 'Lamp', 'Rug', 'Mirror', 'Clock', 'Picture', 'Stove', 'Plate', 'Fork', 'Knife', 'Glasses'],
    ES: ['Mesa', 'Silla', 'Cama', 'Sofá', 'Ventana', 'Puerta', 'Cocina', 'Cuarto', 'Sala', 'Jardín', 'Lámpara', 'Alfombra', 'Espejo', 'Reloj', 'Cuadro', 'Estufa', 'Plato', 'Tenedor', 'Cuchillo', 'Vasos'],
    FR: ['Table', 'Chaise', 'Lit', 'Canapé', 'Fenêtre', 'Porte', 'Cuisine', 'Chambre', 'Salon', 'Jardin', 'Lampe', 'Tapis', 'Miroir', 'Horloge', 'Tableau', 'Cuisinière', 'Assiette', 'Fourchette', 'Couteau', 'Verres']
  },
  Arctic: {
    PT: ['Gelo', 'Pinguim', 'Urso Polar', 'Foca', 'Baleia', 'Neve', 'Iglu', 'Frio', 'Trenó', 'Lobo Artico', 'Rena', 'Aurora', 'Montanha', 'Cristal', 'Oceano', 'Navio', 'Pesca', 'Esqui', 'Casaco', 'Luvas'],
    EN: ['Ice', 'Penguin', 'Polar Bear', 'Seal', 'Whale', 'Snow', 'Igloo', 'Cold', 'Sled', 'Arctic Wolf', 'Reindeer', 'Aurora', 'Mountain', 'Crystal', 'Ocean', 'Ship', 'Fishing', 'Skiing', 'Coat', 'Gloves'],
    ES: ['Hielo', 'Pingüino', 'Oso Polar', 'Foca', 'Ballena', 'Nieve', 'Iglú', 'Frío', 'Trineo', 'Lobo Ártico', 'Reno', 'Aurora', 'Montaña', 'Cristal', 'Océano', 'Barco', 'Pesca', 'Esquí', 'Abrigo', 'Guantes'],
    FR: ['Glace', 'Pingouin', 'Ours Polaire', 'Phoque', 'Baleine', 'Neige', 'Igloo', 'Froid', 'Traîneau', 'Loup Arctique', 'Renne', 'Aurore', 'Montagne', 'Cristal', 'Océan', 'Bateau', 'Pêche', 'Ski', 'Manteau', 'Gants']
  },
  Desert: {
    PT: ['Areia', 'Camelo', 'Sol', 'Cacto', 'Oásis', 'Pirâmide', 'Calor', 'Duna', 'Escorpião', 'Serpente', 'Vento', 'Noite', 'Estrela', 'Poeira', 'Tenda', 'Lenço', 'Bússola', 'Viagem', 'Mapa', 'Tesouro'],
    EN: ['Sand', 'Camel', 'Sun', 'Cactus', 'Oasis', 'Pyramid', 'Heat', 'Dune', 'Scorpion', 'Snake', 'Wind', 'Night', 'Star', 'Dust', 'Tent', 'Scarf', 'Compass', 'Travel', 'Map', 'Treasure'],
    ES: ['Arena', 'Camello', 'Sol', 'Cacto', 'Oasis', 'Pirámide', 'Calor', 'Duna', 'Escorpión', 'Serpiente', 'Viento', 'Noche', 'Estrella', 'Polvo', 'Tienda', 'Bufanda', 'Brújula', 'Viaje', 'Mapa', 'Tesouro'],
    FR: ['Sable', 'Chameau', 'Soleil', 'Cactus', 'Oasis', 'Pyramide', 'Chaleur', 'Dune', 'Scorpion', 'Serpent', 'Vent', 'Nuit', 'Étoile', 'Poussière', 'Tente', 'Écharpe', 'Boussole', 'Voyage', 'Carte', 'Trésor']
  },
  Farm: {
    PT: ['Vaca', 'Cão', 'Galinha', 'Cavalo', 'Porco', 'Ovelha', 'Pato', 'Coelho', 'Burro', 'Galo', 'Trator', 'Moinho', 'Celeiro', 'Trigo', 'Milho', 'Maçã', 'Leite', 'Ovos', 'Queijo', 'Horta'],
    EN: ['Cow', 'Dog', 'Chicken', 'Horse', 'Pig', 'Sheep', 'Duck', 'Rabbit', 'Donkey', 'Rooster', 'Tractor', 'Mill', 'Barn', 'Wheat', 'Corn', 'Apple', 'Milk', 'Eggs', 'Cheese', 'Garden'],
    ES: ['Vaca', 'Perro', 'Gallina', 'Caballo', 'Cerdo', 'Oveja', 'Pato', 'Conejo', 'Burro', 'Gallo', 'Tractor', 'Molino', 'Granero', 'Trigo', 'Maíz', 'Manzana', 'Leche', 'Huevos', 'Queso', 'Huerta'],
    FR: ['Vache', 'Chien', 'Poule', 'Cheval', 'Cochon', 'Mouton', 'Canard', 'Lapin', 'Âne', 'Coq', 'Tracteur', 'Moulin', 'Grange', 'Blé', 'Maïs', 'Pomme', 'Lait', 'Œufs', 'Fromage', 'Potager']
  }
};

const WORLD_ADJECTIVES: Record<GameTheme, Record<Language, { word: string, adj: string, decoys: string[] }[]>> = {
  Zoo: {
    PT: [
      { word: 'Leão', adj: 'Bravo', decoys: ['Doce', 'Lento', 'Pequeno'] },
      { word: 'Tartaruga', adj: 'Lentíssima', decoys: ['Veloz', 'Grande', 'Fácil'] },
      { word: 'Elefante', adj: 'Enorme', decoys: ['Minúsculo', 'Azul', 'Rápido'] },
      { word: 'Girafa', adj: 'Altíssima', decoys: ['Baixa', 'Curta', 'Verde'] },
      { word: 'Macaco', adj: 'Ágil', decoys: ['Lento', 'Pesado', 'Triste'] }
    ],
    EN: [
      { word: 'Lion', adj: 'Brave', decoys: ['Sweet', 'Slow', 'Small'] },
      { word: 'Turtle', adj: 'Slow', decoys: ['Fast', 'Big', 'Easy'] },
      { word: 'Giraffe', adj: 'Tall', decoys: ['Short', 'Low', 'Green'] }
    ],
    ES: { PT: [] } as any,
    FR: { PT: [] } as any
  },
  Space: {
    PT: [
      { word: 'Sol', adj: 'Quente', decoys: ['Gelado', 'Frio', 'Verde'] },
      { word: 'Lua', adj: 'Brilhante', decoys: ['Escura', 'Preta', 'Quadrada'] },
      { word: 'Espaço', adj: 'Vazio', decoys: ['Cheio', 'Apertado', 'Colorido'] }
    ],
    EN: [
      { word: 'Sun', adj: 'Hot', decoys: ['Cold', 'Icy', 'Green'] },
      { word: 'Moon', adj: 'Bright', decoys: ['Dark', 'Black', 'Square'] }
    ],
    ES: { PT: [] } as any,
    FR: { PT: [] } as any
  },
  Ocean: {
    PT: [
      { word: 'Água', adj: 'Salgada', decoys: ['Doce', 'Seca', 'Quente'] },
      { word: 'Tubarão', adj: 'Perigoso', decoys: ['Amigável', 'Lento', 'Rosa'] },
      { word: 'Baleia', adj: 'Gigante', decoys: ['Pequena', 'Leve', 'Voadora'] }
    ],
    EN: [
      { word: 'Water', adj: 'Salty', decoys: ['Sweet', 'Dry', 'Hot'] },
      { word: 'Shark', adj: 'Dangerous', decoys: ['Friendly', 'Slow', 'Pink'] }
    ],
    ES: { PT: [] } as any,
    FR: { PT: [] } as any
  },
  History: { PT: [], EN: [], ES: [], FR: [] },
  Home: { 
    PT: [
      { word: 'Cama', adj: 'Fofinha', decoys: ['Dura', 'Áspera', 'Pontiaguda'] },
      { word: 'Sopa', adj: 'Quentinha', decoys: ['Gelada', 'Dura', 'Seca'] }
    ],
    EN: [
      { word: 'Bed', adj: 'Soft', decoys: ['Hard', 'Rough', 'Sharp'] }
    ],
    ES: { PT: [] } as any,
    FR: { PT: [] } as any
  },
  Arctic: {
    PT: [{ word: 'Neve', adj: 'Gelada', decoys: ['Quente', 'Seca', 'Verde'] }],
    EN: [{ word: 'Snow', adj: 'Ice Cold', decoys: ['Hot', 'Dry', 'Green'] }],
    ES: { PT: [] } as any, FR: { PT: [] } as any
  },
  Desert: {
    PT: [{ word: 'Oásis', adj: 'Fresco', decoys: ['Quente', 'Salgado', 'Azedo'] }],
    EN: [{ word: 'Oasis', adj: 'Fresh', decoys: ['Hot', 'Salty', 'Sour'] }],
    ES: { PT: [] } as any, FR: { PT: [] } as any
  },
  Farm: {
    PT: [{ word: 'Maçã', adj: 'Doce', decoys: ['Salgada', 'Picante', 'Amarga'] }],
    EN: [{ word: 'Apple', adj: 'Sweet', decoys: ['Salty', 'Spicy', 'Bitter'] }],
    ES: { PT: [] } as any, FR: { PT: [] } as any
  }
};

const WORLD_PRAXIAS: Record<GameTheme, Record<Language, { word: string, action: string }[]>> = {
  Zoo: {
    PT: [
      { word: 'Leão', action: 'Ruge como um leão!' },
      { word: 'Macaco', action: 'Faz o som do macaco!' },
      { word: 'Serpente', action: 'Deita a língua de fora como uma cobra!' },
      { word: 'Peixe', action: 'Faz boca de peixinho!' },
      { word: 'Cão', action: 'Arregala os olhos como um cão!' }
    ],
    EN: [
      { word: 'Lion', action: 'Roar like a lion!' },
      { word: 'Monkey', action: 'Make a monkey sound!' }
    ],
    ES: { PT: [] } as any,
    FR: { PT: [] } as any
  },
  Space: {
    PT: [
      { word: 'Foguetão', action: 'Faz o barulho do motor do foguetão!' },
      { word: 'Astronauta', action: 'Flutua como se estivesses no espaço!' }
    ],
    EN: [], ES: [], FR: []
  },
  Ocean: {
    PT: [
      { word: 'Caranguejo', action: 'Abre e fecha as mãos como pinças!' },
      { word: 'Bolhas', action: 'Faz bolinhas com a boca!' }
    ],
    EN: [], ES: [], FR: []
  },
  History: { PT: [], EN: [], ES: [], FR: [] },
  Home: { PT: [], EN: [], ES: [], FR: [] },
  Arctic: {
    PT: [{ word: 'Pinguim', action: 'Caminha como um pinguim!' }],
    EN: [], ES: [], FR: []
  },
  Desert: {
    PT: [{ word: 'Camelo', action: 'Faz de conta que bebes muita água!' }],
    EN: [], ES: [], FR: []
  },
  Farm: {
    PT: [{ word: 'Galinha', action: 'Bate as tuas asas!' }],
    EN: [], ES: [], FR: []
  }
};

/**
 * Utility to generate levels dynamically.
 */
export function generateLevel(theme: GameTheme, lang: Language, type: GameModuleType, difficulty: number): GameLevel {
  const words = GAME_DICTIONARY[theme][lang];
  const word = words[(difficulty - 1) % words.length];
  
  // Cross-reference with English dictionary for better image search
  const enWords = GAME_DICTIONARY[theme]['EN'];
  const englishKeyword = enWords[(difficulty - 1) % enWords.length].toLowerCase();
  
  const seed = `${theme}-${lang}-${word}-${difficulty}`;
  
  let question = '';
  let answer = '';
  let options: string[] = [];

  const addIncorrectOptions = (correct: string, pool: string[]) => {
    const incorrect = pool.filter(o => o !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...incorrect].sort(() => Math.random() - 0.5);
  };

  switch (type) {
    case 'Letters':
      question = lang === 'PT' ? `Letra inicial de ${word.toUpperCase()}:` :
                 lang === 'EN' ? `First letter of ${word.toUpperCase()}:` :
                 lang === 'ES' ? `Primera letra de ${word.toUpperCase()}:` :
                 `Première lettre de ${word.toUpperCase()}:`;
      answer = word[0].toUpperCase();
      options = addIncorrectOptions(answer, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
      break;
    case 'Syllables':
      // Simplified syllable logic for generic words
      question = lang === 'PT' ? `Complete: ${word.substring(2).toUpperCase()}` : `Complete: ${word.substring(2).toUpperCase()}`;
      answer = word.substring(0, 2).toUpperCase();
      options = addIncorrectOptions(answer, ['BA', 'CO', 'DU', 'MA', 'PA', 'TI', 'LE', 'RE', 'SI']);
      break;
    case 'Order':
      question = lang === 'PT' ? `Ordene: ${word.toUpperCase().split('').sort(() => Math.random() - 0.5).join(' - ')}` : 
                 lang === 'EN' ? `Order: ${word.toUpperCase().split('').sort(() => Math.random() - 0.5).join(' - ')}` :
                 lang === 'ES' ? `Ordena: ${word.toUpperCase().split('').sort(() => Math.random() - 0.5).join(' - ')}` :
                 `Ordonnez: ${word.toUpperCase().split('').sort(() => Math.random() - 0.5).join(' - ')}`;
      answer = word.toUpperCase();
      options = addIncorrectOptions(answer, [word.toUpperCase().split('').reverse().join(''), 'TEST', 'ABC', '123']);
      break;
    case 'Phrases':
      question = lang === 'PT' ? `O ___ é um item do ${theme}.` : 
                 lang === 'EN' ? `The ___ is an item from ${theme}.` :
                 lang === 'ES' ? `El ___ es un item del ${theme}.` :
                 `Le ___ est um item du ${theme}.`;
      answer = word.toUpperCase();
      options = addIncorrectOptions(answer, words.map(w => w.toUpperCase()));
      break;
    case 'Adjectives': {
      const themeAdjs = WORLD_ADJECTIVES[theme][lang] || WORLD_ADJECTIVES[theme]['PT'] || [];
      const data = themeAdjs[(difficulty - 1) % themeAdjs.length] || { word, adj: 'GRANDE', decoys: ['PEQUENO', 'MOLE', 'AZUL'] };
      question = lang === 'PT' ? `Como é o ${data.word}?` : `How is the ${data.word}?`;
      answer = data.adj.toUpperCase();
      options = [answer, ...data.decoys.map(d => d.toUpperCase())].sort(() => Math.random() - 0.5);
      return {
        id: seed,
        type,
        theme,
        lang,
        question,
        answer,
        options,
        image: `https://picsum.photos/seed/${seed}/800/800`,
        difficulty,
        targetName: data.word.toUpperCase()
      };
    }
    case 'Praxias': {
      const themePraxias = WORLD_PRAXIAS[theme][lang] || WORLD_PRAXIAS[theme]['PT'] || [];
      const data = themePraxias[(difficulty - 1) % themePraxias.length] || { word, action: 'Move-te!' };
      question = data.action;
      answer = lang === 'PT' ? 'CONSEGUI!' : 'I DID IT!';
      options = [answer, lang === 'PT' ? 'OUTRA VEZ' : 'AGAIN'].sort(() => Math.random() - 0.5);
      return {
        id: seed,
        type,
        theme,
        lang,
        question,
        answer,
        options,
        image: `https://picsum.photos/seed/${seed}/800/800`,
        difficulty,
        targetName: data.word.toUpperCase()
      };
    }
    case 'Match':
    default:
      question = lang === 'PT' ? `O que é este objeto?` : 
                 lang === 'EN' ? `What is this object?` :
                 lang === 'ES' ? `¿Qué es este objeto?` :
                 `Qu'est-ce que cet objet ?`;
      answer = word.toUpperCase();
      options = addIncorrectOptions(answer, words.map(w => w.toUpperCase()));
  }

  return {
    id: `fill-${lang.toLowerCase()}-${theme.toLowerCase()}-${difficulty}`,
    type,
    theme,
    lang,
    difficulty,
    question,
    answer,
    options,
    image: `https://loremflickr.com/200/200/${englishKeyword}`
  };
}

export const STICKER_POOL: Sticker[] = [
  // --- ZOO ---
  { id: 'z1', name: 'Leão', scientificName: 'Panthera leo', imageUrl: 'https://loremflickr.com/400/500/lion', rarity: 'Legendary', pwr: 95, cut: 40, theme: 'Zoo' },
  { id: 'z2', name: 'Elefante', scientificName: 'Loxodonta', imageUrl: 'https://loremflickr.com/400/500/elephant', rarity: 'Common', pwr: 80, cut: 30, theme: 'Zoo' },
  { id: 'z3', name: 'Panda', scientificName: 'Ailuropoda melanoleuca', imageUrl: 'https://loremflickr.com/400/500/panda', rarity: 'Rare', pwr: 30, cut: 98, theme: 'Zoo' },
  { id: 'z4', name: 'Pinguim', scientificName: 'Spheniscidae', imageUrl: 'https://loremflickr.com/400/500/penguin', rarity: 'Common', pwr: 15, cut: 85, theme: 'Zoo' },
  { id: 'z5', name: 'Tigre', scientificName: 'Panthera tigris', imageUrl: 'https://loremflickr.com/400/500/tiger', rarity: 'Rare', pwr: 90, cut: 45, theme: 'Zoo' },
  { id: 'z6', name: 'Coelho', scientificName: 'Oryctolagus cuniculus', imageUrl: 'https://loremflickr.com/400/500/rabbit', rarity: 'Common', pwr: 10, cut: 95, theme: 'Zoo' },
  { id: 'z7', name: 'Lobo', scientificName: 'Canis lupus', imageUrl: 'https://loremflickr.com/400/500/wolf', rarity: 'Rare', pwr: 75, cut: 50, theme: 'Zoo' },
  { id: 'z8', name: 'Águia', scientificName: 'Aquila chrysaetos', imageUrl: 'https://loremflickr.com/400/500/eagle', rarity: 'Legendary', pwr: 85, cut: 20, theme: 'Zoo' },
  { id: 'z9', name: 'Zebra', scientificName: 'Equus quagga', imageUrl: 'https://loremflickr.com/400/500/zebra', rarity: 'Common', pwr: 55, cut: 65, theme: 'Zoo' },
  { id: 'z10', name: 'Girafa', scientificName: 'Giraffa camelopardalis', imageUrl: 'https://loremflickr.com/400/500/giraffe', rarity: 'Rare', pwr: 40, cut: 70, theme: 'Zoo' },

  // --- SPACE ---
  { id: 's1', name: 'Astronauta', scientificName: 'Homo sapiens extra', imageUrl: 'https://loremflickr.com/400/500/astronaut', rarity: 'Legendary', pwr: 60, cut: 80, theme: 'Space' },
  { id: 's2', name: 'Marte', scientificName: 'Planeta Vermelho', imageUrl: 'https://loremflickr.com/400/500/mars', rarity: 'Rare', pwr: 40, cut: 90, theme: 'Space' },
  { id: 's3', name: 'Foguete', scientificName: 'Falcon Block', imageUrl: 'https://loremflickr.com/400/500/rocket', rarity: 'Common', pwr: 99, cut: 10, theme: 'Space' },
  { id: 's4', name: 'Saturno', scientificName: 'Planeta dos Anéis', imageUrl: 'https://loremflickr.com/400/500/saturn', rarity: 'Rare', pwr: 30, cut: 95, theme: 'Space' },
  { id: 's5', name: 'Sol', scientificName: 'Estrela Mãe', imageUrl: 'https://loremflickr.com/400/500/sun', rarity: 'Legendary', pwr: 100, cut: 10, theme: 'Space' },
  { id: 's6', name: 'Cometa', scientificName: 'Gelo Espacial', imageUrl: 'https://loremflickr.com/400/500/comet', rarity: 'Common', pwr: 70, cut: 20, theme: 'Space' },
  { id: 's7', name: 'Alienígena', scientificName: 'Curiosus extraterris', imageUrl: 'https://loremflickr.com/400/500/alien', rarity: 'Rare', pwr: 50, cut: 85, theme: 'Space' },
  { id: 's8', name: 'Vénus', scientificName: 'Planeta Brilhante', imageUrl: 'https://loremflickr.com/400/500/venus', rarity: 'Common', pwr: 45, cut: 60, theme: 'Space' },
  { id: 's9', name: 'Galáxia', scientificName: 'Via Láctea', imageUrl: 'https://loremflickr.com/400/500/galaxy', rarity: 'Legendary', pwr: 100, cut: 100, theme: 'Space' },
  { id: 's10', name: 'Telescópio', scientificName: 'James Webb Block', imageUrl: 'https://loremflickr.com/400/500/telescope', rarity: 'Rare', pwr: 20, cut: 40, theme: 'Space' },

  // --- HISTORY ---
  { id: 'h1', name: 'Partenon', scientificName: 'Templo Grego', imageUrl: 'https://loremflickr.com/400/500/parthenon', rarity: 'Rare', pwr: 70, cut: 30, theme: 'History' },
  { id: 'h2', name: 'Pirâmide', scientificName: 'Gizé', imageUrl: 'https://loremflickr.com/400/500/pyramid', rarity: 'Legendary', pwr: 70, cut: 20, theme: 'History' },
  { id: 'h3', name: 'Cavaleiro', scientificName: 'Knight', imageUrl: 'https://loremflickr.com/400/500/knight', rarity: 'Rare', pwr: 85, cut: 15, theme: 'History' },
  { id: 'h4', name: 'Castelo', scientificName: 'Fortaleza', imageUrl: 'https://loremflickr.com/400/500/castle', rarity: 'Common', pwr: 90, cut: 25, theme: 'History' },
  { id: 'h5', name: 'Faraó', scientificName: 'Ramsés Block', imageUrl: 'https://loremflickr.com/400/500/pharaoh', rarity: 'Legendary', pwr: 80, cut: 50, theme: 'History' },
  { id: 'h6', name: 'Espada', scientificName: 'Excalibur', imageUrl: 'https://loremflickr.com/400/500/sword', rarity: 'Common', pwr: 95, cut: 5, theme: 'History' },
  { id: 'h7', name: 'Viking', scientificName: 'Ragnar Block', imageUrl: 'https://loremflickr.com/400/500/viking', rarity: 'Rare', pwr: 88, cut: 20, theme: 'History' },
  { id: 'h8', name: 'Dinosauro', scientificName: 'T-Rex Antigo', imageUrl: 'https://loremflickr.com/400/500/dinosaur', rarity: 'Legendary', pwr: 100, cut: 10, theme: 'History' },
  { id: 'h9', name: 'Escriba', scientificName: 'Hieróglifo', imageUrl: 'https://loremflickr.com/400/500/scribe', rarity: 'Common', pwr: 20, cut: 70, theme: 'History' },
  { id: 'h10', name: 'Coroa', scientificName: 'Realeza', imageUrl: 'https://loremflickr.com/400/500/crown', rarity: 'Rare', pwr: 40, cut: 60, theme: 'History' },

  // --- OCEAN ---
  { id: 'o1', name: 'Golfinho', scientificName: 'Delphinidae', imageUrl: 'https://loremflickr.com/400/500/dolphin', rarity: 'Legendary', pwr: 50, cut: 95, theme: 'Ocean' },
  { id: 'o2', name: 'Tubarão', scientificName: 'Selachimorpha', imageUrl: 'https://loremflickr.com/400/500/shark', rarity: 'Rare', pwr: 98, cut: 10, theme: 'Ocean' },
  { id: 'o3', name: 'Polvo', scientificName: 'Octopoda', imageUrl: 'https://loremflickr.com/400/500/octopus', rarity: 'Common', pwr: 40, cut: 60, theme: 'Ocean' },
  { id: 'o4', name: 'Baleia', scientificName: 'Balaenidae', imageUrl: 'https://loremflickr.com/400/500/whale', rarity: 'Legendary', pwr: 100, cut: 50, theme: 'Ocean' },
  { id: 'o5', name: 'Estrela do Mar', scientificName: 'Asteroidea', imageUrl: 'https://loremflickr.com/400/500/starfish', rarity: 'Common', pwr: 10, cut: 90, theme: 'Ocean' },
  { id: 'o6', name: 'Tartaruga', scientificName: 'Chelonioidea', imageUrl: 'https://loremflickr.com/400/500/turtle', rarity: 'Rare', pwr: 60, cut: 80, theme: 'Ocean' },
  { id: 'o7', name: 'Cavalo Marinho', scientificName: 'Hippocampus', imageUrl: 'https://loremflickr.com/400/500/seahorse', rarity: 'Common', pwr: 5, cut: 95, theme: 'Ocean' },
  { id: 'o8', name: 'Medusa', scientificName: 'Scyphozoa', imageUrl: 'https://loremflickr.com/400/500/jellyfish', rarity: 'Rare', pwr: 70, cut: 40, theme: 'Ocean' },
  { id: 'o9', name: 'Coral', scientificName: 'Anthozoa', imageUrl: 'https://loremflickr.com/400/500/coral', rarity: 'Common', pwr: 15, cut: 85, theme: 'Ocean' },
  { id: 'o10', name: 'Submarino', scientificName: 'Nautilus Block', imageUrl: 'https://loremflickr.com/400/500/submarine', rarity: 'Legendary', pwr: 85, cut: 20, theme: 'Ocean' },

  // --- HOME ---
  { id: 'ho1', name: 'Televisor', scientificName: 'TV', imageUrl: 'https://loremflickr.com/400/500/tv', rarity: 'Common', pwr: 20, cut: 40, theme: 'Home' },
  { id: 'ho2', name: 'Gato', scientificName: 'Felis catus', imageUrl: 'https://loremflickr.com/400/500/cat', rarity: 'Legendary', pwr: 15, cut: 100, theme: 'Home' },
  { id: 'ho3', name: 'Cadeira', scientificName: 'Seat', imageUrl: 'https://loremflickr.com/400/500/chair', rarity: 'Common', pwr: 10, cut: 50, theme: 'Home' },
  { id: 'ho4', name: 'Sofá', scientificName: 'Rest', imageUrl: 'https://loremflickr.com/400/500/sofa', rarity: 'Rare', pwr: 5, cut: 90, theme: 'Home' },
  { id: 'ho5', name: 'Cão', scientificName: 'Canis familiaris', imageUrl: 'https://loremflickr.com/400/500/dog', rarity: 'Legendary', pwr: 60, cut: 95, theme: 'Home' },
  { id: 'ho6', name: 'Livro', scientificName: 'Knowledge', imageUrl: 'https://loremflickr.com/400/500/book', rarity: 'Common', pwr: 50, cut: 30, theme: 'Home' },
  { id: 'ho7', name: 'Lâmpada', scientificName: 'Light', imageUrl: 'https://loremflickr.com/400/500/lamp', rarity: 'Common', pwr: 20, cut: 60, theme: 'Home' },
  { id: 'ho8', name: 'Janela', scientificName: 'View', imageUrl: 'https://loremflickr.com/400/500/window', rarity: 'Rare', pwr: 10, cut: 70, theme: 'Home' },
  { id: 'ho9', name: 'Relógio', scientificName: 'Time', imageUrl: 'https://loremflickr.com/400/500/clock', rarity: 'Common', pwr: 30, cut: 40, theme: 'Home' },
  { id: 'ho10', name: 'Mochila', scientificName: 'Bag', imageUrl: 'https://loremflickr.com/400/500/backpack', rarity: 'Rare', pwr: 40, cut: 80, theme: 'Home' },
  
  // --- ARCTIC ---
  { id: 'arc1', name: 'Urso Polar', scientificName: 'Ursus maritimus', imageUrl: 'https://loremflickr.com/400/500/polarbear', rarity: 'Legendary', pwr: 95, cut: 30, theme: 'Arctic' },
  { id: 'arc2', name: 'Pinguim Imperador', scientificName: 'Aptenodytes forsteri', imageUrl: 'https://loremflickr.com/400/500/penguin', rarity: 'Rare', pwr: 20, cut: 90, theme: 'Arctic' },
  { id: 'arc3', name: 'Foca', scientificName: 'Phocidae', imageUrl: 'https://loremflickr.com/400/500/seal', rarity: 'Common', pwr: 30, cut: 60, theme: 'Arctic' },
  { id: 'arc4', name: 'Lobo Ártico', scientificName: 'Canis lupus arctos', imageUrl: 'https://loremflickr.com/400/500/arcticwolf', rarity: 'Rare', pwr: 80, cut: 40, theme: 'Arctic' },
  { id: 'arc5', name: 'Iglu', scientificName: 'Domus glacialis', imageUrl: 'https://loremflickr.com/400/500/igloo', rarity: 'Common', pwr: 60, cut: 10, theme: 'Arctic' },

  // --- DESERT ---
  { id: 'des1', name: 'Camelo', scientificName: 'Camelus', imageUrl: 'https://loremflickr.com/400/500/camel', rarity: 'Legendary', pwr: 70, cut: 40, theme: 'Desert' },
  { id: 'des2', name: 'Escorpião', scientificName: 'Scorpiones', imageUrl: 'https://loremflickr.com/400/500/scorpion', rarity: 'Rare', pwr: 85, cut: 20, theme: 'Desert' },
  { id: 'des3', name: 'Serpente das Areias', scientificName: 'Cerastes', imageUrl: 'https://loremflickr.com/400/500/rattlesnake', rarity: 'Common', pwr: 75, cut: 30, theme: 'Desert' },
  { id: 'des4', name: 'Oásis', scientificName: 'Aqua deserti', imageUrl: 'https://loremflickr.com/400/500/oasis', rarity: 'Rare', pwr: 10, cut: 100, theme: 'Desert' },
  { id: 'des5', name: 'Cacto', scientificName: 'Cactaceae', imageUrl: 'https://loremflickr.com/400/500/cactus', rarity: 'Common', pwr: 40, cut: 50, theme: 'Desert' },

  // --- FARM ---
  { id: 'far1', name: 'Vaca', scientificName: 'Bos taurus', imageUrl: 'https://loremflickr.com/400/500/cow', rarity: 'Rare', pwr: 65, cut: 35, theme: 'Farm' },
  { id: 'far2', name: 'Porquinho', scientificName: 'Sus scrofa domesticus', imageUrl: 'https://loremflickr.com/400/500/piglet', rarity: 'Common', pwr: 20, cut: 95, theme: 'Farm' },
  { id: 'far3', name: 'Galinha', scientificName: 'Gallus gallus domesticus', imageUrl: 'https://loremflickr.com/400/500/chicken', rarity: 'Common', pwr: 15, cut: 70, theme: 'Farm' },
  { id: 'far4', name: 'Cavalo', scientificName: 'Equus ferus caballus', imageUrl: 'https://loremflickr.com/400/500/horse', rarity: 'Legendary', pwr: 85, cut: 45, theme: 'Farm' },
  { id: 'far5', name: 'Trator', scientificName: 'Machina agricola', imageUrl: 'https://loremflickr.com/400/500/tractor', rarity: 'Rare', pwr: 90, cut: 10, theme: 'Farm' },
];

export const THEME_BACKGROUNDS: Record<GameTheme, string> = {
  Zoo: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=2000',
  History: 'https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&q=80&w=2000',
  Home: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=2000',
  Space: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000',
  Ocean: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=2000',
  Arctic: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=2000',
  Desert: 'https://images.unsplash.com/photo-1445722421330-843818e69002?auto=format&fit=crop&q=80&w=2000',
  Farm: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000',
};

export const GAME_LEVELS: GameLevel[] = [
  // ==========================================
  // PORTUGUÊS (PT)
  // ==========================================
  
  // --- ZOO ---
  { id: 'pt-z-l1', type: 'Letters', theme: 'Zoo', lang: 'PT', question: 'Letra inicial de LEÃO:', answer: 'L', options: ['L', 'M', 'P', 'R'], image: 'https://loremflickr.com/200/200/lion' },
  { id: 'pt-z-l2', type: 'Letters', theme: 'Zoo', lang: 'PT', question: 'Letra final de ZEBRA:', answer: 'A', options: ['A', 'E', 'Z', 'B'], image: 'https://loremflickr.com/200/200/zebra' },
  { id: 'pt-z-s1', type: 'Syllables', theme: 'Zoo', lang: 'PT', question: 'Quantas sílabas em PAN-DA?', answer: '2', options: ['1', '2', '3', '4'], image: 'https://loremflickr.com/200/200/panda' },
  { id: 'pt-z-d1', type: 'Digraphs', theme: 'Zoo', lang: 'PT', question: 'Complete: CO-E-___-O', answer: 'LH', options: ['LH', 'NH', 'CH', 'RR'], image: 'https://loremflickr.com/200/200/rabbit' },
  { id: 'pt-z-o1', type: 'Order', theme: 'Zoo', lang: 'PT', question: 'Ordene: O - B - O - L', answer: 'LOBO', options: ['LOBO', 'BOLO', 'LOBB', 'LBOO'], image: 'https://loremflickr.com/200/200/wolf' },
  { id: 'pt-z-t1', type: 'Tonic', theme: 'Zoo', lang: 'PT', question: 'Sílaba forte de JA-CA-RÉ:', answer: 'RÉ', options: ['JA', 'CA', 'RÉ'], image: 'https://loremflickr.com/200/200/alligator' },
  { id: 'pt-z-p1', type: 'Phrases', theme: 'Zoo', lang: 'PT', question: 'O ___ corre na savana:', answer: 'LEÃO', options: ['LEÃO', 'PEIXE', 'GATO', 'RATO'], image: 'https://loremflickr.com/200/200/lion' },
  { id: 'pt-z-m1', type: 'Match', theme: 'Zoo', lang: 'PT', question: 'Quem é este animal?', answer: 'TIGRE', options: ['TIGRE', 'LEÃO', 'URSO', 'LOBO'], image: 'https://loremflickr.com/200/200/tiger' },
  
  // --- SPACE ---
  { id: 'pt-s-l1', type: 'Letters', theme: 'Space', lang: 'PT', question: 'Letra inicial de LUA:', answer: 'L', options: ['L', 'M', 'S', 'A'], image: 'https://loremflickr.com/200/200/moon' },
  { id: 'pt-s-s1', type: 'Syllables', theme: 'Space', lang: 'PT', question: 'Sílabas em FO-GUE-TE:', answer: '3', options: ['1', '2', '3', '4'], image: 'https://loremflickr.com/200/200/rocket' },
  { id: 'pt-s-o1', type: 'Order', theme: 'Space', lang: 'PT', question: 'Ordene: M - A - R - T - E', answer: 'MARTE', options: ['MARTE', 'TERAM', 'REMA T', 'METRA'], image: 'https://loremflickr.com/200/200/mars' },
  { id: 'pt-s-t1', type: 'Tonic', theme: 'Space', lang: 'PT', question: 'Sílaba forte de CO-ME-TA:', answer: 'ME', options: ['CO', 'ME', 'TA'], image: 'https://loremflickr.com/200/200/comet' },
  { id: 'pt-s-p1', type: 'Phrases', theme: 'Space', lang: 'PT', question: 'A Terra é um ___:', answer: 'PLANETA', options: ['PLANETA', 'SOL', 'COMETA', 'LUA'], image: 'https://loremflickr.com/200/200/earth' },
  
  // --- OCEAN ---
  { id: 'pt-o-l1', type: 'Letters', theme: 'Ocean', lang: 'PT', question: 'Letra inicial de MAR:', answer: 'M', options: ['M', 'A', 'R', 'S'], image: 'https://loremflickr.com/200/200/sea' },
  { id: 'pt-o-s1', type: 'Syllables', theme: 'Ocean', lang: 'PT', question: 'Sílabas em PEI-XE:', answer: '2', options: ['1', '2', '3', '4'], image: 'https://loremflickr.com/200/200/fish' },
  { id: 'pt-o-d1', type: 'Digraphs', theme: 'Ocean', lang: 'PT', question: 'Complete: GO-___-I-NHO', answer: 'LF', options: ['LF', 'LH', 'NH', 'CH'], image: 'https://loremflickr.com/200/200/dolphin' },
  { id: 'pt-o-m1', type: 'Match', theme: 'Ocean', lang: 'PT', question: 'Que gigante é este?', answer: 'BALEIA', options: ['BALEIA', 'TUBARÃO', 'POLVO', 'PEIXE'], image: 'https://loremflickr.com/200/200/whale' },
  
  // --- HISTORY ---
  { id: 'pt-h-l1', type: 'Letters', theme: 'History', lang: 'PT', question: 'Letra inicial de REI:', answer: 'R', options: ['R', 'P', 'T', 'S'], image: 'https://loremflickr.com/200/200/king' },
  { id: 'pt-h-s1', type: 'Syllables', theme: 'History', lang: 'PT', question: 'Sílabas em CAS-TE-LO:', answer: '3', options: ['1', '2', '3', '4'], image: 'https://loremflickr.com/200/200/castle' },
  { id: 'pt-h-o1', type: 'Order', theme: 'History', lang: 'PT', question: 'Ordene: M - U - S - E - U', answer: 'MUSEU', options: ['MUSEU', 'USEUM', 'SUMEU', 'MESUU'], image: 'https://loremflickr.com/200/200/museum' },
  
  // --- HOME ---
  { id: 'pt-ho-l1', type: 'Letters', theme: 'Home', lang: 'PT', question: 'Letra inicial de MESA:', answer: 'M', options: ['M', 'C', 'S', 'P'], image: 'https://loremflickr.com/200/200/table' },
  { id: 'pt-ho-s1', type: 'Syllables', theme: 'Home', lang: 'PT', question: 'Sílabas em CO-ZI-NHA:', answer: '3', options: ['1', '2', '3', '4'], image: 'https://loremflickr.com/200/200/kitchen' },
  { id: 'pt-ho-p1', type: 'Phrases', theme: 'Home', lang: 'PT', question: 'Eu durmo na ___:', answer: 'CAMA', options: ['CAMA', 'MESA', 'SALA', 'RUA'], image: 'https://loremflickr.com/200/200/bed' },
  
  // ==========================================
  // ENGLISH (EN)
  // ==========================================
  
  // --- ZOO ---
  { id: 'en-z-l1', type: 'Letters', theme: 'Zoo', lang: 'EN', question: 'First letter of LION:', answer: 'L', options: ['L', 'M', 'P', 'R'], image: 'https://loremflickr.com/200/200/lion' },
  { id: 'en-z-s1', type: 'Syllables', theme: 'Zoo', lang: 'EN', question: 'Syllables in TI-GER:', answer: '2', options: ['1', '2', '3', '4'], image: 'https://loremflickr.com/200/200/tiger' },
  { id: 'en-z-p1', type: 'Phrases', theme: 'Zoo', lang: 'EN', question: 'The big cat is a ___:', answer: 'LION', options: ['LION', 'DOG', 'BIRD', 'FISH'], image: 'https://loremflickr.com/200/200/lion' },
  
  // --- SPACE ---
  { id: 'en-s-l1', type: 'Letters', theme: 'Space', lang: 'EN', question: 'First letter of MOON:', answer: 'M', options: ['M', 'L', 'S', 'A'], image: 'https://loremflickr.com/200/200/moon' },
  { id: 'en-s-o1', type: 'Order', theme: 'Space', lang: 'EN', question: 'Order: S - T - A - R', answer: 'STAR', options: ['STAR', 'TSAR', 'RATS', 'ARTS'], image: 'https://loremflickr.com/200/200/star' },
  
  // --- OCEAN ---
  { id: 'en-o-l1', type: 'Letters', theme: 'Ocean', lang: 'EN', question: 'First letter of FISH:', answer: 'F', options: ['F', 'S', 'W', 'B'], image: 'https://loremflickr.com/200/200/fish' },
  { id: 'en-o-m1', type: 'Match', theme: 'Ocean', lang: 'EN', question: 'What is this creature?', answer: 'SHARK', options: ['SHARK', 'WHALE', 'CRAB', 'FISH'], image: 'https://loremflickr.com/200/200/shark' },
  
  // ==========================================
  // ESPAÑOL (ES)
  // ==========================================
  
  // --- ZOO ---
  { id: 'es-z-l1', type: 'Letters', theme: 'Zoo', lang: 'ES', question: 'Primera letra de LEÓN:', answer: 'L', options: ['L', 'M', 'P', 'R'], image: 'https://loremflickr.com/200/200/lion' },
  { id: 'es-z-s1', type: 'Syllables', theme: 'Zoo', lang: 'ES', question: 'Sílabas en TI-GRE:', answer: '2', options: ['1', '2', '3', '4'], image: 'https://loremflickr.com/200/200/tiger' },
  
  // --- SPACE ---
  { id: 'es-s-l1', type: 'Letters', theme: 'Space', lang: 'ES', question: 'Primera letra de LUNA:', answer: 'L', options: ['L', 'M', 'S', 'A'], image: 'https://loremflickr.com/200/200/moon' },
  { id: 'es-s-o1', type: 'Order', theme: 'Space', lang: 'ES', question: 'Ordena: S - O - L', answer: 'SOL', options: ['SOL', 'LOS', 'OLS', 'SLO'], image: 'https://loremflickr.com/200/200/sun' },
  
  // ==========================================
  // FRANÇAIS (FR)
  // ==========================================
  
  // --- ZOO ---
  { id: 'fr-z-l1', type: 'Letters', theme: 'Zoo', lang: 'FR', question: 'Première lettre de LION:', answer: 'L', options: ['L', 'M', 'P', 'R'], image: 'https://loremflickr.com/200/200/lion' },
  { id: 'fr-z-s1', type: 'Syllables', theme: 'Zoo', lang: 'FR', question: 'Syllabes dans TI-GRE:', answer: '2', options: ['1', '2', '3', '4'], image: 'https://loremflickr.com/200/200/tiger' },
  
  // --- SPACE ---
  { id: 'fr-s-l1', type: 'Letters', theme: 'Space', lang: 'FR', question: 'Première lettre de LUNE:', answer: 'L', options: ['L', 'M', 'S', 'A'], image: 'https://loremflickr.com/200/200/moon' },
  { id: 'fr-s-o1', type: 'Order', theme: 'Space', lang: 'FR', question: 'Ordre: C - I - E - L', answer: 'CIEL', options: ['CIEL', 'LEIC', 'EICL', 'CELI'], image: 'https://loremflickr.com/200/200/sky' },
  
  // Fillers for all combinations to ensure 100% is reachable (100 levels per theme/lang)
  ...(['PT', 'EN', 'ES', 'FR'] as Language[]).flatMap(lang => 
    (['Zoo', 'Space', 'Ocean', 'History', 'Home', 'Arctic', 'Desert', 'Farm'] as GameTheme[]).flatMap(theme =>
      Array.from({ length: 100 }).map((_, i) => 
        generateLevel(theme, lang, (['Letters', 'Syllables', 'Digraphs', 'Order', 'Tonic', 'Phrases', 'Match', 'Adjectives', 'Praxias'] as const)[i % 9], i + 1)
      )
    )
  )
];

export const PACK_COST = 50;
export const WIN_REWARD = 20;

export const THEME_COSTS: Record<Exclude<GameTheme, 'Zoo'>, number> = {
  History: 300,
  Home: 0, // Free theme
  Space: 500,
  Ocean: 500,
  Arctic: 600,
  Desert: 600,
  Farm: 400
};

export const CREDIT_PACKS: StoreCreditPack[] = [
  { id: 'pack-small', amount: 100, price: 1.99, label: 'Pacote Explorador' },
  { id: 'pack-medium', amount: 500, price: 4.99, label: 'Pacote Aventureiro', isPromo: true, bonusAmount: 50 },
  { id: 'pack-large', amount: 1500, price: 9.99, label: 'Pacote Mestre do Zoo', isPromo: true, bonusAmount: 300 },
  { id: 'pack-mega', amount: 5000, price: 29.99, label: 'Pacote Rei da Selva', bonusAmount: 1000 },
];


export const RARITY_WEIGHTS: Record<Rarity, number> = {
 'Common': 70,
 'Rare': 24,
 'Legendary': 6
};

export const REWARD_SONGS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
];
