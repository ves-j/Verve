#version 330 core

// Outputs colors in RGBA
out vec4 FragColor;

// Imports the current position from the Vertex Shader
in vec3 crntPos;
// Imports the normal from the Vertex Shader
in vec3 Normal;
// Imports the color from the Vertex Shader
in vec3 color;
// Imports the texture coordinates from the Vertex Shader
in vec2 texCoord;



// Gets the Texture Units from the main function
uniform sampler2D diffuse0;
uniform sampler2D specular0;
uniform sampler2D normal0;

// Gets the color of the light from the main function
uniform vec4 lightColor;
// Gets the position of the light from the main function
uniform vec3 lightPos;
// Gets the position of the camera from the main function
uniform vec3 camPos;


uniform int textureOn;
uniform vec4 meshCol;
// Type of light selected
uniform int lightType;


//light controller
uniform float amb;			//ambient
uniform float specLight;	//specular
uniform float outerConeM;	//specular
uniform int	  spPower;
uniform int	  blinn;		//blinn phong light
uniform int	  diffOn;
uniform float diff;

uniform int   normalLoaded;


vec4 pointLight()
{	
	// used in two variables so I calculate it here to not have to do it twice
	vec3 lightVec = lightPos - crntPos;

	// intensity of light with respect to distance
	float dist = length(lightVec);
	float a = 3.0;
	float b = 0.7;
	float inten = 1.0f / (a * dist * dist + b * dist + 1.0f);

	// ambient lighting
	float ambient = amb;

	vec3 normal;

	// diffuse lighting
	if(normalLoaded == 1)
	{
		normal = normalize(texture(normal0, texCoord).xyz * 2.0f - 1.0f);
	}
	else
	{
		normal = normalize(Normal);
	}
	vec3 lightDirection = normalize(lightVec);
	//max(dot(normal, lightDirection), 0.0f);

	float diffuse;
	if(diffOn == 1)
	{
		diffuse = diff;
	}
	else
	{
		diffuse = max(dot(normal, lightDirection), 0.0f);
	}
	

	// specular lighting
	float specular = 0.0f;

	if (blinn == 1)	//diffuse != 0.0f
	{
		float specularLight = specLight;
		vec3 viewDirection = normalize(camPos - crntPos);
		vec3 halfwayVec = normalize(viewDirection + lightDirection);
		float specAmount = pow(max(dot(normal, halfwayVec), 0.0f), spPower);
		specular = specAmount * specularLight;
	}
	else
	{
		float specularLight = specLight;
		vec3 viewDirection = normalize(camPos - crntPos);
		vec3 reflectionDirection = reflect(-lightDirection, normal);
		float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), spPower);
		specular = specAmount * specularLight;
	};

	return (texture(diffuse0, texCoord) * (diffuse * inten + ambient) + texture(specular0, texCoord).r * specular * inten) * lightColor;
}

vec4 direcLight()
{

	// used in two variables so I calculate it here to not have to do it twice
	vec3 lightVec = lightPos - crntPos;
	// ambient lighting
	float ambient = amb;

	vec3 normal;

	// diffuse lighting
	if(normalLoaded == 1)
	{
		normal = normalize(texture(normal0, texCoord).xyz * 2.0f - 1.0f);
	}
	else
	{
		normal = normalize(Normal);
	}
	vec3 lightDirection = normalize(lightVec); //vec3(1.0f, 1.0f, 0.0f)

	float diffuse;
	if(diffOn == 1)
	{
		diffuse = diff;
	}
	else
	{
		diffuse = max(dot(normal, lightDirection), 0.0f);
	}

	// specular lighting
	float specular = 0.0f;

	if (blinn == 1)
	{
		float specularLight = specLight;
		vec3 viewDirection = normalize(camPos - crntPos);
		vec3 halfwayVec = normalize(viewDirection + lightDirection);
		float specAmount = pow(max(dot(normal, halfwayVec), 0.0f), spPower);
		specular = specAmount * specularLight;
	}
	else
	{
		float specularLight = specLight;
		vec3 viewDirection = normalize(camPos - crntPos);
		vec3 reflectionDirection = reflect(-lightDirection, normal);
		float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), spPower);
		specular = specAmount * specularLight;
	};

	return (texture(diffuse0, texCoord) * (diffuse + ambient) + texture(specular0, texCoord).r * specular) * lightColor;
}

// don't add normal texture to spot light or cone will break
vec4 spotLight()
{
	// controls how big the area that is lit up is
	float outerCone = outerConeM;
	float innerCone = outerConeM + 0.05f;

	// ambient lighting
	float ambient = amb;

	vec3 normal;

	// diffuse lighting
	if(normalLoaded == 1)
	{
		normal = normalize(texture(normal0, texCoord).xyz * 2.0f - 1.0f);
	}
	else
	{
		normal = normalize(Normal);
	}
	vec3 lightDirection = normalize(lightPos - crntPos);

	float diffuse;
	if(diffOn == 1)
	{
		diffuse = diff;
	}
	else
	{
		diffuse = max(dot(normal, lightDirection), 0.0f);
	}

	// specular lighting
	float specular = 0.0f;
	if (blinn == 1)
	{
		float specularLight = specLight;
		vec3 viewDirection = normalize(camPos - crntPos);
		vec3 halfwayVec = normalize(viewDirection + lightDirection);
		float specAmount = pow(max(dot(normal, halfwayVec), 0.0f), spPower);
		specular = specAmount * specularLight;
	}
	else
	{
		float specularLight = specLight;
		vec3 viewDirection = normalize(camPos - crntPos);
		vec3 reflectionDirection = reflect(-lightDirection, normal);
		float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), spPower);
		specular = specAmount * specularLight;
	};

	// calculates the intensity of the crntPos based on its angle to the center of the light cone
	float angle = dot(vec3(0.0f, -1.0f, 0.0f), -lightDirection);
	float inten = clamp((angle - outerCone) / (innerCone - outerCone), 0.0f, 1.0f);

	return (texture(diffuse0, texCoord) * (diffuse * inten + ambient) + texture(specular0, texCoord).r * specular * inten) * lightColor;
}


void main()
{
	// outputs final color
	if (textureOn == 1)
	{
		FragColor = direcLight();

		if (lightType == 0)
		{
			FragColor = pointLight();
		}
		
		if (lightType == 1)
		{
			FragColor = direcLight();
		}

		if (lightType == 2)
		{
			FragColor = spotLight();
		}
	}

	if (textureOn != 1)
	{
		FragColor = meshCol;
	}
	
}