import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { ArrowLeft, RotateCcw, Play, Pause } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface DogRunningGameProps {
  goBack: () => void;
}

interface Dog {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  width: number;
  height: number;
  track: number; // 0, 1, 2 for left, center, right track
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'barrier' | 'question' | 'low_barrier' | 'high_barrier' | 'answer_option';
  track: number; // 0, 1, 2 for left, center, right track
  question?: {
    text: string;
    options: string[];
    correct: number;
  };
  answerText?: string;
  answerIndex?: number;
}

const DogRunningGame: React.FC<DogRunningGameProps> = ({ goBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const { t } = useLanguage();
  const gameRef = useRef({
    isPlaying: false,
    score: 0,
    speed: 2,
    gameTime: 0,
    keys: {
      w: false,
      a: false,
      s: false,
      d: false,
    }
  });

  const [dog, setDog] = useState<Dog>({
    x: 100,
    y: 300,
    velocityY: 0,
    isJumping: false,
    width: 40,
    height: 40,
    track: 1 // Start in center track
  });

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [showControls, setShowControls] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Obstacle | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  // Remove unused state

  // Physics constants
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const GROUND_Y = 300;

  // Sample physics questions (3 options each)
  const physicsQuestions = useMemo(() => [
    {
      text: "What is the acceleration due to gravity on Earth?",
      options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²"],
      correct: 0
    },
    {
      text: "Which equation represents Newton's Second Law?",
      options: ["F = ma", "E = mc²", "v = u + at"],
      correct: 0
    },
    {
      text: "What is the unit of force?",
      options: ["Joule", "Newton", "Watt"],
      correct: 1
    },
    {
      text: "In projectile motion, which component of velocity remains constant?",
      options: ["Vertical", "Horizontal", "Both"],
      correct: 1
    },
    {
      text: "What is the formula for kinetic energy?",
      options: ["KE = ½mv²", "KE = mgh", "KE = mv"],
      correct: 0
    },
    {
      text: "What is the SI unit of power?",
      options: ["Joule", "Watt", "Newton"],
      correct: 1
    },
    {
      text: "Which law states that energy cannot be created or destroyed?",
      options: ["Newton's First Law", "Conservation of Energy", "Ohm's Law"],
      correct: 1
    },
    {
      text: "What is the speed of light in vacuum?",
      options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s"],
      correct: 0
    }
  ], []);

  // Generate obstacles (Subway Surfers style with tracks)
  const generateObstacle = useCallback((): Obstacle => {
    const question = physicsQuestions[Math.floor(Math.random() * physicsQuestions.length)];
    const obstacleTypes = ['barrier', 'barrier', 'low_barrier', 'high_barrier', 'question', 'answer_option']; // More variety
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const track = Math.floor(Math.random() * 3); // 0, 1, 2 for left, center, right
    
    let height = 60;
    let y = GROUND_Y - 60;
    
    if (type === 'low_barrier') {
      height = 30;
      y = GROUND_Y - 30;
    } else if (type === 'high_barrier') {
      height = 90;
      y = GROUND_Y - 90;
    }
    
    // Calculate x position based on track
    const trackWidth = 200; // Width of each track
    const x = 800 + (track * trackWidth);
    
    if (type === 'answer_option') {
      const answerIndex = Math.floor(Math.random() * question.options.length);
      return {
        x: x,
        y: y,
        width: 30,
        height: height,
        type: 'answer_option',
        track: track,
        answerText: question.options[answerIndex],
        answerIndex: answerIndex,
        question: question
      };
    }
    
    return {
      x: x,
      y: y,
      width: 30,
      height: height,
      type: type as 'barrier' | 'question' | 'low_barrier' | 'high_barrier' | 'answer_option',
      track: track,
      question: type === 'question' ? question : undefined
    };
  }, [physicsQuestions]);

  // Draw dog (Subway Surfers style)
  const drawDog = useCallback((ctx: CanvasRenderingContext2D, dog: Dog) => {
    const { y, width, height, track } = dog;
    const time = gameRef.current.gameTime * 0.1;
    
    // Calculate x position based on track
    const trackWidth = 200; // Width of each track
    const x = 100 + (track * trackWidth);
    
    // Dog shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(x + width/2, GROUND_Y + 45, width/2 + 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog body (more rounded)
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 8);
    ctx.fill();
    
    // Dog head
    ctx.fillStyle = '#FF8E8E';
    ctx.beginPath();
    ctx.arc(x + width/2, y - 10, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog ears (animated)
    const earBounce = Math.sin(time * 10) * 2;
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.ellipse(x + width/2 - 12, y - 15 + earBounce, 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + width/2 + 12, y - 15 + earBounce, 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog eyes (animated)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x + width/2 - 6, y - 12, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + width/2 + 6, y - 12, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + width/2 - 6, y - 12, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + width/2 + 6, y - 12, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog nose
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + width/2, y - 6, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog mouth (smile)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + width/2, y - 4, 8, 0, Math.PI);
    ctx.stroke();
    
    // Dog tail (animated)
    const tailSwing = Math.sin(time * 8) * 10;
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.ellipse(x - 8, y + height/2, 12, 6, tailSwing * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog legs (running animation)
    const legOffset = Math.sin(time * 20) * 3;
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(x + 8, y + height, 5, 12 + legOffset);
    ctx.fillRect(x + 18, y + height, 5, 12 - legOffset);
    ctx.fillRect(x + 28, y + height, 5, 12 + legOffset);
    ctx.fillRect(x + 38, y + height, 5, 12 - legOffset);
    
    // Dog shoes
    ctx.fillStyle = '#333';
    ctx.fillRect(x + 6, y + height + 12, 8, 4);
    ctx.fillRect(x + 16, y + height + 12, 8, 4);
    ctx.fillRect(x + 26, y + height + 12, 8, 4);
    ctx.fillRect(x + 36, y + height + 12, 8, 4);
  }, []);

  // Draw obstacles (Subway Surfers style)
  const drawObstacles = useCallback((ctx: CanvasRenderingContext2D, obstacles: Obstacle[]) => {
    obstacles.forEach(obstacle => {
      if (obstacle.type === 'barrier' || obstacle.type === 'low_barrier' || obstacle.type === 'high_barrier') {
        // Different colors for different barrier types
        let color = '#8B4513';
        let warningColor = '#FFD700';
        
        if (obstacle.type === 'low_barrier') {
          color = '#CD853F'; // Lighter brown
          warningColor = '#FFA500'; // Orange
        } else if (obstacle.type === 'high_barrier') {
          color = '#654321'; // Darker brown
          warningColor = '#FF0000'; // Red
        }
        
        // Draw barrier with 3D effect
        ctx.fillStyle = color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // 3D effect
        ctx.fillStyle = '#654321';
        ctx.fillRect(obstacle.x + obstacle.width, obstacle.y, 5, obstacle.height);
        ctx.fillRect(obstacle.x, obstacle.y + obstacle.height, obstacle.width + 5, 5);
        
        // Barrier top
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(obstacle.x - 5, obstacle.y - 10, obstacle.width + 10, 10);
        
        // Warning stripes
        ctx.fillStyle = warningColor;
        for (let i = 0; i < obstacle.width; i += 20) {
          ctx.fillRect(obstacle.x + i, obstacle.y + 10, 10, 5);
        }
        
        // Height indicator
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        if (obstacle.type === 'low_barrier') {
          ctx.fillText('LOW', obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2);
        } else if (obstacle.type === 'high_barrier') {
          ctx.fillText('HIGH', obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2);
        }
        ctx.textAlign = 'left';
        
      } else if (obstacle.type === 'question') {
        // Draw question box with glow effect
        ctx.shadowColor = '#4CAF50';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.shadowBlur = 0;
        
        // Question box border
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Question mark with animation
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2 + 8);
        ctx.textAlign = 'left';
        
        // Sparkle effect
        const time = gameRef.current.gameTime * 0.1;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 3; i++) {
          const sparkleX = obstacle.x + 5 + Math.sin(time * 5 + i) * 10;
          const sparkleY = obstacle.y + 5 + Math.cos(time * 5 + i) * 10;
          ctx.fillRect(sparkleX, sparkleY, 2, 2);
        }
      } else if (obstacle.type === 'answer_option') {
        // Draw answer option box
        ctx.shadowColor = '#FF6B35';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#FF6B35';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.shadowBlur = 0;
        
        // Answer box border
        ctx.strokeStyle = '#E55A2B';
        ctx.lineWidth = 3;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Answer text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(obstacle.answerText || 'A', obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2 + 4);
        ctx.textAlign = 'left';
        
        // Track indicator
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Track ${obstacle.track + 1}`, obstacle.x + obstacle.width/2, obstacle.y - 5);
        ctx.textAlign = 'left';
      }
    });
  }, []);

  // Draw background with moving elements
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current!;
    const width = canvas.width;
    const height = canvas.height;
    const time = gameRef.current.gameTime * 0.1;
    const trackWidth = 200; // Width of each track
    
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#E0F6FF');
    gradient.addColorStop(1, '#90EE90');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw 3 tracks
    for (let track = 0; track < 3; track++) {
      const trackX = track * trackWidth;
      
      // Track background
      ctx.fillStyle = track === 1 ? '#F0F0F0' : '#E8E8E8'; // Center track slightly different
      ctx.fillRect(trackX, GROUND_Y + 40, trackWidth, height - GROUND_Y - 40);
      
      // Track lines
      ctx.strokeStyle = '#C0C0C0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(trackX, GROUND_Y + 40);
      ctx.lineTo(trackX, height);
      ctx.moveTo(trackX + trackWidth, GROUND_Y + 40);
      ctx.lineTo(trackX + trackWidth, height);
      ctx.stroke();
      
      // Track center line
      ctx.strokeStyle = '#A0A0A0';
      ctx.lineWidth = 1;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(trackX + trackWidth/2, GROUND_Y + 40);
      ctx.lineTo(trackX + trackWidth/2, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Moving clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 5; i++) {
      const cloudX = (200 + i * 200 - time * 20) % (width + 100);
      const cloudY = 30 + Math.sin(time * 0.5 + i) * 15;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 25, 0, Math.PI * 2);
      ctx.arc(cloudX + 30, cloudY, 30, 0, Math.PI * 2);
      ctx.arc(cloudX + 60, cloudY, 25, 0, Math.PI * 2);
      ctx.arc(cloudX + 30, cloudY - 15, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Moving buildings in background
    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    for (let i = 0; i < 8; i++) {
      const buildingX = (i * 100 - time * 15) % (width + 100);
      const buildingHeight = 80 + (i % 3) * 20;
      ctx.fillRect(buildingX, GROUND_Y - buildingHeight, 80, buildingHeight);
      
      // Building windows
      ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 2; k++) {
          if (Math.random() > 0.3) {
            ctx.fillRect(buildingX + 10 + j * 20, GROUND_Y - buildingHeight + 10 + k * 25, 15, 15);
          }
        }
      }
      ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    }
    
    // Ground with texture
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, GROUND_Y + 40, width, height - GROUND_Y - 40);
    
    // Ground lines (moving)
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    for (let i = 0; i < 3; i++) {
      const lineY = GROUND_Y + 50 + i * 15;
      const offset = (time * 30) % 40;
      ctx.beginPath();
      ctx.moveTo(-offset, lineY);
      ctx.lineTo(width - offset, lineY);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Sidewalk
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, GROUND_Y + 20, width, 20);
    
    // Sidewalk lines
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, GROUND_Y + 20);
      ctx.lineTo(i, GROUND_Y + 40);
      ctx.stroke();
    }
  }, []);

  // Draw Subway Surfers style question display
  const drawQuestionDisplay = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current!;
    const width = canvas.width;
    
    // Always show a question from the current obstacles
    const questionObstacle = obstacles.find(obs => obs.type === 'question');
    
    if (questionObstacle && questionObstacle.question) {
      // Question background (top bar)
      const gradient = ctx.createLinearGradient(0, 0, 0, 80);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      gradient.addColorStop(1, 'rgba(0, 50, 0, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, 80);
      
      // Question text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(questionObstacle.question.text, width/2, 30);
      
      // Instructions
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('Choose the correct track! Use A/D to move between tracks!', width/2, 55);
      
      ctx.textAlign = 'left';
    } else {
      // Show default message when no question
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, 60);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Physics Adventure - Use WASD to control the dog!', width/2, 25);
      ctx.fillText('Jump over barriers and choose the correct track!', width/2, 45);
      ctx.textAlign = 'left';
    }
  }, [obstacles]);

  // Check collisions
  const checkCollision = useCallback((dog: Dog, obstacles: Obstacle[]): boolean => {
    return obstacles.some(obstacle => {
      // Only check collision if dog and obstacle are on the same track
      if (dog.track !== obstacle.track) {
        return false;
      }
      
      // Calculate dog's x position based on track
      const trackWidth = 200;
      const dogX = 100 + (dog.track * trackWidth);
      
      return dogX < obstacle.x + obstacle.width &&
             dogX + dog.width > obstacle.x &&
             dog.y < obstacle.y + obstacle.height &&
             dog.y + dog.height > obstacle.y;
    });
  }, []);

  // Handle question answer
  const handleAnswer = useCallback((answerIndex: number) => {
    if (currentQuestion && currentQuestion.question) {
      if (answerIndex === currentQuestion.question.correct) {
        // Correct answer - remove obstacle and add score
        setObstacles(prev => prev.filter(obs => obs !== currentQuestion));
        gameRef.current.score += 10;
        setCurrentQuestion(null);
        setPaused(false);
      } else {
        // Wrong answer - game over
        setGameOver(true);
        setPaused(true);
      }
    }
  }, [currentQuestion]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!canvasRef.current || !gameRef.current.isPlaying || paused) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Update game time
    gameRef.current.gameTime += 1;
    
    // Update dog physics
    setDog(prevDog => {
      let newDog = { ...prevDog };
      
      // Apply gravity
      newDog.velocityY += GRAVITY;
      newDog.y += newDog.velocityY;
      
      // Ground collision
      if (newDog.y >= GROUND_Y) {
        newDog.y = GROUND_Y;
        newDog.velocityY = 0;
        newDog.isJumping = false;
      }
      
      // Jump if W key is pressed and not already jumping
      if (gameRef.current.keys.w && !newDog.isJumping) {
        newDog.velocityY = JUMP_FORCE;
        newDog.isJumping = true;
      }
      
      // Track switching (A/D keys)
      if (gameRef.current.keys.a && newDog.track > 0) {
        newDog.track = newDog.track - 1;
      }
      if (gameRef.current.keys.d && newDog.track < 2) {
        newDog.track = newDog.track + 1;
      }
      
      return newDog;
    });
    
    // Update obstacles
    setObstacles(prevObstacles => {
      let newObstacles = prevObstacles.map(obs => ({
        ...obs,
        x: obs.x - gameRef.current.speed
      })).filter(obs => obs.x > -50);
      
      // Generate new obstacles more frequently
      if (Math.random() < 0.03) {
        newObstacles.push(generateObstacle());
      }
      
      // Generate multiple obstacles sometimes
      if (Math.random() < 0.01 && newObstacles.length < 3) {
        newObstacles.push(generateObstacle());
      }
      
      return newObstacles;
    });
    
    // Check collisions
    if (checkCollision(dog, obstacles)) {
      // Check if it's a question obstacle
      const questionObstacle = obstacles.find(obs => 
        obs.type === 'question' && 
        dog.x < obs.x + obs.width &&
        dog.x + dog.width > obs.x &&
        dog.y < obs.y + obs.height &&
        dog.y + dog.height > obs.y
      );
      
      if (questionObstacle) {
        setCurrentQuestion(questionObstacle);
        setPaused(true);
      } else {
        setGameOver(true);
        setPaused(true);
      }
    }
    
    // Increase speed over time
    if (gameRef.current.gameTime % 300 === 0) {
      gameRef.current.speed += 0.2;
    }
    
    // Clear canvas and draw everything
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawBackground(ctx);
    drawObstacles(ctx, obstacles);
    drawDog(ctx, dog);
    drawQuestionDisplay(ctx);
    
    // Draw score (moved to avoid overlap with question)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 130, 200, 60);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${gameRef.current.score}`, 20, 155);
    
    // Draw speed
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Speed: ${gameRef.current.speed.toFixed(1)}`, 20, 180);
    
    if (gameRef.current.isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [dog, obstacles, paused, drawBackground, drawObstacles, drawDog, drawQuestionDisplay, checkCollision, generateObstacle, JUMP_FORCE]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Movement controls
      if (['w', 'a', 's', 'd'].includes(key)) {
        gameRef.current.keys[key as keyof typeof gameRef.current.keys] = true;
        e.preventDefault();
      }
      
      // Question answering (1, 2, 3 keys)
      if (['1', '2', '3'].includes(key) && currentQuestion && currentQuestion.question) {
        const answerIndex = parseInt(key) - 1;
        handleAnswer(answerIndex);
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        gameRef.current.keys[key as keyof typeof gameRef.current.keys] = false;
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentQuestion, handleAnswer]);

  // Start/stop game
  const startGame = () => {
    gameRef.current.isPlaying = true;
    setGameOver(false);
    setPaused(false);
    setCurrentQuestion(null);
    setDog({
      x: 100,
      y: GROUND_Y,
      velocityY: 0,
      isJumping: false,
      width: 40,
      height: 40,
      track: 1 // Start in center track
    });
    setObstacles([]);
    gameRef.current.score = 0;
    gameRef.current.speed = 2;
    gameRef.current.gameTime = 0;
    setShowControls(false);
  };

  const stopGame = () => {
    gameRef.current.isPlaying = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Start animation loop
  useEffect(() => {
    if (gameRef.current.isPlaying && !paused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, paused]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('dog.back')}</span>
        </button>
        
        <div className="flex space-x-4">
          {!gameRef.current.isPlaying && (
            <button
              onClick={startGame}
              className="flex items-center space-x-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <Play className="w-4 h-4" />
              <span>{t('dog.start')}</span>
            </button>
          )}
          
          {gameRef.current.isPlaying && (
            <button
              onClick={() => setPaused(!paused)}
              className="flex items-center space-x-2 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span>{paused ? t('dog.resume') : t('dog.pause')}</span>
            </button>
          )}
          
          <button
            onClick={() => {
              stopGame();
              startGame();
            }}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('dog.restart')}</span>
          </button>
        </div>
      </div>

      {showControls && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-800 mb-4">{t('dog.title')} - {t('dog.controls')}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">{t('dog.movement')}</h4>
              <ul className="space-y-1 text-blue-600">
                <li><kbd className="bg-blue-200 px-2 py-1 rounded">W</kbd> - {t('dog.jump')}</li>
                <li><kbd className="bg-blue-200 px-2 py-1 rounded">A</kbd> - {t('dog.left')}</li>
                <li><kbd className="bg-blue-200 px-2 py-1 rounded">D</kbd> - {t('dog.right')}</li>
                <li><kbd className="bg-blue-200 px-2 py-1 rounded">S</kbd> - {t('dog.slow')}</li>
              </ul>
              <h4 className="font-semibold text-blue-700 mb-2 mt-4">{t('dog.track_system')}</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• <span className="text-blue-600">Track 1</span> - {t('dog.track1')}</li>
                <li>• <span className="text-green-600">Track 2</span> - {t('dog.track2')}</li>
                <li>• <span className="text-purple-600">Track 3</span> - {t('dog.track3')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">{t('dog.rules')}</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• {t('dog.jump_barriers')}</li>
                <li>• <span className="text-orange-600">LOW</span> {t('dog.low_barriers')}</li>
                <li>• <span className="text-red-600">HIGH</span> {t('dog.high_barriers')}</li>
                <li>• <span className="text-green-600">{t('dog.green_boxes')}</span></li>
                <li>• <span className="text-orange-600">{t('dog.orange_boxes')}</span></li>
                <li>• {t('dog.choose_track')}</li>
                <li>• {t('dog.wrong_ends')}</li>
                <li>• {t('dog.correct_points')}</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => setShowControls(false)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {t('dog.got_it')}
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="border-2 border-gray-300 rounded-lg w-full"
          />
          
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">{t('dog.game_over')}</h2>
                <p className="text-lg mb-4">{t('dog.final_score')}: {gameRef.current.score}</p>
                <button
                  onClick={startGame}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  {t('dog.play_again')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {currentQuestion && currentQuestion.question && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">{t('dog.physics_question')}</h3>
          <p className="text-xl text-green-700 mb-6 text-center font-semibold">{currentQuestion.question.text}</p>
          <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
            {currentQuestion.question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="bg-white border-2 border-green-300 text-green-700 px-6 py-4 rounded-xl hover:bg-green-100 hover:border-green-400 transition-all duration-300 text-left font-medium text-lg shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <span className="font-bold text-green-600">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            {t('dog.choose_answer')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DogRunningGame;
