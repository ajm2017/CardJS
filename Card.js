const cardRanksHI = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardRanksLO = ['A','2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const royalRanks = ['10', 'J', 'Q', 'K', 'A'];

const cardRanksHI_bin = [2,3,4,5,6,7,8,9,10,11,12,13,1];
const cardRanksLO_bin = [1,2,3,4,5,6,7,8,9,10,11,12,13];
const royalRanks_bin = [10,11,12,13,1];

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
  var hand = d.slice(0, numCards);      
  if (v) console.log("Hand dealt:", hand);      
  return hand;
}


//ALPHA / String Decks Only
function rankHand(hand, handSize, v) {     
  
  function isFlush(hand) {
    //checks if a 5 card hand IS a flush
    var handSuit = hand[0][hand[0].length - 1];
    for (var i = 1; i < 5; i++) {
      if (hand[i][hand[i].length - 1] !== handSuit) return false;
    }
    return true;
  }

  function hasPair(hand) {
    //any pair exists, AT LEAST !!
    var handRanks = hand.map(function(card) {
      return card.substring(0, card.length - 1);
    });
    var rankCounts = {};
    for (var i = 0; i < hand.length; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }
    for (var rank in rankCounts) {
      if (rankCounts[rank] >= 2) return true;        
    }
    return false;
  }

  function hasTwoPairs(hand) {
    var handRanks = hand.map(function(card) {
      return card.substring(0, card.length - 1);
    });

    var rankCounts = {};
    for (var i = 0; i < handSize; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }

    var pairCount = 0;
    for (var rank in rankCounts) {
      if (rankCounts[rank] >= 2) {
        pairCount++;
      }
    }

    return pairCount === 2;
  }

  function hasThreeOfAKind(hand) {
    var handRanks = hand.map(function(card) {
      return card.substring(0, card.length - 1);
    });

    var rankCounts = {};
    for (var i = 0; i < handSize; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }

    for (var rank in rankCounts) {
      if (rankCounts[rank] === 3) {
        return true;
      }
    }
    return false;
  }

  function hasFullHouse(hand) {
    var handRanks = hand.map(function(card) {
      return card.substring(0, card.length - 1);
    });

    var rankCounts = {};
    for (var i = 0; i < handSize; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }

    var hasTwo = false;
    var hasThree = false;
    for (var rank in rankCounts) {
      if (rankCounts[rank] === 2) {
        hasTwo = true;
      }
      if (rankCounts[rank] === 3) {
        hasThree = true;
      }
    }
    if (hasTwo && hasThree) {
      return true;
    }
    return false;
  }

  function hasQuads(hand) {
    var handRanks = hand.map(function(card) {
      return card.substring(0, card.length - 1);
    });

    var rankCounts = {};
    for (var i = 0; i < handSize; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }
    for (var rank in rankCounts) {
      if (rankCounts[rank] === 4) {
        return true;
      }
    }
    return false;
  }

  function hasStraight(hand) {
    var handRanks = hand.map(function(card) {
      return card.substring(0, card.length - 1);
    });
    var uniqueRanks = Array.from(new Set(handRanks));
    if (uniqueRanks.length < 5) return false;

    //ACES High
    uniqueRanks.sort(function(a, b) {
      return cardRanksHI.indexOf(a) - cardRanksHI.indexOf(b);
    });
    var isStraight = true;
    for (var i = 1; i < uniqueRanks.length; i++) {
      var currentRankIndex = cardRanksHI.indexOf(uniqueRanks[i]);
      var previousRankIndex = cardRanksHI.indexOf(uniqueRanks[i - 1]);
      if (currentRankIndex - previousRankIndex !== 1) {
        isStraight = false;
        break;
      }
    }

    if (isStraight) return true;
    if (uniqueRanks.includes("A")) {
      //ACES Lo
      uniqueRanks.sort(function(a, b) {
        return cardRanksLO.indexOf(a) - cardRanksLO.indexOf(b);
      });
      var isStraight = true;
      for (var i = 1; i < uniqueRanks.length; i++) {
        var currentRankIndex = cardRanksLO.indexOf(uniqueRanks[i]);
        var previousRankIndex = cardRanksLO.indexOf(uniqueRanks[i - 1]);
        if (currentRankIndex - previousRankIndex !== 1) {
          isStraight = false;
          break;
        }
      }
    }
    return isStraight;      
  }


  function isRoyal(hand) {
    var handRanks = hand.map(function(card) {
      return card.substring(0, card.length - 1);
    });

    //console.log(handRanks);
    // Check if the hand ranks match the royal ranks
    for (var i = 0; i < royalRanks.length; i++) {
      if (!handRanks.includes(royalRanks[i])) {
        //console.log(handRanks, handRanks.includes(royalRanks[i]), royalRanks[i]);
        return false;
      }
    }

    return true;
  }

  // Function to find the best 5-card hand from the given hand
  function findBestHand(hand) {
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

    // Initialize bestRankNum to the lowest value
    var bestRankNum = 0;
    var hasP = hasPair(hand);
    var isF = false;
    var hasS = false;
    
    for (var i = 0; i < possibleHands.length; i++) {
      var currentHand = possibleHands[i];
      var currentRankNum = 0;
      var bail = false;

      isF = isFlush(currentHand);
      hasS = hasStraight(currentHand);

      if (isF && hasS) {
        if (isRoyal(currentHand)) {
          currentRankNum = 10;
          bail = true;
        } else {
          currentRankNum = 9;
        }
      } else if (bestRankNum < 8 && currentRankNum<8 && hasP && hasQuads(currentHand)) {
        currentRankNum = 8;
        bail = true; // can't have straight flush now in the 7
      } else if (bestRankNum < 7 && hasP && hasFullHouse(currentHand)) {
        currentRankNum = 7;
      } else if (bestRankNum < 6 && isF) {
        currentRankNum = 6;
      } else if (bestRankNum < 5 && hasS) {
        currentRankNum = 5;
      } else if (bestRankNum < 4 && hasP && hasThreeOfAKind(currentHand)) {
        currentRankNum = 4;
      } else if (bestRankNum < 3 && hasP && hasTwoPairs(currentHand)) {
        currentRankNum = 3;
      } else if (bestRankNum < 2 && hasP && hasPair(currentHand)) {
        currentRankNum = 2;
      } else {
        currentRankNum = 1;
      }

      // Check if the current hand has a higher rank
      if (currentRankNum > bestRankNum) {
        bestHand = currentHand;
        bestRankNum = currentRankNum;
      }
      if (bail) break;
    }


    // Map bestRankNum back to the corresponding rank string
    var bestRank;
    switch (bestRankNum) {
      case 10:
        bestRank = "Royal Flush";
        break;
      case 9:
        bestRank = "Straight Flush";          
        break;
      case 8:
        bestRank = "Quads";
        break;
      case 7:
        bestRank = "Full House";
        break;
      case 6:
        bestRank = "Flush";
        break;
      case 5:
        bestRank = "Straight";
        break;
      case 4:
        bestRank = "Three of a Kind";
        break;
      case 3:
        bestRank = "Two Pair";
        break;
      case 2:
        bestRank = "Pair";
        break;
      case 1:
        bestRank = "High Card";
        break;
    }

    if (v) console.log("Best 5-card hand:", bestHand);
    if (v) console.log("Rank:", bestRank);
    return { bestHand, bestRank };
  }

  // Check if the hand size is valid
  if (handSize === 5) {
    return findBestHand(hand);
  } else {
    console.log("Invalid hand size for ranking");
  }
}


//For binary decks only
function rankHand_bin(hand, handSize, v) {     
  
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

  function hasPair(hand) {
    //any pair exists, AT LEAST !!
    var handRanks = hand.map(function(card) {
      return card & 0b001111;
    });
    var rankCounts = {};
    for (var i = 0; i < hand.length; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }
    for (var rank in rankCounts) {
      if (rankCounts[rank] >= 2) return true;        
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

  function hasTwoPairs(hand) {
    var handRanks = hand.map(function(card) {
      return card & 0b001111;
    });
    var rankCounts = {};
    for (var i = 0; i < handSize; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }
    var pairCount = 0;
    for (var rank in rankCounts) {
      if (rankCounts[rank] >= 2) {
        pairCount++;
      }
    }
    return pairCount === 2;
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

  function hasThreeOfAKind(hand) {
    var handRanks = hand.map(function(card) {
      return card & 0b001111;
    });
    var rankCounts = {};
    for (var i = 0; i < handSize; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }
    for (var rank in rankCounts) {
      if (rankCounts[rank] === 3) {
        return true;
      }
    }
    return false;
  }

  function hasThreeOfAKind_fast(hand, firstrank) {
    hand = hand.filter(card => (card & 0b001111) !== firstrank);
    return hand.length==2;
  }

  function hasFullHouse(hand) {
    var handRanks = hand.map(function(card) {
      return card & 0b001111;
    });
    var rankCounts = {};
    for (var i = 0; i < handSize; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }
    var hasTwo = false;
    var hasThree = false;
    for (var rank in rankCounts) {
      if (rankCounts[rank] === 2) {
        hasTwo = true;
      }
      if (rankCounts[rank] === 3) {
        hasThree = true;
      }
    }
    if (hasTwo && hasThree) {
      return true;
    }
    return false;
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
   
  

  function hasQuads(hand) {
    var handRanks = hand.map(function(card) {
      return card & 0b001111;
    });
    var rankCounts = {};
    for (var i = 0; i < handSize; i++) {
      var rank = handRanks[i];
      if (rank in rankCounts) {
        rankCounts[rank]++;
      } else {
        rankCounts[rank] = 1;
      }
    }
    for (var rank in rankCounts) {
      if (rankCounts[rank] === 4) {
        return true;
      }
    }
    return false;
  }

  function hasQuads_fast(hand, firstrank) {
    hand = hand.filter(card => (card & 0b001111) !== firstrank);
    return hand.length==1;
  }

  function hasStraight(hand) {
    var handRanks = hand.map(function(card) {
      return card & 0b001111;
    });
    var uniqueRanks = Array.from(new Set(handRanks));
    if (uniqueRanks.length < 5) return false;

    //ACES High
    uniqueRanks.sort(function(a, b) {
      return cardRanksHI_bin.indexOf(a) - cardRanksHI_bin.indexOf(b);
    });
    var isStraight = true;
    for (var i = 1; i < uniqueRanks.length; i++) {
      var currentRankIndex = cardRanksHI_bin.indexOf(uniqueRanks[i]);
      var previousRankIndex = cardRanksHI_bin.indexOf(uniqueRanks[i - 1]);
      if (currentRankIndex - previousRankIndex !== 1) {
        isStraight = false;
        break;
      }
    }

    if (isStraight) return true;
    if (uniqueRanks.includes(1)) {
      //ACES Lo
      uniqueRanks.sort(function(a, b) {
        return cardRanksLO_bin.indexOf(a) - cardRanksLO_bin.indexOf(b);
      });
      var isStraight = true;
      for (var i = 1; i < uniqueRanks.length; i++) {
        var currentRankIndex = cardRanksLO_bin.indexOf(uniqueRanks[i]);
        var previousRankIndex = cardRanksLO_bin.indexOf(uniqueRanks[i - 1]);
        if (currentRankIndex - previousRankIndex !== 1) {
          isStraight = false;
          break;
        }
      }
    }
    return isStraight;
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
  function findBestRank(hand) {
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
    var hasP = (hasPair_fast(hand)>0);
    //var hasF = hasFlush(hand,5);  //actually worse!
    var isF,isP,hasS;

    
    for (var i = 0; i < possibleHands.length; i++) {
      var currentHand = possibleHands[i];
      var currentRankNum = 0;
      var bail = false;
      var prank=0;

      //isF = hasF && isFlush(currentHand); //actually worse!
      isF = isFlush(currentHand);      
      isP = !isF && hasP && ((prank = hasPair_fast(currentHand))>0);
      isS = !isP && hasStraight(currentHand);

      if (isF && isS) {
        if (isRoyal(currentHand)) {
          currentRankNum = 10;
          bail = true;
        } else {
          currentRankNum = 9;
        }
      } else if (bestRankNum < 8 && isP && hasQuads_fast(currentHand,prank)) {
        currentRankNum = 8;
        bail = true; // can't have straight flush now in the 7 hand
      } else if (bestRankNum < 7 && isP && hasFullHouse_fast(currentHand,prank)) {
        currentRankNum = 7;
      } else if (bestRankNum < 6 && isF) {
        currentRankNum = 6;
      } else if (bestRankNum < 5 && isS) {
        currentRankNum = 5;
      } else if (bestRankNum < 4 && isP && hasThreeOfAKind_fast(currentHand,prank)) {
        currentRankNum = 4;
      } else if (bestRankNum < 3 && isP && hasTwoPairs_fast(currentHand,prank)) {
        currentRankNum = 3;
      } else if (bestRankNum < 2 && isP) {
        currentRankNum = 2;
      } else {
        currentRankNum = 1;
      }

      // Check if the current hand has a higher rank
      if (currentRankNum > bestRankNum) {
        bestHand = currentHand;
        bestRankNum = currentRankNum;
      }
      if (bail) break;
    }

    if (v) console.log("Rank:", bestRankNum);
    return bestRankNum;
  }

  // Check if the hand size is valid
  if (handSize === 5) {
    return findBestRank(hand);
  } else {
    console.log("Invalid hand size for ranking");
  }
}