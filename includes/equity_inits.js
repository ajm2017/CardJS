//Initialize the deck and all combos
let maxo=0;
let lastmaxo=0;
let heroRange = [];
let villainRange = [];
let resultset = [];
let deckbin = [];
let heroCombos = [];
let villainCombos = [];
let preselects = [];
let preselect_index = 0;
deckbin = createDeck_bin(false);
heroCombos = updateCombos(deckbin,[preselects[0],preselects[1]]);
villainCombos = updateCombos(deckbin,[preselects[8],preselects[9]]);    
var continuousTrialsInterval;
var games=0;
var eligibles=0;
var trialsets=0;
var setstotime=10;
var startTime=null;
var startHands=null;
var endHands=null;
var fastest_handspeed=0;
