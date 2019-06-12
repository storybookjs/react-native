# example addon: roundtrip

This addon uses the channel to communicate a message to the preview and back

This can be useful to perform some analysis on the rendered html.
An example of this would be the accessibility addon (a11y) which uses the amazing axe library to send a list of errors/warnings to the manager.

Other uses include: 
- making DOM changes in the iframe
- fire DOM events in the iframe
