/**
 * Webex Button Call Reroute
 * 
 * Useful for connecting to a single FedRAMP Webex site using the standard Webex button.  It will route to one pre-determined domain. 
 * 
 * 
 */

import xapi from 'xapi';

const uriSuffix = '@fedrampexample.webex.com'; // change this. Should include the webex domain to be called. e.g. @acecloud.webex.com 

const callErrorRegex = /CallError\s+\((MeetingNotFound|InvalidInviteeAddress),\s+expected,\Ssresponse 404|/i;
const callPattern = /(spark:)?(\d{9,12})@webex\.com/i;
const uriPattern = /(\d+)@.+/i; 
const callPatternReattempt = new RegExp("(spark:)?(\\d{9,12})" + uriSuffix.replace(/\./g, '\\.'));


console.log('callPatternReattempt', callPatternReattempt);
function recall(callDisconnect) {

  // console.log('callDisconnect', callDisconnect); 
  let uri = callDisconnect.RequestedURI.replace(callPattern, '$2' + uriSuffix);
  let displayName = uri.replace(uriPattern,'$1'); 
  if (callErrorRegex.test(callDisconnect.CauseString) && callPattern.test(callDisconnect.RequestedURI)) {

    console.log('Reattemping call to:', uri);
    xapi.Command.Dial({ Number: uri, DisplayName: displayName }).then(() => {
     //  alert('Reattempting. Please Wait.');
    });


  }
  else if (callErrorRegex.test(callDisconnect.CauseString) && callPatternReattempt.test(callDisconnect.RequestedURI)) {
    console.log('Last URI is a bad reattempt.  Meeting not found.', uri);
    //   alert('Meeting not found');
  }
}


function alert(title, text = '', duration = 12) {
  xapi.Command.UserInterface.Message.Alert.Display({
    Title: title,
    Text: text,
    Duration: duration,
  });
}

xapi.Event.CallDisconnect.on(recall); 
