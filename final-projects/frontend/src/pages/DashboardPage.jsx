import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import StorageIcon from '@mui/icons-material/Storage';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

// Animasyonlu kart komponenti
const AnimatedCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
  color: 'white',
  height: '100%',
  borderRadius: '10px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)',
    background: 'linear-gradient(135deg, #112240 0%, #1A365D 100%)',
  },
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

// Animasyonlu arka plan
const AnimatedBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.15,
  pointerEvents: 'none',
  background: `
    radial-gradient(circle at 15% 15%, rgba(0, 150, 255, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 85% 85%, rgba(0, 150, 255, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 85% 15%, rgba(5, 202, 130, 0.3) 0%, transparent 35%),
    radial-gradient(circle at 15% 85%, rgba(5, 202, 130, 0.3) 0%, transparent 35%)
  `,
  animation: 'pulse 15s infinite alternate',
  '@keyframes pulse': {
    '0%': { opacity: 0.1 },
    '50%': { opacity: 0.2 },
    '100%': { opacity: 0.1 },
  },
});

// Blockchain animasyonu
const BlockchainAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Nodes
    const nodes = [];
    const numNodes = 50; // Daha fazla düğüm

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 1,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        connected: [],
        color: Math.random() > 0.7 ? '#05CA82' : '#0582CA'
      });
    }

    // Connect nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.85) {
          nodes[i].connected.push(j);
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        for (const connectedIndex of node.connected) {
          const connectedNode = nodes[connectedIndex];

          // Calculate distance
          const dx = connectedNode.x - node.x;
          const dy = connectedNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Only draw connections within a certain range
          if (distance < 300) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);

            // Fade opacity based on distance
            const opacity = 0.2 * (1 - distance / 300);
            ctx.strokeStyle = `rgba(5, 130, 202, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      }

      // Data packet animation
      if (Math.random() > 0.92) {
        const start = Math.floor(Math.random() * nodes.length);
        const end = nodes[start].connected[Math.floor(Math.random() * nodes[start].connected.length)];

        if (end !== undefined) {
          animatePacket(nodes[start], nodes[end]);
        }
      }

      requestAnimationFrame(animate);
    };

    // Data packet animation
    const animatePacket = (start, end) => {
      let progress = 0;
      let x, y;
      const packetColor = Math.random() > 0.5 ? '#05CA82' : '#FFFFFF';

      const movePacket = () => {
        if (progress >= 1) return;

        progress += 0.02;
        x = start.x + (end.x - start.x) * progress;
        y = start.y + (end.y - start.y) * progress;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = packetColor;
        ctx.fill();

        requestAnimationFrame(movePacket);
      };

      movePacket();
    };

    animate();

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
};

// Uçan parçacıklar animasyonu
const ParticlesAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const numParticles = 30;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: i % 2 === 0 ? '#0582CA' : '#05CA82'
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off walls
        if (p.x <= 0 || p.x >= canvas.width) p.speedX *= -1;
        if (p.y <= 0 || p.y >= canvas.height) p.speedY *= -1;
      }

      requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
};

// Pulsing Circles Animation
const PulsingCircles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const circles = [];
    const numCircles = 5;

    for (let i = 0; i < numCircles; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: Math.random() * 100 + 50,
        speed: Math.random() * 0.5 + 0.1,
        color: i % 2 === 0 ? '#0582CA' : '#05CA82',
        opacity: 0.7
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < circles.length; i++) {
        let c = circles[i];

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = `${c.color}${Math.floor(c.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();

        c.radius += c.speed;
        c.opacity -= 0.005;

        if (c.radius >= c.maxRadius || c.opacity <= 0) {
          // Reset circle
          c.x = Math.random() * canvas.width;
          c.y = Math.random() * canvas.height;
          c.radius = 0;
          c.opacity = 0.7;
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />;
};

// ASCII Matrix Yağmur efekti
const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = '01';
    const fontSize = 12;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50;
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 20, 39, 0.05)';  // Koyu arka plan
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0582CA';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Rastgele karakter seç
        const text = characters.charAt(Math.floor(Math.random() * characters.length));

        // Ekrana çiz
        if (Math.random() > 0.99) {
          ctx.fillStyle = '#05CA82'; // Bazen yeşil
        } else {
          ctx.fillStyle = '#0582CA'; // Çoğunlukla mavi
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Aşağı hareket ettir
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    // Handle resize
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = canvas.width / fontSize;

      // Yeni sütunlar için drops array'ini güncelle
      for (let i = 0; i < columns; i++) {
        if (drops[i] === undefined) {
          drops[i] = Math.random() * -50;
        }
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, opacity: 0.3 }} />;
};

// 3D Küp animasyonu
const CubeAnimation = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 200,
      height: 200,
      perspective: 1000,
      zIndex: 5
    }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotation}deg) rotateY(${rotation * 0.7}deg)`,
        animation: 'pulse 8s infinite alternate',
      }}>
        {/* Front */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(5, 130, 202, 0.2)',
          border: '2px solid rgba(5, 130, 202, 0.5)',
          transform: 'translateZ(100px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <Typography variant="h4" sx={{ color: '#0582CA', fontWeight: 'bold' }}>CLOUD</Typography>
        </Box>

        {/* Back */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(5, 202, 130, 0.2)',
          border: '2px solid rgba(5, 202, 130, 0.5)',
          transform: 'translateZ(-100px) rotateY(180deg)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <Typography variant="h4" sx={{ color: '#05CA82', fontWeight: 'bold' }}>COMPUTING</Typography>
        </Box>

        {/* Left */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(5, 130, 202, 0.1)',
          border: '2px solid rgba(5, 130, 202, 0.3)',
          transform: 'rotateY(-90deg) translateZ(100px)',
          backdropFilter: 'blur(5px)'
        }}></Box>

        {/* Right */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(5, 202, 130, 0.1)',
          border: '2px solid rgba(5, 202, 130, 0.3)',
          transform: 'rotateY(90deg) translateZ(100px)',
          backdropFilter: 'blur(5px)'
        }}></Box>

        {/* Top */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(5, 130, 202, 0.15)',
          border: '2px solid rgba(5, 130, 202, 0.4)',
          transform: 'rotateX(90deg) translateZ(100px)',
          backdropFilter: 'blur(5px)'
        }}></Box>

        {/* Bottom */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(5, 202, 130, 0.15)',
          border: '2px solid rgba(5, 202, 130, 0.4)',
          transform: 'rotateX(-90deg) translateZ(100px)',
          backdropFilter: 'blur(5px)'
        }}></Box>
      </Box>
    </Box>
  );
};

// Yeni: Veri Merkezi Grid Animasyonu
const DataCenterGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gridSize = 40;
    const rows = Math.ceil(canvas.height / gridSize);
    const cols = Math.ceil(canvas.width / gridSize);

    const cells = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        cells.push({
          x: j * gridSize,
          y: i * gridSize,
          active: Math.random() > 0.7,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() / 1000;

      cells.forEach(cell => {
        const pulse = Math.sin(time * 2 + cell.pulsePhase) * 0.5 + 0.5;

        if (cell.active) {
          ctx.fillStyle = `rgba(5, 130, 202, ${0.1 + pulse * 0.2})`;
          ctx.strokeStyle = `rgba(5, 130, 202, ${0.3 + pulse * 0.3})`;
        } else {
          ctx.fillStyle = 'rgba(5, 130, 202, 0.05)';
          ctx.strokeStyle = 'rgba(5, 130, 202, 0.1)';
        }

        ctx.beginPath();
        ctx.rect(cell.x, cell.y, gridSize - 2, gridSize - 2);
        ctx.fill();
        ctx.stroke();

        // Rastgele hücreleri aktifleştir/deaktifleştir
        if (Math.random() < 0.001) {
          cell.active = !cell.active;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />;
};

// Yeni: Bulut Parçacıkları Animasyonu
const CloudParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 10,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    function drawCloud(x, y, size) {
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.3, 0, Math.PI * 2);
      ctx.arc(x - size * 0.4, y - size * 0.2, size * 0.3, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.1})`;
        drawCloud(p.x, p.y, p.size);

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.size) p.x = canvas.width + p.size;
        if (p.x > canvas.width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = canvas.height + p.size;
        if (p.y > canvas.height + p.size) p.y = -p.size;
      });

      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }} />;
};

// Yeni: Veri Akış Çizgileri
const DataFlowLines = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lines = [];
    const numLines = 20;

    for (let i = 0; i < numLines; i++) {
      lines.push({
        startX: Math.random() * canvas.width,
        startY: Math.random() * canvas.height,
        length: Math.random() * 200 + 100,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 1,
        progress: Math.random(),
        color: Math.random() > 0.5 ? '#0582CA' : '#05CA82'
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach(line => {
        const endX = line.startX + Math.cos(line.angle) * line.length;
        const endY = line.startY + Math.sin(line.angle) * line.length;

        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `${line.color}40`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Hareket eden nokta
        const dotX = line.startX + Math.cos(line.angle) * (line.length * line.progress);
        const dotY = line.startY + Math.sin(line.angle) * (line.length * line.progress);

        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fillStyle = line.color;
        ctx.fill();

        // İz efekti
        ctx.beginPath();
        ctx.moveTo(line.startX + Math.cos(line.angle) * (line.length * Math.max(0, line.progress - 0.2)),
          line.startY + Math.sin(line.angle) * (line.length * Math.max(0, line.progress - 0.2)));
        ctx.lineTo(dotX, dotY);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        line.progress += 0.01 * line.speed;
        if (line.progress > 1.2) {
          line.progress = -0.2;
          line.startX = Math.random() * canvas.width;
          line.startY = Math.random() * canvas.height;
          line.angle = Math.random() * Math.PI * 2;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }} />;
};

// Yeni: Siber Güvenlik Kalkanı Animasyonu
const SecurityShield = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      position: 'absolute',
      top: '20%',
      right: '10%',
      width: 150,
      height: 150,
      zIndex: 4
    }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: '3px solid transparent',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #0582CA, #05CA82)',
          mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          animation: 'rotate 10s linear infinite',
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,130,202,0.2) 0%, rgba(5,202,130,0.1) 100%)',
          filter: 'blur(8px)',
          animation: 'pulse 2s ease-in-out infinite alternate'
        }
      }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '60%',
          background: `conic-gradient(from ${rotation}deg, #0582CA, #05CA82, #0582CA)`,
          borderRadius: '50%',
          filter: 'blur(4px)',
          opacity: 0.6
        }} />
      </Box>
    </Box>
  );
};

const DashboardPage = () => {
  const statsData = [
    { title: 'Active Servers', value: '24', icon: <StorageIcon sx={{ fontSize: 40, color: '#0582CA' }} /> },
    { title: 'CPU Utilization', value: '68%', icon: <MemoryIcon sx={{ fontSize: 40, color: '#0582CA' }} /> },
    { title: 'Total Storage', value: '4.2 TB', icon: <CloudQueueIcon sx={{ fontSize: 40, color: '#0582CA' }} /> },
    { title: 'Network Speed', value: '1.8 Gbps', icon: <SpeedIcon sx={{ fontSize: 40, color: '#0582CA' }} /> }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#001427',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackground />
      <BlockchainAnimation />
      <DataCenterGrid />
      <CloudParticles />
      <DataFlowLines />
      <SecurityShield />
      <ParticlesAnimation />
      <PulsingCircles />
      <MatrixRain />
      <CubeAnimation />

      <Box sx={{
        position: 'relative',
        zIndex: 10,
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pt: 5
      }}>
        <Typography variant="h3" sx={{
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          position: 'relative',
          color: 'transparent',
          backgroundClip: 'text',
          backgroundImage: 'linear-gradient(135deg, #0582CA, #05CA82)',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: 0,
            width: '100%',
            height: 4,
            background: 'linear-gradient(90deg, #0582CA, #05CA82)',
            borderRadius: 2
          },
          animation: 'pulse 5s infinite alternate',
        }}>
          Decentralized Cloud Computing
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;
