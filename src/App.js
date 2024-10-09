'use client'

import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Text, Box, Environment, useGLTF } from "@react-three/drei"
import { Suspense, useRef, useEffect } from "react"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import placeHolder from './placeholder.svg'
import lanternModel from './Lantern.glb'
import testModel from './2.glb'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

function Picture({ position, rotation, url }) {
  const texture = useLoader(TextureLoader, url)
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[2, 1.5]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

function Palace() {
  const wallColor = "#e0d5c1"
  const floorColor = "#8b7d6b"

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Walls */}
      <Box args={[20, 7, 0.1]} position={[0, 1.5, -10]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      <Box args={[20, 7, 0.1]} position={[0, 1.5, 10]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      <Box args={[0.1, 7, 20]} position={[-10, 1.5, 0]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      <Box args={[0.1, 7, 20]} position={[10, 1.5, 0]}>
        <meshStandardMaterial color={wallColor} />
      </Box>

      {/* Pictures */}
      <Picture position={[-5, 2, -9.9]} rotation={[0, 0, 0]} url={placeHolder} />
      <Picture position={[0, 2, -9.9]} rotation={[0, 0, 0]} url={placeHolder} />
      <Picture position={[5, 2, -9.9]} rotation={[0, 0, 0]} url={placeHolder} />
      <Picture position={[-9.9, 2, -5]} rotation={[0, Math.PI / 2, 0]} url={placeHolder} />
      <Picture position={[-9.9, 2, 5]} rotation={[0, Math.PI / 2, 0]} url={placeHolder} />

      {/* Text */}
      <Text
        position={[0, 4, -9.5]}
        fontSize={0.5}
        color="black"
      >
        Welcome to the 3D Palace
      </Text>
    </>
  )
}

function Model() {
  const group = useRef();
  const { nodes } = useGLTF(testModel);
  
  // Calculate the bounding box and center
  const boundingBox = new THREE.Box3().setFromObject(nodes.Scene || nodes[Object.keys(nodes)[0]]); // Assuming nodes is not empty
  const center = new THREE.Vector3();
  boundingBox.getCenter(center);

  useEffect(() => {
    if (group.current) {
      // Adjust the position and zoom level as necessary
      group.current.position.set(-center.x, -center.y, -center.z);
    }
  }, [center]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Scene || nodes[Object.keys(nodes)[0]]} />
    </group>
  );
}

export default function Component() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [30, 60, 40] }}>
        <Suspense fallback={null}>
          <Model />
          {/* <Palace /> */}
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>
    </div>
  )
}