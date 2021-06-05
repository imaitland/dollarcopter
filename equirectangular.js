//top-left reference point
// https://www.google.com/maps/place/39%C2%B022'18.8%22N+76%C2%B042'40.3%22W/@39.3718889,-76.7122887,18z/data=!3m1!4b1!4m14!1m7!3m6!1s0x89c803aed6f483b7:0x44896a84223e758!2sBaltimore,+MD!3b1!8m2!3d39.2903848!4d-76.6121893!3m5!1s0x0:0x0!7e2!8m2!3d39.3718765!4d-76.711186
var p0 = {
  scrX: 0, // Minimum X position on screen
  scrY: -60, // Minimum Y position on screen
  lat: 39.37187, // Latitude
  lng: -76.711186, // Longitude
};

//bottom-right reference point
//https://www.google.com/maps/place/39%C2%B012'57.0%22N+76%C2%B031'45.7%22W/@39.215827,-76.5315497,17z/data=!3m1!4b1!4m14!1m7!3m6!1s0x89c803aed6f483b7:0x44896a84223e758!2sBaltimore,+MD!3b1!8m2!3d39.2903848!4d-76.6121893!3m5!1s0x0:0x0!7e2!8m2!3d39.2158269!4d-76.5293607
var p1 = {
  scrX: 674, // Maximum X position on screen
  scrY: 836, // Maximum Y position on screen
  lat: 39.215827, // Latitude
  lng: -76.529361, // Longitude
};
var radius = 6.371; //Earth Radius in Km

//## Now I can calculate the global X and Y for each reference point ##\\
// https://stackoverflow.com/questions/16266809/convert-from-latitude-longitude-to-x-y
// This function converts lat and lng coordinates to GLOBAL X and Y positions

function latlngToGlobalXY(lat, lng) {
  //Calculates x based on cos of average of the latitudes
  let x = radius * lng * Math.cos((p0.lat + p1.lat) / 2);
  //Calculates y based on latitude
  let y = radius * lat;
  return { x: x, y: y };
}
// Calculate global X and Y for top-left reference point
p0.pos = latlngToGlobalXY(p0.lat, p0.lng);
// Calculate global X and Y for bottom-right reference point
p1.pos = latlngToGlobalXY(p1.lat, p1.lng);

/*
 * This gives me the X and Y in relation to map for the 2 reference points.
 * Now we have the global AND screen areas and then we can relate both for the projection point.
 */

// This function converts lat and lng coordinates to SCREEN X and Y positions
export function latlngToScreenXY(lat, lng) {
  //Calculate global X and Y for projection point
  let pos = latlngToGlobalXY(lat, lng);
  //Calculate the percentage of Global X position in relation to total global width
  pos.perX = (pos.x - p0.pos.x) / (p1.pos.x - p0.pos.x);
  //Calculate the percentage of Global Y position in relation to total global height
  pos.perY = (pos.y - p0.pos.y) / (p1.pos.y - p0.pos.y);

  //Returns the screen position based on reference points
  return {
    x: p0.scrX + (p1.scrX - p0.scrX) * pos.perX,
    y: p0.scrY + (p1.scrY - p0.scrY) * pos.perY,
  };
}

//# The usage is like this #\\
/*
var pos = latlngToScreenXY(-22.815319, -47.071718);
$point = $("#point-to-project");
$point.css("left", pos.x + "em");
$point.css("top", pos.y + "em");
*/
