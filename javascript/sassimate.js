$(document).ready(function() {
    function index(target, test) {

    	return target.indexOf(test) != -1;

    }

    //function to replace values in keyframe with the new values
    function replaceAll(str, find, replace) {
      return str.replace(new RegExp(find, 'g'), replace);
    }

    var finalKeyframe = '';
    $('.submit').click(function() {

      var iterations = $('#iterations').val();
      var animationSelected = $('#animation').val();
      var duration = $('#duration').val();
      var strength = $('.range').val();
      var animationName = animationSelected + '100';
      var ss = document.styleSheets;
        //add element for animation to the page
        $('.display-wrapper').html('<p class="display animation-display">Sassimate!</p>');
        //create the sass mixin and append to the page
        $('.display').addClass(iterations).addClass(animationSelected).addClass(strength+animationName).attr('id', animationSelected).show();
          $('.mixin-wrapper').text(" @include animate(" + animationSelected + ", " + duration + "s, $strength: "+ strength +", $iteration: " + iterations + ")");
          //change css properties to change our animation
          $('.display').css({
                              "animation-iteration-count" :iterations,
                              "animation-name"  : animationName,
                              "animation-duration": duration + "s"

          });

          //find the before and get the value we need to add our maths to
          var valuesArray = getValues(animationName);
          if (valuesArray != undefined) {


          valuesArray = valuesArray.replace(/\"/g, "");
          valuesArray = valuesArray.split(',');

          //functions to get the value of our json from sass
          function getValues(animationNameForProperty) {
              var elem       = document.getElementById(animationSelected),
                  result   = getComputedStyle(elem , '::before').content;
                  if(result != '') {
                       return JSON.parse(result);
                  }
                  else {

                  }

          }

        var cssRulesList = document.styleSheets[1].cssRules;
        var keyFramesArray = [];

        for (i = 0; i < cssRulesList.length; i++) {
            if(cssRulesList[i].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE) {
                var cssAnimationName = cssRulesList[i].name;
                keyFramesArray.push({'keyframe': cssRulesList[i], 'Value': cssAnimationName});
            }
        }



        for (i = 0; i < keyFramesArray.length; i++) {
            if(keyFramesArray[i].Value == animationName) {
                var strength = strength;
                var keyframesString = ''+ keyFramesArray[i].keyframe.cssText + '';
                keyframesString.toString();
                keyframesString = keyframesString.replace(/\(/g,"( ").replace(/\)/g," )");
                // keyframesString = replaceAll(keyframesString, "(", "( " );
                for (j = 0; j < valuesArray.length; j++) {
                    if(index(valuesArray[j], 'px')) {
                        var numberValue = valuesArray[j].split('px');
                        var newValue = (parseFloat(numberValue[0]) / 100) * strength;
                        keyframesString = replaceAll(keyframesString, valuesArray[j], newValue.toString() + 'px');
                    }
                    else if(index(valuesArray[j], '%')) {
                        console.log(valuesArray[j]);
                        var numberValue = valuesArray[j].split('%');
                        var newValue = (parseFloat(numberValue) / 100) * strength;
                        keyframesString = replaceAll(keyframesString, valuesArray[j]+',', newValue.toString() + '%,');
                    }
                    else if(index(valuesArray[j], 'deg')) {
                        var numberValue = valuesArray[j].split('deg');
                        var newValue = (parseFloat(numberValue) / 100) * strength;
                        keyframesString = replaceAll(keyframesString, valuesArray[j], newValue + 'deg');
                    }
                    else if(animationName == 'pulse100' || animationName ==  'rubberBand100'|| animationName ==  'bounceIn100' || animationName ==  'bounceOut100'){
                        var numberValue = valuesArray[j];

                        var newValue = ( (parseFloat(numberValue) - 1)  / 100) * strength + 1;
                        console.log(newValue);
                        keyframesString =replaceAll(keyframesString, valuesArray[j]+',', newValue+',');
                    }
                    else if(animationName == 'rollIn100' || animationName ==  'rollOut100'){
                        var numberValue = valuesArray[j];
                        var newValue = ( (parseFloat(numberValue) - 100)  / 100) * strength + 100;
                        keyframesString =replaceAll(keyframesString, valuesArray[j], newValue);
                    }
                    else if(animationName == 'rotateIn100' || animationName ==  'rotateOut100'){
                        var numberValue = valuesArray[j];
                        var newValue = ( (parseFloat(numberValue) - 150)  / 100) * strength + 150;
                        keyframesString =replaceAll(keyframesString, valuesArray[j], newValue);
                    }
                    else if(animationName == 'zoomIn100' || animationName == 'zoomOut100'){
                      console.log('hi');
                        var numberValue = valuesArray[j];
                        var newValue = 1 - ((1/100) * strength);
                        console.log(newValue);
                        keyframesString =replaceAll(keyframesString, valuesArray[j]+',', newValue+',');
                    }
                    else if(animationName == 'bounceIn100' || animationName == 'bounceOut100'){
                        var numberValue = valuesArray[j];
                        var newValue = 0.9 - ((0.6/100) * strength);
                        console.log(newValue)
                        keyframesString =replaceAll(keyframesString, valuesArray[j], newValue);
                    }

                }

                finalKeyframe += keyframesString;
            }

            $('.style').html('<style>' + finalKeyframe +'<style>');
        }
        console.log(finalKeyframe);
      }
    });
});
