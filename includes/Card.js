const cardRanksHI = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardRanksLO = ['A','2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const royalRanks = ['T', 'J', 'Q', 'K', 'A'];
const unicodeSuits = ['♠', '♣', '♥', '♦'];
const suitNames = ['spades', 'clubs', 'hearts', 'diamonds'];
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

//For Bin Ranks, aces are 0th element - leave .AA and .00BB open for special subrank {pair} values
const subranksAHI = [1e-5, 1e-17, 1e-16, 1e-15, 1e-14, 1e-13, 1e-12, 1e-11, 1e-10, 1e-9, 1e-8, 1e-7, 1e-6];
const subranksALO = [1e-17, 1e-16, 1e-15, 1e-14, 1e-13, 1e-12, 1e-11, 1e-10, 1e-9, 1e-8, 1e-7, 1e-6, 1e-5];
const AAranksAHI = [.14, .02, .03, .04, .05, .06, .07, .08, .09, .10, .11, .12, .13];
const BBranksAHI = [.0014, .0002, .0003, .0004, .0005, .0006, .0007, .0008, .0009, .0010, .0012, .0013, .0013];

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

function strCard2bin(c) {
  s = unicodeSuits.findIndex(e => e==c[1]);
  r = cardRanksLO.findIndex(e => e==c[0]);  
  return [0,16,32,48][s] + (r+1);
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
  //if (v) console.log("Hand dealt:", binHand2str(hand), binHand2type(hand));      
  return hand;
}

function insertCard(c, d) {
  if (typeof c!== 'undefined') {
    if (c > 0) {
      d.push(c);
      d.sort((a,b)=> a-b);
    }
  }
}

function rankHand_bin(hand, handSize, v, dosubs) {     
  if (v) console.log ("Ranking Hand:", binHand2str(hand));
  
  
  function getSubrank(hand, mainrank, p1, p2, s1) {    
    let subrank = 0;

    switch (mainrank) {
      //High Card
      //R.0000ssssssssssss
      case 1:
        hand.forEach(element => {
          e = (element & 0b001111)-1
          subrank+=subranksAHI[e];
        });
        break;

      //Pair
      //R.[pair,2-14 ahigh]00sssssssssssss
      case 2:
        subrank+=AAranksAHI[p1-1];
        hand = hand.filter(card => (card & 0b001111) !== p1);
        if (v) console.log ("leftover hand:", binHand2str(hand));
        hand.forEach(element => {
          e = (element & 0b001111)-1
          subrank+=subranksAHI[e];
        });
        break;

      //Two Pair
      //R.[hipair,2-14 ahigh][lopair,2-14 ahigh]sssssssssssss
      case 3:
        if (AAranksAHI[p1-1] > AAranksAHI[p2-1]) {
          subrank+=AAranksAHI[p1-1];
          subrank+=BBranksAHI[p2-1];
        } else {
          subrank+=AAranksAHI[p2-1];
          subrank+=BBranksAHI[p1-1];
        }        
        hand = hand.filter(card => (card & 0b001111) !== p1);
        hand = hand.filter(card => (card & 0b001111) !== p2);
        if (v) console.log ("leftover hand:", binHand2str(hand));
        hand.forEach(element => {
          e = (element & 0b001111)-1
          subrank+=subranksAHI[e];
        });
        break;

      //Three of a kind
      //R.[trips,2-14 ahigh]00sssssssssssss
      case 4:
        subrank+=AAranksAHI[p1-1];
        hand = hand.filter(card => (card & 0b001111) !== p1);
        hand.forEach(element => {
          e = (element & 0b001111)-1
          subrank+=subranksAHI[e];
        });
        break;

      //Straight
      //R.[tothe]
      case 5:
        subrank+=AAranksAHI[s1-1];
        break;

      //Flush
      //R.0000sssssssssssss
      case 6:
        hand.forEach(element => {
          e = (element & 0b001111)-1
          subrank+=subranksAHI[e];
        });
        break;

      //Full House
      //R.[trips,2-14 ahigh][pair,2-14 ahigh]
      case 7:
        subrank+=AAranksAHI[p1-1];
        subrank+=BBranksAHI[p2-1];
        break;

      //Quads
      //R.[quads,2-14 ahigh]00ssssssssssssss
      case 8:
        subrank+=AAranksAHI[p1-1];
        hand = hand.filter(card => (card & 0b001111) !== p1);
        hand.forEach(element => {
          e = (element & 0b001111)-1
          subrank+=subranksAHI[e];
        });
        break;

      //Straight Flush
      //R.[tothe]
      case 9:
        hand.forEach(element => {
          e = (element & 0b001111)-1
          subrank+=subranksAHI[e];
        });
        break;

      //Royal
      //R
      case 10:
        break;
    }
    
    return subrank;
  }

  // Function to find the best 5-card hand RANK from the given hand
  function findBestRank(hand, dosubs) {
    var possibleHands = [];

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
          if ((hand[i] & 0b001111) == (hand[j] & 0b001111)) {
            prank2 = (hand[j] & 0b001111);
            return true;
          }
        }  
      }
      return false;
    }
  
    function hasThreeOfAKind_fast(hand,firstrank) {
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
      if (hand.length==2) {
        prank2 = hand[0] & 0b001111;
      } else {
        prank2 = firstrank;
        prank = hand[0] & 0b001111;
      }
      return true;
    }
       
    function hasQuads_fast(hand,firstrank) {
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
      if (hirank-lowrank+1==handsize) { return true; }
  
      //If there is even an ace...
      if (uniqueRanks.includes(1)) {
        //ACES HI - change aces to 14
        uniqueRanks = uniqueRanks.map(value => { if (value === 1) { return 14; } else { return value; } });
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
      srank=0;
      for (var i = 0; i < uniqueRanks.length-1; i++) {
        if (uniqueRanks[i] > srank) srank=uniqueRanks[i];
        for (var j = i+1; j < uniqueRanks.length; j++) {
          if (Math.abs(uniqueRanks[i] - uniqueRanks[j]) >= handsize) {bail=true; break;}
        }
        if (bail) break;
      }
      if (!bail) return true;
  
      //If there is even an ace...
      srank=0;
      if (uniqueRanks.includes(1)) {
        //ACES HI - change aces to 14
        uniqueRanks = uniqueRanks.map(value => {
          if (value === 1) { return 14; } else { return value; }
        });
        for (var i = 0; i < uniqueRanks.length-1; i++) {
          if (uniqueRanks[i] > srank) srank=uniqueRanks[i];
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
    var isF,isP,hasS;
    
    for (var i = 0; i < possibleHands.length; i++) {
      var currentHand = possibleHands[i];
      var currentRankNum = 1;
      var bail = false;
      var prank=0;
      var prank2=0;
      var srank=0;

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

      // Add subrank value (as decimals), important for comparing same ranks: 
      // kickers, better 2 pair, higher flush, better straight, etc.
      if (dosubs) {        
        currentRankNum = currentRankNum + getSubrank(currentHand, currentRankNum, prank, prank2, srank);
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