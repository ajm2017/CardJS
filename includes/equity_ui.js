
function savePreselect(e) {
    let cstr = $(e).data('card');
    let cbin = strCard2bin(cstr);

    //check for previous preselect (if so, add it back to deck and resort)    
    insertCard(preselects[preselect_index],deckbin);
    //console.log (preselects[preselect_index]);   

    //set it and remove from the deck
    preselects[preselect_index] = cbin;
    deckbin.splice(deckbin.indexOf(cbin),1);
    heroCombos = updateCombos(deckbin,[preselects[0],preselects[1]]);
    villainCombos = updateCombos(deckbin,[preselects[8],preselects[9]]);

    //default select the appopriate range    
    switch (preselect_index) {
      case 0:
      case 1:        
        selectRangeByCombos('hero', heroCombos);
        saveRange('hero');
        resetResults();
        break;

      case 8:
      case 9:
        selectRangeByCombos('villain', villainCombos);
        saveRange('villain');
        resetResults();
        break;
    }

    //update the range combos
    $('.combo-num').html('0');
    $('.combo-perc').html('0.0%');
    displayCombos('hero', heroCombos);
    displayCombos('villain', villainCombos);

    //show preselect card
    var p = $(`#preselect${preselect_index}`);
    var offset = p.offset();
    var width = p.outerWidth();
    var height = p.outerHeight();    
    var c = $(`#preselect${preselect_index}_card`);
    sname = suitNames[cbin>>4];
    $(`#preselect${preselect_index}_card .cardrank`).html(cstr[0]);
    $(`#preselect${preselect_index}_card .cardsuit`).html(cstr[1]);
    $(`#preselect${preselect_index}_card .cardsuit`).removeClass('hearts');
    $(`#preselect${preselect_index}_card .cardsuit`).removeClass('spades');
    $(`#preselect${preselect_index}_card .cardsuit`).removeClass('clubs');
    $(`#preselect${preselect_index}_card .cardsuit`).removeClass('diamonds');
    $(`#preselect${preselect_index}_card .cardsuit`).addClass(sname);
    c.css({
      top: offset.top+5,
      left: offset.left+4,
      display: 'flex'
    }).fadeIn(100);


    //console.log (cstr, preselect_index, strCard2bin(cstr),preselects);
    $('.card-picker-wrapper').fadeOut(100);
  }

  function selectRangeByCombos(who, c) {
    $(`.hand-range-button.${who}`).removeClass('selected');
    if ((who=='hero' && (preselects[0] || preselects[1])) || (who=='villain' && (preselects[8] || preselects[9])))  {
      c.forEach(h=>{
        type = binHand2type(h);
        $(`#${who}_${type}`).addClass('selected');
      })
    }
  }


  function preselectExists(p,i) {
    if (typeof p[i]!== 'undefined') {
      if (p[i] > 0) {
        return true;
      }
    }
    return false;
  }

  function buildComboDivs(combo) {
    let theHTML = '';
    combo.forEach(function(h,i) {
      let c1 = binCard2str(h[0]);
      let c2 = binCard2str(h[1]);
      let c1str = createCardDiv(c1);
      let c2str = createCardDiv(c2);
      let sort1 = cardRanksHI.findIndex(element => element==c1[0]);
      let sort2 = cardRanksHI.findIndex(element => element==c2[0]);
      let cardspace = "";
      if ((i+1)%6==0 && i!=combo.length-1 ) {
        cardspace="<hr size=1 noshade>";
      } else {
        cardspace=(i==combo.length-1?"":"&nbsp;");
      }
      if (sort2>sort1) {
        theHTML += `${c2str}${c1str}${cardspace}\n`;
       } else {
        theHTML += `${c1str}${c2str}${cardspace}\n`;
      }
    });
    return theHTML;
  }

  function buildCardSelector(d, title) {
    let lastsuit=0;
    let thissuit=0;
    let theHTML = `<span class='selectortitle'>${title}</span>:<br>`;
    d.forEach(function(c,i) {
      let c1 = binCard2str(c);
      let c1str = createCardDiv(c1);
      let cardspace = "";      
      thissuit = c>>4;
      //console.log (thissuit);
      if (thissuit!=lastsuit && i!=d.length-1 ) {
        lastsuit = thissuit;
        theHTML += `<hr size=1 noshade>\n`;      
      }
      theHTML += `${c1str}\n`;
      
    });
    return theHTML;
  }

  function createCardDiv(c, marginclass) {
    let theHTML = '';
    r = c[0]; s=c[1];
    snum = unicodeSuits.findIndex(element => element==s);
    sname = suitNames[snum];

    theHTML += `
      <div class="card ${sname}" onclick="savePreselect(this);" data-card="${c}">
        <span class="cardrank">${r}</span>
        <span class="cardsuit ${sname}">${s}</span>
      </div>
    `;
    return theHTML;
  }

  function buildRangeTable(who) {
    const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    let tableHTML = '';  
    cards.forEach((card, index) => {
      tableHTML += '<tr>';                
      cards.slice(0,index).forEach(innerCard => {
        tableHTML += buildRangeButton(who, innerCard, card, 'o');
      });
      cards.slice(index).forEach(innerCard => {
        if (card==innerCard) {
          tableHTML += buildRangeButton(who, card, innerCard, '');
        } else {
          tableHTML += buildRangeButton(who, card, innerCard, 's');
        }          
      });       
      tableHTML += '</tr>';        
    });
    return tableHTML;
  }

  function getCombosByType(type, usecombos) {
    let c = [];
    usecombos.forEach(h=>{
      let thistype = binHand2type(h);
      if (type==thistype) {
        c.push(h);
      }
    });
    return c;
  }

  function updateCombos(d,musthave){
    theseCombos = [];    
    //add musthave (preselects) back to the deck(d) temporarily
    //only create combos that each of the must have cards'
    //if there is only 1 or no must haves, return the relevant combos
    let filteredMustHave = musthave.filter(item => item !== undefined && item !== 0);
    let thisd = d.concat(filteredMustHave);

    thisd.forEach(function(c1,a){ thisd.forEach(function(c2,b){ if (b>a) { 
      let mhexists=true;
      musthave.forEach((p)=>{
        if (typeof p!='undefined') {
          if (p>0) {
            if (![c1,c2].includes(p)) mhexists=false;
          }
        }
      });
      if (mhexists) theseCombos.push([c1,c2]); 
    } }); });
    return theseCombos;
  }

  function displayCombos(who,c){      
    let types = new Map();     
    
    c.forEach(h=>{
      let thistype = binHand2type(h);
      if (types.has(thistype)) {
        cnt = types.get(thistype);
        types.set(thistype, cnt+1);
      } else {
        types.set (thistype,1);
      }
    });

    let usecombos=(who=='hero'?heroCombos:villainCombos);
    let userange = (who=='hero'?heroRange:villainRange);

    types.forEach(function(v,k){
      $(`#${who}_${k}`).find('.combo-num').html(v);
      $(`#${who}_${k}`).find('.combo-perc').html((Math.round(v/usecombos.length*10000,5)/100).toLocaleString()+'%');
    });

    //count selected type combos
    let numcombos=0;
    $(`.hand-range-button.${who}.selected`).each(function() {
        numcombos += parseInt($(this).find('.combo-num').html());
    });

    $(`#${who}_selcombos`).html(numcombos);
    $(`#${who}_totcombos`).html(usecombos.length);
    $(`#${who}_rangeperc`).html(0);
  }

  function buildRangeButton(who, innerCard, card, ext) {
    let comboText = `<span class="combo-num">abc</span><span class="combo-perc">xyz</span>`;
    if (who!='hero' && who!='villain') comboText = '';
    return `<td>
      <button class="hand-range-button ${who}" id="${who}_${innerCard}${card}${ext}" data-type="${innerCard}${card}${ext}">
        ${innerCard}${card}${ext}
        ${comboText}
      </button>
      </td>`;
  }

  function saveRange(who) {
    let numcombos=0;
    if (who=='hero') {
      heroRange = [];
      $(`.hand-range-button.${who}.selected`).each(function() {
        let value = $(this).data('type').toLocaleString();
        numcombos += parseInt($(this).find('.combo-num').html());
        heroRange.push(value);
      });      
    }

    if (who=='villain') {
      villainRange = [];
      $(`.hand-range-button.${who}.selected`).each(function() {
        let value = $(this).data('type').toLocaleString();
        numcombos += parseInt($(this).find('.combo-num').html());
        villainRange.push(value);
      });
    }
    
    $(`#${who}_selcombos`).html(numcombos);
    $(`#${who}_rangeperc`).html(Math.round(numcombos / parseInt($(`#${who}_totcombos`).html())*10000)/100);
  }
  
  function initResults() {
    $('.hand-range-button.hero').each(function() {
        let value = $(this).data('type').toLocaleString();
        resultset.push([value,0,0]);
        //0 - hand type
        //1 - occurrences
        //2 - wins
      });
  }
  
  function resetResults() {
    //Initial Opacity of result buttons (based on hero range)
    $('.hand-range-button.result').css("opacity", "0.2")
    $('.hand-range-button.result').css('background', 'linear-gradient(to right, #4CAF50 ' + 0 + '%, #f0f0f0 ' + 0 + '%)');
    heroRange.forEach(e=>{
      $('#result_'+e).css("opacity", ".5"); 
    })

    stopContinuousTrials();
    games=0;
    eligibles=0;
    lastEligibles=0;
    
    resultset = [];
    initResults();    

    trialsets=0;
    setstotime=10;
    startTime=null;
    startHands=null;
    endHands=null;
    fastest_handspeed=0;

    currentEquity=0;
    lastEquity=0;
    numConvergences=0;
  }

  function updateResults() {
    maxo=0;
    sumw=0;
    resultset.forEach(e=>{
      o=0; w=0;
      if (eligibles) {
      o = e[1]/eligibles;
      w = e[2]/e[1];
      sumw+=e[2];
      }

      //Occurence opacity
      if (o > maxo) maxo=o;
      operc = o/lastmaxo;
      if (operc > 1) operc = 1;
      operc = (.5+(operc*.5)).toFixed(2);
      $('#result_'+e[0]).css("opacity", operc); 

      //Win fill gradient
      fillperc = Math.ceil(w*100);
      whiteperc = 1-fillperc;
      $('#result_'+e[0]).css('background', 'linear-gradient(to right, #4CAF50 ' +fillperc + '%, #f0f0f0 ' + whiteperc + '%)');
      $('#result_'+e[0]).attr('title', e[0] + ' - occurs: ' + (o*100).toFixed(3) + '%, wins: ' + (w*100).toFixed(2) +'%');

      //Game & Eligibles
      $("#totalGames").html(games.toLocaleString());
      $("#eligibleGames").html(eligibles.toLocaleString());

    });
    $("#numWins").html(sumw.toLocaleString());
    $("#numEligible").html(eligibles.toLocaleString());
    
    currentEquity = ((sumw/eligibles*10000).toFixed(3)/100);
    $("#totEquity").html(currentEquity.toLocaleString() + '%');
    lastmaxo = maxo;
  }
  
  function selectRangeForPosition(position,who) {
      if (position=='INV') {
          $('.hand-range-button' + '.' + who + '.selected').addClass('temp');
          $('.hand-range-button' + '.' + who + ':not(.selected)').addClass('selected');
          $('.hand-range-button' + '.' + who + '.temp').removeClass('selected');
          $('.hand-range-button' + '.' + who + '.temp').removeClass('temp');
          return;
      }

      $('.' + who + ' .hand-range-button').removeClass('selected');
      const ranges = {
        'ALL': [], 
        'CUSTOM': [0], 
        'UTG':    ['AA','KK','QQ','JJ','TT','99','88','77','AKo','AQo','AKs','AQs','AJs','ATs','A5s','KQs','KJs','KTs','QJs','QTs','JTs','J9s','98s','T9s'], 
        'UTG+1':  ['AA','KK','QQ','JJ','TT','99','88','77','AKo','AQo','AKs','AQs','AJs','ATs','A5s','KQs','KJs','KTs','QJs','QTs','JTs','J9s','98s','T9s'], 
        'UTG+2':  ['AA','KK','QQ','JJ','TT','99','88','77','AKo','AQo','AJo','AKs','AQs','AJs','ATs','A9s','A8s','A5s','A4s','KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s','98s','T9s'], 
        'LJ':     ['AA','KK','QQ','JJ','TT','99','88','77','66','55','AKo','AQo','AJo','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s','T9s','T8s','98s','87s','76s'], 
        'HJ':     ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','AKo','AQo','AJo','ATo','KQo','KJo','QJo','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s','T9s','T8s','98s','87s','76s','65s'], 
        'CO':     ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKo','AQo','AJo','ATo','KQo','KJo','KTo','QJo','QTo','JTo','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','QJs','QTs','Q9s','Q8s','JTs','J9s','J8s','T9s','T8s','98s','97s','87s','86s','76s','65s','54s'], 
        'BTN':    ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o','KQo','KJo','KTo','K9o','QJo','QTo','Q9o','JTo','J9o','T9o','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','JTs','J9s','J8s','J7s','J6s','T9s','T8s','T7s','T6s','98s','97s','96s','87s','86s','85s','76s','75s','65s','54s','43s'], 
        'SB':     ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o','KQo','KJo','KTo','K9o','K8o','QJo','QTo','Q9o','Q8o','JTo','J9o','J8o','T9o','T8o','98o','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s','QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','Q4s','JTs','J9s','J8s','J7s','J6s','T9s','T8s','T7s','T6s','98s','97s','96s','95s','87s','86s','85s','84s','76s','75s','74s','65s','64s','63s','54s','53s','43s','32s'], 
        'BB':     ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o','KQo','KJo','KTo','K9o','QJo','QTo','Q9o','JTo','J9o','T9o','98o','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s','QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','JTs','J9s','J8s','J7s','T9s','T8s','T7s','T6s','98s','97s','96s','87s','86s','85s','76s','75s','65s','64s','54s','53s','43s']
      };
      if (ranges[position].length !== 0) {
        ranges[position].forEach(hand => {
          $('#' + who + '_' + hand).addClass('selected');
        });
      } else {        
          $('.hand-range-button' + '.' + who).addClass('selected');        
      }
    }
