import client from "./client.js"
import gql from 'graphql-tag'
import { Terminal } from 'xterm';
import 'xterm/dist/xterm.css';

var term = new Terminal();
let prompt = '$'
const outlet = document.getElementById('terminal')
term.open(outlet);
term.write(prompt)
term.on('key', (e) => {
  if (e instanceof Object) {

  }
  if (e.keyCode !== 'undefined') {

  }
  if (
    e.keyCode >= 48 && e.keyCode <= 57 ||
    e.keyCode >= 65 && e.keyCode <= 90
  ) {
    term.write(e.key)
  }
})

client.subscribe({
  query: gql`
    subscription {
      childProcess
    }`,
  variables: {}
}).subscribe({
  next ({data: childProcess }) {
    console.log('childProcess:', childProcess.childProcess)
    term.writeln(JSON.stringify(childProcess.childProcess))
  }
});
