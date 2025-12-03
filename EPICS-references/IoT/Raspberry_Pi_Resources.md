// Some resources I gathered while researching

- Setting up Raspberry Pi Pico and comparison to Arduino - https://www.nabto.com/raspberry-pi-pico-programming/
- Ideas for how to make something using Pico - https://www.kevsrobots.com/ideas/pico.html
	- https://www.youtube.com/watch?v=p5lc9js2xqs&t=2s
- TinyML - For AI stuff on Pico - https://github.com/mit-han-lab/tinyml | https://hanlab.mit.edu/projects/tinyml
- Other ML stuff - https://mjrobot.org/2021/03/12/tinyml-motion-recognition-using-raspberry-pi-pico/#respond
- https://in.mathworks.com/help/simulink/supportpkg/raspberrypi_ref/perform-predictive-maintenance-for-rotating-device-using-machine-learning-algorithm-on-raspberry-pi.html

- AI response - 
	-  Development Environment: To get started with programming the Pico, you can use MicroPython or C/C++. The ==Thonny IDE== is recommended for beginners as it ==simplifies the process of writing and uploading code to the Pico24==. You can also utilize platforms like Edge Impulse for training TinyML models that can be deployed on the Pico17.
	- While you cannot run complex AI models directly on the Raspberry Pi Pico in real-time via USB connection, ==you can train models elsewhere and deploy them for inference on the device using TinyML techniques==. Alternatively, use the Pico as part of an IoT system where it collects data for processing by more capable hardware.

- Documentation - https://www.raspberrypi.com/documentation/computers/
