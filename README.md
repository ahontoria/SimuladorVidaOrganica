
# Proyecto de Simulación de Vida Artificial

## Introducción

Este proyecto es un tributo a Nils Aall Barricelli, un pionero en el campo de la vida artificial y la evolución digital. Barricelli, un matemático y astrofísico italo-noruego, fue uno de los primeros en utilizar computadoras para simular procesos evolutivos y estudiar la dinámica de sistemas biológicos. En la década de 1950, trabajó en la Universidad de Princeton y en el Instituto de Estudios Avanzados, donde desarrolló modelos de organismos virtuales que podían reproducirse, mutar y competir por recursos en un entorno digital. Sus investigaciones sentaron las bases para el campo de la vida artificial y la evolución artificial, inspirando a generaciones de científicos y programadores.

## Motivación

La motivación detrás de este proyecto es explorar y entender mejor los principios de la evolución y la dinámica de los sistemas vivos a través de simulaciones digitales. Al recrear un entorno donde organismos virtuales pueden interactuar, reproducirse y evolucionar, buscamos proporcionar una herramienta educativa y de investigación que pueda ser utilizada para estudiar comportamientos complejos y emergentes en sistemas biológicos artificiales.

## Descripción del Proyecto

### Organismos

Cada organismo tiene los siguientes atributos iniciales:
- **Salud**: 100
- **Edad**: 0
- **Energía**: 300
- **Tamaño**: 5
- **Retiro**: 200 ciclos
- **Esperanza de vida máxima**: entre 100 y 300 ciclos

Cada organismo puede tener uno de los siguientes roles:
- **Consumidor**: Representados por un círculo rojo.
- **Productor**: Representados por un círculo azul.
- **Transportador**: Representados por un círculo naranja.
- **Sanador**: Representados por un círculo cian.

Los organismos pueden ser de género masculino (cuadrado) o femenino (círculo).
Los organismos pueden infectarse, lo que reduce su salud y energía.

### Movimiento

Los organismos se mueven de forma aleatoria, pero buscan activamente diferentes objetivos según su rol:
- **Consumidores**: Buscan comida o recursos si tienen menos de 150 de energía, o buscan pareja si tienen más de 150 de energía.
- **Productores**: Buscan transportadores que lleven recursos si no tienen recursos.
- **Transportadores**: Buscan recursos si no llevan uno, y buscan productores para entregar recursos si llevan uno.
- **Sanadores**: Buscan organismos infectados para curar.

### Reproducción

- Los consumidores se reproducen si tienen más de 150 de energía, tienen una pareja cerca y ambos son adultos (entre 20 y 200 ciclos).
- Cada reproducción consume 75 de energía de cada pareja.
- La reproducción se representa de forma visual mediante un pequeño fogonazo amarillo.
- Los hijos heredan roles y géneros de manera aleatoria, respetando límites de proporción:
  - **Productores**: Hasta un 5% de la población total.
  - **Transportadores**: Hasta un 2% de la población total.
  - **Sanadores**: Hasta un 2% de la población total.
  - **Consumidores**: El resto de los nuevos organismos.

### Herencia Genética y Mutaciones

Los organismos heredan genes de sus padres, los cuales afectan sus atributos y comportamiento:
- **Velocidad**: Influye en la rapidez de movimiento.
- **Resistencia**: Afecta la resistencia a enfermedades.
- **Fertilidad**: Determina la capacidad de reproducción.

Los genes pueden mutar con una pequeña probabilidad, introduciendo variaciones que pueden beneficiar o perjudicar al organismo. Estas mutaciones permiten la evolución del comportamiento de los organismos a lo largo del tiempo.

### Consumo de recursos y producción de comida

- Los consumidores pueden convertir 1 recurso en 2 unidades de comida.
- Los productores pueden convertir 1 recurso en 50 unidades de comida.

### Transportadores

- Los transportadores recogen recursos y los entregan a los productores.
- Mientras llevan un recurso, no pueden morir.
- Pueden convertirse en productores si el número de productores es menor a 2.

### Sanadores

- Los sanadores curan organismos infectados que estén cerca.
- La curación aumenta el contador de curaciones.

### Infección y curación

- Los organismos pueden infectarse aleatoriamente.
- Los organismos infectados pierden salud y energía con el tiempo.
- Los sanadores y los mismos organismos pueden curar la infección con una probabilidad del 5% cada ciclo.

### Muerte

- Los organismos mueren si su energía o salud llega a 0, o si superan su esperanza de vida máxima.
- Cuando mueren, se registran en las estadísticas.

### Estadísticas

- Se muestran estadísticas en tiempo real de la población, roles, géneros, infecciones, curaciones, y esperanza de vida promedio.
- Los ciclos también se cuentan y se muestran.

### Interacción de usuario

- Hay un control deslizante para ajustar la velocidad de los ciclos.
- Un botón permite añadir recursos aleatoriamente al campo de juego.
- La gráfica en tiempo real muestra la evolución del total de organismos con el tiempo.

## Instrucciones para ejecutar

1. Clona el repositorio.
```bash
   git clone https://github.com/ahontoria/SimuladorVidaOrganica
``` 
2. Abre el archivo `index.html` en tu navegador web.
3. Utiliza los controles y botones disponibles para interactuar con la simulación.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o crea un pull request en el repositorio de GitHub.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Para más detalles, consulta el archivo `LICENSE`.
