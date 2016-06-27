import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  describe('setEntries', () => {

    it('добавляет записи к состоянию', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 Days Later');
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

    it('преобразует в immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

    describe('next', () => {

      it('берёт для голосования следующие две записи', () => {
        const state = Map({
          entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
        });
        const nextState = next(state);
        expect(nextState).to.equal(Map({
          vote: Map({
            pair: List.of('Trainspotting', '28 Days Later')
          }),
          entries: List.of('Sunshine')
        }));
      });

    });


    describe('vote', () => {

      it('создаёт результат голосования для выбранной записи', () => {
        const state = Map({
          pair: List.of('Trainspotting', '28 Days Later')
        });
        const nextState = vote(state, 'Trainspotting')
        expect(nextState).to.equal(Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 1
          })
        }));
      });

      it('добавляет в уже имеющийся результат для выбранной записи', () => {
        const state = Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          })
        });
        const nextState = vote(state, 'Trainspotting');
        expect(nextState).to.equal(Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }));
      });

    });

    describe('next', () => {
      it('помещает победителя текущего голосования в конец списка записей', () => {
        const state = Map({
          vote: Map({
            pair: List.of('Trainspotting', '28 Days Later'),
            tally: Map({
              'Trainspotting': 4,
              '28 Days Later': 2
            })
          }),
          entries: List.of('Sunshine', 'Millions', '127 Hours')
        });
        const nextState = next(state);
        expect(nextState).to.equal(Map({
          vote: Map({
            pair: List.of('Sunshine', 'Millions')
          }),
          entries: List.of('127 Hours', 'Trainspotting')
        }));
      });

      it('в случае ничьей помещает обе записи в конец списка', () => {
        const state = Map({
          vote: Map({
            pair: List.of('Trainspotting', '28 Days Later'),
            tally: Map({
              'Trainspotting': 3,
              '28 Days Later': 3
            })
          }),
          entries: List.of('Sunshine', 'Millions', '127 Hours')
        });
        const nextState = next(state);
        expect(nextState).to.equal(Map({
          vote: Map({
            pair: List.of('Sunshine', 'Millions')
          }),
          entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
        }));
      });
    });

    it('когда остаётся лишь одна запись, помечает её как победителя', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }));
    });



  });

});
