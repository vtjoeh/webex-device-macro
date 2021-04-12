Webex Button Call Reroute
 
Useful for connecting to a single FedRAMP Webex site using the standard Webex button.  It will route to one pre-determined domain. 

Problem:  Webex cloud registered devices cannot call **meetingId**@webex.com.  The Webex button dials **meetingId**@webex.com.  This macro retries failed calls to 
**meetingId**@webex.com to **meetingId**@**domain**.webex.com.  
