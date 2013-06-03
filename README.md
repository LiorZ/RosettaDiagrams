Rosetta Diagrams
===============


Introduction
-------------

	Rosetta Diagrams allows you to create protein modeling protocols with Rosetta by drawing the protocol as a diagram on a browser. The diagram can then be exported as a Rosetta Script and ran on any Rosetta installation. This tutorial assumes you are already familiar with protein modeling and have a basic understanding of Rosetta. No programming skills required.

The workspace
-------------
	
	![Workspace](https://raw.github.com/LiorZ/RosettaDiagrams/master/readme_files/screenshot_clean.png)
	The screen above is the workspace in which the diagrams are sketched. It is composed of 4 main sections:
	1. The Code section - where the Rosetta Scripts XML code is being displayed. This section is updated every time the diagram is changed.
	2. The Palette - contains all elements available within Rosetta for the creation of a Rosetta Scripts protocol. (Movers, Filters, TaskOperations and Control Structure movers (currently, there is only IFMover)
	3. The Properties section - displays relevant information in the form of a key-value pairs for elements that are selected in the diagram. This pairs are actually the attributes that appear in the XML tags of the elements in the Rosetta Scripts code. The *Add Attribute* button adds another key-value pair , that is also added to the element's tag in the XML file.
	All these sections appear when the mouse hover them , and retract once no longer needed.
	4. The Canvas - the area in which the diagram is drawn.
	
Creating a protocol
--------------------

	In order to add elements (movers/filters/task operations) to the diagram, simply click on the corresponding element in the palette. The element should then appear as a colored rectangle on the canvas:	
	![Diagram Elements](https://raw.github.com/LiorZ/RosettaDiagrams/master/readme_files/elements.png)
