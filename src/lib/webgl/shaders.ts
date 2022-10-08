export const vertexShader = () => // language=GLSL
    `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
    }
    `

export const fragmentShader = () => // language=GLSL
    `
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        
        // Invert the y-axis to be consistent with the canvas coordinate system
//        st.y = 1.0 - st.y;
        // Calculate the distance from the mouse position
//        float dis = distance(st, u_mouse);
//        vec3 color = vec3(st.x - (step(dis, 0.05)*dis*4.), st.y - (step(dis, 0.05)*dis*4.), abs(sin(u_time)));
        
        vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
        gl_FragColor = vec4(color, 1.0);
    }
    `

export const wavyLoadingFragmentShader = () => // language=GLSL
    `
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    
    float state = 50.;
    float y_min = 0.;
    float y_max = u_resolution.y;
    
    
    void main() {
        // Colourfull
        vec2 st = gl_FragCoord.xy/u_resolution.xy;
        st.x *= u_resolution.x/u_resolution.y;
        vec3 color = vec3(st.x,st.y,abs(sin(u_time)));
        
        // Wavy
        float pct = step(gl_FragCoord.y / (y_max - y_min) * 100. - sin(u_time + gl_FragCoord.x * 0.05) + cos(u_time), state);
        color = (1.0 - pct) * vec3(0.) + pct * color;
    
        // Set
        gl_FragColor = vec4(color,1.);
    }
    `
