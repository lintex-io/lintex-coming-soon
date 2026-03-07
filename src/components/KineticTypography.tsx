import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function KineticTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Calculate progress from 0 to 1 over the first viewport height
      const progress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create text texture
    const createTextTexture = (text: string) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const width = 4096;
      const height = 1024;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Large font to fill vertical space
      ctx.font = '900 800px "Inter", sans-serif'; 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      // Draw text centered, scaling down if necessary to fit width
      ctx.fillText(text, width / 2, height / 2, width - 100);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const texture = createTextTexture('NO BS TRADE AND BELIEVE');

    // Geometry - Torus Knot from Codrops Demo 1
    const geometry = new THREE.TorusKnotGeometry(9, 3, 768, 3, 4, 3);
    
    // Shaders from Codrops Demo 1
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;

      uniform float uTime;

      void main() {
        vUv = uv;
        vPosition = position;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;

      uniform float uTime;
      uniform sampler2D uTexture;

      void main() {
        float time = uTime * 0.1;

        // Repeat texture
        // Reduced repeat.x from 12.0 to 4.0 to accommodate longer text and wider texture
        vec2 repeat = -vec2(4., 3.);
        
        vec2 uv = fract(vUv * repeat - vec2(time, 0.));
        vec3 texture = texture2D(uTexture, uv).rgb;
        
        // Fog effect
        float fog = clamp(vPosition.z / 6., 0., 1.);
        vec3 fragColor = mix(vec3(0.), texture, fog);

        gl_FragColor = vec4(fragColor, 1.);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Optimization: Stop rendering if scrolled out of view
      // The opacity becomes 0 when scrollProgress * 1.5 >= 1, which is approx scrollY > window.innerHeight * 0.66
      // We'll use window.innerHeight as a safe cutoff to completely kill the rendering
      if (window.scrollY > window.innerHeight) {
        return;
      }

      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;
      
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  // Calculate styles based on scroll progress
  const opacity = Math.max(0, 1 - scrollProgress * 1.5); // Fade out faster
  const scale = Math.max(0.8, 1 - scrollProgress * 0.2); // Slight scale down

  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none">
      <div 
        ref={containerRef} 
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ 
          opacity, 
          transform: `scale(${scale})` 
        }} 
      />
      {/* Darker overlay as requested */}
      <div className="absolute inset-0 bg-black/80" />
    </div>
  );
}

