
var database = firebase.database();

    $("#add-train").on("click", function() {
      event.preventDefault();

      var nameInput = $("#train-name").val().trim();
      var destInput = $("#destination").val().trim();
      var firstTrainInput = $("#first-train").val().trim();
      var freqInput = $("#frequency").val().trim();

      if (nameInput && destInput && firstTrainTime && freqInput) {

        database.ref().push({
          train: nameInput,
          destination: destInput,
          firstTrainTime: firstTrainInput,
          trainFrequency: freqInput
        });

        database.ref().on("child_added", function(childSnapshot) {
          console.log(childSnapshot.val().train);
          console.log(childSnapshot.val().destination);
          var tableRow = $('<tr />')
          var columnElement = tableRow.html('<td>'+childSnapshot.val().train+'</td><td>'+childSnapshot.val().destination+'</td><td>'+childSnapshot.val().firstTrainTime+'</td><td>'+childSnapshot.val().trainFrequency+'</td>')

          $("#train-schedule").append(tableRow);

        });

      } else {
        alert('Please fill out all the fields before submitting.')
      }

    });
