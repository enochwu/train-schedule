var config = {
  apiKey: "AIzaSyAnk75zDMZ9armX5_xHaMy4vYx51k9WEow",
  authDomain: "rain-scheduler.firebaseapp.com",
  databaseURL: "https://rain-scheduler.firebaseio.com",
  projectId: "rain-scheduler",
  storageBucket: "",
  messagingSenderId: "114010683972"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#add-train").on("click", function() {
  event.preventDefault();

  var nameInput = $("#train-name").val().trim();
  var destInput = $("#destination").val().trim();
  var firstTrainInput = $("#first-train").val().trim();
  var freqInput = $("#frequency").val().trim();

  if (nameInput && destInput && firstTrainInput && freqInput) {

    // Creates local "temporary" object for holding employee data
    var trainInfo = {
      train: nameInput,
      destination: destInput,
      firstTrainTime: firstTrainInput,
      trainFrequency: freqInput
    };

    // Uploads employee data to the database
    database.ref().push(trainInfo);

    $('.form-control').val('');

  } else {
    alert('Please fill out all the fields before submitting. In addition, check to make sure your time is formatted to hh:ss and that the train frequency is only a numberical value')
  }

});

database.ref().on("child_added", function(childSnapshot) {

  var nameInput = childSnapshot.val().train;
  var destInput = childSnapshot.val().destination;
  var freqInput = childSnapshot.val().trainFrequency;

  var tFrequency = childSnapshot.val().trainFrequency;

  // Time is 3:30 AM
  var firstTime = childSnapshot.val().firstTrainTime;
  console.log(nameInput);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  // console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  // console.log(currentTime);
  // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  // console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var timeNextTrain = moment(nextTrain).format("HH:mm")
  // console.log("ARRIVAL TIME: " + timeNextTrain);

  var tableRow = $('<tr />')
  var columnElement = tableRow.html('<td>'+nameInput+'</td><td>'+destInput+'</td><td>'+tMinutesTillTrain+'m'+'</td><td>'+timeNextTrain+'</td><td>'+freqInput+'m'+'</td>')

  $("#train-schedule").append(tableRow);

});
