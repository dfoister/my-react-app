import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {Mesh, Color, MathUtils, TextureLoader, MeshBasicMaterial} from "three";
import { getGPUTier } from "detect-gpu";

interface CubeProps {
    position: [number, number, number];
    color: string;
}

const Cube: React.FC<CubeProps> = (props) => {
    const mesh = useRef<Mesh | null>(null);
    const [speed] = useState<number>(Math.random() * 0.005 + 0.001);
    const [angle, setAngle] = useState<number>(Math.random() * Math.PI * 2);
    const [radius] = useState<number>(Math.random() * 8 + 5);
    const [initialY] = useState<number>(Math.random() * 8 - 4);


    useFrame(({ camera }) => {
        if (mesh.current) {
            mesh.current.rotation.x += speed;
            mesh.current.rotation.y += speed;
            mesh.current.rotation.z += speed;

            // Update the angle for the cube's orbit
            setAngle((prevAngle) => prevAngle + speed);

            // Update the cube position to orbit around the camera
            const newX = camera.position.x + radius * Math.sin(angle);
            const newY = initialY;
            const newZ = camera.position.z + radius * Math.cos(angle);

            mesh.current.position.set(newX, newY, newZ);
        }
    });

    return (
        <mesh ref={mesh} position={props.position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={props.color} />
        </mesh>
    );
}

interface BlackCubeProps {
    position: [number, number, number];
    url: string;
}

const BlackCube: React.FC<BlackCubeProps> = (props) => {
    const mesh = useRef<Mesh | null>(null);
    const texture = useLoader(TextureLoader, "/rick.png");
    const [gpuTier, setGpuTier] = useState<string | null>(null);
    const [angle, setAngle] = useState<number>(Math.random() * Math.PI * 2);
    const [speed] = useState<number>(Math.random() * 0.005 + 0.001);
    const [radius] = useState<number>(Math.random() * 8 + 5);
    const [initialY] = useState<number>(Math.random() * 8 - 4);

    useFrame(({ camera }) => {
        if (mesh.current) {
            mesh.current.rotation.x += speed;
            mesh.current.rotation.y += speed;
            mesh.current.rotation.z += speed;

            // Update the angle for the cube's orbit
            setAngle((prevAngle) => prevAngle + speed);

            // Update the cube position to orbit around the camera
            const newX = camera.position.x + radius * Math.sin(angle);
            const newY = initialY;
            const newZ = camera.position.z + radius * Math.cos(angle);

            mesh.current.position.set(newX, newY, newZ);
        }
    });

    const onPointerDown = () => {
        window.open(props.url, "_blank");
    };

    useEffect(() => {
        const tier = async () => {
            const gpuTier = await getGPUTier();
            setGpuTier(gpuTier.tier.toString());
        };
        tier();
    }, []);

    useEffect(() => {
        if (gpuTier === "GPU Tier 0") {
            const material = new MeshBasicMaterial({ color: "black" });
            if (mesh.current) {
                mesh.current.material = material;
            }
        }
    }, [gpuTier]);

    return (
        <mesh
            ref={mesh}
            position={props.position}
            onClick={onPointerDown}
            onPointerOver={(e) => e.stopPropagation()}
            onPointerOut={(e) => e.stopPropagation()}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshLambertMaterial map={texture} />
        </mesh>
    );
};



const AnimatedBackground: React.FC = () => {
    const generateCubes = () => {
        const cubes = [];
        for (let i = 0; i < 19; i++) {
            const position: [number, number, number] = [
                Math.random() * 25 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
            ];
            const color = new Color(
                MathUtils.lerp(0.5, 1, Math.random()),
                MathUtils.lerp(0.5, 1, Math.random()),
                MathUtils.lerp(0.5, 1, Math.random())
            );
            cubes.push(<Cube position={position} color={`#${color.getHexString()}`} key={i} />);
            console.log(`Color: ${color.getHexString()}`);
        }
            cubes.push(
                <BlackCube
                    position={[Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10]}
                    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    key={19}
                />
            );
            return cubes;
        };

    return (
        <Canvas style={{ background: "#282c34" }}>
            <pointLight position={[-20, 20, -20]} intensity={0.5} />
            <pointLight position={[20, 20, 20]} intensity={0.5} />
            <pointLight position={[-20, -20, 20]} intensity={0.5} />
            <pointLight position={[20, -20, -20]} intensity={0.5} />
            {generateCubes()}
        </Canvas>
    );
};

export default AnimatedBackground;
