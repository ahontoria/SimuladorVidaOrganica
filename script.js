// Clase que representa un organismo en la simulación
class Organism {
    constructor(x, y, role, gender, genes = null) {
        // Inicialización de propiedades del organismo
        this.x = x; // Posición en el eje X
        this.y = y; // Posición en el eje Y
        this.health = 100; // Salud inicial
        this.age = 0; // Edad inicial
        this.energy = 300; // Energía inicial
        this.alive = true; // Estado de vida
        this.role = role; // Rol del organismo (productor, transportador, consumidor, sanador)
        this.gender = gender; // Género del organismo
        this.size = 5; // Tamaño inicial
        this.infected = false; // Estado de infección
        this.infectionDuration = 0; // Duración de la infección
        this.ageAtDeath = 0; // Edad al morir
        this.retirementAge = 200; // Edad de jubilación
        this.maxAge = Math.random() * 200 + 100; // Edad máxima aleatoria
        this.carryingResource = false; // Si el transportador lleva un recurso
        this.resources = 0; // Recursos que posee
        this.flash = 0; // Propiedad para el destello

        // Genes del organismo
        this.genes = genes || {
            speed: Math.random(), // Velocidad de movimiento
            resistance: Math.random(), // Resistencia a enfermedades
            fertility: Math.random() // Capacidad de reproducción
        };

        // Ajuste de velocidad basado en los genes
        this.speed = 0.5 + this.genes.speed * 0.5;
    }

    // Método estático para mutar los genes
    static mutateGenes(parentGenes) {
        const mutationRate = 0.01; // Tasa de mutación
        let newGenes = {};
        for (let gene in parentGenes) {
            // Mutación de genes con una tasa de mutación específica
            newGenes[gene] = parentGenes[gene] + (Math.random() < mutationRate ? (Math.random() * 0.2 - 0.1) : 0);
            // Limitar los genes entre 0 y 1
            newGenes[gene] = Math.min(Math.max(newGenes[gene], 0), 1);
        }
        return newGenes;
    }

    // Método para mover el organismo
    move() {
        // Determinar el objetivo de movimiento según el rol
        let target = { x: this.x + (Math.random() * 200 - 100), y: this.y + (Math.random() * 200 - 100) };
    
        if (this.role === 'consumidor') {
            if (this.energy > 150) {
                target = this.findNearestPartner();
            } else {
                target = this.findNearest(food.concat(resources));
            }
        } else if (this.role === 'transportador') {
            target = this.carryingResource ? this.findNearestProducers() : this.findNearest(resources);
        } else if (this.role === 'sanador') {
            target = this.findNearestInfected(organisms);
        } else if (this.role === 'productor' && this.resources === 0) {
            const nearestTransporter = this.findNearestTransporterCarryingResource();
            if (nearestTransporter && Math.hypot(this.x - nearestTransporter.x, this.y - nearestTransporter.y) < 200) {
                target = nearestTransporter;
            }
        }

        // Movimiento del organismo ajustado por la velocidad basada en genes
        this.x += (target.x - this.x) * this.speed * 0.05;
        this.y += (target.y - this.y) * this.speed * 0.05;
        this.energy -= 0.1;
    }

    // Método para encontrar el ítem más cercano
    findNearest(items) {
        if (items.length === 0) return { x: this.x, y: this.y };
        let nearest = items.reduce((nearest, item) => {
            let distance = Math.hypot(this.x - item.x, this.y - item.y);
            return distance < Math.hypot(this.x - nearest.x, this.y - nearest.y) ? item : nearest;
        }, items[0]);
        return nearest;
    }

    // Método para encontrar el transportador más cercano que lleva un recurso
    findNearestTransporterCarryingResource() {
        let transportersWithResource = organisms.filter(o => o.role === 'transportador' && o.carryingResource);
        if (transportersWithResource.length === 0) return null;
        let nearest = transportersWithResource.reduce((nearest, transporter) => {
            let distance = Math.hypot(this.x - transporter.x, this.y - transporter.y);
            return distance < Math.hypot(this.x - nearest.x, this.y - nearest.y) ? transporter : nearest;
        }, transportersWithResource[0]);
        return nearest;
    }    

    // Método para encontrar el organismo infectado más cercano
    findNearestInfected(organisms) {
        let infectedOrganisms = organisms.filter(o => o.infected);
        if (infectedOrganisms.length === 0) return { x: this.x, y: this.y };
        let nearest = infectedOrganisms.reduce((nearest, organism) => {
            let distance = Math.hypot(this.x - organism.x, this.y - organism.y);
            return distance < Math.hypot(this.x - nearest.x, this.y - nearest.y) ? organism : nearest;
        }, infectedOrganisms[0]);
        return nearest;
    }

    // Método para que el organismo consuma comida o recoja recursos
    eatOrCollectResource() {
        if (this.role === 'consumidor' && this.alive && this.energy < 150) {
            for (let i = 0; i < food.length; i++) {
                let distance = Math.hypot(this.x - food[i].x, this.y - food[i].y);
                if (distance < 5) {
                    this.energy += 50;
                    food.splice(i, 1);
                    return;
                }
            }
            for (let i = 0; i < resources.length; i++) {
                let distance = Math.hypot(this.x - resources[i].x, this.y - resources[i].y);
                if (distance < 5) {
                    this.resources += 1;
                    resources.splice(i, 1);
                    return;
                }
            }
        }
    }

    // Método para convertir recursos en comida
    convertResourcesToFood() {
        if (this.role === 'consumidor' && this.resources > 0) {
            this.resources -= 1;
            for (let i = 0; i < 2; i++) {
                food.push({ x: this.x, y: this.y });
            }
        } else if (this.role === 'productor' && this.resources > 0) {
            this.resources -= 1;
            for (let i = 0; i < 50; i++) {
                food.push({ x: this.x, y: this.y });
            }
        }
    }

    // Método para que los transportadores recojan recursos
    collectResource(resources) {
        if (this.role === 'transportador' && this.alive && !this.carryingResource) {
            for (let i = 0; i < resources.length; i++) {
                let distance = Math.hypot(this.x - resources[i].x, this.y - resources[i].y);
                if (distance < 5) {
                    this.carryingResource = true;
                    resources.splice(i, 1);
                    break;
                }
            }
        }
    }

    // Método para que los transportadores entreguen recursos a los productores
    deliverResourceToProducer() {
        if (this.role === 'transportador' && this.alive && this.carryingResource) {
            let nearestProducer = this.findNearestProducers();
            if (nearestProducer && typeof nearestProducer.receiveResource === 'function') {
                let distance = Math.hypot(this.x - nearestProducer.x, this.y - nearestProducer.y);
                if (distance < 5) {
                    nearestProducer.receiveResource();
                    this.carryingResource = false;
                }
            }
        }
    }

    // Método para encontrar el productor más cercano
    findNearestProducers() {
        let producers = organisms.filter(o => o.role === 'productor');
        if (producers.length === 0) return { x: this.x, y: this.y };
        let nearest = producers.reduce((nearest, o) => {
            let distance = Math.hypot(this.x - o.x, this.y - o.y);
            return distance < Math.hypot(this.x - nearest.x, this.y - nearest.y) ? o : nearest;
        }, producers[0]);
        return nearest;
    }

    // Método para que los productores reciban recursos
    receiveResource() {
        if (this.role === 'productor' && this.alive) {
            this.resources += 1;
        }
    }

    // Método para que los sanadores curen a otros organismos
    healOthers(organisms) {
        if (this.role === 'sanador' && this.alive) {
            organisms.forEach(organism => {
                if (organism !== this && organism.infected && Math.hypot(this.x - organism.x, this.y - organism.y) < 10) {
                    organism.infected = false;
                    simulationStats.cures++;
                }
            });
        }
    }

    // Método para que los organismos se reproduzcan
    reproduce() {
        if (!this.carryingResource && this.energy > 150 && this.age > 20 && this.age < this.retirementAge) {
            const partner = this.findNearestPartner();
            if (partner && this.gender !== partner.gender && partner.age > 20 && partner.age < partner.retirementAge && partner.energy > 150) {
                const totalOrganisms = organisms.length;
                const producers = organisms.filter(o => o.role === 'productor').length;
                const transporters = organisms.filter(o => o.role === 'transportador').length;
                const healers = organisms.filter(o => o.role === 'sanador').length;

                const producerLimit = totalOrganisms * 0.05;
                const transporterLimit = totalOrganisms * 0.02;
                const healerLimit = totalOrganisms * 0.02;

                let newRole = 'consumidor';

                if (producers < producerLimit) {
                    newRole = 'productor';
                } else if (transporters < transporterLimit) {
                    newRole = 'transportador';
                } else if (healers < healerLimit) {
                    newRole = 'sanador';
                }

                const gender = Math.random() < 0.5 ? 'female' : 'male';
                let child = new Organism(this.x, this.y, newRole, gender);
                this.energy -= 75;
                partner.energy -= 75;
                this.flash = 10; // Activar destello
                partner.flash = 10; // Activar destello en la pareja
                return child;
            }
        }
        return null;
    }

    // Método para encontrar la pareja más cercana
    findNearestPartner() {
        let potentialPartners = organisms.filter(o => o !== this && o.role === this.role && o.alive && o.age > 20 && o.age < o.retirementAge && o.energy > 150);
        if (potentialPartners.length === 0) return { x: this.x, y: this.y };
        let nearest = potentialPartners.reduce((nearest, partner) => {
            let distance = Math.hypot(this.x - partner.x, this.y - partner.y);
            return distance < Math.hypot(this.x - nearest.x, this.y - nearest.y) ? partner : nearest;
        }, potentialPartners[0]);
        return nearest;
    }

    // Método para infectar al organismo
    infect() {
        if (Math.random() < 0.01) {
            this.infected = true;
            this.infectionDuration = 0;
            simulationStats.infections++;
        }
    }

    // Método para propagar la infección a otros organismos
    spreadInfection(organisms) {
        if (this.infected && this.alive) {
            organisms.forEach(organism => {
                if (organism !== this && Math.hypot(this.x - organism.x, this.y - organism.y) < 10) {
                    if (Math.random() < 0.05) {
                        organism.infected = true;
                        simulationStats.infections++;
                    }
                }
            });
        }
    }

    // Método para que el organismo se cure de una infección
    heal() {
        if (this.infected) {
            this.infectionDuration += 1;
            if (Math.random() < 0.05) {
                this.infected = false;
                simulationStats.cures++;
            }
        }
    }

    // Método de actualización del estado del organismo
    update() {
        if (!this.carryingResource) {
            this.age += 1;
        }

        // Ajuste del tamaño basado en la edad
        this.size = 5 + this.age * 0.05;

        if (this.role === 'consumidor' && this.age > 50) {
            const totalOrganisms = organisms.length;
            const producers = organisms.filter(o => o.role === 'productor').length;
            const transporters = organisms.filter(o => o.role === 'transportador').length;
            const healers = organisms.filter(o => o.role === 'sanador').length;

            const producerLimit = totalOrganisms * 0.05;
            const transporterLimit = totalOrganisms * 0.02;
            const healerLimit = totalOrganisms * 0.02;

            let newRole = 'consumidor';

            if (producers < producerLimit) {
                newRole = 'productor';
            } else if (transporters < transporterLimit) {
                newRole = 'transportador';
            } else if (healers < healerLimit) {
                newRole = 'sanador';
            }

            this.role = newRole;
        }

        if (this.age >= this.retirementAge && this.role !== 'consumidor') {
            this.role = 'consumidor';
        }

        if (this.infected) {
            this.health -= 0.1;
            this.energy -= 0.2;
            this.heal();
        }

        if (!this.carryingResource && (this.energy <= 0 || this.health <= 0 || this.age > this.maxAge)) {
            this.alive = false;
            this.ageAtDeath = this.age;
            simulationStats.deaths++;
            simulationStats.totalAgeAtDeath += this.ageAtDeath;
        }

        if (this.role === 'productor' && this.alive) {
            this.convertResourcesToFood();
        }

        if (this.role === 'consumidor' && this.alive) {
            this.convertResourcesToFood();
        }

        if (this.flash > 0) {
            this.flash--; // Reducir el destello con el tiempo
        }
    }
}

// Inicialización del canvas para la simulación
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight * 0.95;

// Inicialización del canvas para el gráfico
const graphCanvas = document.getElementById('graphCanvas');
const graphCtx = graphCanvas.getContext('2d');
graphCanvas.width = 280;
graphCanvas.height = 100;

// Inicialización de variables globales para la simulación
let organisms = [];
let food = [];
let resources = [];
const simulationStats = {
    deaths: 0,
    infections: 0,
    cures: 0,
    totalAgeAtDeath: 0,
    cycles: 0,
    totalOrganismsHistory: []
};

// Creación de organismos iniciales
for (let i = 0; i < 50; i++) {
    let role = ['productor', 'transportador', 'consumidor', 'sanador'][Math.floor(Math.random() * 4)];
    let gender = Math.random() < 0.5 ? 'female' : 'male';
    organisms.push(new Organism(Math.random() * canvas.width, Math.random() * canvas.height, role, gender));
}

// Creación de recursos iniciales
for (let i = 0; i < 300; i++) { // Incrementar el número de recursos iniciales a 300
    resources.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
}

// Control de la velocidad de la simulación
const speedControl = document.getElementById('speedRange');
let cycleSpeed = 500;

speedControl.addEventListener('input', (event) => {
    cycleSpeed = event.target.value;
});

// Mostrar u ocultar la leyenda
let showLegend = true;
const legendToggle = document.getElementById('legendToggle');
legendToggle.addEventListener('click', () => {
    showLegend = !showLegend;
    document.getElementById('legendAndStats').style.display = showLegend ? 'block' : 'none';
});

// Botón para añadir recursos aleatorios
const addResourcesButton = document.getElementById('addResourcesButton');
addResourcesButton.addEventListener('click', () => {
    addRandomResources(50); // Añadir 50 recursos aleatorios
});

// Función para añadir recursos aleatorios
function addRandomResources(amount) {
    for (let i = 0; i < amount; i++) {
        resources.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
    }
}

// Función de actualización de la simulación
function update() {
    const producersCount = organisms.filter(o => o.role === 'productor').length;

    organisms.forEach((organism, index) => {
        if (organism.alive) {
            organism.move();
            organism.eatOrCollectResource();
            if (organism.role === 'transportador') {
                organism.collectResource(resources);
                organism.deliverResourceToProducer();
                // Convertir transportadores en productores si hay pocos productores
                if (producersCount < 2 && Math.random() < 0.1) {
                    organism.role = 'productor';
                    organism.carryingResource = false; // Asegurarse de que dejen cualquier recurso que estén llevando
                }
            }
            organism.healOthers(organisms);
            organism.infect();
            organism.spreadInfection(organisms);
            let child = organism.reproduce();
            if (child) {
                organisms.push(child);
            }
            organism.update();
        }
    });
    organisms = organisms.filter(organism => organism.alive);

    // Actualizar el historial de organismos
    simulationStats.totalOrganismsHistory.push(organisms.length);
    if (simulationStats.totalOrganismsHistory.length > 100) {
        simulationStats.totalOrganismsHistory.shift();
    }

    draw();

    if (organisms.length === 0) {
        cancelAnimationFrame(animationId);
        console.log("Todos los organismos han muerto. Simulación detenida.");
    } else {
        simulationStats.cycles++;
    }
}

let animationId;

// Función para dibujar la simulación en el canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    resources.forEach(r => {
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'brown';
        ctx.fill();
    });

    food.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
    });

    organisms.forEach(organism => {
        if (organism.alive) {
            ctx.save(); // Guarda el contexto actual
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Color de la sombra
            ctx.shadowBlur = 10; // Desenfoque de la sombra
            ctx.shadowOffsetX = 0; // Desplazamiento de la sombra en X
            ctx.shadowOffsetY = 0; // Desplazamiento de la sombra en Y

            if (organism.flash > 0) {
                ctx.shadowColor = 'rgba(255, 215, 0, 0.7)'; // Color del destello
                ctx.shadowBlur = 20; // Desenfoque del destello
            }

            if (organism.gender === 'female') {
                ctx.beginPath();
                ctx.arc(organism.x, organism.y, organism.size, 0, Math.PI * 2);
                ctx.fillStyle = organism.infected ? '#e74c3c' : '#2c3e50';
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.rect(organism.x - organism.size, organism.y - organism.size, organism.size * 2, organism.size * 2);
                ctx.fillStyle = organism.infected ? '#e74c3c' : '#2c3e50';
                ctx.fill();
            }

            ctx.shadowColor = 'transparent'; // Elimina la sombra del borde
            if (organism.role === 'productor') {
                ctx.strokeStyle = '#3498db';
            } else if (organism.role === 'transportador') {
                ctx.strokeStyle = '#e67e22';
            } else if (organism.role === 'consumidor') {
                ctx.strokeStyle = '#e74c3c';
            } else if (organism.role === 'sanador') {
                ctx.strokeStyle = '#1abc9c';
            }
            ctx.lineWidth = 2;
            ctx.stroke();

            if (organism.carryingResource) {
                ctx.beginPath();
                ctx.arc(organism.x + 10, organism.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'brown';
                ctx.fill();
            }

            ctx.restore(); // Restaura el contexto guardado
        }
    });

    if (showLegend) {
        drawLegend();
        drawStats();
        drawGraph();
    }
}

// Función para dibujar la leyenda en el canvas
function drawLegend() {
    const roles = [
        { role: 'Productores', color: '#3498db' },
        { role: 'Transportadores', color: '#e67e22' },
        { role: 'Consumidores', color: '#e74c3c' },
        { role: 'Sanadores', color: '#1abc9c' },
        { role: 'Infectados', color: '#e74c3c' }
    ];

    const legendHeight = roles.length * 30 + 90; // Ajustar la altura del fondo blanco
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(10, 100, 150, legendHeight);

    roles.forEach((item, index) => {
        ctx.beginPath();
        ctx.arc(20, 120 + index * 30, 10, 0, Math.PI * 2);
        ctx.fillStyle = item.role === 'Infectados' ? '#e74c3c' : '#2c3e50';
        ctx.fill();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(item.role, 40, 125 + index * 30);
    });

    // Añadir leyenda para el género
    ctx.beginPath();
    ctx.arc(20, 120 + roles.length * 30, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.font = '12px Arial';
    ctx.fillText('Femenino', 40, 125 + roles.length * 30);

    ctx.beginPath();
    ctx.rect(10, 120 + roles.length * 30 + 30, 20, 20);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.font = '12px Arial';
    ctx.fillText('Masculino', 40, 125 + roles.length * 30 + 45);
}

// Función para dibujar las estadísticas en el canvas
function drawStats() {
    const totalOrganisms = organisms.length;
    const producers = organisms.filter(o => o.role === 'productor').length;
    const transporters = organisms.filter(o => o.role === 'transportador').length;
    const consumers = organisms.filter(o => o.role === 'consumidor').length;
    const healers = organisms.filter(o => o.role === 'sanador').length;
    const infected = organisms.filter(o => o.infected).length;
    const healthy = totalOrganisms - infected;
    const males = organisms.filter(o => o.gender === 'male').length;
    const females = organisms.filter(o => o.gender === 'female').length;
    const averageLifeSpan = simulationStats.deaths === 0 ? 0 : (simulationStats.totalAgeAtDeath / simulationStats.deaths).toFixed(2);

    const stats = [
        `Ciclos: ${simulationStats.cycles}`,
        `Total de organismos: ${totalOrganisms}`,
        `Productores: ${producers}`,
        `Transportadores: ${transporters}`,
        `Consumidores: ${consumers}`,
        `Sanadores: ${healers}`,
        `Infectados: ${infected}`,
        `Sanos: ${healthy}`,
        `Masculinos: ${males}`,
        `Femeninos: ${females}`,
        `Muertes: ${simulationStats.deaths}`,
        `Esperanza de vida promedio: ${averageLifeSpan}`
    ];

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(10, 400, 250, stats.length * 20 + 20);

    stats.forEach((item, index) => {
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(item, 15, 420 + index * 20);
    });
}

// Función para dibujar el gráfico en el canvas
function drawGraph() {
    graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

    const maxOrganisms = Math.max(...simulationStats.totalOrganismsHistory);

    graphCtx.beginPath();
    graphCtx.moveTo(0, graphCanvas.height - (simulationStats.totalOrganismsHistory[0] / maxOrganisms) * graphCanvas.height);

    simulationStats.totalOrganismsHistory.forEach((value, index) => {
        let x = (index / 100) * graphCanvas.width;
        let y = graphCanvas.height - (value / maxOrganisms) * graphCanvas.height;
        graphCtx.lineTo(x, y);
    });

    graphCtx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
    graphCtx.lineWidth = 2;
    graphCtx.stroke();
}

// Bucle principal de la simulación
function gameLoop() {
    update();
    setTimeout(() => {
        animationId = requestAnimationFrame(gameLoop);
    }, cycleSpeed);
}

gameLoop();
