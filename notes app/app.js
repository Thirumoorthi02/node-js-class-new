const chalk = require('chalk');
const yargs = require('yargs');
const notes = require('./notes.js');

// chalk is library where we can add colors to elements which we are printing in console
// console.log(chalk.blue.bgRed.bold(getNotes()));

// process.argv will give use the params we pass in command line(CLI)
// Eg: node app.js hey ---> process.argv contains "hey"
// argv ---> argument vector
// console.log(process.argv);

// yargs is a library used to get parsed details from CLI
// eg: node app --title=hello
// process.argv will give us "--title=hello"
// yargs.argv will give us {title:hello}

// customize yargs version
yargs.version('2.2.2'); // will be shown when node app.js --version is executed

// debugger will be executed only if we run "node inspect app.js" instead of "node app.js"
// node inspect app.js
// open chrome --> chrome://inspect --> select the node app and inspect
debugger;

// Create add command
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body)
    }
})

// Create remove command
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.removeNote(argv.title)
    }
})

// Create list command
yargs.command({
    command: 'list',
    describe: 'List your notes',
    handler() {
        notes.listNotes()
    }
})

// Create read command
yargs.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.readNote(argv.title)
    }
})

yargs.parse()

