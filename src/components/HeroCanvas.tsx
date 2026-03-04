"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 900;
  const base = useMemo(() => { const p=new Float32Array(count*3); for(let i=0;i<count;i++){p[i*3]=(Math.random()-.5)*20;p[i*3+1]=(Math.random()-.5)*16;p[i*3+2]=(Math.random()-.5)*14;} return p; }, []);
  const phi = useMemo(() => { const p=new Float32Array(count); for(let i=0;i<count;i++) p[i]=Math.random()*Math.PI*2; return p; }, []);
  const pos = useMemo(() => new Float32Array(base), [base]);
  useFrame(s => {
    if(!ref.current) return;
    const t=s.clock.elapsedTime;
    ref.current.rotation.y=t*.018;
    const arr=ref.current.geometry.attributes.position.array as Float32Array;
    for(let i=0;i<count;i++) arr[i*3+1]=base[i*3+1]+Math.sin(t*.22+phi[i])*.06;
    ref.current.geometry.attributes.position.needsUpdate=true;
  });
  return (
    <Points ref={ref} positions={pos} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#C84B31" size={0.02} sizeAttenuation depthWrite={false} opacity={0.25}/>
    </Points>
  );
}

function Rings() {
  const r1=useRef<THREE.Mesh>(null!),r2=useRef<THREE.Mesh>(null!),r3=useRef<THREE.Mesh>(null!);
  useFrame(s=>{const t=s.clock.elapsedTime;
    if(r1.current) r1.current.rotation.x=t*.05;
    if(r2.current) r2.current.rotation.y=t*.04;
    if(r3.current){r3.current.rotation.z=t*.07;r3.current.rotation.x=t*.025;}
  });
  const m=(o:number)=><meshBasicMaterial color="#C84B31" wireframe transparent opacity={o}/>;
  return (<>
    <mesh ref={r1}><torusGeometry args={[4.2,.009,8,120]}/>{m(.045)}</mesh>
    <mesh ref={r2}><torusGeometry args={[2.6,.008,8,80]}/>{m(.035)}</mesh>
    <mesh ref={r3}><torusGeometry args={[1.5,.006,8,60]}/>{m(.06)}</mesh>
  </>);
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0"
      style={{maskImage:"linear-gradient(to bottom,black 50%,transparent 100%)",WebkitMaskImage:"linear-gradient(to bottom,black 50%,transparent 100%)"}}>
      <Canvas camera={{position:[0,0,5.5],fov:60}} gl={{alpha:true,antialias:false}} style={{background:"transparent"}}>
        <Particles/><Rings/>
      </Canvas>
    </div>
  );
}
