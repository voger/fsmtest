/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "fsmTest"
 *
 * @asset(fsmtest/*)
 */
qx.Class.define("fsmtest.Application", {
  extend: qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     *
     * @lint ignoreDeprecated(alert)
     */
    main: function() {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /* App starts here*/
      // init the gui

      var doc = this.getRoot();
      var border = new qx.ui.decoration.Decorator().set({
        width: 3,
        style: "solid",
        color: "black"
      });

      var frame = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
      var box = new qx.ui.core.Widget().set({
        decorator: border
      });
      var button = new qx.ui.form.Button("Change state");


      frame.add(box);
      frame.add(button);
      doc.add(frame, {
        left: 20,
        top: 20
      });

      // init the fsm
      // Create a new finite state machine
      var fsm = new qx.util.fsm.FiniteStateMachine("Fsm_1");

      button.addListener("execute", fsm.eventListener, fsm);

      fsm.setDebugFlags(
        qx.util.fsm.FiniteStateMachine.DebugFlags.EVENTS |
        qx.util.fsm.FiniteStateMachine.DebugFlags.TRANSITIONS |
        qx.util.fsm.FiniteStateMachine.DebugFlags.FUNCTION_DETAIL |
        qx.util.fsm.FiniteStateMachine.DebugFlags.OBJECT_NOT_FOUND
      );


      fsm.addObject("box", box);
      fsm.addObject("button", button);


      /*
       * State: Red
       *
       * Actions upon entry:
       *  box.setBackgroundColor("red");
       *
       * Transition on:
       *  "execute" on button
       */
      var state = new qx.util.fsm.State("Red", {

        "autoActionsBeforeOnentry": {
          "setBackgroundColor": [{
            "parameters": ["red"],
            "objects": ["box"]
          }]
        },

        "onentry": function(fsm, event) {
          fsm.getObject("button").setLabel("Change state to Blue");
        },

        "events": {
          "execute": {
            "button": "Transition_Red_To_Blue"
          }
        }
      });



      var trans = new qx.util.fsm.Transition("Transition_Red_To_Blue", {
        "nextState": "Blue",
        "predicate": true,
        "ontransition": function(fsm, event) {
          console.log("Transiting...");
        }
      });
      state.addTransition(trans);
      fsm.addState(state);

      state = new qx.util.fsm.State("Blue", {

        "autoActionsBeforeOnentry": {
          "setBackgroundColor": [{
            "parameters": ["blue"],
            "objects": ["box"]
          }]
        },

        "onentry": function(fsm, event) {
          fsm.getObject("button").setLabel("Terminate");
        },

        "events": {
          "execute": {
            "button": "Terminate"
          }
        }
      });

      var trans = new qx.util.fsm.Transition("Terminate", {
        "nextState": qx.util.fsm.FiniteStateMachine.StateChange.TERMINATE
      });
      state.addTransition(trans);
      fsm.addState(state);

      fsm.addListener("terminated", function() {
        console.log("Terminated...");
        fsm.dispose();
        console.log("fsm.isDisposed(): "+ fsm.isDisposed(true));
      }, this);

      fsm.start();
    }
  }
});
