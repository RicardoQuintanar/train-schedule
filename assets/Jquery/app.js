var config = {
    apiKey: "AIzaSyCxkcn9Ub4_mjcCq0z3cnHZHMzabWa8gSM",
    authDomain: "train-schedule-dbb07.firebaseapp.com",
    databaseURL: "https://train-schedule-dbb07.firebaseio.com",
    projectId: "train-schedule-dbb07",
    storageBucket: "",
    messagingSenderId: "600629615245"
  };
  firebase.initializeApp(config);


var database = firebase.database();


var trainName;
var destination;
var firstTrain;
var frequency;
var newTableRow;
var nextArrival;
var minutesAway;


// 2. Button for adding Trains
$("#add-train").on("click", function(event) {
    event.preventDefault();
  
    // user input
    trainName = $("#train-input").val().trim();
    trainDestination = $("#destination-input").val().trim();
    firstTrain = $("#first-train-time-input").val().trim();
    frequency = $("#frequency-input").val().trim();
  
    // local object for holding employee data
    newTrain = {
      name: trainName,
      destination: trainDestination,
      firstTrain: firstTrain,
      frequency: frequency
    };
    database.ref().push(newTrain);
  
    // Clears all of the text-boxes
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
  });

  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  
  var firstTimeConverted = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var tRemainder = diffTime % childSnapshot.val().frequency;
  console.log(tRemainder);
  
  var tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // full list of items to the well
    newTableRow = $("#trains").append("<tr>");
    newTableRow.append("<td>" + childSnapshot.val().name + "</td>");
    newTableRow.append("<td>" + childSnapshot.val().destination + "</td>");
    newTableRow.append("<td>" + childSnapshot.val().frequency + "</td>");
    newTableRow.append("<td>" + (moment(nextTrain).format("hh:mm")) + "</td>");
    newTableRow.append("<td>" + tMinutesTillTrain + "</td>");
  });