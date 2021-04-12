/*
  Webex FedRAMP dial pad.  Used for devices registered to Webex FedRAMP.  

  Purspose: By design, Webex FedRAMP devices cannot dial <meetingId>@webex.com .  By default the Webex button dials <meetingId>@webex.com. This makes the Webex Button useless.
  This is a replacement Webex Button replacement that calls <meetingId>@<domain>.webex.com. By default the macro removes the default Webex Button.  

*/


import xapi from 'xapi';

const YOURCOMPANY = 'Company XYZ'; // Replace with your company name
const URISUFFIX = '@acecloud.webex.com'; // Replace with your Webex URI Suffix 
const DEFAUlTWEBEXBUTTON = false;  // Show the default Webex Button?   Removes the button when script is run (or adds it if set to true).  Comment out or delete if not needed. 

const PANELID = 'webexFedRAMP_panel';
const FEEDBACKID = 'webexFedRampFeedbackId';

function alert(title, text = '', duration = 12) {
  xapi.Command.UserInterface.Message.Alert.Display({
    Title: title,
    Text: text,
    Duration: duration,
  });
}

function openTextInput() {
  xapi.Command.UserInterface.Message.TextInput.Display({
    InputType: 'Numeric',
    Text: 'Please enter the 9 to 11 numeric Webex Meeting ID to join a ' + YOURCOMPANY + ' meeting. Use the green Call button for other formats.',
    Duration: 600,
    FeedbackId: FEEDBACKID,
    SubmitText: 'Join Webex',
    Title: ' Webex Meeting ID for ' + YOURCOMPANY,
  });
}

function panelClicked(event) {
  if (event.PanelId === PANELID) {
    openTextInput();
  }
}

function makeCall(event) {
  if (event.FeedbackId === FEEDBACKID) {
    const dialString = event.Text;
    if (/^\d{9,12}$/.test(dialString)) {
      let uri = dialString + URISUFFIX;
      let displayName = YOURCOMPANY + ' Webex ' + dialString;
      xapi.Command.Dial({ Number: uri, DisplayName: displayName });
    }
    else if (/^.+@.+\..+$/.test(dialString)) { // option to dial URI.  
      xapi.Command.Dial({ Number: dialString, DisplayName: dialString });
    }
    else if (/\d+/.test(dialString)) {
      alert('Not a Webex Meeting ID', 'A Webex Meeting ID needs to be 9 to 11 digits');
    }
    else if (dialString !== '') { // If end user dials an alphanumeric, append the URISUFFIX and try to route. 
      let uri = dialString + URISUFFIX;
      xapi.Command.Dial({ Number: uri, DisplayName: 'PMR: ' + uri });
    }
  }
}

if (DEFAUlTWEBEXBUTTON) {
  xapi.Config.UserInterface.Features.Call.JoinWebex.set('Auto');
} else {
  xapi.Config.UserInterface.Features.Call.JoinWebex.set('Hidden');
}

xapi.Event.UserInterface.Message.TextInput.Response.on(makeCall);
xapi.Event.UserInterface.Extensions.Panel.Clicked.on(panelClicked);


