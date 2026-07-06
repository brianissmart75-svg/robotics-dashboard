export const QUIZZES = {
  "YouTube FRC Research": {
    "Level 1": [
      { question: "What is the primary purpose of researching previous FRC games?", options: ["To copy another team's robot exactly.", "To identify successful mechanisms and strategies for specific tasks.", "To find out which teams have the highest budgets.", "To memorize the rulebook from past years."], correctAnswer: 1 },
      { question: "When watching a match video, what should you focus on to evaluate a robot's effectiveness?", options: ["The color of their bumpers.", "Cycle times and reliability under defense.", "How loud their cheering section is.", "The type of camera they are using."], correctAnswer: 1 },
      { question: "Why is it important to document your research findings?", options: ["So you can prove you watched the videos.", "To share insights with the team and avoid repeating mistakes.", "To get a grade for the class.", "To have a longer engineering notebook."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "What should you look for when analyzing autonomous routines of top teams?", options: ["Which music is playing.", "The starting position and consistency of scoring.", "How many people are driving.", "The brand of laptop they use."], correctAnswer: 1 },
      { question: "When reviewing match footage, why is looking at 'defense' important?", options: ["To see who got a penalty.", "To understand how effectively a robot can score under pressure and resist being pushed.", "To see the referees.", "To copy their defensive driving style exactly without thought."], correctAnswer: 1 },
      { question: "How does scouting data complement video research?", options: ["It provides quantitative data (numbers) to support qualitative observations (video).", "It replaces video entirely.", "It makes the videos load faster.", "It prevents other teams from watching you."], correctAnswer: 0 }
    ]
  },
  "Onshape CAD": {
    "Level 1": [
      { question: "What does CAD stand for?", options: ["Computer-Aided Design", "Central Automated Drafting", "Computer-Aided Driving", "Centralized Assembly Drawing"], correctAnswer: 0 },
      { question: "In Onshape, what is a 'Part Studio' used for?", options: ["Putting multiple parts together to see how they move.", "Creating and editing individual 3D parts.", "Rendering realistic images of the robot.", "Writing the code to control the robot."], correctAnswer: 1 },
      { question: "Why do we use 'Mates' in an Assembly?", options: ["To change the color of the parts.", "To define how parts connect and move relative to each other.", "To measure the weight of the robot.", "To export the files for 3D printing."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "What is the primary benefit of Onshape being cloud-based?", options: ["It requires a massive gaming computer.", "Multiple users can collaborate and edit the same document simultaneously.", "It works without the internet.", "It deletes files after 24 hours."], correctAnswer: 1 },
      { question: "Which feature is used to turn a 2D sketch into a 3D solid?", options: ["Extrude", "Mate", "Fillet", "Dimension"], correctAnswer: 0 },
      { question: "What is a 'Sketch' in CAD software?", options: ["A rough drawing on paper.", "A 2D profile used as the foundation for 3D features.", "A painted texture.", "A type of motor bracket."], correctAnswer: 1 }
    ]
  },
  "Tinkercad": {
    "Level 1": [
      { question: "Tinkercad is primarily based on what type of modeling?", options: ["Writing complex code.", "Combining basic geometric shapes (primitives).", "2D sketching.", "Virtual reality sculpting."], correctAnswer: 1 },
      { question: "How do you create a hole in a solid object in Tinkercad?", options: ["Use the 'Drill' tool.", "Select an object, change its property to 'Hole', and group it with the solid object.", "Delete faces of the object.", "It is not possible to create holes in Tinkercad."], correctAnswer: 1 },
      { question: "What file format is most commonly exported from Tinkercad for 3D printing?", options: [".DOCX", ".JPG", ".STL", ".MP4"], correctAnswer: 2 }
    ],
    "Level 2": [
      { question: "What happens when you 'Group' two solid shapes in Tinkercad?", options: ["They change color.", "They combine into a single, unified 3D object.", "They disappear.", "They become holes."], correctAnswer: 1 },
      { question: "Which feature allows you to align multiple objects perfectly on an axis?", options: ["The Ruler tool.", "The Align tool.", "The Hole tool.", "The Color picker."], correctAnswer: 1 },
      { question: "What is the 'Workplane' in Tinkercad?", options: ["The surface where you drag and drop shapes to build your design.", "A tool to send the file to the printer.", "The internet connection.", "The name of the save button."], correctAnswer: 0 }
    ]
  },
  "Drive Time": {
    "Level 1": [
      { question: "What is 'Tank Drive'?", options: ["A drivetrain where the left and right sides are controlled independently.", "A drivetrain that can move sideways.", "A drivetrain with only two wheels.", "A drivetrain shaped like a tank."], correctAnswer: 0 },
      { question: "Why is practice driving essential before a competition?", options: ["To burn out the motors so they run smoother.", "To develop muscle memory and situational awareness.", "To test how fast the robot can crash into a wall.", "So the programmer doesn't have to write autonomous code."], correctAnswer: 1 },
      { question: "When communicating with your drive coach during a match, what is most important?", options: ["Arguing about the strategy.", "Keeping quiet so you can concentrate.", "Clear, concise communication about field status and strategy execution.", "Looking at the audience."], correctAnswer: 2 }
    ],
    "Level 2": [
      { question: "What is a 'Swerve Drive'?", options: ["A drive base that can only move forwards.", "A highly maneuverable drivetrain where all wheels can independently steer and drive.", "A drive base with exactly three wheels.", "A drive base using tank treads."], correctAnswer: 1 },
      { question: "Why might a driver intentionally lower their robot's max speed using software controls?", options: ["To make the battery last longer during practice.", "To allow for finer, more precise movements when scoring.", "Because the judges penalize fast robots.", "To make the match last longer."], correctAnswer: 1 },
      { question: "In FRC, what is the role of the Human Player relative to the Driver?", options: ["To control the secondary mechanisms.", "To introduce game pieces onto the field and communicate field timing to the drive team.", "To fix the robot if it breaks.", "To code the autonomous routine."], correctAnswer: 1 }
    ]
  },
  "Fusion 360": {
    "Level 1": [
      { question: "What is Fusion 360 primarily used for?", options: ["Editing videos.", "Parametric 3D CAD modeling and mechanical design.", "Writing robot code.", "Creating websites."], correctAnswer: 1 },
      { question: "What is the difference between a Body and a Component in Fusion 360?", options: ["A body is a single continuous 3D shape, while a component can contain multiple bodies and has its own origin for assemblies.", "They are exactly the same thing.", "A body is used for 2D sketches and a component is for 3D.", "Components are only used for electrical parts."], correctAnswer: 0 },
      { question: "Which workspace is used to turn 3D models into physical parts via 3D printing or CNC?", options: ["Design Workspace", "Render Workspace", "Manufacture Workspace", "Animation Workspace"], correctAnswer: 2 }
    ]
  },
  "WPILib Coding": {
    "Level 1": [
      { question: "What programming languages are primarily supported by WPILib for FRC?", options: ["Python, JavaScript, HTML", "C++, Java, Python", "Ruby, Swift, Go", "Scratch, Blockly"], correctAnswer: 1 },
      { question: "What is the purpose of the robotInit() method in a standard FRC robot program?", options: ["It runs repeatedly during the autonomous period.", "It runs exactly once when the robot first turns on.", "It controls the drive motors.", "It shuts down the robot safely."], correctAnswer: 1 },
      { question: "In command-based programming, what is a 'Subsystem'?", options: ["A specific action the robot performs (like shooting a ball).", "A logical grouping of hardware (like a drivetrain or an intake).", "The joystick used by the driver.", "A backup battery."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "What does the teleopPeriodic() method do?", options: ["Runs code once before autonomous starts.", "Executes repeatedly at 50Hz during the driver-controlled portion of the match.", "Compiles the Java code.", "Initializes the motors."], correctAnswer: 1 },
      { question: "What is a 'Command' in the WPILib Command-Based framework?", options: ["A file that stores all passwords.", "A state machine that represents an action or behavior the robot can execute.", "The steering wheel for the driver.", "A variable that stores the battery voltage."], correctAnswer: 1 },
      { question: "Why is source control (like Git/GitHub) crucial for WPILib coding?", options: ["It makes the code run faster.", "It allows multiple programmers to collaborate, track changes, and revert to working versions if something breaks.", "It is required to connect to the RoboRIO.", "It translates Java into C++ automatically."], correctAnswer: 1 }
    ]
  },
  "FRC Driver Station": {
    "Level 1": [
      { question: "What is the main function of the FRC Driver Station software?", options: ["To write and compile robot code.", "To CAD the robot.", "To communicate with the robot, enable/disable it, and view diagnostics.", "To design the team's website."], correctAnswer: 2 },
      { question: "If the Driver Station shows 'No Robot Communication', what is the most likely first step to troubleshoot?", options: ["Rewrite the robot code.", "Check the ethernet/wifi connection between the laptop and the robot radio.", "Replace the battery in the joystick.", "Update the computer's operating system."], correctAnswer: 1 },
      { question: "What does the 'Enable' button do?", options: ["Turns on the laptop.", "Allows the robot to execute code and move its actuators.", "Connects the joystick to the computer.", "Downloads the code to the RoboRIO."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "Where would you look in the Driver Station to see console printouts and errors from your code?", options: ["The Setup tab.", "The Diagnostics tab / Console Output.", "The USB tab.", "The Power tab."], correctAnswer: 1 },
      { question: "What happens if you press the 'Spacebar' while the robot is enabled?", options: ["The robot scores a point.", "The Driver Station emergency disables (E-Stops) the robot.", "The autonomous mode starts.", "The laptop goes to sleep."], correctAnswer: 1 },
      { question: "What indicates a healthy connection on the Driver Station UI?", options: ["All red lights.", "Green indicators for Communication, Robot Code, and Joysticks.", "The laptop battery icon flashing.", "The screen turning black."], correctAnswer: 1 }
    ]
  },
  "RoboRIO Config": {
    "Level 1": [
      { question: "What is the RoboRIO?", options: ["The main battery of the robot.", "The central 'brain' or main controller of an FRC robot.", "The radio that connects to the wifi.", "The motor controller."], correctAnswer: 1 },
      { question: "Why do you need to 'image' a RoboRIO?", options: ["To take a picture of it for the engineering notebook.", "To install the correct operating system and firmware required for the current FRC season.", "To wipe the hard drive to save space.", "To change the color of its LEDs."], correctAnswer: 1 },
      { question: "What is the default IP address of the RoboRIO when connected via USB?", options: ["10.TE.AM.2", "192.168.1.1", "172.22.11.2", "8.8.8.8"], correctAnswer: 2 }
    ],
    "Level 2": [
      { question: "Which tool is officially used to set the team number on the RoboRIO?", options: ["WPILib VS Code", "RoboRIO Imaging Tool", "FRC Driver Station", "Phoenix Tuner"], correctAnswer: 1 },
      { question: "What connects to the PWM ports on the RoboRIO?", options: ["Sensors like encoders.", "Older motor controllers and servos.", "The radio.", "The main power breaker."], correctAnswer: 1 },
      { question: "If the RoboRIO Comm LED is solid red, what does it usually mean?", options: ["Everything is working perfectly.", "There is a fault, or no code is currently running/crashing.", "It is connected to the internet.", "The battery is fully charged."], correctAnswer: 1 }
    ]
  },
  "Encoders & Sensors": {
    "Level 1": [
      { question: "What does an encoder measure?", options: ["Temperature of a motor.", "Distance, speed, or position by tracking the rotation of a shaft.", "Voltage of the battery.", "Distance to an object using sound waves."], correctAnswer: 1 },
      { question: "Which sensor would be best for detecting the distance to a wall?", options: ["Limit Switch", "Encoder", "Ultrasonic Sensor or LiDAR", "Gyroscope"], correctAnswer: 2 },
      { question: "What is the primary purpose of a Limit Switch?", options: ["To tell the code when a mechanism has reached the physical end of its travel.", "To measure how fast a wheel is spinning.", "To keep the robot driving perfectly straight.", "To limit the amount of battery power used."], correctAnswer: 0 }
    ],
    "Level 2": [
      { question: "What does a Gyroscope (or IMU) measure on a robot?", options: ["The weight of the robot.", "The angular rate of rotation and robot heading (angle).", "The distance to the closest game piece.", "The temperature of the RoboRIO."], correctAnswer: 1 },
      { question: "What is the difference between an absolute and incremental encoder?", options: ["Absolute encoders know their exact position upon startup; incremental only track changes.", "Absolute encoders are heavier.", "Incremental encoders use lasers.", "Absolute encoders are only used for driving."], correctAnswer: 0 },
      { question: "Why might a sensor reading be 'noisy' or fluctuating?", options: ["The code is running too fast.", "Electrical interference, mechanical vibration, or poor wiring.", "The battery is too full.", "Sensors always return perfect data."], correctAnswer: 1 }
    ]
  },
  "Frame Construction": {
    "Level 1": [
      { question: "Why is using 'gussets' important when building a robot frame?", options: ["They make the robot look cooler.", "They reinforce joints and corners, making the frame stronger.", "They reduce the weight of the robot.", "They hold the battery in place."], correctAnswer: 1 },
      { question: "What is a 'rivet' used for?", options: ["Transmitting power from a motor to a wheel.", "Measuring the length of a piece of metal.", "Fastening two pieces of material together permanently.", "Lubricating gears."], correctAnswer: 2 },
      { question: "Why should you ensure your frame is square and true?", options: ["So the drivetrain works efficiently and the robot drives straight.", "Because the judges prefer square robots.", "To maximize the weight of the robot.", "To make it easier to paint."], correctAnswer: 0 }
    ],
    "Level 2": [
      { question: "What is the advantage of using aluminum box tubing for an FRC frame?", options: ["It is the heaviest material available.", "It provides a high strength-to-weight ratio and is easy to drill and assemble.", "It is completely flexible.", "It rusts easily, giving a cool aesthetic."], correctAnswer: 1 },
      { question: "When assembling a frame, why might you use locknuts (Nyloc) instead of regular nuts?", options: ["They are cheaper.", "The nylon insert prevents them from vibrating loose during a match.", "They conduct electricity better.", "They look shiny."], correctAnswer: 1 },
      { question: "What does the phrase 'measure twice, cut once' mean in construction?", options: ["Always cut pieces shorter than needed.", "Double-check your measurements before making irreversible cuts to avoid wasting material.", "Cut the piece into two pieces.", "Use two different measuring tapes."], correctAnswer: 1 }
    ]
  },
  "Weight Management": {
    "Level 1": [
      { question: "What is the typical maximum weight limit for an FRC robot (excluding battery and bumpers)?", options: ["50 lbs", "100 lbs", "125 lbs", "150 lbs"], correctAnswer: 2 },
      { question: "How can you use Onshape to help with weight management?", options: ["By assigning materials to parts to automatically calculate the total mass.", "Onshape cannot help with weight management.", "By stretching the parts to look thinner on screen.", "By exporting the files to a spreadsheet."], correctAnswer: 0 },
      { question: "Which of the following is a common method for removing excess weight from a robot part without losing too much strength?", options: ["Switching all metal parts to plastic.", "Pocketing or drilling lightening holes in non-structural areas.", "Removing the battery.", "Using fewer wheels on the drivetrain."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "Why should you weigh individual subsystems (like an intake) before assembling the whole robot?", options: ["To find out which one is the heaviest.", "To track weight allocation against your CAD model to ensure you don't exceed the final limit.", "To balance them on a scale for a photo.", "Subsystems shouldn't be weighed."], correctAnswer: 1 },
      { question: "What is the consequence of exceeding the 125 lb limit at competition inspection?", options: ["You get a small point penalty in matches.", "You are praised for building a heavy robot.", "You will not pass inspection and cannot compete until weight is removed.", "You have to drive slower."], correctAnswer: 2 },
      { question: "Which material is often swapped out for Polycarbonate (Lexan) to save weight?", options: ["Foam", "Heavy aluminum or steel plates.", "Wood", "Carbon Fiber"], correctAnswer: 1 }
    ]
  },
  "Robot Build": {
    "Level 1": [
      { question: "What is an 'Everybot'?", options: ["A robot that can play every game.", "A low-cost, effective, and accessible robot design released publicly to help teams.", "A robot built by everyone on the team.", "A fully autonomous robot."], correctAnswer: 1 },
      { question: "During an initial robot build, what is a 'prototype'?", options: ["The final painted robot.", "A quick, temporary version of a mechanism built to test a concept.", "The CAD drawing.", "The battery charger."], correctAnswer: 1 },
      { question: "Why is wiring management (like using zip ties and wire loom) important on a finished build?", options: ["It prevents wires from getting caught in moving parts and makes troubleshooting easier.", "It makes the robot heavier.", "It uses up spare zip ties.", "It makes the code run faster."], correctAnswer: 0 }
    ],
    "Level 2": [
      { question: "What should you always wear when cutting or grinding metal during the build?", options: ["Headphones", "Safety Glasses", "A watch", "Sandals"], correctAnswer: 1 },
      { question: "What is the purpose of 'Bumpers' on an FRC robot?", options: ["To make the robot look colorful.", "To protect the robot structure and other robots during collisions.", "To hide the wheels from view.", "To hold extra batteries."], correctAnswer: 1 },
      { question: "When mounting a motor, why is ensuring proper gear meshing critical?", options: ["To make sure the gears look shiny.", "To ensure efficient power transfer and prevent the gears from stripping or breaking.", "To slow down the motor.", "So the robot is louder."], correctAnswer: 1 }
    ]
  },
  "PedroPathing": {
    "Level 1": [
      { question: "What is PedroPathing primarily used for in FTC?", options: ["Designing 3D models.", "A library for advanced path following and autonomous navigation.", "Controlling the brightness of LEDs.", "Managing team finances."], correctAnswer: 1 },
      { question: "When tuning PIDF for PedroPathing, what does the 'P' stand for?", options: ["Proportional", "Power", "Predictive", "Pathing"], correctAnswer: 0 },
      { question: "Why is multitasking important in FTC Autonomous programs?", options: ["It allows the robot to drive and move mechanisms (like an arm or intake) at the same time.", "It helps the driver hold two controllers.", "It makes the code file size smaller.", "It prevents the battery from draining quickly."], correctAnswer: 0 }
    ],
    "Level 2": [
      { question: "What is a 'PathChain' in the context of PedroPathing?", options: ["A physical chain on the robot's drivetrain.", "A sequence of connected paths for the robot to follow smoothly in autonomous.", "A security feature to protect the code.", "A list of errors in the console."], correctAnswer: 1 },
      { question: "What is the purpose of 'tuning' PedroPathing?", options: ["To make the robot play a song.", "To calibrate the software constants so the physical robot accurately follows the physical path.", "To adjust the color of the robot's camera.", "To increase the top speed of the motors past their physical limit."], correctAnswer: 1 },
      { question: "Which coordinate system does PedroPathing rely on to know where the robot is?", options: ["GPS", "Odometry (using dead wheels or drive encoders).", "Sonar", "Wi-Fi triangulation"], correctAnswer: 1 }
    ]
  },
  "Pinpoint Odometry": {
    "Level 1": [
      { question: "What is the primary function of the goBILDA Pinpoint Odometry Computer?", options: ["To control the motors directly.", "To provide highly accurate robot localization (X, Y, and Heading) without burdening the main Control Hub.", "To measure the battery voltage.", "To connect to the Driver Station Wi-Fi."], correctAnswer: 1 },
      { question: "Why is 'dead-wheel' odometry often preferred over drive wheel encoders?", options: ["Because it's cheaper.", "Because dead wheels are not driven by motors, they are less susceptible to wheel slip.", "Because dead wheels make the robot drive faster.", "Because they look cooler on the robot."], correctAnswer: 1 },
      { question: "What sensors does the Pinpoint computer combine to determine the robot's pose?", options: ["Camera and LIDAR.", "Two optical/magnetic encoders (for X and Y movement) and an IMU (gyroscope).", "Ultrasonic sensors and bump switches.", "GPS and cellular towers."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "How does the Pinpoint computer communicate with the FTC Control Hub?", options: ["Via Bluetooth.", "Using an I2C connection.", "Using a standard USB cable.", "It doesn't communicate; it acts completely independently."], correctAnswer: 1 },
      { question: "When installing odometry pods, why is the physical measurement (offsets from the center of rotation) critical?", options: ["To make sure the pods don't hit the ground.", "Because the math used to calculate heading relies on knowing exactly where the pods are.", "To ensure the robot fits within the sizing box.", "To balance the weight perfectly."], correctAnswer: 1 },
      { question: "What is 'localization' in the context of autonomous programming?", options: ["Translating the app into different languages.", "The process of the robot determining its exact position and orientation on the field.", "Finding the closest game piece.", "The robot's ability to drive straight."], correctAnswer: 1 }
    ]
  },
  "Bambu Labs 3D Printing": {
    "Level 1": [
      { question: "What is a key advantage of Bambu Labs 3D printers?", options: ["They only print in black.", "High speed and multi-color printing capabilities.", "They do not require electricity.", "They are made entirely of wood."], correctAnswer: 1 },
      { question: "What does the AMS (Automatic Material System) do?", options: ["It automatically orders more filament from the internet.", "It allows for automated multi-color and multi-material printing.", "It washes the build plate.", "It measures the humidity in the room."], correctAnswer: 1 },
      { question: "How does bed leveling work on most Bambu Lab printers?", options: ["You have to manually turn screws under the bed with a piece of paper.", "It is done automatically using sensors like LiDAR or force sensors.", "You hit it with a hammer until it is flat.", "It does not need a level bed."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "What is a common cause of a clogged nozzle?", options: ["Printing too slowly.", "Heat creep or dirty filament.", "Using the wrong color.", "Connecting to Wi-Fi."], correctAnswer: 1 },
      { question: "How does the flow dynamics calibration work?", options: ["It uses a scale to weigh the filament.", "It uses LiDAR to inspect extruded lines for perfect extrusion consistency.", "It listens to the sound of the motor.", "It asks the user to manually measure the lines."], correctAnswer: 1 },
      { question: "Which build plate is generally best for printing PLA on a Bambu Lab printer?", options: ["A sheet of glass.", "Textured PEI or the Cool Plate.", "Cardboard.", "Aluminum foil."], correctAnswer: 1 }
    ]
  },
  "Filament Types (TPU/PETG)": {
    "Level 1": [
      { question: "What does TPU stand for?", options: ["Tough Plastic Unit", "Thermoplastic Polyurethane, a flexible filament", "Thermal Polymer Utility", "Textured Printing Underlay"], correctAnswer: 1 },
      { question: "What is a primary characteristic of PETG compared to PLA?", options: ["It is much weaker.", "It is stronger, slightly flexible, and has higher temperature resistance.", "It is a liquid.", "It is only available in transparent colors."], correctAnswer: 1 },
      { question: "Why is it critical to keep TPU dry before printing?", options: ["Because it is highly hygroscopic (absorbs moisture), which causes popping and poor prints.", "Because it will melt at room temperature.", "Because water makes it change color.", "Because dry TPU prints faster."], correctAnswer: 0 }
    ],
    "Level 2": [
      { question: "What happens if you try to print TPU too fast?", options: ["The print becomes invisible.", "The flexible filament can buckle inside the extruder path and cause a jam.", "The printer will overheat.", "The TPU turns into PLA."], correctAnswer: 1 },
      { question: "When would you choose PETG over PLA for an FRC robot part?", options: ["When you need the part to be as brittle as possible.", "When the part needs higher impact resistance and heat tolerance (like near motors).", "When you want the part to dissolve in water.", "When weight doesn't matter at all."], correctAnswer: 1 },
      { question: "What is a common printing challenge associated with PETG?", options: ["It won't stick to the bed at all.", "Stringing and oozing due to its sticky nature.", "It prints too perfectly.", "It requires a 300 degree Celsius nozzle."], correctAnswer: 1 }
    ]
  },
  "CNC Machine Basics": {
    "Level 1": [
      { question: "What does CNC stand for?", options: ["Computer Numerical Control", "Centralized Network Computer", "Cutting 'N' Carving", "Computerized Node Cutting"], correctAnswer: 0 },
      { question: "What is the primary function of an end mill?", options: ["To hold the material in place.", "To cut and remove material from a workpiece as it rotates.", "To cool down the machine.", "To measure the dimensions of the part."], correctAnswer: 1 },
      { question: "What is the purpose of 'zeroing' a CNC machine?", options: ["To turn it off safely.", "To set the starting point or origin (X, Y, Z coordinates) for the toolpath.", "To clear the memory.", "To sharpen the tools."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "What is the difference between climb milling and conventional milling?", options: ["Climb milling is only for plastics.", "Climb milling pulls the tool into the material for a better finish but requires a rigid machine.", "Conventional milling is faster.", "They are exactly the same thing."], correctAnswer: 1 },
      { question: "What does 'feed rate' refer to in CNC machining?", options: ["How fast the spindle rotates.", "The speed at which the cutting tool advances through the material.", "The amount of electricity the machine uses.", "The cost of the material."], correctAnswer: 1 },
      { question: "Why is using coolant or lubricant often important when milling metals like aluminum?", options: ["To make the part smell better.", "To reduce heat, prevent tool wear, and clear chips away from the cut.", "To make the metal softer.", "To change the color of the metal."], correctAnswer: 1 }
    ]
  },
  "Graphite CNC Machining": {
    "Level 1": [
      { question: "What is machined graphite commonly used for in manufacturing?", options: ["Making pencils.", "Creating electrodes for EDM (Electrical Discharge Machining).", "Building robot frames.", "Lubricating gears."], correctAnswer: 1 },
      { question: "Why is dust collection absolutely critical when machining graphite?", options: ["To keep the shop looking nice.", "Graphite dust is highly abrasive, conductive, and can severely damage machine electronics if it settles on them.", "Because it smells bad.", "To recycle the dust into new blocks."], correctAnswer: 1 },
      { question: "Does machining graphite typically require cutting fluid or liquid coolant?", options: ["Yes, lots of it.", "No, it is typically machined dry to prevent creating an abrasive, messy slurry.", "Only on Tuesdays.", "Yes, but only water."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "What type of cutting tools are best suited for machining graphite?", options: ["Soft wood-cutting blades.", "Diamond-coated tools to resist rapid wear from the highly abrasive material.", "Standard High-Speed Steel (HSS).", "Plastic tools."], correctAnswer: 1 },
      { question: "How does the machinability of graphite compare to steel?", options: ["It is much easier to cut but highly brittle and prone to chipping/breakout at edges.", "It is much harder and requires more force.", "It is exactly the same.", "It melts when you cut it."], correctAnswer: 0 },
      { question: "In a high-level FRC context, why might a team be interested in graphite machining?", options: ["To make their robot heavier.", "For highly specialized custom applications, though it is quite rare compared to aluminum or plastics.", "To write on the field.", "To fuel a steam engine."], correctAnswer: 1 }
    ]
  },
  "Metal 3D Printing (Steel)": {
    "Level 1": [
      { question: "What is the most common technology used for metal 3D printing in industry?", options: ["FDM (Fused Deposition Modeling)", "SLA (Stereolithography)", "SLM/DMLS (Selective Laser Melting)", "Paper layering"], correctAnswer: 2 },
      { question: "Why is metal 3D printing typically more expensive than plastic 3D printing?", options: ["Material costs", "Machine complexity and maintenance", "Safety requirements like inert gas environments", "All of the above"], correctAnswer: 3 },
      { question: "What is a 'support structure' in metal 3D printing primarily used for?", options: ["Making the part look cool.", "Anchoring the part to the build plate and dissipating intense heat.", "Adding extra weight.", "Holding the printer together."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "What is the purpose of the inert gas environment (like Argon) in a metal 3D printer chamber?", options: ["To prevent the metal powder from oxidizing or catching fire when melted by the laser.", "To cool down the laser.", "To make the metal shiny.", "To speed up the printing process."], correctAnswer: 0 },
      { question: "Why do metal 3D printed parts often require post-processing like heat treatment?", options: ["To melt them down again.", "To relieve residual internal stresses caused by rapid heating and cooling.", "To change their color.", "To make them magnetic."], correctAnswer: 1 },
      { question: "What is 'binder jetting' in metal 3D printing?", options: ["Using a laser to melt metal.", "A process where a liquid binding agent is selectively deposited to join powder particles, requiring later sintering in a furnace.", "Gluing metal plates together.", "Printing with liquid metal."], correctAnswer: 1 }
    ]
  },
  "Carbon Fiber 3D Printing": {
    "Level 1": [
      { question: "When a filament is described as 'Carbon Fiber filled' (like CF-PLA or CF-Nylon), what does that actually mean?", options: ["It is made 100% of carbon.", "Chopped carbon fiber strands are mixed into the plastic base material.", "It is painted black.", "It is extremely heavy."], correctAnswer: 1 },
      { question: "Why do people print with Carbon Fiber infused filaments?", options: ["To make the part completely unbreakable.", "To increase the stiffness, rigidity, and dimensional stability of the part.", "To make it flexible.", "To make it transparent."], correctAnswer: 1 },
      { question: "What hardware upgrade is absolutely necessary to print with Carbon Fiber filament?", options: ["A heated chamber.", "A hardened steel or ruby nozzle, because CF is highly abrasive and will quickly destroy a brass nozzle.", "A larger build plate.", "A faster motor."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "Does adding chopped carbon fiber to a filament significantly increase its tensile strength (resistance to breaking when pulled)?", options: ["Yes, it makes it 10x stronger.", "No, it primarily increases stiffness and brittleness; continuous carbon fiber is needed for high tensile strength.", "It decreases the strength completely.", "It only works on Tuesdays."], correctAnswer: 1 },
      { question: "What is Continuous Carbon Fiber 3D printing?", options: ["Printing without ever stopping.", "A process that lays down a continuous, unbroken strand of carbon fiber inside the plastic matrix, drastically increasing strength.", "Printing extremely long parts.", "Using a very large spool of filament."], correctAnswer: 1 },
      { question: "Why might a CF-Nylon part warp during printing?", options: ["Because it is too heavy.", "Nylon is highly susceptible to shrinking as it cools, often requiring a heated chamber or enclosure to manage temperature.", "Because the carbon fiber pushes it.", "Because it absorbs light."], correctAnswer: 1 }
    ]
  },
  "UV Resin 3D Printing": {
    "Level 1": [
      { question: "How does a UV Resin 3D printer create parts?", options: ["By melting plastic wire.", "By cutting sheets of paper.", "By using a UV light source to cure and harden liquid photopolymer resin layer by layer.", "By squirting liquid metal."], correctAnswer: 2 },
      { question: "What are the two main post-processing steps required immediately after a resin print finishes?", options: ["Sanding and painting.", "Washing the uncured resin off with IPA/alcohol, and final curing under a UV light.", "Heating in an oven and cooling in water.", "Removing supports and throwing them away."], correctAnswer: 1 },
      { question: "Why must you wear gloves and a mask when handling liquid UV resin?", options: ["Because it is sticky.", "Because it is expensive.", "Because it is toxic, a skin irritant, and emits harmful fumes.", "To keep your hands warm."], correctAnswer: 2 }
    ],
    "Level 2": [
      { question: "What is the difference between SLA and MSLA (or LCD) resin printers?", options: ["SLA uses a directed laser beam, while MSLA uses an LCD screen to mask a UV LED array, curing entire layers at once.", "There is no difference.", "SLA is for metal, MSLA is for plastic.", "SLA is faster."], correctAnswer: 0 },
      { question: "What is 'hollowing' and why is it important in resin printing?", options: ["Making holes in the part for screws.", "Making a solid model hollow to save expensive resin and reduce suction forces on the FEP film during printing.", "Making the part lighter to throw.", "Making the part transparent."], correctAnswer: 1 },
      { question: "Why must hollowed resin models have drain holes?", options: ["To make them aerodynamic.", "To allow trapped liquid resin and washing alcohol to escape, preventing the model from cracking or exploding later due to off-gassing.", "To save weight.", "To look better."], correctAnswer: 1 }
    ]
  },
  "Custom Robot Parts (vs Kitbot)": {
    "Level 1": [
      { question: "What is the 'Kitbot' (or AM14U) in FRC?", options: ["A robot you buy at the store.", "The standard, reliable drivetrain chassis provided to teams in the kickoff kit.", "A custom swerve drive.", "A robot built by another team."], correctAnswer: 1 },
      { question: "Why might a team choose to use the Kitbot instead of designing a custom drivetrain?", options: ["Because they have to.", "It saves weeks of design/build time, is highly reliable, and allows the team to focus on scoring mechanisms.", "It is the fastest drivetrain available.", "It is invisible to the opposing alliance."], correctAnswer: 1 },
      { question: "What is a primary risk of designing a custom drivetrain from scratch?", options: ["It might be too colorful.", "It may take too long to build, leaving no time for driver practice or programming.", "It will definitely break in the first match.", "It uses too much electricity."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "When is a custom drivetrain typically justified in FRC?", options: ["When the team wants to look cool.", "When the game terrain or specific strategic requirements cannot be met by the standard Kitbot, such as needing swerve drive for extreme maneuverability.", "When the team has extra money to spend.", "When they lost the Kitbot."], correctAnswer: 1 },
      { question: "How does using standard COTS (Commercial Off-The-Shelf) parts benefit custom robot design?", options: ["They are proven, easily replaceable, and reduce the need for complex in-house manufacturing.", "They are heavier.", "They are always cheaper than making them.", "They guarantee a win."], correctAnswer: 0 },
      { question: "What is a commonly accepted 'Golden Rule' of FRC robot design when considering custom parts vs kit parts?", options: ["Always build everything from scratch.", "Steal from the best, invent the rest: Only design custom parts when no off-the-shelf solution exists for your specific need.", "Never use COTS parts.", "Always copy last year's robot."], correctAnswer: 1 }
    ]
  },
  "FTC Rules Quiz": {
    "Level 1": [
      { question: "In FTC, what is the maximum starting size of the robot?", options: ["18 x 18 x 18 inches", "20 x 20 x 20 inches", "24 x 24 x 24 inches", "No size limit"], correctAnswer: 0 },
      { question: "During the Autonomous period, how does the robot operate?", options: ["Controlled by the driver.", "Pre-programmed instructions and sensors only.", "Controlled by the coach.", "By remote control."], correctAnswer: 1 },
      { question: "What is the primary safety rule in the pit area?", options: ["Running is allowed.", "Safety glasses are required at all times.", "No eating.", "Music must be loud."], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "What is the consequence of intentionally damaging an opposing robot?", options: ["A warning.", "A Yellow Card or Red Card.", "A point deduction.", "Nothing."], correctAnswer: 1 },
      { question: "Can an FTC robot expand beyond 18x18x18 inches during a match?", options: ["No, never.", "Yes, but only vertically.", "Yes, after the match begins, subject to game-specific rules.", "Yes, but only in the end game."], correctAnswer: 2 }
    ]
  },
  "FRC Rules Quiz": {
    "Level 1": [
      { question: "In FRC, what is the maximum weight of the robot excluding the battery and bumpers?", options: ["100 lbs", "120 lbs", "125 lbs", "150 lbs"], correctAnswer: 2 },
      { question: "What is the standard voltage of an FRC robot battery?", options: ["5V", "12V", "24V", "120V"], correctAnswer: 1 },
      { question: "Who is allowed in the alliance station during a match?", options: ["Up to 4 drive team members.", "The whole team.", "Only the coach.", "Only the drivers."], correctAnswer: 0 }
    ],
    "Level 2": [
      { question: "What does a Yellow Card indicate in FRC?", options: ["A minor violation.", "A warning for egregious robot or team member behavior.", "A bonus point.", "A timeout."], correctAnswer: 1 },
      { question: "During the endgame, what is typically the objective?", options: ["Scoring the most points in the center.", "Performing a specific climbing or balancing task.", "Disabling the opponent.", "Returning to the starting zone."], correctAnswer: 1 }
    ]
  },
  "FTC Current Game Quiz": {
    "Level 1": [
      { question: "What is the primary theme and objective of the current FTC season?", options: ["Racing around a track.", "Scoring game elements into specific high and low targets.", "Building the tallest tower.", "Knocking over opponent robots."], correctAnswer: 1 },
      { question: "How many points is the primary autonomous task worth?", options: ["10 points", "20 points", "30 points", "50 points"], correctAnswer: 1 },
      { question: "What is the name of the main scoring element used in this season's game?", options: ["Ring", "Pixel / Block", "Sphere", "Cone"], correctAnswer: 1 }
    ],
    "Level 2": [
      { question: "What is the specific penalty for controlling more than the allowed number of game elements at one time?", options: ["A warning", "A Minor Penalty per element", "A Major Penalty per element", "Disqualification"], correctAnswer: 1 },
      { question: "During the Endgame, what is the highest scoring action a robot can perform?", options: ["Parking in the designated zone.", "Launching a drone or hanging from the rigging.", "Shooting a game element across the field.", "Blocking the opponent."], correctAnswer: 1 }
    ]
  },
  "FRC Current Game Quiz": {
    "Level 1": [
      { question: "What is the primary theme and objective of the current FRC season (e.g., CRESCENDO/REEFSCAPE)?", options: ["Shooting Notes/Elements into designated targets (Speaker/Amp/Goals).", "Playing soccer with robots.", "Stacking totes.", "Racing to the finish line."], correctAnswer: 0 },
      { question: "During the autonomous period, what is the maximum number of pre-loaded game pieces a robot can start with?", options: ["Zero", "One", "Two", "Three"], correctAnswer: 1 },
      { question: "What action triggers the 'Coopertition' bonus during a qualification match?", options: ["Both alliances scoring a set amount in a specific goal early in the match.", "Giving a high-five to the opposing team.", "Scoring zero points.", "Not moving in auto."], correctAnswer: 0 }
    ],
    "Level 2": [
      { question: "What is the penalty for a robot extending beyond its maximum allowable dimensions while interacting with another robot?", options: ["Foul", "Tech Foul", "Yellow Card", "Red Card"], correctAnswer: 1 },
      { question: "In the final seconds of the match (Endgame), where do robots typically go to earn additional points?", options: ["The human player station.", "The Stage/Climbing Zone.", "The center of the field.", "Their starting position."], correctAnswer: 1 }
    ]
  },
  "Mecanum Wheel Refurbishment": {
    "Level 1": [
      { question: "What is a critical first step when refurbishing a mecanum wheel?", options: ["Throwing the old rollers away.", "Carefully disassembling the side plates to access and inspect the rollers and axles.", "Painting the wheel a new color.", "Using a hammer to loosen the parts."], correctAnswer: 1 },
      { question: "Why is it important to clean the rollers on a mecanum wheel?", options: ["To make them look shiny for the judges.", "To ensure smooth, frictionless rotation which is vital for sideways strafing.", "To add more weight to the robot.", "To change the color of the wheel."], correctAnswer: 1 },
      { question: "When reassembling a mecanum wheel, what is a crucial detail to verify?", options: ["That you have extra screws left over.", "That the rollers are installed in the correct orientation to maintain the 45-degree angle profile.", "That the wheel is permanently glued together.", "That the wheel cannot spin at all."], correctAnswer: 1 }
    ]
  },
  "Swerve Drive Maintenance": {
    "Level 1": [
      { question: "How often should swerve modules be cleaned and re-greased during a competition season?", options: ["Never.", "Only at the end of the year.", "Regularly, especially after intense matches or exposure to carpet debris/dust.", "Every five minutes."], correctAnswer: 2 },
      { question: "What is best practice when applying new grease to swerve gears?", options: ["Pack the gearbox completely full so no air remains.", "Apply an even, light coat to the gear teeth to reduce friction without attracting excessive dirt.", "Use cooking oil instead of grease.", "Apply it only to the outside of the module."], correctAnswer: 1 },
      { question: "Why is it important to check the tension of steering belts or chains in a swerve module?", options: ["To make the robot lighter.", "To prevent skipping, which causes loss of accurate directional control.", "To make the module spin faster.", "To make the robot look more complicated."], correctAnswer: 1 }
    ]
  },
  "Re-gearing a Motor": {
    "Level 1": [
      { question: "When safely opening a planetary gearbox, what must you be particularly careful to avoid?", options: ["Looking directly at it.", "Losing the small sun gears, planet gears, or pins that hold the stages together.", "Using any tools.", "Getting the gearbox cold."], correctAnswer: 1 },
      { question: "Why might a robotics team choose to re-gear a motor?", options: ["To change the color of the motor.", "To trade speed for torque, or torque for speed, depending on what the mechanism needs to do.", "To make the motor use more battery power.", "Because it sounds better."], correctAnswer: 1 },
      { question: "In a planetary gearbox, what is the role of the outer ring gear?", options: ["It provides the electrical power.", "It houses the internal planetary stages and keeps the planet gears engaged and aligned.", "It acts as the main output shaft.", "It connects the motor to the battery."], correctAnswer: 1 }
    ]
  },
  "Final Log": {
    "Level 1": [
      { question: "What is the most important part of completing a session?", options: ["Logging your hours.", "Cleaning up your workspace.", "Documenting your progress and what you learned.", "All of the above."], correctAnswer: 3 },
      { question: "Why do we log our accomplishments at the end of the day?", options: ["To get a grade.", "To track team progress, maintain accountability, and document the engineering process.", "Because the coach said so.", "To show off to other teams."], correctAnswer: 1 },
      { question: "What should you do if you didn't finish your task today?", options: ["Pretend you did.", "Leave it a mess.", "Document what is left to do so the next person (or you) can pick up where you left off.", "Throw it away."], correctAnswer: 2 }
    ],
    "Level 2": [
      { question: "How does detailed documentation in your 'Final Log' help the team during competition?", options: ["It provides a clear history of design iterations for the judges' engineering notebook.", "It makes the robot drive faster.", "It guarantees a win.", "It doesn't help."], correctAnswer: 0 },
      { question: "When checking out, why is it important to select the correct difficulty level?", options: ["To prove you are the smartest.", "To ensure the adaptive curriculum gives you appropriately challenging questions to reinforce your learning.", "To make the quiz longer.", "To get more points."], correctAnswer: 1 },
      { question: "What is the primary goal of the robotics dashboard check-out process?", options: ["To stop you from leaving.", "To enforce a reflection period on the day's work, ensuring continuous improvement and knowledge retention.", "To make sure you didn't steal anything.", "To count how many people showed up."], correctAnswer: 1 }
    ]
  }
};

export const FINAL_LOG_QUIZ = {
  "Level 1": [
    { question: "What is the most important part of completing a session?", options: ["Logging your hours.", "Cleaning up your workspace.", "Documenting your progress and what you learned.", "All of the above."], correctAnswer: 3 },
    { question: "Why do we log our accomplishments at the end of the day?", options: ["To get a grade.", "To track team progress, maintain accountability, and document the engineering process.", "Because the coach said so.", "To show off to other teams."], correctAnswer: 1 },
    { question: "What should you do if you didn't finish your task today?", options: ["Pretend you did.", "Leave it a mess.", "Document what is left to do so the next person (or you) can pick up where you left off.", "Throw it away."], correctAnswer: 2 }
  ],
  "Level 2": [
    { question: "How does detailed documentation in your 'Final Log' help the team during competition?", options: ["It provides a clear history of design iterations for the judges' engineering notebook.", "It makes the robot drive faster.", "It guarantees a win.", "It doesn't help."], correctAnswer: 0 },
    { question: "When checking out, why is it important to select the correct difficulty level?", options: ["To prove you are the smartest.", "To ensure the adaptive curriculum gives you appropriately challenging questions to reinforce your learning.", "To make the quiz longer.", "To get more points."], correctAnswer: 1 },
    { question: "What is the primary goal of the robotics dashboard check-out process?", options: ["To stop you from leaving.", "To enforce a reflection period on the day's work, ensuring continuous improvement and knowledge retention.", "To make sure you didn't steal anything.", "To count how many people showed up."], correctAnswer: 1 }
  ]
};
