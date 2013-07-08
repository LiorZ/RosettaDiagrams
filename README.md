Rosetta Diagrams
===============


Introduction
-------------

Rosetta Diagrams allows you to create protein modeling protocols with Rosetta by drawing the protocol as a diagram in a browser. The diagram can then be exported to a Rosetta Script and run on any Rosetta installation. This tutorial assumes you are already familiar with protein modeling and have a basic understanding of Rosetta. No programming skills required.

The workspace
-------------
	
![Workspace](https://raw.github.com/LiorZ/RosettaDiagrams/master/readme_files/screenshot_clean.png)
The image above features the workspace in which the diagrams are sketched. It is composed of 4 main sections:

1. The Code section - where the Rosetta Scripts XML code is displayed. This section is synchronized with the diagram and updates on every change.
2. The Palette - contains all the elements that are available within Rosetta for the creation of a Rosetta Scripts protocol. (Movers, Filters, TaskOperations and Control Structure movers (currently, there is only IFMover)
3. The Properties section - displays relevant information in the form of a key-value pairs for elements that are selected in the diagram. These pairs are actually the attributes that appear in the XML tags of the elements in the Rosetta Scripts code. The *Add Attribute* button adds another key-value pair , that is also added to the element's tag in the XML file. All these sections appear when the mouse hover them , and retract once no longer needed.
4. The Canvas - the area in which the diagram is drawn.

The workspace can be zoomed in/out with the mouse wheel and dragged by the usual means (left mouse button).
	
Creating a protocol
--------------------

In order to add elements (movers/filters/task operations) to the diagram, simply click on the corresponding element in the palette. The element should then appear as a colored rectangle on the canvas:	
![Diagram Elements](https://raw.github.com/LiorZ/RosettaDiagrams/master/readme_files/elements.png)
Each type of element has a different color. Movers appear green, filters are orange and task operations are blue. Control structures (IFMover for example) appear red.

A Rosetta Scripts protocol usually has a well-defined sequence. This sequence is usually composed of movers and filters. A mover typically alters the structure of the *pose* , a filter usually discards simulations in which a certain condition doesn't hold. Task operations which are essentially just instructions to the packer and don't alter the sequence of a protocol. 
In the following figure, the Docking mover will be applied to the pose , and then the Ddg filter.
![Diagram Connection](https://raw.github.com/LiorZ/RosettaDiagrams/master/readme_files/connection.png)

To form a connection between elements, hover the *source* element (the one that should be applied first) , click the arrow button in the menu that pops up. Then, click the *target* element.
![Diagram Connection](https://raw.github.com/LiorZ/RosettaDiagrams/master/readme_files/form_connection.png)

Now, notice the change in the Rosetta Script code, in the Code section:
<pre>
	&lt;ROSETTASCRIPTS&gt;
		&lt;SCOREFXNS&gt;&lt;/SCOREFXNS&gt;
		&lt;TASKOPERATIONS&gt;&lt;/TASKOPERATIONS&gt;
		&lt;FILTERS&gt;
			&lt;Ddg name=&quot;element_1&quot; /&gt;
		&lt;/FILTERS&gt;
		&lt;MOVERS&gt;
			&lt;Docking name=&quot;element_0&quot; /&gt;
		&lt;/MOVERS&gt;
		&lt;APPLY_TO_POSE&gt;&lt;/APPLY_TO_POSE&gt;
		&lt;PROTOCOLS&gt;
			&lt;Add mover_name=element_0/&gt;
			&lt;Add filter_name=element_1/&gt;
		&lt;/PROTOCOLS&gt;
	&lt;/ROSETTASCRIPTS&gt;
	
</pre>
In the *Properties Section* we can modify the attributes of each element in the diagram. For example , in the above example we can enter a threshold for the Ddg filter to serve as cutoff, or change some of the attributes of the Docking mover such as fullatom (true/false or 1/0). To bring up the properties simply click on the element you want to change and hover with your mouse over the **Properties** rectangle in the bottom of the screen.  
The *Add Attribute* button allows you to add your own attribute if there is one that is not listed in the table.
![Properties section](https://raw.github.com/LiorZ/RosettaDiagrams/master/readme_files/properties_section.png)

To remove an element, simply click the trash can logo on the menu.

Subdiagrams
------------
Some movers in Rosetta can contain nested elements as part of their operation. A good example for one of these elements is the MetropolisHastings mover which can have nested movers in one of the following 2 ways:

1. Defining the movers within MetropolisHastings:
<pre>
	&lt; MetropolisHastings ... &gt;
	  &lt; Backrub sampling_weight=(1 &Real) .../&gt;
	&lt; /MetropolisHastings &gt;
</pre>
2. Referencing previously defined movers:
<pre>
	&lt;Backrub name=backrub .../&gt;
	&lt;MetropolisHastings ...&gt;
	  &lt;Add mover_name=backrub sampling_weight=(1 &Real)/&gt;
	&lt;/MetropolisHastings &gt;
</pre>

RosettaDiagrams supports nested movers in the form of Subdiagrams in the second format described above. To create a subdiagram and add nested elements, click the subdiagram icon in the menu:
![Subdiagram menu item](https://raw.github.com/LiorZ/RosettaDiagrams/master/readme_files/subdiagram_icon.png)
Upon clicking , a new canvas will appear where new elements could be added and a new flow could be defined.
![Subdiagram menu item](https://raw.github.com/LiorZ/RosettaDiagrams/master/readme_files/subdiagram_annotated.png)
