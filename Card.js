// Function to create a standard 52-card deck
function createDeck(v) {
    var suits = ['♠', '♣', '♥', '♦'];
    var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    d = [];
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < ranks.length; j++) {
        d.push(ranks[j] + suits[i]);
      }
    }
    if (v) console.log("Deck created:", deck);
    return d;
}