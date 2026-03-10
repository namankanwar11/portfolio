import * as THREE from "three";

export interface NodeDef {
  id: number;
  position: THREE.Vector3;
  type: "start" | "normal" | "end";
}

export interface QuestionDef {
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface LevelDef {
  level: number;
  name: string;
  unlocks: string;
  question: QuestionDef;
  nodes: NodeDef[];
  correctPath: number[];
  edges: [number, number][];
}

export const levels: LevelDef[] = [
  {
    level: 1,
    name: "Initialize Protocol",
    unlocks: "Projects Module",
    question: {
      text: "Which Python function is used to output data to the screen?",
      options: ["echo()", "print()", "output()", "console.log()"],
      correctAnswer: 1,
    },
    nodes: [
      { id: 0, position: new THREE.Vector3(-3, 0, 0), type: "start" },
      { id: 1, position: new THREE.Vector3(0, 1.5, 0), type: "normal" },
      { id: 2, position: new THREE.Vector3(3, 0, 0), type: "end" },
    ],
    correctPath: [0, 1, 2],
    edges: [
      [0, 1],
      [1, 2],
      [0, 2],
    ],
  },
  {
    level: 2,
    name: "Bypass Firewall",
    unlocks: "Skills Module",
    question: {
      text: "Which Machine Learning algorithm is commonly used for classification and uses an ensemble of decision trees?",
      options: [
        "Linear Regression",
        "K-Means Clustering",
        "Random Forest",
        "Principal Component Analysis",
      ],
      correctAnswer: 2,
    },
    nodes: [
      { id: 0, position: new THREE.Vector3(-4, -1, 0), type: "start" },
      { id: 1, position: new THREE.Vector3(-1.5, 2, 0), type: "normal" },
      { id: 2, position: new THREE.Vector3(0, -2, 0), type: "normal" },
      { id: 3, position: new THREE.Vector3(2, 1.5, 0), type: "normal" },
      { id: 4, position: new THREE.Vector3(4, -1, 0), type: "end" },
    ],
    correctPath: [0, 2, 1, 3, 4],
    edges: [
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 3],
      [2, 3],
      [2, 4],
      [3, 4],
    ],
  },
  {
    level: 3,
    name: "Decrypt Memory",
    unlocks: "Experience Log",
    question: {
      text: "What does NLP stand for in Artificial Intelligence?",
      options: [
        "Neural Learning Process",
        "Natural Language Processing",
        "Node Level Programming",
        "None of the above",
      ],
      correctAnswer: 1,
    },
    nodes: [
      { id: 0, position: new THREE.Vector3(-4, 0, 0), type: "start" },
      { id: 1, position: new THREE.Vector3(-2, 2, -1), type: "normal" },
      { id: 2, position: new THREE.Vector3(-2, -2, 1), type: "normal" },
      { id: 3, position: new THREE.Vector3(0, 3, 0), type: "normal" },
      { id: 4, position: new THREE.Vector3(0, 0, 2), type: "normal" },
      { id: 5, position: new THREE.Vector3(2, 2, -1), type: "normal" },
      { id: 6, position: new THREE.Vector3(2, -2, 1), type: "normal" },
      { id: 7, position: new THREE.Vector3(4, 0, 0), type: "end" },
    ],
    correctPath: [0, 2, 4, 1, 3, 5, 6, 7],
    edges: [
      [0, 1],
      [0, 2],
      [0, 4],
      [1, 3],
      [1, 4],
      [2, 4],
      [2, 6],
      [3, 5],
      [4, 5],
      [4, 6],
      [5, 7],
      [6, 7],
    ],
  },
];
