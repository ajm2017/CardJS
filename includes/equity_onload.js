$(document).ready(function() {

    $(window).resize(function() {
      preselects.forEach((e,i)=>{
        if (typeof e!='undefined' && e>0) {
          var offset = $(`#preselect${i}`).offset(); 
          $(`#preselect${i}_card`).css({
            top: offset.top + 5, 
            left: offset.left + 4, 
          });
        }
      });        
    });


    $('.quick-select-buttons').html(`
    <button class="quick-select" data-position="ALL">All</button>
    <button class="quick-select" data-position="CUSTOM">Custom</button>
    <button class="quick-select" data-position="UTG">RFI: UTG</button>
    <button class="quick-select" data-position="UTG+1">RFI: UTG+1</button>
    <button class="quick-select" data-position="UTG+2">RFI: UTG+2</button>
    <button class="quick-select" data-position="LJ">RFI: LJ</button>
    <button class="quick-select" data-position="HJ">RFI: HJ</button>
    <button class="quick-select" data-position="CO">RFI: CO</button>
    <button class="quick-select" data-position="BTN">RFI: BTN</button>
    <button class="quick-select" data-position="SB">RFI: SB</button>
    <button class="quick-select" data-position="BB">BB</button>
    <button class="quick-select" data-position="INV">Inverse</button>
    `);


    function displayRange(who) {
      $('#'+who+'Range').html(buildRangeTable(who));  
      if (who!='result') {
        $('.' + who + '.hand-range-button').on('click', function(event) {  

            if ($(event.target).hasClass('slider')) {
              // If it is, do nothing
              return;
            }

            $(this).toggleClass('selected'); 

            if ($(this).hasClass('selected')) {
              $(this).find('.slider').val(100);
            } else {
              $(this).find('.slider').val(0);
            }
            saveRange(who); resetResults(); 
        });
        $('.' + who + ' .quick-select').on('click', function() {
          const position = $(this).data('position');
          selectRangeForPosition(position,who);
          saveRange(who);
          resetResults();
        });  
    

        $('.' + who + '.slider').on('input change', function() {
          var fillperc = $(this).val();
          var whiteperc = fillperc;
          var target = $(this).data('target');
          $(`#${target}`).css('background', 'linear-gradient(to right, #4CAF50 ' + fillperc + '%, #f0f0f0 ' + whiteperc + '%)');
        });
        
        if (who=='hero') { displayCombos(who, heroCombos); } else { displayCombos(who, villainCombos); }
      }        
    }

    displayRange('hero');
    displayRange('villain');
    displayRange('Hresult');
    displayRange('Vresult');

    var hoverTimer;
    $('.hand-range-button:not(.result)').hover(function(e) {      

      if ($(e.target).hasClass('slider')) {
        // If it is, do nothing
        return;
      }

      let t = $(this).data('type');

      let theseCombos=[];
      if ($(this).hasClass('hero')) {
        theseCombos = getCombosByType(t,heroCombos);
      } else {
        theseCombos = getCombosByType(t,villainCombos);
      }

      hoverTimer = setTimeout(function() {

        //Create overlay contents
        let comboDivs = buildComboDivs(theseCombos);
        $('.card-combo-overlay').html(comboDivs);

        var overlayWidth = $('.card-combo-overlay').outerWidth();
        var pageWidth = $(window).width();
        var overlayX = e.pageX + 10; 

        // Check if overlay extends past the right edge of the viewport
        if (overlayX + overlayWidth > pageWidth) {
          overlayX = e.pageX - overlayWidth - 10; // Position to the left of the cursor
        }

        $('.card-combo-overlay').css({
          top: e.pageY - 20, 
          left: overlayX
        }).fadeIn(100);
      }, 1500);
    }, function() {  
      clearTimeout(hoverTimer); 
      $('.card-combo-overlay').fadeOut(50); 
    });


    $('.cardpreselect, .preselected_card').on('click', function() {  
      preselect_index = $(this).data('index');
      let cardtitle = $(`#preselect${preselect_index}`).data('title');

      deckbin.sort((a,b)=> a-b);
      $('.card-picker').html(buildCardSelector(deckbin, cardtitle));
      if (preselectExists(preselects,preselect_index)) {
        $('.card-picker-wrapper .clearbutton').show();
      } else {
        $('.card-picker-wrapper .clearbutton').hide();
      }

      $('.card-picker-wrapper').css({
        display: 'flex'
      }).fadeIn(100);
    });


    $('#preselect_clear').on('click', function() {                  
      //put the card back in the deck and update the combos array
      insertCard(preselects[preselect_index],deckbin);
      preselects[preselect_index] = 0;
      heroCombos = updateCombos(deckbin,[preselects[0],preselects[1]]);
      villainCombos = updateCombos(deckbin,[preselects[8],preselects[9]]);        
      $(`#preselect${preselect_index}_card`).hide();       
      $('.combo-num').html('0');        
      switch (preselect_index) {
        case 0:
        case 1:        
          selectRangeByCombos('hero', heroCombos);
        break;

        case 8:
        case 9:
          selectRangeByCombos('villain', villainCombos);
        break;
      }
      displayCombos('hero', heroCombos);
      displayCombos('villain', villainCombos);
    });


    $('.card-picker-wrapper').click(function(e) {
      if (!$(e.target).closest('.card-picker').length) {
        $('.card-picker-wrapper').fadeOut(100);
    }
  });

  

});