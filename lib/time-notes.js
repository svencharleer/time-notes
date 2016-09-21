'use babel';

import TimeNotesView from './time-notes-view';
import { CompositeDisposable } from 'atom';

export default {

  timeNotesView: null,
  modalPanel: null,
  subscriptions: null,


  activate(state) {
    this.timeNotesView = new TimeNotesView(state.timeNotesViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.timeNotesView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'time-notes:toggle': () => this.toggle(),
      'time-notes:enter_pressed': (e) => this.enter_pressed(e)
    }));

    atom.config.set('time-notes.enabled', false)
  },

  deactivate() {
    this.modalPanel.destroy();
     this.subscriptions.dispose();
    this.timeNotesView.destroy();
  },

  serialize() {
    return {
      timeNotesViewState: this.timeNotesView.serialize()
    };
  },

  toggle() {



    var enabled = atom.config.get('time-notes.enabled')
    console.log('TimeNotes was toggled!');
    enabled = !enabled;
    atom.config.set('time-notes.enabled', enabled)

  },
  enter_pressed(e){
    var enabled = atom.config.get('time-notes.enabled')
    if(enabled)
    {
      var editor = atom.workspace.getActiveTextEditor();
      editor.moveToBeginningOfLine();
      editor.insertText(new Date().toLocaleString()+ "\t");
      editor.insertText(Date.parse(new Date()).toString()+ "\t");

      editor.moveToEndOfLine();
      editor.insertNewline();
  }
  else{
   return e.abortKeyBinding();
  }

  }

};
