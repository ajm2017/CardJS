  
  function continuousTrials(num, v) {     
    continuousTrialsInterval = setInterval(() => { runTrials(num, v); }, 1);
  }
  
  function stopContinuousTrials() {
    clearInterval(continuousTrialsInterval);
  }

  function calculateHandsPerSecond(m,h) {
    var handsPerSecond = h / (m / 1000);
    if (handsPerSecond > fastest_handspeed) fastest_handspeed = handsPerSecond
    $("#GPS").html        (parseInt(handsPerSecond).toLocaleString());
    $("#fastestGPS").html (parseInt(fastest_handspeed).toLocaleString());
  }

  function runTrials(numTrials, v) {      
    if (trialsets%setstotime==0) {
      if (startTime!=null) {
        endTime = Date.now();
        endHands = games;
        calculateHandsPerSecond (endTime - startTime, endHands - startHands);
      }
      startTime = Date.now();
      startHands = games;
    }      
    for (var i = 0; i < numTrials; i++) recordTrial(v);
    trialsets++;
    updateResults();
    if (detectConvergence) {  
      if (lastConvEligibles!=eligibles) {
        if (convergenceTest(lastEquity, currentEquity, usePrecision)) {
          numConvergences++;
          if (numConvergences>=minConvergences) {
            //We've converged enough times in a row (with new eligibles)
            stopContinuousTrials();
            $('#stopButton').prop('disabled', true);
          }
        } else {numConvergences=0;}
        lastEquity = currentEquity;
        lastConvEligibles = eligibles;
      }
    }
  }

  function convergenceTest(f1, f2, precision) {
    if ((Math.abs(f2-f1)) <= precision) return true; 
    return false;
  }

  function doTrial(v) {
    d = shuffleDeckFY(deckbin,v);
    resultindexH = -1;
    resultindexV = -1;
    eligible = false;
    let dealtcards = [];
    let common=[];         
    let p0=0, p1=0, p2=0, p3=0, p4=0, p5=0, p6=0, p8=0, p9=0;  //p7 is burn
    
    //Deal each player hand
    let playerHands = [];
    for(i=1;i<=parseInt($('#players').val());i++) {      
      let h=[];      
      let n=2;

      if (i==1) {
        //Hero
        p0 = preselects[0];
        p1 = preselects[1];
        
        if (typeof p0!='undefined' && p0>0) {
          h.push(p0); n--;
        }
        if (typeof p1!='undefined' && p1>0) {
          h.push(p1); n--;
        }

        if (n>0) {
          fromdeck = dealCards(d, n, v);
          dealtcards.push(...fromdeck);
          h.push(...fromdeck);
        }
        p = [h,binHand2type(h),0]
        //0 -- hand array //1 -- hand type  //2 -- rank

        //is Hero eligible?
        if (heroRange.indexOf(p[1])===-1) {
          //NO: not in hero range, put cards back in deck and bail
          d.push(...dealtcards);
          return;
        }

      } else {
        //Villain        
        
        if (i==2) {
          p8 = preselects[8];
          p9 = preselects[9];
          
          if (typeof p8!='undefined' && p8>0) {
            h.push(p8); n--;
          }
          if (typeof p9!='undefined' && p9>0) {
            h.push(p9); n--;
          }
        }

        if (n>0) {
          fromdeck = dealCards(d, n, v);
          dealtcards.push(...fromdeck);
          h.push(...fromdeck);
        }
        p = [h,binHand2type(h),0]
        //0 -- hand array //1 -- hand type  //2 -- rank

        //is at least one Villain eligible?
        if (!eligible && villainRange.indexOf(p[1])>=0) {
          //YES, don't need to check anymore...
          eligible = true;
        }
      }
      
      playerHands.push(p);
    }

    //Eligible game?
    if (eligible) { 
      //YES: Get result index and record occurrence
      eligibles++;        

      //for Hero
      resultindexH = resultsetH.findIndex(group => group[0] === playerHands[0][1])
      resultsetH[resultindexH][1]++;

      //for 1st Villain
      resultindexV = resultsetV.findIndex(group => group[0] === playerHands[1][1])
      resultsetV[resultindexV][1]++;

    } else {
      //NO: Villains were eligible, so put cards back in deck and bail
      //playerHands.forEach(e=>{d.push(...e[0])});  
      d.push(...dealtcards);   
      return;
    }

    //Deal common cards
    p2 = preselects[2];
    p3 = preselects[3];
    p4 = preselects[4];
    p5 = preselects[5];
    p6 = preselects[6];

    n=5;
    if (typeof p2!='undefined' && p2>0) {
      common.push(p2);  n--;
    }
    if (typeof p3!='undefined' && p3>0) {
      common.push(p3);  n--;
    }
    if (typeof p4!='undefined' && p4>0) {
      common.push(p4);  n--;
    }
    if (typeof p5!='undefined' && p5>0) {
      common.push(p5);  n--;
    }
    if (typeof p6!='undefined' && p6>0) {
      common.push(p6);  n--;
    }

    if (n>0) {
      fromdeck = dealCards(d, n, v);
      dealtcards.push(...fromdeck);
      common.push(...fromdeck);
    }    
    if (v) console.log("Deck now:", d);
    if (v) console.log("Common now:", binHand2str(common));

    //Rank each player hand (if in range)      
    playerHands.forEach(function(e,index){
      playerHands[index][2] = rankHand_bin(common.concat(e[0]), 5, v, true);
    });

    //Compare players
    bestPlayer=-1;
    bestRank=0;
    numChops=1;
    playerHands.forEach(function(e,index){
      if (v) console.log("Player Hand:", index, binHand2str(e[0]));
      if (e[2]>bestRank) {
        bestRank = e[2];
        bestPlayer = index;
        numChops=1;
      } else if (e[2]==bestRank) numChops++;
    });

    if (v) console.log(binHand2str(common));      
    if (v) console.log ('Winner', bestPlayer, bestRank, numChops, d)

    //Record wins
    if (bestPlayer==0) {        
      resultsetH[resultindexH][2]+=(1/numChops);
    } else if (bestPlayer==1) {
      resultsetV[resultindexV][2]+=(1/numChops);
    }

    //Put the dealt cards back in the deck    
    d.push(...dealtcards);
    

    return;
  }

  function recordTrial(v) {
    doTrial(v);
    games++;
  }
