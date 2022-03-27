const VF = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "boo".
var div = document.getElementById("output");
var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

// Size our SVG:
renderer.resize(600, 600);

// And get a drawing context:
var context = renderer.getContext();

// Create a stave at position 50, 200 of width 500 on the canvas.
var stave = new VF.Stave(50, 200, 500);

// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();

var baseNotes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

var phrase = []
var keyIndex = 2;
var dominantIndex = (keyIndex + 4) % 7; //+4 because the V is the I + 4
var fMaj7Asc = []
let start = 6 //randomize to be dominant chord tones, note off by one actually makes this the seventh
for (let chordGenerator = 0; chordGenerator<4; chordGenerator++) {
    fMaj7Asc.push(baseNotes[(dominantIndex+start+chordGenerator*2)%7]); // %7 stays for the demo, but implement octave
}

console.log(fMaj7Asc);

var notesAsc = fMaj7Asc.map(
    x => new VF.StaveNote({
        keys: [x+"/4"],
        duration: "8"
    })
);

notesAsc.unshift(new VF.StaveNote({
    keys: ['b/4'],
    duration: "8r"
})) //Adding eigth rest to make room for triplet figure

phrase.push(notesAsc);


var descG7 = []
start = 6
for (let scaleGenerator = 0; scaleGenerator<4; scaleGenerator++) {
    descG7.push(baseNotes[(dominantIndex+start-scaleGenerator)%7]);
}

console.log(descG7);

var notesDesc = descG7.map(
    (x) => new VF.StaveNote({
        keys: [x+"/4"],
        duration: "8"
    })
);
phrase.push(notesDesc);

var beams = [new VF.Beam(notesAsc.slice(2,5)), new VF.Beam(notesDesc.slice(0,4))];

var simpleTriplet = new Vex.Flow.Tuplet(notesAsc.slice(2,5));

var voice = new Vex.Flow.Voice({num_beats:4, resolution:Vex.Flow.RESOLUTION})
phrase.forEach(x => voice.addTickables(x))

var formatter = new Vex.Flow.Formatter();
formatter.format([voice], 450); //450 is 50 less than stave width so there is room for stuff

voice.draw(context, stave);

beams.forEach(function(beam){
  beam.setContext(context).draw();
});

simpleTriplet.setContext(context).draw();

// let chord1 = new VF.ChordSymbol()
//   .addGlyphOrText('F')
//   .addGlyphOrText('-7', {
//     symbolModifier: VF.ChordSymbol.symbolModifiers.SUPERSCRIPT
//   })
//   .setFontSize(20);



// var notes = [
//     // Two eighth notes of C.
//     new VF.StaveNote({ clef: "treble", keys: ["c/4"], duration: "8" }),
//     new VF.StaveNote({ clef: "treble", keys: ["c/4"], duration: "8" }),

//     // Four 16th notes D.
//     new VF.StaveNote({ clef: "treble", keys: ["d#/4"], duration: "16" }),
//     new VF.StaveNote({ clef: "treble", keys: ["d/4"], duration: "16" }),
//     new VF.StaveNote({ clef: "treble", keys: ["db/4"], duration: "16" }),
//     new VF.StaveNote({ clef: "treble", keys: ["d/4"], duration: "16" }),

//     // A quarter-note rest. Note that the key (b/4) specifies the vertical
//     // position of the rest.
//     new VF.StaveNote({ clef: "treble", keys: ["b/4"], duration: "qr" }),

//     // A C-Major chord.
//     new VF.StaveNote({ clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" }),
// ];

// // Create a voice in 4/4 and add the notes from above
// var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
// voice.addTickables(notes);

// // Format and justify the notes to 350 pixels (50 pixels left for key and time signatures).
// var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 350);

// var beams = VF.Beam.generateBeams(notes);

// // Render the notes followed by the beams
// Vex.Flow.Formatter.FormatAndDraw(context, stave, notes);
// beams.forEach(function (b) {
//     b.setContext(context).draw();
// });




// // Setup the notes_array
// var notes = [
//   ["c/4", "16"],
//   ["d/4", "16"],
//   ["e/4", "16"],
//   ["f/4", "16"],
//   ["g/4", "16"],
//   ["a/4", "4"],
//   ["b/4", "4"],
//   ["c/5", "8"],
//   ["b/4", "16"],
//   ["a/4", "16"],
//   ["g/4", "16"],
//   ["f/4", "16"],
//   ["e/4", "16"],
//   ["d/4", "16"],
//   ["c/4", "8"],
//   ["b/3", "8"],
//   ["c/4", "8"]
// ].map(function(noteStruct){
//   return new Vex.Flow.StaveNote({
//     keys: [noteStruct[0]], 
//     duration: noteStruct[1]
//   });
// });

// // Setup the beams: we do this before defining tuplets so that default bracketing will work.
// var beams = [
//   [0, 5], // c/4 - g/4
//   [8, 13], // b/4 - e/4
//   [14, 17] // c/4, b/3, c/4
// ].map(function(i){
//   return new Vex.Flow.Beam(notes.slice(i[0], i[1]));
// });

// // Now create the tuplets:
// var quarterNoteTriplet = new Vex.Flow.Tuplet(notes.slice(0, 8), {
//   num_notes: 3, notes_occupied: 2, ratioed: true
// });

// var nestedQuintuplet = new Vex.Flow.Tuplet(notes.slice(0,5), {
//   num_notes: 5, notes_occupied: 4, location: -1, bracketed: true
// });

// var nestedTriplet = new Vex.Flow.Tuplet(notes.slice(6,8), {
//   num_notes: 3, notes_occupied: 2, location: -1
// });

// var complexQuintuplet = new Vex.Flow.Tuplet(notes.slice(8,13), {
//   num_notes: 5, notes_occupied: 3
// })

// var simpleTriplet = new Vex.Flow.Tuplet(notes.slice(14,17));

// // Create the voice:
// var voice = new Vex.Flow.Voice({num_beats:4, resolution:Vex.Flow.RESOLUTION})
// voice.addTickables(notes);

// // Format the voice:
// var formatter = new Vex.Flow.Formatter();
// formatter.format([voice], 775);

// // Draw the voice:
// voice.draw(context, stave);

// // Draw the beams:
// beams.forEach(function(beam){
//   beam.setContext(context).draw();
// });

// // Draw the tuplets:
// [ quarterNoteTriplet, nestedQuintuplet, nestedTriplet, complexQuintuplet, simpleTriplet ]
// .forEach(function(tuplet){
//   tuplet.setContext(context).draw();
// });




// // Render voice
// voice.draw(context, stave);

// var notes = [
//     new VF.StaveNote({ clef: "treble", keys: ["e##/5"], duration: "8d" }).addAccidental(0, new VF.Accidental("##")).addDotToAll(),
//     new VF.StaveNote({ clef: "treble", keys: ["b/4"], duration: "16" }).addAccidental(0, new VF.Accidental("b")),
//     new VF.StaveNote({ clef: "treble", keys: ["c/4"], duration: "8" }),
//     new VF.StaveNote({ clef: "treble", keys: ["d/4"], duration: "16" }),
//     new VF.StaveNote({ clef: "treble", keys: ["e/4"], duration: "16" }).addAccidental(0, new VF.Accidental("b")),
//     new VF.StaveNote({ clef: "treble", keys: ["d/4"], duration: "16" }),
//     new VF.StaveNote({ clef: "treble", keys: ["e/4"], duration: "16" }).addAccidental(0, new VF.Accidental("#")),
//     new VF.StaveNote({ clef: "treble", keys: ["g/4"], duration: "32" }),
//     new VF.StaveNote({ clef: "treble", keys: ["a/4"], duration: "32" }),
//     new VF.StaveNote({ clef: "treble", keys: ["g/4"], duration: "16" }),
//     new VF.StaveNote({ clef: "treble", keys: ["d/4"], duration: "q" }),
// ];

// var beams = VF.Beam.generateBeams(notes);
// Vex.Flow.Formatter.FormatAndDraw(context, stave, notes);
// beams.forEach(function (b) {
//     b.setContext(context).draw();
// });
