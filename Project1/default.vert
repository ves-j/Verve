#version 330 core

// Positions/Coordinates
layout (location = 0) in vec3 aPos;

// Normal coordinate
layout (location = 1) in vec3 aNormal;

// Colors
layout (location = 2) in vec3 aColor;

// Texture Coordinates
layout (location = 3) in vec2 aTex;


// Outputs the current position for the Fragment Shader
out vec3 crntPos;

// Outputs the normal for the Fragment Shader
out vec3 Normal;

// Export the color for the Fragment Shader
out vec3 color;

// Export the texture coordinates to the fragment shader
out vec2 texCoord;



// Controls the scale of the vertices
uniform float scale;

// imgui uniforms
uniform float size;
uniform float px;
uniform float py;
uniform float pz;



// Imports the camera matrix from the main function
uniform mat4 camMatrix;

// Imports the model matrix from the main function
uniform mat4 model;


void main()
{

	// calculates current position
	crntPos = vec3(model * vec4(size * (aPos.x + px), size * (aPos.y + py), size * (aPos.z + pz), 1.0f));

	// Assigns the normals from the Vertex Data to "Normal"
	Normal = aNormal;

	// Assigns the colors from the Vertex Data to "color"
	color = aColor;

	// Assigns the texture coordinates from the Vertex Data to "texCoord"
	texCoord = aTex;


	// Outputs the positions/coordinates of all vertices
	gl_Position = camMatrix * vec4(crntPos, 1.0);
}