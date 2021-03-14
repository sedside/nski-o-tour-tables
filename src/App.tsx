import React from 'react';
import { TotalTable } from './TotalTable';
import { OneCompetitionTable } from './OneCompetitionTable';

import './App.css';
// закомментированный импорт таблицы для примера
// import { OneCompetitionTable } from './OneCompetitionTable';

function App() {
  return (
    <div>
      <TotalTable />
      <OneCompetitionTable />
      {/* закомментированное отображение таблицы для примера */}
      {/* <OneCompetitionTable /> */}
    </div>
  );
}

export default App;
