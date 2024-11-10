<script>
  let gameTimeInWeeks = 0;
  let gameYear = 0;
  let gameMonth = 1;
  let gameWeek = 1;

  const updateDate = () => {
    gameYear = Math.floor(gameTimeInWeeks / 52);
    gameMonth = Math.floor((gameTimeInWeeks % 52) / 4) + 1;
    gameWeek = (gameTimeInWeeks % 4) + 1;
  };

  // Épületek, erőforrások és folyamatban lévő építkezés
  const buildings = [
    { id: 1, name: 'Kunyhó', cost: { wood: 30, clay: 20 }, buildTime: 1 }, 
    { id: 2, name: 'Lakóház', cost: { wood: 50, clay: 30 }, buildTime: 3 }, 
    { id: 3, name: 'Farm', cost: { wood: 100, reed: 40 }, buildTime: 2 },  
    { id: 4, name: 'Ételraktár', cost: { wood: 75, clay: 100, reed: 50 }, buildTime: 2 },
    { id: 5, name: 'Erdészház', cost: { wood: 150, clay: 0, reed: 50 }, buildTime: 4 } 
  ];
  let resources = { wood: 500, clay: 200, reed: 100 };
  let buildingInProgress = null;
  let builtBuildings = [];
  let selectedBuilding = null;
  
  // Lakosság kezelése: 20 fő kezdetben, max életkor: 120 év (6240 hét)
  let population = Array.from({ length: 20 }, () => ({
    age: 0,
    maxAge: 6240 // Max életkor 120 év hétben mérve
  }));

  const advanceTime = () => {
    gameTimeInWeeks += 1;
    updateDate(); // Frissítjük az év, hónap és hét változókat

    // Lakosság öregítése
    population = population
      .map(person => ({ ...person, age: person.age + 1 }))
      .filter(person => person.age < person.maxAge); // Eltávolítjuk azokat, akik elérték a max életkort

    // Új lakosok születése minden 52. héten (évente)
    if (gameTimeInWeeks % 52 === 0) {
      const newBorns = Array.from({ length: Math.floor(population.length * 0.05) }, () => ({
        age: 0,
        maxAge: 6240
      }));
      population = [...population, ...newBorns];
    }
    

    // Építkezés idejének csökkentése
    if (buildingInProgress) {
      buildingInProgress.timeLeft -= 1;
      if (buildingInProgress.timeLeft <= 0) {
        for (let resource in buildingInProgress.building.cost) {
          resources[resource] -= buildingInProgress.building.cost[resource];
        }
        builtBuildings = [...builtBuildings, buildingInProgress.building];
        buildingInProgress = null;
      }
    }
  };

  // Építkezés indítása
  const buildBuilding = () => {
    if (selectedBuilding) {
      const cost = selectedBuilding.cost;
      const canBuild = Object.keys(cost).every(resource => resources[resource] >= cost[resource]);
      if (canBuild) {
        buildingInProgress = {
          building: selectedBuilding,
          timeLeft: selectedBuilding.buildTime
        };
        selectedBuilding = null;
      } else {
        alert('Nincs elég erőforrás az építkezéshez!');
      }
    }
  };
</script>

<div>
  <p>Aktuális idő: {gameYear}.{gameMonth < 10 ? '0' : ''}{gameMonth}.{gameWeek < 10 ? '0' : ''}{gameWeek}</p>
  <button on:click={advanceTime}>Tovább 1 héttel</button>

  <h3>Erőforrások:</h3>
  <ul>
    <li>Fa: {resources.wood}</li>
    <li>Agyag: {resources.clay}</li>
    <li>Nád: {resources.reed}</li>
  </ul>

  <h3>Elérhető épületek:</h3>
  <ul>
    {#each buildings as building (building.id)}
      <li>
        <button on:click={() => selectedBuilding = building}>
          {building.name} (Fa: {building.cost.wood}, Agyag: {building.cost.clay}, Nád: {building.cost.reed}, Építkezési idő: {building.buildTime} hét)
        </button>
      </li>
    {/each}
  </ul>

  {#if selectedBuilding}
    <p>Kiválasztott épület: {selectedBuilding.name}</p>
    <button on:click={buildBuilding}>Építkezés indítása</button>
  {/if}

  <h3>Elkészült épületek:</h3>
  <ul>
    {#each builtBuildings as building (building.id)}
      <li>{building.name}</li>
    {/each}
  </ul>

  {#if buildingInProgress}
    <p>Építkezés folyamatban: {buildingInProgress.building.name} ({buildingInProgress.timeLeft} hét hátra)</p>
  {/if}

  <h3>Lakosság:</h3>
  <p>Jelenlegi lakosság száma: {population.length}</p>
  <ul>
    {#each population as person, index}
      <li>Lakos {index + 1}: Kor: {Math.floor(person.age / 52)} év ({person.age} hét)</li>
    {/each}
  </ul>
</div>
