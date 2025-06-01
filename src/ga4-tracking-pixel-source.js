// ssGTM Doku: https://developers.google.com/tag-platform/tag-manager/server-side/api?hl=de
// aGTM Doku: https://github.com/Andiministrator/ga4-tracking-pixel
const ga4TPversion = "1.0";

// Load Libraries
const log = require('logToConsole');
const claimRequest = require('claimRequest');
//const sendHttpRequest = require('sendHttpRequest');
const setResponseStatus = require('setResponseStatus');
const setResponseHeader = require('setResponseHeader');
const setResponseBody = require('setResponseBody');
const sendEventToGoogleAnalytics = require('sendEventToGoogleAnalytics');
//const setPixelResponse = require('setPixelResponse');
const returnResponse = require('returnResponse');
const getRequestPath = require('getRequestPath');
const getRequestHeader = require('getRequestHeader');
//const getRequestQueryParameters = require('getRequestQueryParameters');
//onst Promise = require('Promise');
const runContainer = require('runContainer');
const createRegex = require('createRegex');
const testRegex = require('testRegex');
const generateRandom = require('generateRandom');
const getTimestampMillis = require('getTimestampMillis');
//const fromBase64 = require('fromBase64');
const makeString = require('makeString');
//const JSON = require('JSON');
var err = '';

// Check Path (and Pixel Name for ID
var pixelname = data.pixel_name;
var path = getRequestPath();
var regex = createRegex('^/[a-zA-Z0-9_-]+/[a-zäöüßA-ZÄÖÜ0-9\\/\\s\\+\\._-]*/?'+pixelname+'$','');
if (!testRegex(regex, path)) return;
var parts = path.split('/');
if (parts.length < 3) return;
var id = parts[1];
if (typeof id !== 'string' || !id) return;
var p = parts.length>3 ? parts.slice(2, -1) : [];

// Check whether ID is matching and set GA4 ID
var ids = data.ids || [];
var ga4id = data.default_id || '';
for (var i=0; i<ids.length; i++) {
  if (ids[i].id==id) {
    ga4id = ids[i].ga4id;
    break;
  }
}
if (!ga4id) return;

// Claim Request
claimRequest();

// Build GA4 Event
var event = { event_name: data.eventname };

// Add Necessary Event Data
event['x-ga-protocol_version'] = '2';
event['x-ga-measurement_id'] = ga4id; // e.g. 'G-3105KCF4NC';
//event['x-ga-client_id'] = '799925220.1727100378';
//event['x-ga-temp_client_id'] = '997570488';
//event['x-ga-lps'] = true;
event['x-ga-request_count'] = 1;
event['x-ga-gcs'] = 'G101';
event['x-ga-gcd'] = '13p3t3p3p5l1';
event['x-ga-npa'] = '0';
event['x-ga-dma'] = true;
event['x-ga-dma_cps'] = '-';
event['x-ga-country'] = 'DE';
event['x-ga-region'] = 'DE';
event['x-gclb-country'] = 'DE';
event['x-gclb-region'] = 'DE';
// Add Common Event Data
event.client_id = makeString(getTimestampMillis()) + '.' + makeString(generateRandom(1, 10000000));
event.ip_override = '49.156.48.123';
event.language = 'de-de';
event.page_encoding = 'UTF-8';
event.page_hostname = data.hostname || 'example.com';
event.page_location = 'https://'+event.page_hostname+path;
event.page_path = path;
//event.page_title = 'Newsletter 1';
//event.page_referrer = 'test.com';
event.user_agent = getRequestHeader('user-agent');
if (!event.user_agent) event.user_agent = 'Andiministrator;1.0|Fake%20Browser;1.0|Not.A%2FBrand;99.0.0.0';
event.screen_resolution = '1024 x 768';
event.viewport_size = '1000 x 750';

// Add overhanded (path) attributes
var pathnames = data.attributes || [];
var regex = createRegex('[^a-zäöüßA-ZÄÖÜ0-9\\s\\+\\._-]','g');
for (var i=0; i<p.length; i++) {
  var attr_name = 'attribute' + makeString(i+1);
  if (typeof pathnames[i]=='object' && typeof pathnames[i].attribute=='string' && pathnames[i].attribute) {
    attr_name = pathnames[i].attribute;
  }
  event[attr_name] = p[i].replace(regex, '');
}

// Add userdefined attributes
var attr = data.additional_attributes || [];
for (var i=0; i<attr.length; i++) {
  event[attr[i].attribute_name] = attr[i].attribute_value;
}

// Prepare Image Response
var img_format = data.image_format || 'gif';
img_format = img_format.trim();
var img_content = data.image_content || '';
img_content = img_content.trim();
if (!img_content) {
  img_format = 'gif';
  img_content = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
}

// Sends the event to Google Analytics
/*sendEventToGoogleAnalytics(event).then((response) => {
  if (response.location) {
    //setResponseHeader('location', response.location);
    //setResponseStatus(302);
  } else {
    //setResponseStatus(200);
  }
}).catch((error) => {
  err = 'Error sending Event to Google Analytics: ' + error.reason;
  //setResponseStatus(500);
});*/


// Send Response
runContainer(event, function() {
  // OnComplete
  returnResponse();
}, function() {
  // OnStart
  setResponseHeader('Content-Type', 'image/'+img_format);
  setResponseHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  setResponseHeader('Pragma', 'no-cache');
  setResponseHeader('Expires', '0');
  setResponseStatus(200);
  setResponseBody(img_content, 'base64');
});
