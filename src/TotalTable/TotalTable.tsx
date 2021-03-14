import React, { useMemo, useState } from 'react';
import clsx from 'clsx';

import totalTable from './fixture.json';

import './TotalTable.css';

interface IEvent {
  group: string;
  result: string;
  points: number;
  cup_status: string;
}

interface ICompetitor {
  name: string;
  team: string;
  qual: string;
  year_birth: number;
  gender: string;
  comp_class: string;
  num_events: number;
  num_counted: number;
  cup_result: number;
  events: { [key: string]: IEvent };
}

interface IGroup {
  name: string;
  groups: string[];
  competitors?: ICompetitor[];
  events?: number;
  counted?: number;
}

const GROUPS_BASE = [
  {
    name: 'М21, М20, М50',
    groups: ['М21', 'М20', 'М50'],
  },
  {
    name: 'М17, М60, М70',
    groups: ['М17', 'М60', 'М70'],
  },
  {
    name: 'Женщины',
    groups: ['Ж17', 'Ж45', 'Ж21', 'Ж60'],
  },
  {
    name: 'Школьники',
    groups: ['Ж14', 'Ж11', 'М14', 'М11'],
  },
  {
    name: 'Дети с родителями',
    groups: ['Д+Р'],
  },
] as IGroup[];

interface ISortedGroups {
  [key: string]: ICompetitor[];
}

const TotalTable = () => {
  const data = totalTable;
  const eventsIndex = useMemo(() => data.events.map(event => event.name), [
    data,
  ]);

  const competitorsByGroups = useMemo(() => {
    const sortedGroups = {} as ISortedGroups;

    data.competitors.forEach(competitor => {
      const groupName = GROUPS_BASE.find(group =>
        group.groups.includes(competitor.comp_class),
      )!.name;
      sortedGroups[groupName] = sortedGroups[groupName] || [];

      // @ts-ignore
      sortedGroups[groupName].push(competitor);
    });

    Object.values(sortedGroups).forEach(group => {
      group.sort((a, b) => (a.cup_result > b.cup_result ? -1 : 1));
    });

    return sortedGroups;
  }, [data]);

  const [sortedCompetitors, setSortedCompetitors] = useState<ISortedGroups>(
    competitorsByGroups,
  );

  const sortByField = (groupName: string, fieldName: keyof ICompetitor) => {
    const [name, competitors] = Object.entries(sortedCompetitors).find(
      ([name]) => name === groupName,
    )!;

    let isAscending = false;

    for (let i = 0; i < competitors.length - 1; i++) {
      const areValuesEqual =
        competitors[i][fieldName] === competitors[i + 1][fieldName];

      if (areValuesEqual) {
        continue;
      }

      if (competitors[i][fieldName] < competitors[i + 1][fieldName]) {
        isAscending = true;
        break;
      }
    }

    const newSortedCompetitors = {
      ...sortedCompetitors,
      [name]: [...competitors].sort((a, b) => {
        if (isAscending) {
          return a[fieldName] > b[fieldName] ? -1 : 1;
        }

        return a[fieldName] > b[fieldName] ? 1 : -1;
      }),
    };

    setSortedCompetitors(newSortedCompetitors);
  };

  return (
    <div className="total-table">
      <div className="total-table__table-title">
        Кубок Федерации спортивного ориентирования Новосибирской области по
        спортивному ориентированию
      </div>
      <div className="total-table__table-subtitle">{`«${data.name}»`}</div>
      {Object.entries(sortedCompetitors).map(([name, group]) => (
        <div className="total-table__table-container" key={name}>
          <div className="total-table__title">{name}</div>
          <table className="total-table__table">
            <tbody>
              <tr className="total-table__head">
                <td></td>
                <td
                  className="total-table__head-cell"
                  onClick={() => {
                    sortByField(name, 'name');
                  }}
                >
                  Фамилия, имя
                </td>
                <td
                  className="total-table__head-cell"
                  onClick={() => {
                    sortByField(name, 'team');
                  }}
                >
                  Коллектив
                </td>
                <td
                  className="total-table__head-cell"
                  onClick={() => {
                    sortByField(name, 'qual');
                  }}
                >
                  Кат.
                </td>
                <td
                  className="total-table__head-cell"
                  onClick={() => {
                    sortByField(name, 'year_birth');
                  }}
                >
                  Г.р.
                </td>
                <td
                  className="total-table__head-cell"
                  onClick={() => {
                    sortByField(name, 'comp_class');
                  }}
                >
                  Группа
                </td>
                {data.events.map(event => (
                  <td key={event.name} className="total-table__head-cell">
                    {event.short_name}
                  </td>
                ))}
                <td
                  onClick={() => {
                    sortByField(name, 'cup_result');
                  }}
                  className="total-table__head-cell"
                >{`Кол-во tbd из tbd`}</td>
              </tr>
              {group.map((competitor, index) => (
                <tr className="total-table__row" key={`${competitor.name}${competitor.year_birth}`}>
                  <td className="total-table__cell">{index + 1}</td>
                  <td className="total-table__cell">{competitor.name}</td>
                  <td className="total-table__cell">{competitor.team}</td>
                  <td className="total-table__cell">{competitor.qual}</td>
                  <td className="total-table__cell">{competitor.year_birth}</td>
                  <td className="total-table__cell">{competitor.comp_class}</td>
                  {eventsIndex.map(eventName => (
                    <td
                      className={clsx(
                        'total-table__cell',
                        'total-table__result-cell',
                      )}
                      key={eventName}
                    >
                      {
                        Object.entries(competitor.events || {})?.find(
                          ([name]) => name === eventName,
                        )?.[1]?.points
                      }
                    </td>
                  ))}
                  <td className="total-table__cell">
                    <div className="total-table__results">
                      <span>{competitor.num_counted}</span>
                      <span className="total-table__total-result">
                        {competitor.cup_result}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TotalTable;
