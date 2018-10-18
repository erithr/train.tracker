// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCtaIAPWRvR2zMy3UNX88T74sqmbYbnigg",
    authDomain: "tth-erithr.firebaseapp.com",
    databaseURL: "https://tth-erithr.firebaseio.com",
    projectId: "tth-erithr",
    storageBucket: "tth-erithr.appspot.com",
    messagingSenderId: "399864817441"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var newName = $("#train-name-input").val().trim();
    var newDestination = $("#destination-input").val().trim();
    var newStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var newFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: newName,
        Destination: newDestination,
        start: newStart,
        Frequency: newFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.Destination);
    console.log(newTrain.start);
    console.log(newTrain.Frequency);

    alert("train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var newName = childSnapshot.val().name;
    var newDestination = childSnapshot.val().Destination;
    var newStart = childSnapshot.val().start;
    var newFrequency = childSnapshot.val().Frequency;

    // train Info
    console.log(newName);
    console.log(newDestination);
    console.log(newStart);
    console.log(newFrequency);

    // Prettify the train start
    var trainStart = moment(newStart, "HH:mm").subtract(1, "years");
    console.log(trainStart);

    // To calculate the minutes
    var diffTime = moment().diff(moment(trainStart), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % newFrequency;
    console.log(tRemainder);
    // Calculate the minutes til the next train 
    var tMinutesTillTrain = newFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextArrival = moment(nextTrain).local().format("hh:mm A");

    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

    // Create the new row
    var newRow = $("<tr>").append(
        $(`<td scope="row">`).text(newName),
        $("<td>").text(newDestination),
        $("<td>").text(newFrequency),
        $("<td>").text(nextArrival),
        $("<td>").text(tMinutesTillTrain)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});
