const cardRanksHI = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardRanksLO = ['A','2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const royalRanks = ['T', 'J', 'Q', 'K', 'A'];
const unicodeSuits = ['♠', '♣', '♥', '♦'];
const rankNames = [
  "High Card",
  "Pair",
  "Two Pair",
  "Three of a Kind",
  "Straight",
  "Flush",
  "Full House",
  "Quads",
  "Straight Flush",
  "Royal Flush"
];

const royalRanks_bin = [10,11,12,13,1];

//For Bin Ranks, aces are LO
const subranks = [.1, 1e-13, 1e-12, 1e-11, 1e-10, 1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2]



function createDeck(v) {
  //Alpha/String deck creator
  //Logical, but slower data structure to work with.
    var suits = ['s', 'c', 'h', 'd'];
    var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    var d = [];
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < ranks.length; j++) {
        d.push(ranks[j] + suits[i]);
      }
    }
    if (v) console.log("Deck created:", d);
    return d;
}

function createDeck_bin(v) {
  //Base 10 to create
  //In binary:  0bXXYYY, where XX are the suit bits, and YYYY are rank bits
  //So, to get the suit with bitwise functions just bitwise shift: >> 4
  //to get the rank, just do a bitwise mask:  & 0b001111
  var d = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61];
  if (v) console.log("Binary Deck created:", d);
  return d;
}

function binCard2str(c) {
  s = unicodeSuits[c >> 4];
  r = cardRanksLO[(c & 0b001111)-1];
  return r+s;
}

function binHand2str(h) {
  nh = [];
  h.forEach(e=>{nh.push(binCard2str(e))}) 
  return nh;
}

function binHand2type(h) {
  h1r = (h[0] & 0b001111)-1
  h2r = (h[1] & 0b001111)-1
  if (h1r==h2r) return cardRanksLO[h1r] + cardRanksLO[h2r]; //pocket pair
  if (h1r==0) { t = cardRanksLO[h1r] + cardRanksLO[h2r]; } //first card is ace
  else if (h2r==0) { t = cardRanksLO[h2r] + cardRanksLO[h1r]; } //2nd card is ace
  else if (h1r>h2r) { t = cardRanksLO[h1r] + cardRanksLO[h2r] } else { t = cardRanksLO[h2r] + cardRanksLO[h1r] }
  h1s = h[0] >> 4
  h2s = h[1] >> 4
  if (h1s==h2s) { return t+'s'; } else { return t+'o'; }
}

function shuffleDeck(d, v) {
  d.sort(function() { return 0.5 - Math.random(); });
  if (v) console.log("Deck shuffled:", d);
  return d;      
}

function shuffleDeckFY(d, v) {
  //Fisher-Yates (Knuth) shuffle
  //Create a fairer shuffle where each permutation is equally likely
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];  // Swap the elements.
  }
  if (v) console.log("Deck FY shuffled:", d);
  return d;
}
 
function dealCards(d, numCards, v) {
  var hand = d.splice(0, numCards);  
  if (v) console.log("Hand dealt:", binHand2str(hand), binHand2type(hand));      
  return hand;
}


function rankHand_bin(hand, handSize, v, dosubs) {     
  
  function isFlush(hand) {
    // Checks if a 5 card hand IS a flush
    var handSuit = hand[0] >> 4;
    for (var i = 1; i < 5; i++) {
      if (hand[i] >> 4 != handSuit) return false;
    }
    return true;
  }

  function hasFlush(hand, x) {
    // Checks if a hand contains ANY flush of size x
    // Create an object to count the cards in each suit
    var suitCounts = [0, 0, 0, 0];
    
    // Count the number of cards in each suit
    for (var i = 0; i < hand.length; i++) {
      var suit = hand[i] >> 4;
      suitCounts[suit]++;
    }

    // Check if any suit has at least `x` cards
    for (var i = 0; i < 4; i++) {
      if (suitCounts[i] >= x) {
        return true;
      }
    }    
    return false;
  }  

  function hasPair_fast(hand) {
    //any pair exists, AT LEAST !!
    //returns the rank to be used later in two pair and three of a kind and full checks
    for (var i = 0; i < hand.length-1; i++) {
      for (var j = i+1; j < hand.length; j++) {
        if ((hand[i] & 0b001111) == (hand[j] & 0b001111)) return (hand[i] & 0b001111);
      }  
    }
    return 0;
  }

  function hasTwoPairs_fast(hand,firstrank) {
    //returns if another pair, other than first rank exists
    hand = hand.filter(card => (card & 0b001111) !== firstrank);
    for (var i = 0; i < hand.length-1; i++) {
      for (var j = i+1; j < hand.length; j++) {
        //if ((hand[i] & 0b001111) != firstrank && (hand[i] & 0b001111) == (hand[j] & 0b001111)) return true;
        if ((hand[i] & 0b001111) == (hand[j] & 0b001111)) return true;
      }  
    }
    return false;
  }

  function hasThreeOfAKind_fast(hand, firstrank) {
    hand = hand.filter(card => (card & 0b001111) !== firstrank);
    return hand.length==2;
  }

  function hasFullHouse_fast(hand,firstrank) {
    hand = hand.filter(card => (card & 0b001111) !== firstrank);    
    //We know there's at least pair & can't be quads, so only 2 or 3 cards left
    //And, the remaining cards after filter MUST match rank.    
    var handRank = hand[0] & 0b001111;
    for (var i = 1; i < hand.length; i++) {
       if ((hand[i] & 0b001111) != handRank) return false;
    }
    return true;
  }
     
  function hasQuads_fast(hand, firstrank) {
    hand = hand.filter(card => (card & 0b001111) !== firstrank);
    return hand.length==1;
  }

  function isStraight_fast(hand) {
    var handsize=hand.length;
    var handRanks = hand.map(function(card) {
      return card & 0b001111;
    });
    var uniqueRanks = Array.from(new Set(handRanks));
    if (uniqueRanks.length < handsize) return false;

    //ACES LO (rank value 1)
    uniqueRanks.sort(function(a, b) { return a - b; });
    var lowrank = uniqueRanks[0];
    var hirank  = uniqueRanks[handsize-1];
    if (hirank-lowrank+1==handsize) return true;

    //If there is even an ace...
    if (uniqueRanks.includes(1)) {
      //ACES HI - change aces to 14
      uniqueRanks = uniqueRanks.map(value => {
        if (value === 1) {
          return 14;  
        } else {
          return value; 
        }
      });
      uniqueRanks.sort(function(a, b) { return a - b; });
      var lowrank = uniqueRanks[0];
      var hirank  = uniqueRanks[handsize-1];
      if (hirank-lowrank+1==handsize) return true;
    }
    return false;
  }

  function isStraight_fast2(hand) {
    var handsize=hand.length;
    var uniqueRanks = hand.map(function(card) {
      return card & 0b001111;
    });
    
    //Because I always check for pair existence before calling, there will always be unique ranks equal
    //to handsize...
    //var uniqueRanks = Array.from(new Set(handRanks));
    //if (uniqueRanks.length < handsize) return false;

    //ACES LO (rank value 1)
    var bail=false;
    for (var i = 0; i < uniqueRanks.length-1; i++) {
      for (var j = i+1; j < uniqueRanks.length; j++) {
        if (Math.abs(uniqueRanks[i] - uniqueRanks[j]) >= handsize) {bail=true; break;}
      }
      if (bail) break;
    }
    if (!bail) return true;

    //If there is even an ace...
    if (uniqueRanks.includes(1)) {
      //ACES HI - change aces to 14
      uniqueRanks = uniqueRanks.map(value => {
        if (value === 1) { return 14; } else { return value; }
      });
      for (var i = 0; i < uniqueRanks.length-1; i++) {
        for (var j = i+1; j < uniqueRanks.length; j++) {
          if (Math.abs(uniqueRanks[i] - uniqueRanks[j]) >= handsize) {return false;}
        }  
      }
      return true;
    }
    return false;
  }

  function isRoyal(hand) {
    var handRanks = hand.map(function(card) {
      return card & 0b001111;
    });
    for (var i = 0; i < royalRanks_bin.length; i++) {
      if (!handRanks.includes(royalRanks_bin[i])) {
        return false;
      }
    }
    return true;
  }


  // Function to find the best 5-card hand RANK from the given hand
  function findBestRank(hand, dosubs) {
    var possibleHands = [];

    // Generate all possible combinations of 5-card hands from the given hand
    function generateCombinations(hand, r, combination, index) {
      if (combination.length === r) {
        possibleHands.push(combination.slice());
        return;
      }

      for (var i = index; i < hand.length; i++) {
        combination.push(hand[i]);
        generateCombinations(hand, r, combination, i + 1);
        combination.pop();
      }
    }

    generateCombinations(hand, 5, [], 0);

    // Inits
    var bestRankNum = 0;
    var bestHand = [];
    var hasP = (hasPair_fast(hand)>0);
    //var hasF = hasFlush(hand,5);  //actually worse!
    var isF,isP,hasS;
    
    for (var i = 0; i < possibleHands.length; i++) {
      var currentHand = possibleHands[i];
      var currentRankNum = 1;
      var bail = false;
      var prank=0;

      //isF = hasF && isFlush(currentHand); //actually worse!
      isF = isFlush(currentHand);      
      isP = !isF && hasP && ((prank = hasPair_fast(currentHand))>0);
      isS = !isP && isStraight_fast2(currentHand);

      if (isF && isS) {
        if (isRoyal(currentHand)) {
          currentRankNum = 10;
          bail = true;
        } else {
          currentRankNum = 9;
        }
      } else if (bestRankNum < 9 && isP && hasQuads_fast(currentHand,prank)) {
        currentRankNum = 8;
      } else if (bestRankNum < 8 && isP && hasFullHouse_fast(currentHand,prank)) {
        currentRankNum = 7;
      } else if (bestRankNum < 7 && isF) {
        currentRankNum = 6;
      } else if (bestRankNum < 6 && isS) {
        currentRankNum = 5;
      } else if (bestRankNum < 5 && isP && hasThreeOfAKind_fast(currentHand,prank)) {
        currentRankNum = 4;
      } else if (bestRankNum < 4 && isP && hasTwoPairs_fast(currentHand,prank)) {
        currentRankNum = 3;
      } else if (bestRankNum < 3 && isP) {
        currentRankNum = 2;
      } 

      // Add subrank value (as decimals), important for comparing same ranks: kickers, better 2 pair, higher flush, straight, etc.
      //A==.1, K==.01, ...      
      if (dosubs) {
        let subrank = 0;
        currentHand.forEach(element => {
          r = (element & 0b001111)-1
          subrank+=subranks[r];
        });
        currentRankNum = currentRankNum+subrank
      }      

      // Check if the current hand has a higher rank
      if (currentRankNum > bestRankNum) {
        bestRankNum = currentRankNum;
        bestHand = currentHand
      }
      if (bail) break;
    }

    if (v) {
        console.log("Rank:", bestRankNum);
        console.log("Best Hand:", binHand2str(bestHand));
    }
    
    return bestRankNum;
  }

  // Check if the hand size is valid
  if (handSize === 5) {
    return findBestRank(hand, dosubs);
  } else {
    console.log("Invalid hand size for ranking");
  }
}