
var database = firebase.database();

console.log(database.destination);

// var tableRow = $('<tr />')
// var columnElement = tableRow.html('<td>'+database.train+'</td><td>'+childSnapshot.val().destination+'</td><td>'+tMinutesTillTrain+'m'+'</td><td>'+timeNextTrain+'</td><td>'+childSnapshot.val().trainFrequency+'m'+'</td>')
// $("#train-schedule").append(tableRow);

$("#add-train").on("click", function() {
  event.preventDefault();

  var nameInput = $("#train-name").val().trim();
  var destInput = $("#destination").val().trim();
  var firstTrainInput = $("#first-train").val().trim();
  var freqInput = $("#frequency").val().trim();

  if (nameInput && destInput && firstTrainInput && freqInput) {

    database.ref().push({
      train: nameInput,
      destination: destInput,
      firstTrainTime: firstTrainInput,
      trainFrequency: freqInput
    });

    database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val().train);
      console.log(childSnapshot.val().destination);

      var tFrequency = childSnapshot.val().trainFrequency;

      // Time is 3:30 AM
      var firstTime = childSnapshot.val().firstTrainTime;

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      // Current Time
      var currentTime = moment();
      console.log(currentTime);
      console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      var timeNextTrain = moment(nextTrain).format("HH:mm")
      console.log("ARRIVAL TIME: " + timeNextTrain);

      var tableRow = $('<tr />')
      var columnElement = tableRow.html('<td>'+childSnapshot.val().train+'</td><td>'+childSnapshot.val().destination+'</td><td>'+tMinutesTillTrain+'m'+'</td><td>'+timeNextTrain+'</td><td>'+childSnapshot.val().trainFrequency+'m'+'</td>')

      $("#train-schedule").append(tableRow);

    });

  } else {
    alert('Please fill out all the fields before submitting.')
  }

});
