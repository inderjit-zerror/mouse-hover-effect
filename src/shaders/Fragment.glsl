

precision mediump float;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uIsActive;

void main() {
    vec4 color = texture2D(uTexture, vUv);

      // Convert to grayscale using luminance formula
    float gray = dot(color.rgb, vec3(0.100, 0.487, 0.114));
    vec4 grayColor = vec4(vec3(gray), color.a);

      // Calculate distance from mouse position
    float dist = distance(vUv, uMouse);

      // Create smooth circle mask
    float circle = 1.10 - smoothstep(uRadius - 0.05, uRadius, dist);

      // Mix between grayscale and color based on circle and activity
    vec4 finalColor = mix(grayColor, color, circle * uIsActive);

    gl_FragColor = finalColor;
}
