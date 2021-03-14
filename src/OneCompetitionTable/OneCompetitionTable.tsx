import React, { useMemo, useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';

import oneCompetition from './fixture.json';

import './OneCompetitionTable.css';

interface ICompetitor {
  name: string;
  team: string;
  qual: string;
  year_birth: number;
  gender: string;
  comp_class: string;
  group: string;
  result: string;
  points: number;
}

interface IDataByGroups {
  [key: string]: ICompetitor[];
}

interface IGroupsByName {
  [key: string]: {
    name: string;
    num_controls: number;
    length: number;
  };
}

const SMALLEST_WINDOW_SIZE = 500;

const OneCompetitionTable = () => {
  const data = oneCompetition;
  const competitorsSortedByGroups = useMemo(
    () =>
      data.groups.reduce((acc, group) => {
        acc[group.name] = data.competitors
          .filter(competitor => competitor.group === group.name)
          .sort((a, b) => (a.result > b.result ? 1 : -1));

        return acc;
      }, {} as IDataByGroups),
    [data],
  );
  const groupsByName = useMemo(
    () =>
      data.groups.reduce((acc, group) => {
        acc[group.name] = group;

        return acc;
      }, {} as IGroupsByName),
    [data],
  );

  const [isSmallViewport, setSmallViewport] = useState(false);

  const onResizeSetViewport = useCallback(() => {
    if (window.innerWidth < SMALLEST_WINDOW_SIZE && !isSmallViewport) {
      setSmallViewport(true);
    } else if (window.innerWidth >= SMALLEST_WINDOW_SIZE && isSmallViewport) {
      setSmallViewport(false);
    }
  }, [isSmallViewport]);

  useEffect(() => {
    window.addEventListener('resize', onResizeSetViewport);

    return () => {
      window.removeEventListener('resize', onResizeSetViewport);
    };
  }, [onResizeSetViewport]);

  return (
    <div className="one-competition-table">
      <div className="one-competition-table__table-title">{data.long_name}</div>
      <div className="one-competition-table__table-subtitle">{`${data.date}, ${data.location}`}</div>
      <div className="one-competition-table__table-container">
        {Object.entries(competitorsSortedByGroups).map(
          ([groupName, groupCompetitors]) => (
            <React.Fragment key={groupName}>
              <div
                className={clsx('one-competition-table__title', {
                  'one-competition-table__title_mobile': isSmallViewport,
                })}
              >{`${groupName}, ${groupsByName[groupName].length} км, ${groupsByName[groupName].num_controls} КП`}</div>
              <table className="one-competition-table__table">
                <thead>
                  <tr className="one-competition-table__head">
                    <td className="one-competition-table__head-cell">
                      {isSmallViewport ? '' : '№п/п'}
                    </td>
                    <td className="one-competition-table__head-cell">
                      {isSmallViewport ? 'ФИО' : 'Фамилия, имя'}
                    </td>
                    <td className="one-competition-table__head-cell">
                      {isSmallViewport ? 'Кол-в' : 'Коллектив'}
                    </td>
                    {!isSmallViewport && (
                      <td className="one-competition-table__head-cell">Квал</td>
                    )}
                    {!isSmallViewport && (
                      <td className="one-competition-table__head-cell">ГР</td>
                    )}
                    <td className="one-competition-table__head-cell">
                      {isSmallViewport ? 'Груп.' : 'Группа'}
                    </td>
                    <td className="one-competition-table__head-cell">
                      {isSmallViewport ? 'Рез-т' : 'Результат'}
                    </td>
                    <td className="one-competition-table__head-cell">
                      {isSmallViewport ? 'Бал.' : 'Баллы'}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {groupCompetitors.map((competitor, index) => (
                    <tr
                      key={`${competitor.name}${competitor.result}`}
                      className="one-competition-table__row"
                    >
                      <td
                        className={clsx('one-competition-table__cell', {
                          'one-competition-table__cell_mobile': isSmallViewport,
                          'one-competition-table__cell_very-small': isSmallViewport,
                        })}
                      >
                        {index + 1}
                      </td>
                      <td
                        className={clsx('one-competition-table__cell', {
                          'one-competition-table__cell_small': isSmallViewport,
                        })}
                      >
                        {competitor.name}
                      </td>
                      <td
                        className={clsx('one-competition-table__cell', {
                          'one-competition-table__cell_very-small': isSmallViewport,
                        })}
                      >
                        {competitor.team}
                      </td>
                      {!isSmallViewport && (
                        <td
                          className={clsx('one-competition-table__cell', {
                            'one-competition-table__cell_mobile': isSmallViewport,
                          })}
                        >
                          {competitor.qual}
                        </td>
                      )}
                      {!isSmallViewport && (
                        <td className="one-competition-table__cell">
                          {competitor.year_birth}
                        </td>
                      )}
                      <td
                        className={clsx('one-competition-table__cell', {
                          'one-competition-table__cell_mobile': isSmallViewport,
                        })}
                      >
                        {competitor.comp_class}
                      </td>
                      <td
                        className={clsx('one-competition-table__cell', {
                          'one-competition-table__cell_mobile': isSmallViewport,
                        })}
                      >
                        {competitor.result}
                      </td>
                      <td
                        className={clsx('one-competition-table__cell', {
                          'one-competition-table__cell_mobile': isSmallViewport,
                        })}
                      >
                        {competitor.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </React.Fragment>
          ),
        )}
        <div className="one-competition-table__bottom">
          <div className="one-competition-table__official-title">
            Начальник дистанции
          </div>
          <div className="one-competition-table__official-name">
            {data.officials['event-director']}
          </div>
          <div className="one-competition-table__official-title">
            Главный судья
          </div>
          <div className="one-competition-table__official-name">
            {data.officials['technical-director']}
          </div>
          <div className="one-competition-table__official-title">
            Главный секретарь
          </div>
          <div className="one-competition-table__official-name">
            {data.officials.secretary}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneCompetitionTable;
