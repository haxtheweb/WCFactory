# Web Component Factory

A factory that churns out web components, library agnostic.

Goals:
- Empower anyone that knows how to create HTML,CSS and basic JS with web components
- Eliminate barriers to entry by abstracting tooling
- Create a single dependency (docker) requirement to participating effectively in the future of the web
- Support any platform matching https://custom-elements-everywhere.com/ conformance testing
- Support any custom element sub class you want to add
- 0 Config wiring of produced assets up to HAX; a system that treats front and elements as little APIs to eliminate wysiwyg tools

Vision:
- 1 command to get everything up and going
- Never have to understand the complexities of tooling
- CLI should seek to empower as many people as possible
- Anyone should be able to manage, create, and share elements in an element library
- Seamless sharing to webcomponents.org, npm, and git
- Unify CLI, build step, and element packaging across all libraries
- Allow advanced developers to fork, tinker, and repurpose to their will