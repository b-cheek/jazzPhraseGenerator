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
stave.setText('D-7', VF.Modifier.Position.ABOVE, { shift_y: -10 });

// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();

var baseNotes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

var numFlatsOrSharps = 3;


var flatSharpSymbol = 'b';
//Note that the following two variables are determined by flatSharpSymbol
var keyGeneratorIncrement = 3; //this will add flats, as flats are created around the circle of fourths, which is 3 tones above the base note. To add sharps, it should equal 4
var keyGenStart = 1; //since flats start with Bb. If sharps, keyGenStart=5, sharps start at F#

for (let i=0; i<numFlatsOrSharps; i++) {
    baseNotes[(keyGenStart+i*(keyGeneratorIncrement))%7] += flatSharpSymbol; //The 5 is to start at B, if the loop executes once, there will be one flat, Bb
}

console.log(baseNotes);

var phrase = []
var keyIndex = 2;
var dominantIndex = (keyIndex + 4) % 7; //+4 because the V is the I + 4. This idea is present for all intervals in the program
var fMaj7Asc = []
let start = 6 //randomize to be dominant chord tones, note off by one actually makes this the seventh
for (let chordGenerator = 0; chordGenerator<4; chordGenerator++) {
    fMaj7Asc.push(baseNotes[(dominantIndex+start+chordGenerator*2)%7]); // %7 stays for the demo, but implement octave
}

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

let chord1 = new VF.ChordSymbol()
  .addGlyphOrText('D')
  .addGlyphOrText('-7', {
    symbolModifier: VF.ChordSymbol.symbolModifiers.SUPERSCRIPT
  })
  .setFontSize(20);
notesAsc[0].addModifier(chord1);

phrase.push(notesAsc);


var descG7 = [];
start = 6;
for (let scaleGenerator = 0; scaleGenerator<4; scaleGenerator++) {
    descG7.push(baseNotes[(dominantIndex+start-scaleGenerator)%7]);
}

var notesDesc = descG7.map(
    (x) => new VF.StaveNote({
        keys: [x+"/4"],
        duration: "8"
    })
);
phrase.push(notesDesc);

for (const note of phrase) console.log(note);

var beams = [new VF.Beam(notesAsc.slice(2,5)), new VF.Beam(notesDesc.slice(0,4))];

var simpleTriplet = new Vex.Flow.Tuplet(notesAsc.slice(2,5));

var voice = new Vex.Flow.Voice({num_beats:4, resolution:Vex.Flow.RESOLUTION})
phrase.forEach(x => voice.addTickables(x))

var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 440); //Leave 10px of space at the end of the bar

voice.draw(context, stave);

beams.forEach(function(beam){
  beam.setContext(context).draw();
});

simpleTriplet.setContext(context).draw();


// const {
//   Accidental,
//   ChordSymbol,
//   Flow,
//   Formatter,
//   Renderer,
//   Stave,
//   StaveNote
// } = Vex;

// //Flow.setMusicFont('Bravura');

// // Create an SVG renderer and attach it to the DIV element named "boo".
// const div = document.getElementById('output');
// const renderer = new Renderer(div, Renderer.Backends.SVG);

// // Configure the rendering context.
// renderer.resize(650, 500);
// const context = renderer.getContext();
// context.scale(1.5, 1.5);
// context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');

// // Create a stave of width 400 at position 10, 40 on the canvas.
// let stave = new Stave(10, 40, 400);

// // Add a clef and time signature.
// stave.addClef('treble').addTimeSignature('4/4');

// // Connect it to the rendering context and draw!
// stave.setContext(context).draw();

// let notes = [
//   // A quarter-note C.
//   new StaveNote({
//     keys: ['f/4'],
//     duration: 'h'
//   }),

//   // A quarter-note D.
//   new StaveNote({
//     keys: ['b/4'],
//     duration: 'h'
//   }).addModifier(new Accidental('b')),
// ];

// console.log(notes);

// // let chord1 = new ChordSymbol()
// //   .addGlyphOrText('F')
// //   .addGlyphOrText('-7', {
// //     symbolModifier: ChordSymbol.symbolModifiers.SUPERSCRIPT
// //   })
// //   .setFontSize(14);

// let chord2 = new ChordSymbol()
//   .addGlyphOrText('Bb7')
//   .addGlyphOrText('#11', {
//     symbolModifier: ChordSymbol.symbolModifiers.SUPERSCRIPT
//   })
//   .addGlyphOrText('b9', {
//     symbolModifier: ChordSymbol.symbolModifiers.SUBSCRIPT
//   })
//   .setFontSize(14);

// notes[0].addModifier(chord1);
// notes[1].addModifier(chord2);

// console.log(notes);
// console.log(notesAsc);

// Formatter.FormatAndDraw(context, stave, notes);

// Flow.setMusicFont('Petaluma');

// stave = new Stave(10, 140, 400);

// // Add a clef and time signature.
// stave.addClef('treble').addTimeSignature('4/4');

// // Connect it to the rendering context and draw!
// stave.setContext(context).draw();

// notes = [
//   // A quarter-note C.
//   new StaveNote({
//     keys: ['f/4'],
//     duration: 'h'
//   }),

//   // A quarter-note D.
//   new StaveNote({
//     keys: ['b/4'],
//     duration: 'h'
//   }).addModifier(new Accidental('b')),
// ];

// chord1 = new ChordSymbol()
//   .addGlyphOrText('F')
//   .addGlyphOrText('7', {
//     symbolModifier: ChordSymbol.symbolModifiers.SUPERSCRIPT
//   })
//   .addGlyphOrText('b5', {
//     symbolModifier: ChordSymbol.symbolModifiers.SUBSCRIPT
//   })
//   .setFontSize(14);

// console.log(chord1)

// chord2 = new ChordSymbol()
//   .addGlyphOrText('Bb7')
//   .addGlyphOrText('#11', {
//     symbolModifier: ChordSymbol.symbolModifiers.SUPERSCRIPT
//   })
//   .addGlyphOrText('b9', {
//     symbolModifier: ChordSymbol.symbolModifiers.SUBSCRIPT
//   })
//   .setFontSize(14);

// notes[0].addModifier(chord1);
// notes[1].addModifier(chord2);

// Formatter.FormatAndDraw(context, stave, notes);



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
