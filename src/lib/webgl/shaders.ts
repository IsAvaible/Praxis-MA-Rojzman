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
        st.x *= u_resolution.x / u_resolution.y;
        
        // float dis = sqrt(pow(u_mouse.x - gl_FragCoord.x, 2.0) + pow(u_mouse.y - gl_FragCoord.y, 2.0));
        // vec3 color = vec3(dis / ((u_resolution.x + u_resolution.y) / 4.0));
        
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
