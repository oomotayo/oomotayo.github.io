//To help me have access to the domain
const corsAnywhere = "https://cors-anywhere.herokuapp.com/"

const baseUrl = "https://eh3wlvr1zb.execute-api.us-east-1.amazonaws.com/"

//contains needed endpoint url for the functions
const endpoints = {
  createChannel : "dev/channel/create",
  getUploadUrl: "dev/channel/url"
}

(function() {
  console.log( "Z Test" );
})

//function to create channel

var createChannel = function (channelName = "Seun PTT Channel") {
  return new Promise((resolve, reject) => {

const url = corsAnywhere + baseUrl + endpoints.createChannel;

var audioTestHeaders = new Headers();

audioTestHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "channelName": channelName
});

var requestOptions = {
  method: 'POST',
  headers: audioTestHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(url, requestOptions)
  // .then(response => response.json())
  .then( async (response) => {
    console.log( "My response=", response );
  })
  .then(result => resolve(result))
  .catch(error => reject(error));

 })
}

//function to create upload url
var getUploadUrl = function (channelID = "bf3ca510-c717-11eb-9e17-eb0ced4ee36b", key="Seun.wav", contentType="audio/webm", expires = 3600){

  return new Promise ((resolve, reject) => {


  
  var getUploadHeaders = new Headers();
  
  getUploadHeaders.append("Content-Type", "application/json");

  const url = corsAnywhere + baseUrl + endpoints.getUploadUrl;

  var raw = JSON.stringify({
  "channelId": channelID,
  "expires": expires,
  "key": key,
  "contentType": contentType
  });

var requestOptions = {
  method: 'POST',
  headers: getUploadHeaders,
  body: raw,  
  redirect: 'follow'
};

fetch(url, requestOptions)
  .then(response => response.text())
  .then(result => resolve(result))
  .catch(error => reject(error));
    })
}

//function to upload files
var uploadFile = function (file, url, contentType){
  return new Promise((resolve, reject) => {



  var fileUploadHeaders = new Headers();
  fileUploadHeaders.append("Content-Type", contentType);

  console.log(file)

  var requestOptions = {
  method: 'PUT',
  headers: fileUploadHeaders,
  body: file,
  redirect: 'follow'
};

  fetch(url, requestOptions)
  .then(response => response.text())
  .then(result => resolve(result))
  .catch(error => reject(error));

  })
}
